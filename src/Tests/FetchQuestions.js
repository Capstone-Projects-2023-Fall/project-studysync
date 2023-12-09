// Assume your component is named AddQuestionForm.js
import React, { useState } from 'react';
import FlashcardRepo from '../js/repositories/FlashcardRepo';

const AddQuestionForm = ({ quizId, setQuizData }) => {
  const [question, setQuestion] = useState('');
  const [choices, setChoices] = useState(['', '', '', '']);
  const [correctChoiceIndex, setCorrectChoiceIndex] = useState(null);
  const [deleteQuestion, setDeleteQuestion] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);

  const handleAddQuestion = async () => {
    if (question && choices.every((choice) => choice !== '') && correctChoiceIndex !== null) {
      try {
        const newQuiz = await FlashcardRepo.addQuizQuestion(quizId, question, choices, correctChoiceIndex);
        setQuizData((prev) => [...prev, { question, choices, questionId: newQuiz }]);
        setQuestion('');
        setChoices(['', '', '', '']);
        setCorrectChoiceIndex(null);
      } catch (error) {
        console.error('Failed to add quiz:', error);
      }
    }
  };

  const confirmDelete = async () => {
    if (deleteQuestion) {
        try {
            await FlashcardRepo.deleteQuestion(quizId, deleteQuestion.questionId);
            const updatedQuiz = questions.filter(quiz => quiz.questionId !== deleteQuestion.questionId);
            setQuizData(updatedQuiz);
            setDeleteQuestion(null);
        } catch (error) {
            console.error("Failed to delete flashcard:", error);
        }
        setOpenDelete(false);
    }
}
  return (
    <div>
      <label>
        Question
        <input type="text" value={question} onChange={(e) => setQuestion(e.target.value)} />
      </label>
      <br />

      {choices.map((choice, index) => (
        <div key={index}>
          <label>
            Choice {index + 1}
            <input
              type="text"
              value={choice}
              onChange={(e) => setChoices((prevChoices) => [...prevChoices.slice(0, index), e.target.value, ...prevChoices.slice(index + 1)])}
            />
          </label>
          <br />
        </div>
      ))}

      <label>
        Correct Choice
        <input type="number" value={correctChoiceIndex !== null ? correctChoiceIndex + 1 : ''} onChange={(e) => setCorrectChoiceIndex(parseInt(e.target.value, 10) - 1)} />
      </label>
      <br />

      <button onClick={handleAddQuestion}>Add Question</button>
    </div>
  );
};

export default AddQuestionForm;
