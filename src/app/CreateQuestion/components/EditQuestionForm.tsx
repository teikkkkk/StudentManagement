import React, { useState } from 'react';
import styles from '../../styles/Question.module.css';

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

interface EditQuestionFormProps {
  questionId: number;
  questions: Question[];
  setQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
  setEditQuestionId: React.Dispatch<React.SetStateAction<number | null>>;
  editQuestion: string;
  editAnswers: Answer[];
}

const EditQuestionForm: React.FC<EditQuestionFormProps> = ({ questionId, questions, setQuestions, setEditQuestionId, editQuestion, editAnswers }) => {
  const [localEditQuestion, setLocalEditQuestion] = useState<string>(editQuestion);
  const [localEditAnswers, setLocalEditAnswers] = useState<Answer[]>(editAnswers);

  const handleAddEditAnswer = () => {
    const newAnswer: Answer = { answer: '', is_correct: false };
    setLocalEditAnswers([...localEditAnswers, newAnswer]);
  };

  const handleDeleteAnswer = async (answerId: number | null | undefined, index: number) => {
    if (answerId) {
      try {
        const response = await fetch(`http://localhost:8000/api/deleteAnswer/${answerId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to delete answer');
        }

        const updatedAnswers = [...localEditAnswers];
        updatedAnswers.splice(index, 1); 
        setLocalEditAnswers(updatedAnswers); 
      } catch (error) {
        console.error('Error deleting answer:', error);
      }
    } else {
      const updatedAnswers = [...localEditAnswers];
      updatedAnswers.splice(index, 1);
      setLocalEditAnswers(updatedAnswers);
    }
  };

  const handleUpdateQuestion = async () => {
    if (!questionId) return;
    const updatedQuestion = {
      id: questionId,
      question: localEditQuestion,
      answers: [...localEditAnswers],
    };
    updatedQuestion.answers.forEach((answer) => {
      answer.is_correct = answer.is_correct !== undefined ? answer.is_correct : false;
    });

    const correctAnswerIds = updatedQuestion.answers
      .filter((answer) => answer.is_correct && answer.id !== undefined)
      .map((answer) => answer.id);

    try {
      const response = await fetch(`http://localhost:8000/api/EditQuestion/${questionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: updatedQuestion.question,
          answers: updatedQuestion.answers,
          correctAnswerIds,
        }),
      });

      if (response.ok) {
        const updatedQuestionData = await response.json();
        const { question, answers, correctAnswerIds } = updatedQuestionData;
        question.answers = answers;
        question.correctAnswerIds = correctAnswerIds;
        const updatedQuestions = questions.map((q) => {
          if (q.id === questionId) {
            return question;
          }
          return q;
        });

        setQuestions(updatedQuestions);
        setEditQuestionId(null);
      } else {
        console.error('Failed to update question:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating question:', error);
    }
  };

  return (
    <div>
      <div className={styles.question}>
        <h3 className={styles.questionTitle}>
          {questions.findIndex(q => q.id === questionId) + 1}. 
        </h3>
        <input
          type="text"
          value={localEditQuestion}
          onChange={(e) => setLocalEditQuestion(e.target.value)}
          className={styles.inputQuestion}
        />
      </div>
      {localEditAnswers.map((answer, index) => (
        <div key={index} className={styles.answerInputContainer}>
          <label>
            {String.fromCharCode(65 + index)}.
            <input
              type="text"
              value={answer.answer}
              onChange={(e) => {
                const updatedAnswers = [...localEditAnswers];
                updatedAnswers[index].answer = e.target.value;
                setLocalEditAnswers(updatedAnswers);
              }}
              className={styles.inputAnswer}
            />
            <input
              type="checkbox"
              checked={answer.is_correct}
              onChange={() => {
                const updatedAnswers = [...localEditAnswers];
                updatedAnswers[index].is_correct = !updatedAnswers[index].is_correct;
                setLocalEditAnswers(updatedAnswers);
              }}
              className={styles.isCorrect}
 />
          </label>
          <button
            onClick={() => handleDeleteAnswer(answer.id, index)}
            className={styles.deleteButton}
          >
            Delete
          </button>
        </div>
      ))}
      <button onClick={handleAddEditAnswer} className={styles.addButton}>
        Add Answer
      </button>
      <button onClick={handleUpdateQuestion} className={styles.saveButton}>
        Save
      </button>
      <button onClick={() => setEditQuestionId(null)} className={styles.cancelButton}>
        Cancel
      </button>
    </div>
  );
};

export default EditQuestionForm;