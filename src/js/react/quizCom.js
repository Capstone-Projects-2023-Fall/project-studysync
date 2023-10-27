import React, { useEffect, useState } from 'react';
import { database } from '../../firebase'; // Import your Firebase configuration
import { QuizRepository } from '../repositories/QuizRepository'; // Import your QuizRepository class
import QuizList from './QuizList';
import AddQuiz from './AddQuiz';

function QuizComponent() {
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    // Create an instance of QuizRepository
    const quizRepository = new QuizRepository(database);

    // Call the getAllQuizes function to retrieve the quizzes
    quizRepository.getAllQuizes()
      .then((quizzes) => {
        // Extract unique subjects from the retrieved quizzes
        const uniqueSubjects = Array.from(new Set(quizzes.map(quiz => quiz.subject)));
        
        // Update the state with unique subjects
        setQuizzes(uniqueSubjects);
      })
      .catch((error) => {
        console.error('Error retrieving quizzes:', error);
      });
  }, []); // The empty dependency array ensures the effect runs once when the component mounts

  return (
    <div>
      {/* Render your quizzes here */}
      <h2>Quiz:</h2>
      <div>
        <h3>Subject: </h3>
        <ul>
          {quizzes.map((subject) => (
            <li key={subject} style={{ marginBottom: '10px' }}>
              <span style={{ display: 'inline-block', width: '150px' }}>{subject}</span>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3>Quiz Details: </h3>
        <QuizList />
        <AddQuiz />
      </div>
    </div>
  );
}

export default QuizComponent;
