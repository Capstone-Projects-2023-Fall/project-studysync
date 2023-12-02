import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FlashcardRepo from '../repositories/FlashcardRepo';

import { Button, TextField, Typography, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItem, IconButton, Avatar, ThemeProvider, createTheme, ButtonGroup, Stack, DialogContentText, CircularProgress } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';//quotation mark 
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
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
const QuizComponent = () => {

  const [openAdd, setOpenAdd] = useState(false);
  const { setId, quizId } = useParams();  //retrieve the flashcard set in order to go to a certain quiz

  const [question, setQuestion] = useState('');
  const [choices, setChoices] = useState(['', '', '', '']); // store choices
  const [correctChoiceIndex, setCorrectChoiceIndex] = useState(null); //capture the correct choice as an array index
  const [questions, setQuizData] = useState([]); //array to hold all questions data

  const [deleteQuestion, setDeleteQuestion] = useState(null); 
  const [openDelete, setOpenDelete] = useState(false);

  const [editQuestion, setEditQuestion] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);

  const [selectedCard, setSelectedCard] = useState(null);
  const [showDefinition, setShowDefinition] = useState(false);


  const [openGenerate, setOpenGenerateAI] = useState(false); // a state to handle the AI button
  const [topicName, setTopicName] = useState(''); // capture the topic name from user entry
  const [numberOfQuestions, setNumOfQuestions] = useState(1); //capture the number of quesiton from user entry, default is set to 1

  const [openQuiz, setOpenQuiz] = useState(false); // state to handle the creat quiz button
  const [quizTitle, setQuizTitle] = useState(''); // capture the quiz title from the user entry

  const [newQuizAdded, setQuizList] = useState([]); // store the newly created quiz

  const [isQuizPaused, setIsQuizPaused] = useState(false);
  const [openQuizInfo, setOpenQuizInfo] = useState(false);//quiz infor

  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [flashcardSetName, setFlashcardSetName] = useState('');
  const [flashcardRating, setRating] = useState('');
  const [flashcardDifficulty, setDifficulty] = useState('');
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [submitAttempted1, setSubmitAttempted1] = useState(false);

  //calculation time limit
  const calculateTimeLimit = () => {
    return questions.length * 5;
    };

  useEffect(() => {
    //check if the quiz is paused
    const pausedState = JSON.parse(localStorage.getItem('quizPaused'));
    if (pausedState && pausedState.setId === setId) {
      setIsQuizPaused(true);
    }
  }, []);

  //resumae quiz navigate back to saved quiz
  const handleResumeQuiz = () => {
    navigate(`/quizmain/${setId}`);
  };

  //hook for navigation
  const navigate = useNavigate();

  //for navagation start quiz
  const startQuiz = () => {
    navigate(`/quizmain/${setId}`); //Navigate to the quiz page with setId
    localStorage.removeItem('quizPaused');//if start new quiz, delete saved progress
  };


  useEffect(() => {
    if (!openEdit) {
      resetEditDialog(); 
    }
  }, [openEdit]);

  useEffect(() => {
    //fetch questions from database
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

// this function allow the user to create a new quiz
const handleCreateQuiz = async () => {
    try {
      const uid = FlashcardRepo.getCurrentUid();
  
      if (uid && quizTitle) {
        // call createNewQuiz function from FlashcardRepo
        const newQuizId = await FlashcardRepo.createNewQuiz(setId, quizTitle);
  
        console.log("You want to add: ", quizTitle);
        // add the newly created quiz to the user's owned quiz sets
        await FlashcardRepo.addOwnedQuizSetToUser(uid, newQuizId);
        //store a newly added quiz in a state to pass as prop
        setQuizList(newQuizId);
      }
    } catch (error) {
      console.error('Error creating quiz:', error);
    }
  };

const handleOpenGenerateAI = async () => {
    setOpenGenerateAI(true);
     const topicName = await FlashcardRepo.getFlashcardSetById(setId);
    //get the flashcard set name
    console.log("Your topic name is: ", topicName.name);
    setFlashcardSetName(topicName.name);

};

function parseGPTResponse(rawResponse) {
    try {
    
        // Check if rawResponse is undefined or null
        if (!rawResponse) {
            console.error("Raw response is undefined or null");
            return [];
        }
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

// this function allows user to generate new quiz question through the help of AI
const handleGenerateAIQuestion = async () => {
   
    try {
            // check if required fields are filled
        if (!numberOfQuestions || !topicName) {
            // display alert if any required field is missing
            alert('Please fill in all required fields.');
            // set submitAttempted to true to highlight missing fields
            setSubmitAttempted(true);
        }
        else {
            setOpenGenerateAI(false);
            setIsLoading(true);
        const responseString = await callYourCloudFunctionToGenerateQuestions(numberOfQuestions, topicName);
        const generatedQuestions = responseString;

        const addedQuestions = [];
        for (const question of generatedQuestions) {
            const newQuestionId = await FlashcardRepo.addQuizQuestion(quizId, question.question, question.choices, question.correctChoiceIndex);
            addedQuestions.push({ ...question, questionId: newQuestionId });
        }
        setSuccessMessage('Flashcards generated successfully!');
        setQuizData(prev => [...prev, ...addedQuestions]);
    }
    } catch (error) {
        console.error("Error generating or adding question with AI:", error);
    }finally {
        setIsLoading(false);
    }
};

// a cloud function to make POST request to ChatGPT for to generate user requested questions
const callYourCloudFunctionToGenerateQuestions = async (numQuestions, topicName) => {
    try {
        const functionUrl = 'https://us-central1-studysync-a603a.cloudfunctions.net/askGPTWithImage';

        const messages = [{
            role: "user",
            content: [{
                type: "text",
                text: `Please create ${numQuestions} quiz question 
                along with 4 multiple choices answer with one correct answerabout ${topicName}. 
                Format each question as JSON format with 'question', an array of choices in 'choices' field, and 'correctChoiceIndex' 
                as an index to the correct choice, i need to parse it with only "question", "choices", and "correctChoiceIndex".
                Please make sure questions are not repetitive. It is better just have the json back without any other text.`
            }]
        }];
        console.log("Sending Request with JSON payload:", { messages });
        const response = await fetch(functionUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
                body: JSON.stringify({ messages }),
        });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            console.log("Response from cloud function:", response);
            const data = await response.json();
            console.log("Response data from cloud function:", data);
            return parseGPTResponse(data); // Assuming the data.text is the string of JSON flashcards
        } catch (error) {
            console.error("Error calling cloud function:", error);
            throw error;
        }
};

const [value, setValue] = React.useState('AI');

const handleChange = (event, newValue) => {
  setValue(newValue);
};
const handleGenerateViaFlashcards = async () => {

    const flashcardName = await FlashcardRepo.getFlashcardSetById(setId);
    console.log("Performing a different function for the second tab");
    console.log("This is the quiz title you would like to work with: ", setId);
    console.log("This is the quiz title you would like to work with: ", flashcardName);
  };

const getFlashcardsData = async () => {

    // check if required fields are filled
    if (!numberOfQuestions || !flashcardRating || !flashcardDifficulty) {
        // display alert if any required field is missing
        alert('Please fill in all required fields.');
        // set submitAttempted to true to highlight missing fields
        setSubmitAttempted1(true);
      } else {
        console.log('Rating:', flashcardRating);
        console.log('Difficulty:', flashcardDifficulty);
        console.log('Form submitted successfully');
      }

}

const renderOptions = () => {
    switch (value) {
      case "AI":
        return (
          <div>
            <Typography textAlign="center">
                Quiz Based on AI: You can create a quiz by entering your quiz topic and our AI tools will handle it for you.
            </Typography>
            <TextField
              autoFocus
              margin="dense"
              label="Topic Name"
              type="text"
              fullWidth
              value={topicName}
              onChange={(e) => setTopicName(e.target.value)}
              error={submitAttempted && !topicName}
              helperText={submitAttempted && !topicName ? 'Please enter the topic of the quiz' : ''}
            />
            <TextField
              margin="dense"
              label="Number of Question(s)"
              type="number"
              fullWidth
              value={numberOfQuestions}
              onChange={(e) => setNumOfQuestions(e.target.value)}
            />
          </div>
        );
      case "Flashcards":
        
        return (
          <div>
            <Typography textAlign="center">
                Quiz Based on Flashcards: Our AI tools will generate those question by using your flashcards that marked as "Don't Know"
            </Typography>
            <br/>
            <Typography> 
                By using this flashcard topic: &nbsp;
                <span
                    style={{
                        fontWeight: "bold",
                        color: "black",
                        fontSize: "20px",
                    }}
                >
                {flashcardSetName}
                </span>
            </Typography>
            <TextField
                margin="dense"
                label="Number of Question(s)"
                type="number"
                fullWidth
                value={numberOfQuestions}
                onChange={(e) => setNumOfQuestions(e.target.value)}
            />
            <FormControl id="rating-control-buttons"> Rating Levels: 
            <RadioGroup
                aria-labelledby="rating-control-buttons"
                name="rating"
                value={flashcardRating}
                onChange={(e) => setRating(e.target.value)}
                row
                >
                <FormControlLabel value="Know" control={<Radio />} label="Know" />
                <FormControlLabel value="Don't Know" control={<Radio />} label="Don't Know" />
                <FormControlLabel value="Not Sure" control={<Radio />} label="Not Sure" />
            </RadioGroup>
            {submitAttempted1 && !flashcardRating && <div style={{ color: 'red' }}>Please select a rating level</div>}
            </FormControl>

            <FormControl id="difficulty-control-buttons"> Difficulty Levels:
            <RadioGroup
                aria-labelledby="rdifficulty-control-buttons"
                name="difficulty"
                value={flashcardDifficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                row
                >
                <FormControlLabel value="Easy" control={<Radio />} label="Easy" />
                <FormControlLabel value="Medium" control={<Radio />} label="Medium" />
                <FormControlLabel value="Hard" control={<Radio />} label="Hard" />
            </RadioGroup>
            {submitAttempted1 && !flashcardDifficulty && <div style={{ color: 'red' }}>Please select a difficulty level</div>}
            </FormControl>
            
          </div>
        );
      // Add more cases for additional tabs as needed
      default:
        return null;
    }
  };
  
return (
    <div style={{
        display: "flex", flexDirection: "column", height: "100vh",
        backgroundColor: '#f9f9f9', padding: '20px'
    }}>

            {isLoading && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100vw', position: 'fixed', top: 0, left: 0, zIndex: 1000, backgroundColor: 'rgba(255, 255, 255, 0.7)' }}>
                    <CircularProgress />
                </div>
            )}
            <Snackbar
                open={!!successMessage}
                autoHideDuration={6000}
                onClose={() => setSuccessMessage('')}
                message={successMessage}
            />   
            <Snackbar
                open={!!errorMessage}
                autoHideDuration={6000}
                onClose={() => setErrorMessage('')}
                message={errorMessage}
                color="error"
            />
 
    <QuizList newQuizAdded={newQuizAdded}/>

        {/* Step 3: Add "Start Quiz" Button */}
      <Button
        variant="contained"
        color="primary"
        onClick={startQuiz}
        style={{ /* your button styles */ }}
      >
        Start Quiz
      </Button>

        <div style={{ flex: 1, display: "flex", flexDirection: "row", justifyContent: "space-between", marginBottom: '20px' }}>
            <List style={{
                width: "30%", borderRight: "1px solid #e0e0e0",
                borderRadius: '8px', overflow: 'hidden', boxShadow: '0px 0px 15px rgba(0,0,0,0.1)'
            }}>
                
            {/*quiz info button*/}
                <Button
                variant="outlined"
                startIcon={<FormatQuoteIcon />}
                onClick={() => setOpenQuizInfo(true)}
                style={{ alignSelf: 'center', marginTop: '20px', marginLeft: '10px' }}>
                    Quiz Info
                </Button>

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
        {/*start quiz button*/}
        <Button
            variant="contained"
            color="primary"
            onClick={startQuiz}
            style={{ alignSelf: 'center', marginTop: '20px' }} 
        >
            Start Quiz
        </Button>
        
        {isQuizPaused && (
        <Button
          variant="contained"
          color="secondary"
          onClick={handleResumeQuiz}
          style={{ alignSelf: 'center', marginTop: '20px' }}
        >
          Resume Quiz
        </Button>
        )}

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
                    onClose={() => {
                    setOpenGenerateAI(false);
                    setNumOfQuestions("1");
                    setTopicName('');
                    setDifficulty('');
                    setRating('');
                    setSubmitAttempted(false);
                    setSubmitAttempted1(false);
                    }}
                >
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        textColor="secondary"
                        indicatorColor="secondary"
                        aria-label="secondary tabs example"
                    >
                        <Tab value="AI" label="Quiz Based on AI" />
                        <Tab value="Flashcards" label="Quiz Based on Flashcards" />
                    </Tabs>
                    <DialogTitle   
                    fontSize= "25px"
                    fontWeight= "bold"
                    >                  
                            <PrecisionManufacturingIcon /> 
                            {"AI Generating Tools"}
                    </DialogTitle>
                    <DialogContent>
                        {renderOptions()}
                    </DialogContent>
                    <DialogActions>
                    {/* <Button onClick={handleGenerateAIQuestion}>Generate Questions</Button> */}
                    {value === "AI" && <Button variant ="contained" onClick={handleGenerateAIQuestion}>Generate</Button>}
                    {value === "Flashcards" && <Button variant ="contained" onClick={getFlashcardsData}>Generate</Button>}
                    </DialogActions>
                </Dialog>
                
                {/*diaglos show quiz infomatio*/}
                <Dialog open={openQuizInfo} onClose={() => setOpenQuizInfo(false)}>
                    <DialogTitle>Quiz Information</DialogTitle>
                    <DialogContent>
                        <Typography>Question number: {questions.length}</Typography>
                        <Typography>Time Limit: {calculateTimeLimit()} minutes</Typography>
                        </DialogContent>
                        {/*close info display*/}
                        <DialogActions>
                            <Button onClick={() => setOpenQuizInfo(false)} color="primary">
                                Close
                                </Button>
                                </DialogActions>
                                </Dialog>
                                </div>
                                );
            };

export default QuizComponent;