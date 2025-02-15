'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from '../styles/Question.module.css';
import NewQuestionForm from './components/NewQuestionForm';
import QuestionItem from './components/QuestionItem';
import EditQuestionForm from './components/EditQuestionForm';

interface Answer {
  id?: number;
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

const QuizDetails = () => {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [editQuestionId, setEditQuestionId] = useState<number | null>(null);
  const [editQuestion, setEditQuestion] = useState<string>('');
  const [editAnswers, setEditAnswers] = useState<Answer[]>([]);
  const searchParams = useSearchParams();
  const quizId = parseInt(searchParams!.get('quizId') ?? '', 10);
  
  useEffect(() => {
    const fetchQuizDetails = async () => {
      if (!quizId) return;
      try {
        const response = await fetch(`http://localhost:8000/api/quizzes/details/${quizId}`);
        if (!response.ok) throw new Error(response.statusText);
        const data = await response.json();
        setQuiz(data.quiz);
        setQuestions(data.questions);
      } catch (error) {
        console.error('Error fetching quiz details:', error);
      }
    };
  
    fetchQuizDetails();
  }, [quizId]);
  const handleDeleteQuestion = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8000/api/DeleteQuestions/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error(response.statusText);

      setQuestions((prevQuestions) => prevQuestions.filter((question) => question.id !== id));
    } catch (error) {
      console.error('Error deleting question:', error);
    }
  };
  const handleEditQuestion = (question: Question) => {
    setEditQuestionId(question.id);
    setEditQuestion(question.question);
    const updatedAnswers = question.answers.map((answer) => {
      const isCorrect = question.correctAnswerIds?.includes(answer.id ?? 0) || false; 
      return {
        ...answer,
        is_correct: isCorrect, 
      };
    });
    setEditAnswers(updatedAnswers);  
  };


  if (!quiz) return <p>Loading...</p>;

  return (
    <div className={styles.container}>
      <div className={styles.quizInfo}>
        <h1 className={styles.quizTitle}>{quiz.title}</h1>
        <p className={styles.quizTime}>Time: {quiz.time} minutes</p>
      </div>
      <div className={styles.questionContainer}>
        <NewQuestionForm quizId={quizId} setQuestions={setQuestions} questions={questions} />
        
      {questions.length > 0 ? (
  questions.map((question, questionIndex) => (
    <div key={question.id} className={styles.questionItem}>
      {editQuestionId === question.id ? (
       <EditQuestionForm
       questionId={question.id}
       questions={questions}
       setQuestions={setQuestions}
       setEditQuestionId={setEditQuestionId}
       editQuestion={editQuestion}
       editAnswers={editAnswers}
     />
      ) : (
        <QuestionItem
          key={question.id}
          question={question}
          questionIndex={questionIndex}
          onEdit={() => handleEditQuestion(question)}
          onDelete={handleDeleteQuestion}
        />
      )}
    </div>
  ))
) : (
  <p>No questions available for this quiz.</p>
)}

      </div>
    </div>
  );
};

export default QuizDetails;