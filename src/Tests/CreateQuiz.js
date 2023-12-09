// CreateQuizForm.js
import React, { useState } from 'react';
import FlashcardRepo from '../js/repositories/FlashcardRepo';

const QuizCreator = ({ setId, quizTitle, setQuizList }) => {
    const handleCreateQuiz = async () => {
      try {
        const uid = FlashcardRepo.getCurrentUid();
  
        if (uid && quizTitle) {
          const newQuizId = await FlashcardRepo.createNewQuiz(setId, quizTitle);
  
          console.log("You want to add: ", quizTitle);
  
          await FlashcardRepo.addOwnedQuizSetToUser(uid, newQuizId);
  
          setQuizList(newQuizId);
        }
      } catch (error) {
        console.error('Error creating quiz:', error);
      }
    };
  
    return (
      <div>
        {/* Your component UI goes here */}
        <button onClick={handleCreateQuiz}>Create Quiz</button>
      </div>
    );
  };
  
  export default QuizCreator;
