"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import styles from './ContentOfCourse.module.css';
import { FaHome } from 'react-icons/fa';

interface ContentOfCourse {
  id: number;
  title: string;
  description: string;
  video: string;
}
const CreateQuizForm = () => {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [video, setVideo] = useState<string>('');
  const [contentOfCourse, setContentOfCourse] = useState<ContentOfCourse[]>([]);
  const [editingContentOfCourseId, setEditingContentOfCourseId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState<string>('');
  const [editDescription, setEditDescription] = useState<string>('');
  const [editVideo, setEditVideo] = useState<string>('');
  const router = useRouter(); 
  const fetchContentOfCourse = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contentOfCourse/${courseId}`);
      if (response.ok) {
        const data: ContentOfCourse[] = await response.json();
        setContentOfCourse(data);
      } else {
        console.error('Error fetching quizzes:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchContentOfCourse();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contentOfCourse`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description, video }),
      });

      if (response.ok) {
        const newContentOfCourse: ContentOfCourse = await response.json();
        setContentOfCourse((prevContentOfCourse) => [...prevContentOfCourse, newContentOfCourse]);
         
      } else {
        console.error('Error creating quiz:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8000/api/contentOfCourse/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setContentOfCourse((prevContentOfCourse) => prevContentOfCourse.filter((contentOfCourse) => contentOfCourse.id !== id));
      } else {
        console.error('Error deleting quiz:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleEdit = (contentOfCourse: ContentOfCourse) => {
        setEditingContentOfCourseId(contentOfCourse.id);
        setEditTitle(contentOfCourse.title);
        setEditDescription(contentOfCourse.description);
        setEditVideo(contentOfCourse.video);
  };

  const handleUpdate = async () => {
    if (editingContentOfCourseId === null) return;

    try {
      const response = await fetch(`http://localhost:8000/api/contentOfCourse/${editingContentOfCourseId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: editTitle, description: editDescription, video: editVideo }),
      });

      if (response.ok) {
        const updatedContentOfCourse: ContentOfCourse = await response.json();
        setContentOfCourse((prevContentOfCourse) =>
                    prevContentOfCourse.map((contentOfCourse) => (contentOfCourse.id === updatedContentOfCourse.id ? updatedContentOfCourse : contentOfCourse))
        );
        setEditingContentOfCourseId(null);
      
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
          <label htmlFor="description">Description:</label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className={styles.input}
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="video">Video:</label>
          <input
            type="text"
            id="video"
            value={video}
            onChange={(e) => setVideo(e.target.value)}
            required
            className={styles.input}
          />
        </div>
        <button type="submit" className={styles.submitButton}>Create Content Of Course</button>
      </form>

      <div className={styles.quizList}>
        <h2>All Quizzes</h2>
        <ul>
          {contentOfCourse.length > 0 ? (
            contentOfCourse.map((contentOfCourse) => (
              <li key={contentOfCourse.id} className={styles.quizItem}>
                {editingContentOfCourseId === contentOfCourse.id ? (
                  <div>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className={styles.input}
                    />  
                    <input
                      type="text"
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      className={styles.input}
                    />
                    <button onClick={handleUpdate} className={styles.saveButton}>
                      Save
                    </button>
                    <button onClick={() => setEditingContentOfCourseId(null)} className={styles.cancelButton}>
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div>
                    <h3>{contentOfCourse.title}</h3>
                    <p>Description: {contentOfCourse.description}</p>
                    <button onClick={() => handleDetail(contentOfCourse.id)} className={styles.detailButton}>
                  Chi tiết
                </button>
                    <button onClick={() => handleEdit(contentOfCourse)} className={styles.editButton}>
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(contentOfCourse.id)}
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
