// FlashcardComponent.js
import React, { useState } from 'react';
import FlashcardRepo from '../js/repositories/FlashcardRepo';  // Adjust the path accordingly


const UpdateQuestions = ({ quizId, editQuestion, questions, setQuizData, setOpenEdit, setEditQuestion }) => {
    const [question, setQuestion] = useState(editQuestion ? editQuestion.question : '');
    const [choices, setChoices] = useState(editQuestion ? [...editQuestion.choices] : ['', '', '', '']);
    const [correctChoiceIndex, setCorrectChoiceIndex] = useState(
      editQuestion ? editQuestion.correctChoiceIndex : null
    );
  
    const handleUpdateQuestion = async () => {
      if (editQuestion && question && choices.every((choice) => choice !== '')) {
        try {
          await FlashcardRepo.updateQuestion(
            quizId,
            editQuestion.questionId,
            question,
            choices,
            correctChoiceIndex
          );
  
          const updatedQuiz = questions.map((quiz) => {
            if (quiz.questionId === editQuestion.questionId) {
              return { ...quiz, question, choices, correctChoiceIndex };
            }
            return quiz;
          });
          setQuizData(updatedQuiz);
          setOpenEdit(false);
          setEditQuestion(null);
  
          // Clear input fields and reset state values
          setQuestion('');
          setChoices(['', '', '', '']);
          setCorrectChoiceIndex(null);
        } catch (error) {
          console.error("Failed to update flashcard:", error);
        }
      }
    };
  
    return (
      <div>
        {/* Render your form inputs and buttons here */}
        {/* For example: */}
        <label htmlFor="questionInput">Question</label>
        <input
          id="questionInput"
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        {/* ... other form inputs ... */}
        <button onClick={handleUpdateQuestion}>Update Question</button>
      </div>
    );
  };
  
  export default UpdateQuestions;