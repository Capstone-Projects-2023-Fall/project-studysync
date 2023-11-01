import React, { useEffect, useState } from 'react';
import { database } from '../../firebase';
import { QuizRepository } from '../repositories/QuizRepository';
import QuizList from './QuizList';
import AddQuiz from './AddQuiz';

function QuizComponent() {
  const [quizzes, setQuizzes] = useState([]);

  const fetchData = () => {
    const quizRepository = new QuizRepository(database);

    quizRepository.getAllQuizes()
      .then((quizzes) => {
        // Update the state with all quizzes
        setQuizzes(quizzes);
      })
      .catch((error) => {
        console.error('Error retrieving quizzes:', error);
      });
  };

  useEffect(() => {
    // Fetch data when the component mounts
    fetchData();
  }, []); // The empty dependency array ensures the effect runs once when the component mounts


const updateQuizzes = (updatedQuizzes) => {
  setQuizzes(updatedQuizzes);
};

  return (
    <div>
      <div>
        <QuizList quizzes={quizzes} fetchData={fetchData} />
        <AddQuiz fetchData={fetchData} /> {/* Pass fetchData and database as props to AddQuiz */}
      </div>
    </div>
  );
}

export default QuizComponent;
