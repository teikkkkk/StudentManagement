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

interface QuestionItemProps {
  question: Question;
  questionIndex: number;
  onEdit: (question: Question) => void;
  onDelete: (id: number) => void;
}

const QuestionItem = ({ question, questionIndex, onEdit, onDelete }: QuestionItemProps) => {
  return (
    <div>
      <h3 className={styles.questionTitle}>
        {questionIndex + 1}. {question.question}
      </h3>
      <ul className={styles.questionItemAnswers}>
        {Array.isArray(question.answers) && question.answers.length > 0 ? (
          question.answers.map((answer, answerIndex) => {
            const answerId = answer.id || `new-${answerIndex}`;
            const AnswerId = typeof answerId === 'string' ? parseInt(answerId) : answerId;
            const isCorrect = Array.isArray(question.correctAnswerIds) && AnswerId !== undefined && question.correctAnswerIds.includes(AnswerId);
            return (
              <li key={typeof answerId === 'number' ? answerId : `answer-${answerId}`} className={styles.answer}>
                {isCorrect && <span className={styles.correctIcon}>✔️</span>}
                {String.fromCharCode(65 + answerIndex)}. {answer.answer}
              </li>
            );
          })
        ) : (
          <p>No answers available</p>
        )}
      </ul>
      <button onClick={() => onEdit(question)} className={styles.editButton}>Edit</button>
      <button onClick={() => onDelete(question.id)} className={styles.deleteButton}>Delete</button>
    </div>
  );
};

export default QuestionItem;