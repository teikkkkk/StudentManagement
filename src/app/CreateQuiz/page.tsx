"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import styles from '../styles/CreateQuizForm.module.css';
import { FaHome } from 'react-icons/fa';

interface Quiz {
  id: number;
  title: string;
  time: number;
  created_at: string;
  updated_at: string;
}
const CreateQuizForm = () => {
  const [title, setTitle] = useState<string>('');
  const [time, setTime] = useState<number | ''>('');
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [editingQuizId, setEditingQuizId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState<string>('');
  const [editTime, setEditTime] = useState<number | ''>('');
  const router = useRouter(); 
  const fetchQuizzes = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/quizzes`);
      if (response.ok) {
        const data: Quiz[] = await response.json();
        setQuizzes(data);
      } else {
        console.error('Error fetching quizzes:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/quizzes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, time }),
      });

      if (response.ok) {
        const newQuiz: Quiz = await response.json();
        setQuizzes((prevQuizzes) => [...prevQuizzes, newQuiz]);
        setTitle('');
        setTime('');
      } else {
        console.error('Error creating quiz:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8000/api/quizzes/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setQuizzes((prevQuizzes) => prevQuizzes.filter((quiz) => quiz.id !== id));
      } else {
        console.error('Error deleting quiz:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleEdit = (quiz: Quiz) => {
    setEditingQuizId(quiz.id);
    setEditTitle(quiz.title);
    setEditTime(quiz.time);
  };

  const handleUpdate = async () => {
    if (editingQuizId === null) return;

    try {
      const response = await fetch(`http://localhost:8000/api/quizzes/${editingQuizId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: editTitle, time: editTime }),
      });

      if (response.ok) {
        const updatedQuiz: Quiz = await response.json();
        setQuizzes((prevQuizzes) =>
          prevQuizzes.map((quiz) => (quiz.id === updatedQuiz.id ? updatedQuiz : quiz))
        );
        setEditingQuizId(null);
        setEditTitle('');
        setEditTime('');
      } else {
        console.error('Error updating quiz:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

 const handleDetail = (id: number) => {
  router.push(`/CreateQuestion?page=quiz-details&quizId=${id}`);
};

  const handleHomeClick = () => {
    router.push('/Home');
  };

  return (
    <div>
      <header className={styles.header}>
        <button onClick={handleHomeClick} className={styles.homeButton}>
          <FaHome size={20} />
        </button>
        <h1 className={styles.pageTitle}>Create Quiz</h1>
      </header>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="title" >Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className={styles.input}
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="time">Time (minutes):</label>
          <input
            type="number"
            id="time"
            value={time}
            onChange={(e) => setTime(Number(e.target.value))}
            required
            className={styles.input}
          />
        </div>
        <button type="submit" className={styles.submitButton}>Create Quiz</button>
      </form>

      <div className={styles.quizList}>
        <h2>All Quizzes</h2>
        <ul>
          {quizzes.length > 0 ? (
            quizzes.map((quiz) => (
              <li key={quiz.id} className={styles.quizItem}>
                {editingQuizId === quiz.id ? (
                  <div>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className={styles.input}
                    />
                    <input
                      type="number"
                      value={editTime}
                      onChange={(e) => setEditTime(Number(e.target.value))}
                      className={styles.input}
                    />
                    <button onClick={handleUpdate} className={styles.saveButton}>
                      Save
                    </button>
                    <button onClick={() => setEditingQuizId(null)} className={styles.cancelButton}>
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div>
                    <h3>{quiz.title}</h3>
                    <p>Time: {quiz.time} minutes</p>
                    <button onClick={() => handleDetail(quiz.id)} className={styles.detailButton}>
                  Chi tiết
                </button>
                    <button onClick={() => handleEdit(quiz)} className={styles.editButton}>
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(quiz.id)}
                      className={styles.deleteButton}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </li>
            ))
          ) : (
            <p>No quizzes available.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default CreateQuizForm;
