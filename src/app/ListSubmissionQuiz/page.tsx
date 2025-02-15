
"use client";
import { useState, useEffect } from 'react';
import { useSearchParams,useRouter } from 'next/navigation'; 
import styles from '../styles/QuizSubmission.module.css';
interface QuizSubmission {
    id: number;
    quiz_id: number;
    score: number;
    time_taken: number;
}
const QuizSubmission = () => {
  const router = useRouter(); 
  const [submissions, setSubmissions] = useState<QuizSubmission[]>([]);
  const searchParams = useSearchParams();
  const quizId = searchParams!.get('quizId'); 
  
  const fetchSubmissions = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/ListSubmission/${quizId}`);
      if (response.ok) {
        const data: QuizSubmission[] = await response.json(); 
        setSubmissions(data); 
      } else {
        console.error('Error fetching submissions:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    if (quizId) {
      fetchSubmissions();
    }
  }, [quizId]);

  if (submissions.length === 0) {
    return <p>No submissions available for this quiz.</p>;
  }
  const handleDetailSubmission= (id: number) => {
    router.push(`/ResultQuiz?page=detail-submission&submission=${id}`);
  };
  return (
    <div className={styles.submissionList}>
      <h1 className={styles.title}>Quiz Submissions</h1>
      <ul>
      {submissions.length > 0 ? (
         submissions.map((submission,submissionIndex) => (
             <li key={submission.id} className={styles.quizItem}>
             <div>
               <h3>lần {submissionIndex+1}</h3>
               <p>điểm : {submission.score} </p>
               <button onClick={()=>handleDetailSubmission(submission.id)} className={styles.detailButton}> chi tiết </button>
             </div>
         </li>
          ))
        ) : (
            <p>No quizzes available.</p>
          )}
      </ul> 
    </div>
  );
};

export default QuizSubmission;
