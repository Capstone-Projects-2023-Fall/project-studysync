import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FlashcardRepo from '../repositories/FlashcardRepo';

import { Button, TextField, Typography, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItem, IconButton, Avatar, ThemeProvider, createTheme } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SendIcon from '@mui/icons-material/Send';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useParams } from 'react-router-dom';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import EditIcon from '@mui/icons-material/Edit';

const QuizComponent = () => {

  const [openAdd, setOpenAdd] = useState(false);
  const { setId } = useParams();  //retrieve the flashcard set in order to go to a certain quiz

  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [choices, setChoices] = useState(['', '', '', '']); //store choices
  const [correctChoiceIndex, setCorrectChoiceIndex] = useState(null); //capture the correct choice as an array index
  const [questions, setQuizData] = useState([]); //array to hold all questions data

  const [deleteQuestion, setDeleteQuestion] = useState(null); 
  const [openDelete, setOpenDelete] = useState(false);

  const [editQuestion, setEditQuestion] = useState(null);

  useEffect(() => {
    // fetch questions from database
    const fetchQuestions = async () => {
        try {
            const questionData = await FlashcardRepo.getQuestionItems(setId);
            console.log("fetching question", questionData);
            const questionsArray = Object.keys(questionData).map(key => {
                return {
                    question: questionData[key].question,
                    choices: questionData[key].choices,
                    questionId: key
                };
            });
            setQuizData(questionsArray);
        } catch (error) {
            console.error("Failed to fetch flashcards:", error);
        }
    };

    fetchQuestions();
}, [setId]);

  //this methods add quiz and its data to the database
  const handleAddQuestion = async () => {
    if (question && choices.every((choice) => choice !== '') &&
    correctChoiceIndex !== null) {

      try {
        const newQuiz = await FlashcardRepo.addQuizQuestion(setId, question, choices, correctChoiceIndex);
        // Update the quizData state with the new quiz
        setQuizData((prev) => [...prev, { question, choices, questionId: newQuiz }]);
        // Clear input fields
        setQuestion('');
        setChoices(['', '', '', '']);
        setCorrectChoiceIndex(null);
      } catch (error) {
        console.error('Failed to add quiz:', error);
      }
    }
  };

  //this method will handle delete question
  const handleDeleteQuestion = (quiz) => {
    setDeleteQuestion(quiz);
    setOpenDelete(true);
};

//delete the question and update the question data (setQuizData(updateQuiz))
const confirmDelete = async () => {
    if (deleteQuestion) {
        try {
            await FlashcardRepo.deleteQuestion(setId, deleteQuestion.questionId);
            const updatedQuiz = questions.filter(quiz => quiz.questionId !== deleteQuestion.questionId);
            setQuizData(updatedQuiz);
            setDeleteQuestion(null);
        } catch (error) {
            console.error("Failed to delete flashcard:", error);
        }
        setOpenDelete(false);
    }
}

//save the index of the correct answer captured from the user input
const handleChoiceChange = (value, index) => {
    const updatedChoices = [...choices];
    updatedChoices[index] = value;
    setChoices(updatedChoices);
  };

  const handleCorrectChoiceChange = (e) => {
    const index = parseInt(e.target.value, 10);
    setCorrectChoiceIndex(index);
  };
  
  
return (
    <div style={{
        display: "flex", flexDirection: "column", height: "100vh",
        backgroundColor: '#f9f9f9', padding: '20px'
    }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "row", justifyContent: "space-between", marginBottom: '20px' }}>
            <List style={{
                width: "30%", borderRight: "1px solid #e0e0e0",
                borderRadius: '8px', overflow: 'hidden', boxShadow: '0px 0px 15px rgba(0,0,0,0.1)'
            }}>
            {/* show list of question on the left panel with options to edit or delete */}
            {questions.map((quiz, index) => (
                    <ListItem button key={index}>
                        {quiz.question}
                        <IconButton>
                            <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteQuestion(quiz)}>
                            <DeleteIcon />
                        </IconButton>
                    </ListItem>
            ))}
                <Button onClick={() => setOpenAdd(true)} startIcon={<AddIcon />}>
                    Add
                </Button>
            </List>
        </div>

        {/* create a dialog and capture all the question data         */}
        <Dialog open={openAdd} onClose={() => setOpenAdd(false)}>
                    <DialogTitle>Add a new question</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Question"
                            fullWidth
                            onChange={(e) => setQuestion(e.target.value)}
                        />
                    <div>
                    {/* allow user to put all answer into multiple choices and select the correct answer */}
                            {choices.map((choice, index) => (
                        <div key={index}>
                            <TextField
                            label={`Choice ${index + 1}`}
                            fullWidth
                            value={choice}
                            onChange={(e) => handleChoiceChange(e.target.value, index)}
                            />
                            <input
                                type="radio"
                                name="correctChoice"
                                value={index}
                                onChange={handleCorrectChoiceChange}
                                checked={correctChoiceIndex === index}
                                />{' '}
                                Correct
                        </div>
                            ))}
                    </div>
                    {/* this diaglog with either add or cancel the adding question process */}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenAdd(false)} color="primary">
                            Cancel
                        </Button>
                        <Button
                             onClick={() => {
                                handleAddQuestion();
                                setOpenAdd(false);
                            }}
                            color="primary"
                        >
                            Add
                        </Button>
                    </DialogActions>
        </Dialog>
               {/* prompt user if they really want to the delete a certain question                  */}
                <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
                    <DialogTitle>Confirm Deletion</DialogTitle>
                    <DialogContent>
                        <Typography>Are you sure you want to delete this question?</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDelete(false)} color="primary">
                            No
                        </Button>
                        <Button
                            onClick={confirmDelete}
                            color="primary"
                        >
                            Yes
                        </Button>
                    </DialogActions>
                </Dialog>
    
    </div>
);
};

export default QuizComponent;