import { useState } from 'react';
import styles from '../../styles/Question.module.css';


interface Answer {
  id?: number;
  answer: string;
  is_correct: boolean;
}
interface NewQuestionFormProps {
  quizId: number;
  setQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
  questions: Question[];  
}



interface Question {
  id: number; 
  question: string;
  answers: Answer[];
  correctAnswerIds: number[];
}

const NewQuestionForm = ({ quizId, setQuestions, questions }: NewQuestionFormProps) => {
  const [newQuestion, setNewQuestion] = useState<string>('');
  const [newAnswers, setNewAnswers] = useState<Answer[]>([{ answer: '', is_correct: false }]);
  
  const handleAddAnswer = () => {
    setNewAnswers([...newAnswers, { answer: '', is_correct: false }]);
  };

  const handleAnswerChange = (index: number, value: string) => {
    const updatedAnswers = [...newAnswers];
    updatedAnswers[index].answer = value;
    setNewAnswers(updatedAnswers);
  };

    const handleCorrectAnswerChange = (index: number) => {
      const updatedAnswers = newAnswers.map((answer, i) => ({
        ...answer,
        is_correct: i === index,
      }));
      setNewAnswers(updatedAnswers);
    };``

  const handleSubmit = async () => {
    const hasCorrectAnswer = newAnswers.some((answer) => answer.is_correct);
    if (!hasCorrectAnswer) {
        alert('Please mark at least one correct answer.');
        return;
    }
    const correctAnswerIds = newAnswers
        .filter((answer) => answer.is_correct && answer.id !== undefined)  
        .map((answer) => answer.id);
  
    try {
    
        const response = await fetch(`http://localhost:8000/api/AddQuestions/${quizId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                question: newQuestion,
                answers: newAnswers,
                correctAnswerIds,  
            }),
        });
  
        if (response.ok) {
            const newQuestionData = await response.json();
            const {question, answers, correctAnswerIds} = newQuestionData;
            question.answers = answers;
            question.correctAnswerIds= correctAnswerIds;
            setQuestions([...questions, question]);
            setNewQuestion('');
            setNewAnswers([{ answer: '', is_correct: false }]);
        } else {
            console.error('Failed to submit question:', response.statusText);
        }
    } catch (error) {
        console.error('Error submitting question:', error);
    }
  };
  const handleCancel = () => {
    setNewQuestion('');
    
    setNewAnswers([{ answer: '', is_correct: false }]);
  };
  return (
    <div className={styles.newQuestionForm}>
    <h3 className={styles.questionItemTitle}>Add New Question</h3>
    <h4 className={styles.inputTitle}>Question:</h4>
    <input
      type="text"
      value={newQuestion}
      onChange={(e) => setNewQuestion(e.target.value)}
      placeholder="Enter question"
      className={styles.inputQuestion}
    />
    <h4 className={styles.inputTitle}>Answers:</h4>
    {newAnswers.map((answer, index) => (
      <div key={index} className={styles.answerInputContainer}>
        <input
          type="text"
          value={answer.answer}
          onChange={(e) => handleAnswerChange(index, e.target.value)}
          placeholder={`Answer ${index + 1}`}
          className={styles.inputAnswer}
        />
        <label>
          <input
            type="checkbox"
            checked={answer.is_correct}
            onChange={() => handleCorrectAnswerChange(index)}
            className={styles.isCorrect}
          />
        </label>
      </div>
    ))}
    <button onClick={handleAddAnswer} className={styles.addButton}>
      Add Answer
    </button>
    <button onClick={handleSubmit} className={styles.submitButton}>
      Add Question
    </button>
    <button onClick={() => handleCancel()} className={styles.cancelButton}>
      Cancel
    </button>
  </div>
  );
};

export default NewQuestionForm;
