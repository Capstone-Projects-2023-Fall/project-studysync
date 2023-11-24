import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FlashcardRepo from '../repositories/FlashcardRepo';

import { Button, TextField, Typography, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItem, IconButton, Avatar, ThemeProvider, createTheme, ButtonGroup, Stack, DialogContentText } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SendIcon from '@mui/icons-material/Send';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useParams } from 'react-router-dom';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import EditIcon from '@mui/icons-material/Edit';
import Question from '../models/question';
import QuizList from './QuizList';

import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';

const QuizComponent = () => {

  const [openAdd, setOpenAdd] = useState(false);
  const { setId, quizId } = useParams();  //retrieve the flashcard set in order to go to a certain quiz

  const [question, setQuestion] = useState('');
  const [choices, setChoices] = useState(['', '', '', '']); //store choices
  const [correctChoiceIndex, setCorrectChoiceIndex] = useState(null); //capture the correct choice as an array index
  const [questions, setQuizData] = useState([]); //array to hold all questions data

  const [deleteQuestion, setDeleteQuestion] = useState(null); 
  const [openDelete, setOpenDelete] = useState(false);

  const [editQuestion, setEditQuestion] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);

  const [selectedCard, setSelectedCard] = useState(null);
  const [showDefinition, setShowDefinition] = useState(false);

  const [openGenerate, setOpenGenerateAI] = useState(false); // a state to handle the AI button
  const [topicName, setTopicName] = useState('');
  const [numberOfQuestions, setNumOfQuestions] = useState(1);

  const [openQuiz, setOpenQuiz] = useState(false);
  const [quizTitle, setQuizTitle] = useState('');

  
  useEffect(() => {
    if (!openEdit) {
      resetEditDialog(); 
    }
  }, [openEdit]);

  useEffect(() => {
    // fetch questions from database
    const fetchQuestions = async () => {
        try {
            const questionData = await FlashcardRepo.getQuestionItems(quizId);
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

}, [quizId]);

  //this methods add quiz and its data to the database
  const handleAddQuestion = async () => {
    if (question && choices.every((choice) => choice !== '') &&
    correctChoiceIndex !== null) {

      try {
        const newQuiz = await FlashcardRepo.addQuizQuestion(quizId, question, choices, correctChoiceIndex);
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
  
  const handleEditQuestion = (quiz) => {
    resetEditDialog(); // Reset state when opening the dialog
    setQuestion(quiz.question)
    setChoices([...quiz.choices]);
    setCorrectChoiceIndex(quiz.correctChoiceIndex);
    setEditQuestion(quiz);
    setOpenEdit(true);
};

  // Reset state when the "Edit question" dialog is closed
  const resetEditDialog = () => {
    setQuestion('');
    setChoices(['', '', '', '']);
    setCorrectChoiceIndex(null);
  };
  

const handleUpdateQuestion = async () => {
    if (editQuestion && question && choices.every((choice) => choice !== '')){
        try {
            await FlashcardRepo.updateQuestion(quizId, editQuestion.questionId, question, choices, correctChoiceIndex);

            const updatedQuiz = questions.map(quiz => {
                if (quiz.questionId === editQuestion.questionId) {
                    return { ...quiz, question, choices, correctChoiceIndex};
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

const handleShowQuestion = () => {
    const currentIndex = questions.indexOf(selectedCard);
    if (currentIndex > 0) {
        setSelectedCard(questions[currentIndex - 1]);
        setShowDefinition(false);
    }
};

const handleNextCard = () => {
    const currentIndex = questions.indexOf(selectedCard);
    if (currentIndex < questions.length - 1) {
        setSelectedCard(questions[currentIndex + 1]);
        setShowDefinition(false);
    }
};

const handleCreateQuiz = async () => {
    try {
      const uid = FlashcardRepo.getCurrentUid();
  
      if (uid && quizTitle) {
        // Call your createNewQuiz function from FlashcardRepo
        const newQuizId = await FlashcardRepo.createNewQuiz(setId, quizTitle);
  
        console.log("You want to add: ", quizTitle);
        // Add the newly created quiz to the user's owned quiz sets
        await FlashcardRepo.addOwnedQuizSetToUser(uid, newQuizId);
      }
    } catch (error) {
      console.error('Error creating quiz:', error);
    }
  };

  
const handleOpenGenerateAI = () => {
    setOpenGenerateAI(true);
};

function parseGPTResponse(rawResponse) {
    try {
        // Regular expression to find JSON objects in the response
        const jsonRegex = /{[\s\S]*?}/g;
        const matches = rawResponse.match(jsonRegex);
        console.log("Raw JSON matches:", matches);

        if (!matches) return [];

        // Parse each JSON string into an object
        const questions = matches.map(jsonString => {
            try {
                return JSON.parse(jsonString);
            } catch (error) {
                console.error("Error parsing individual JSON string:", jsonString, error);
                return null; // or some other error handling
            }
        }).filter(question => question != null);
        return questions;
    } catch (error) {
        console.error("Error parsing GPT response:", error);
        return [];
    }
}

const handleGenerateAIQuestion = async () => {
    setOpenGenerateAI(false);

    try {
        const responseString = await callYourCloudFunctionToGenerateQuestions(numberOfQuestions, topicName);
        const generatedQuestions = responseString;

        const addedQuestions = [];
        for (const question of generatedQuestions) {
            const newQuestionId = await FlashcardRepo.addQuizQuestion(quizId, question.question, question.choices, question.correctChoiceIndex);
            // // add the AI generated flashcard data into quiz question
            // await FlashcardRepo.addQuizQuestion(quizId, flashcard.definition, [flashcard.term, 'Option 2', 'Option 3', 'Option 4'], 0);
            addedQuestions.push({ ...question, questionId: newQuestionId });
        }

        setQuizData(prev => [...prev, ...addedQuestions]);
    } catch (error) {
        console.error("Error generating or adding question with AI:", error);
    }
};

const callYourCloudFunctionToGenerateQuestions = async (numQuestions, topicName) => {
    try {
        const functionUrl = 'https://us-central1-studysync-a603a.cloudfunctions.net/askGPT';

        const response = await fetch(functionUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
                body: JSON.stringify({ message: `Please create ${numQuestions} quiz question 
                along with 4 multiple choices answer with one correct answerabout ${topicName}. 
                Format each question as JSON with 'question', an array of choices in 'choices' field, and 'correctChoiceIndex' 
                as an index to the correct choice no other words in json , i need to parse it with only "question", "choices", and "correctChoiceIndex".
                Please make sure questions are not repetitive.` }),
        });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            return parseGPTResponse(data.text); // Assuming the data.text is the string of JSON flashcards
        } catch (error) {
            console.error("Error calling cloud function:", error);
            throw error;
        }
};
  
return (
    <div style={{
        display: "flex", flexDirection: "column", height: "100vh",
        backgroundColor: '#f9f9f9', padding: '20px'
    }}>
    <QuizList/>
        <div style={{ flex: 1, display: "flex", flexDirection: "row", justifyContent: "space-between", marginBottom: '20px' }}>
            <List style={{
                width: "30%", borderRight: "1px solid #e0e0e0",
                borderRadius: '8px', overflow: 'hidden', boxShadow: '0px 0px 15px rgba(0,0,0,0.1)'
            }}>
            {/* show list of question on the left panel with options to edit or delete */}
            {questions.map((quiz, index) => (
                    <ListItem button key={index} onClick={() => { setSelectedCard(quiz); setShowDefinition(false); }}>
                        {quiz.question}
                        <IconButton onClick={() => handleEditQuestion(quiz)}>
                            <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteQuestion(quiz)}>
                            <DeleteIcon />
                        </IconButton>
                    </ListItem>
            ))}
            <Stack direction="row" spacing={2} >
                <Button onClick={() => setOpenAdd(true)}  variant="outlined" startIcon={<AddIcon />}>
                    Add
                </Button>
                <Button variant="contained" endIcon= {<SmartToyOutlinedIcon/>} onClick={handleOpenGenerateAI}>Generate Question</Button>
                <Button variant="outlined" onClick={() => setOpenQuiz(true)}>Create a New Quiz</Button>
            </Stack>
            </List>

            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", marginLeft: '20px' }}>
                        <Typography variant="h6">
                            {selectedCard ? `${questions.indexOf(selectedCard) + 1}/${questions.length}` : ""}
                        </Typography>
                        <div style={{
                            display: "flex", alignItems: "center", width: "80%", justifyContent: "space-between",
                            marginTop: '20px', borderRadius: '8px', padding: '10px', backgroundColor: '#fff', boxShadow: '0px 0px 15px rgba(0,0,0,0.1)'
                        }}>
                            <IconButton onClick={handleShowQuestion}>
                                <ArrowBackIcon />
                            </IconButton>
                            <div
                                style={{
                                    flex: 1,
                                    height: "300px",
                                    border: "1px solid #e0e0e0",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    cursor: "pointer",
                                    borderRadius: '8px'
                                }}
                                onClick={() => setShowDefinition(!showDefinition)}
                            >
                                 {selectedCard && (
                                <div>
                                    
                                    <p><Typography variant="h5">Question:{'\n'}</Typography></p> 
                                    <Typography>{selectedCard.question}</Typography> 
                                    <p><Typography variant="h5">Answer Choices:</Typography></p>                              
                                    <ul>
                                    {Array.isArray(selectedCard.choices) ? (
                                        selectedCard.choices.map((choice, index) => (
                                            <li key={index}>{choice}</li>
                                        ))
                                    ) : (
                                        <li>{selectedCard.choices}</li>
                                    )}
                                    </ul>
                                </div>
                                 )}

                            </div>

                            <IconButton onClick={handleNextCard}>
                                <ArrowForwardIcon />
                            </IconButton>
                        </div>

             </div>

        </div>

        <Dialog open={openEdit} onClose={() => { setOpenEdit(false)}}>
                    <DialogTitle>Edit question</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Question"
                            fullWidth
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                        />
                        <div>
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
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenEdit(false)} color="primary">
                            Cancel
                        </Button>
                        <Button
                            onClick={() => {
                                handleUpdateQuestion();
                                setOpenEdit(false);
                            }}
                            color="primary"
                        >
                            Update
                        </Button>
                    </DialogActions>
                </Dialog>

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

                <Dialog open={openQuiz} onClose={() => setOpenQuiz(false)}>
                    <DialogTitle>Please Enter Your Quiz Title</DialogTitle>
                        <DialogContent>
                    <TextField
                            autoFocus
                            margin="dense"
                            label="Quiz Title"
                            fullWidth
                            onChange={(e) => setQuizTitle(e.target.value)}
                        />
                        </DialogContent>
                        <DialogActions>
                        <Button onClick={() => setOpenQuiz(false)} color="primary">
                            Cancel
                        </Button>
                        <Button
                            onClick={() => {
                                handleCreateQuiz();
                                setOpenQuiz(false);
                            }}
                            color="primary"
                        >
                            Confirm
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

                <Dialog 
                    open={openGenerate}
                    onClose={() => setOpenGenerateAI(false)}
                >
                    <DialogTitle>{"AI Q/A Generated Tool"}</DialogTitle>
                    <DialogContent>
                    <DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Topic Name"
                            type="text"
                            fullWidth
                            value={topicName}
                            onChange={(e) => setTopicName(e.target.value)}
                        />
                        <TextField
                            margin="dense"
                            label="Number of Question(s)"
                            type="number"
                            fullWidth
                            value={numberOfQuestions}
                            onChange={(e) => setNumOfQuestions(e.target.value)}
                        />
                    </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={handleGenerateAIQuestion}>Generate Questions</Button>
                    </DialogActions>
                </Dialog>
    
    </div>
    );
};

export default QuizComponent;