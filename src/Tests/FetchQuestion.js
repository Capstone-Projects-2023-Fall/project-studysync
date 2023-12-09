// FlashcardComponent.js
import React, { useState, useEffect } from 'react';
import FlashcardRepo from '../js/repositories/FlashcardRepo'; // assuming this is the module with the database fetch logic

const Questions = ({ quizId, termArray, definitionArray }) => {
  const [quizData, setQuizData] = useState([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const questionData = await FlashcardRepo.getQuestionItems(quizId);
        const questionsArray = Object.keys(questionData).map(key => ({
          question: questionData[key].question,
          choices: questionData[key].choices,
          questionId: key,
        }));
        setQuizData(questionsArray);
      } catch (error) {
        console.error("Failed to fetch flashcards:", error);
      }
    };

    fetchQuestions();
  }, [quizId, termArray, definitionArray]);

  return (
    // your component rendering logic
    <div>
      {/* Render quizData in your component */}
    </div>
  );
};

export default Question;
