"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import styles from "../styles/TakeQuiz.module.css";

interface Answer {
  id: number;
  answer: string;
  is_correct: boolean;
}

interface Question {
  id: number;
  question: string;
  answers: Answer[];
  correctAnswerIds: number[];
}

interface Quiz {
  id: number;
  title: string;
  time: number;  
}

const TakeQuiz = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const quizId = parseInt(searchParams!.get("quizId") ?? "", 10);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number[] }>({});
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [score, setScore] = useState<number | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    const fetchQuizDetails = async () => {
      if (!quizId) return;

      try {
        const response = await fetch(`http://localhost:8000/api/listQuestion/${quizId}`);
        if (!response.ok) throw new Error(response.statusText);
        const data = await response.json();
        setQuestions(data.questions);
        setQuiz(data.quiz);
        const storedEndTime = localStorage.getItem(`quiz_${quizId}_endTime`);
        if (storedEndTime) {
          const remainingTime = Math.floor((parseInt(storedEndTime) - Date.now()) / 1000);
          setTimeLeft(remainingTime > 0 ? remainingTime : 0);
        } else {
          const endTime = Date.now() + data.quiz.time * 60 * 1000;
          localStorage.setItem(`quiz_${quizId}_endTime`, endTime.toString());
          setTimeLeft(data.quiz.time * 60);
        }
      } catch (error) {
        console.error("Error fetching quiz details:", error);
      }
    };

    fetchQuizDetails();
  }, [quizId]);

  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit();   
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  const handleAnswerSelect = (questionId: number, answerId: number) => {
    setSelectedAnswers((prev) => {
      const selectedForQuestion = prev[questionId] || [];
      if (selectedForQuestion.includes(answerId)) {
        return {
          ...prev,
          [questionId]: selectedForQuestion.filter((id) => id !== answerId),
        };
      } else {
        return {
          ...prev,
          [questionId]: [...selectedForQuestion, answerId],
        };
      }
    });
  };

  const handleSubmit = async () => {
    if (questions.some((question) => !selectedAnswers[question.id]?.length)) {
      
    }
    const answers = questions.map((question) => {
      const selectedAnswerIds = selectedAnswers[question.id] || [];
      return selectedAnswerIds.map((answerId) => ({
        question_id: question.id,
        answer_id: answerId,
      }));
    }).flat();

    try {
      const timeTaken = quiz?.time ? quiz.time * 60 - timeLeft : 0;
      const response = await fetch(`http://localhost:8000/api/submitQuiz`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quiz_id: quiz?.id,
          answers: answers,
          time_taken: timeTaken,
        }),
      });

      if (!response.ok) {
        throw new Error("Gửi bài thất bại, vui lòng thử lại!");
      }
      const result = await response.json();
      setScore(result.score);
      setShowPopup(true);
      setTotalQuestions(result.totalQuestions);
      localStorage.removeItem(`quiz_${quizId}_endTime`);
    } catch (error) {
      console.error("Error submitting quiz:", error);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    router.push("/ListQuiz");
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.quizTitle}>{quiz?.title}</h1>
        <div className={styles.timer}>
          <h3>Thời gian còn lại: {formatTime(timeLeft)}</h3>
        </div>
      </div>
      <div className={styles.questionContainer}>
        {questions.length > 0 ? (
          questions.map((question, questionIndex) => (
            <div key={question.id} className={styles.questionItem}>
              <h3 className={styles.questionTitle}>
                Câu hỏi {questionIndex + 1}: {question.question}
              </h3>
              <ul className={styles.answerList}>
                {question.answers.map((answer, answerIndex) => (
                  <li key={answer.id} className={styles.answer}>
                    <label>
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value={answer.id}
                        onChange={() => handleAnswerSelect(question.id, answer.id)}
                        checked={selectedAnswers[question.id]?.includes(answer.id) || false}
                      />
                      {String.fromCharCode(65 + answerIndex)}. {answer.answer}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          ))
        ) : (
          <p>Không có câu hỏi nào cho bài quiz này.</p>
        )}
        {questions.length > 0 && (
          <button onClick={handleSubmit} className={styles.submitButton}>
            Nộp bài
          </button>
        )}
        {showPopup && score !== null && (
          <div className={styles.popup}>
            <div className={styles.popupContent}>
              <h2>Bạn đã đạt được {score}/{totalQuestions} điểm</h2>
              <button onClick={closePopup} className={styles.closeButton}>Đóng</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TakeQuiz;
