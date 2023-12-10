// FlashcardComponent.js
import React, { useState, useEffect } from 'react';
import FlashcardRepo from '../repositories/FlashcardRepo'; // assuming this is the module with the database fetch logic

const QuizList = ({ setId, quizId, navigate, newQuizAdded }) => {
  const [quizList, setQuizList] = useState([]);

  useEffect(() => {
    const fetchQuizTitle = async () => {
      try {
        const quizData = await FlashcardRepo.getQuizTitleFromFlashcardSet(setId);
        console.log("Fetching Quiz Title:", quizData);

        if (newQuizAdded && !quizList.includes(newQuizAdded)) {
          setQuizList(prevList => [...prevList, newQuizAdded]);
          newQuizAdded = null;
        } else {
          setQuizList(quizData);
        }
      } catch (error) {
        console.error("Failed to fetch flashcards:", error);
      }
    };

    fetchQuizTitle();

  }, [setId, quizId, navigate, newQuizAdded]);

  return (
    // your component rendering logic
    <div>
      <ul>
        {quizList.map((quiz, index) => (
          <li key={index}>{quiz}</li>
        ))}
      </ul>
    </div>
  );
};

export default QuizList;
