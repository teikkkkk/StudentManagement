"use client";
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation'; 
import styles from '../styles/ResultQuiz.module.css';

interface SelectedAnswer {
  question_id: number;
  selected_answer_id: number;
}

interface QuizResult {
  quiz_title: string;
  score: number;
  time_taken: number;
  selected_answers: SelectedAnswer[];
  questions: Question[];  
}

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

const ResultQuiz = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const searchParams = useSearchParams();
  const SubmissionId = searchParams.get('submission'); 

  const fetchQuizResult = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/quiz-result/${SubmissionId}`);
      if (response.ok) {
        const data: QuizResult = await response.json(); 
        setQuizResult(data); 
        setQuestions(data.questions);
      } else {
        console.error('Error fetching quiz result:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    if (SubmissionId) {
      fetchQuizResult();
    }
  }, [SubmissionId]);

  if (!quizResult) {
    return <p>Loading...</p>;
  }  

  const minutes = Math.floor(quizResult.time_taken / 60);
  const seconds = quizResult.time_taken % 60;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Quiz Result: {quizResult.quiz_title}</h1>
      <p className={styles.score}><strong>Score:</strong> {quizResult.score} / {questions.length}</p>
      <p className={styles.time}><strong>Time Taken:</strong> {minutes}:{seconds.toString().padStart(2, '0')} s</p>
      <div className={styles.questionContainer}>
        {questions.length > 0 ? (
          questions.map((question, questionIndex) => {
            const selectedAnswersForQuestion = quizResult.selected_answers
              .filter((selected) => selected.question_id === question.id)
              .map(selected => selected.selected_answer_id);

            return (
              <div key={question.id} className={styles.questionItem}>
                 <h3 className={styles.questionTitle}>
                   
                    <span
                      className={
                        selectedAnswersForQuestion.length > 0 &&
                        selectedAnswersForQuestion.every((id) => question.correctAnswerIds.includes(id)) &&
                        selectedAnswersForQuestion.length === question.correctAnswerIds.length
                          ? styles.correctMarkerSmall
                          : styles.incorrectMarkerSmall
                      }
                    >
                      {selectedAnswersForQuestion.length > 0 &&
                      selectedAnswersForQuestion.every((id) => question.correctAnswerIds.includes(id)) &&
                      selectedAnswersForQuestion.length === question.correctAnswerIds.length
                        ? '✅'
                        : '❌'}
                    </span>
                    {questionIndex + 1}. {question.question}
                  </h3>
                <ul className={styles.questionItemAnswers}>
                    {question.answers.map((answer, answerIndex) => {
                      const isSelected = selectedAnswersForQuestion.includes(answer.id);
                      const isAnswerCorrect = question.correctAnswerIds.includes(answer.id);
                      return (
                        <li
                          key={answer.id}
                          className={`${styles.answer}${isAnswerCorrect && !isSelected ? styles.correctAnswer : ''}`}
                        >
                          <label>
                            <input
                              type="checkbox"
                              checked={isSelected} 
                              disabled 
                            />
                            {String.fromCharCode(65 + answerIndex)}. {answer.answer}
                          </label>
                          {isAnswerCorrect  && <span className={styles.correctMarker}> ✅</span>}
                        </li>
                      );
                    })}
                  </ul>

              </div>
            );
          })
        ) : (
          <p>No questions available for this quiz.</p>
        )}
      </div>
    </div>
  );
};

export default ResultQuiz;
