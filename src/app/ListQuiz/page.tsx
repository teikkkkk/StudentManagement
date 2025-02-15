"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import styles from '../styles/CreateQuizForm.module.css';
import { FaHome } from 'react-icons/fa';

interface Quiz {
    id: number;
    title: string;
    time: number;
}

const ListQuiz = () => {
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const router = useRouter(); 

    const fetchQuizzes = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/quizzes');
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

    const handleTakeQuiz = (id: number) => {
        router.push(`/TakeQuiz?page=quiz-take&quizId=${id}`);
    };

    const hadleResultQuiz = (id: number) => {
        router.push(`/ListSubmissionQuiz?page=quiz-submission&quizId=${id}`);
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
                <h1 className={styles.pageTitle}>List Quiz</h1>
            </header>
            <div className={styles.quizList}>
                <h2>All Quizzes</h2>
                <ul>
                    {quizzes.length > 0 ? (
                        quizzes.map((quiz) => (
                            <li key={quiz.id}>
                                <div>
                                    <h3>{quiz.title}</h3>
                                    <p>Time: {quiz.time} minutes</p>
                                    <button onClick={() => handleTakeQuiz(quiz.id)} className={styles.detailButton}>Làm bài</button>
                                    <button onClick={() => hadleResultQuiz(quiz.id)} className={styles.editButton}>Kết quả</button>
                                </div>
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

export default ListQuiz;
