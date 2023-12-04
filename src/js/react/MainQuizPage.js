import React, {useState,useEffect,useCallback} from 'react';
import {AppBar, Toolbar, Typography, Button, List, ListItem,Paper, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from '@mui/material';
import {useParams,useNavigate} from 'react-router-dom';
import FlashcardRepo from '../repositories/FlashcardRepo';

//mainQuizPage component
function MainQuizPage() {

  const { setId } = useParams(); //aroute param to identify the quiz set
  const [questions, setQuestions] = useState([]); //array to hold question data from database
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(null); //current selected question index
  const [score, setScore] = useState(null);//for score
  const [quizFinished, setQuizFinished] = useState(false);//check if quiz is done for return to quiz page button
  const [timeLeft, setTimeLeft] = useState(10 * 5 * 60);//default time
  const navigate = useNavigate();//navigation
  const [isPaused, setIsPaused] = useState(false);//pause quiz
  const [openDialog, setOpenDialog] = useState(false);//for dialog
  const LOCAL_STORAGE_QUIZ_KEY = 'quizPaused';//saved key
  const [openSubmitDialog, setOpenSubmitDialog] = useState(false);//for submit dialog

  //for submit dialog
  const handleOpenSubmitDialog = () => {
    setOpenSubmitDialog(true);
  };  

  //handle time, each quiz 5 mins
  const calculateInitialTime = useCallback(() => {
    return questions.length * 5 * 60; 
  }, [questions.length]);


  //open dialog
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };
  

  //close dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  

  //for pausing
  const handlePause = () => {
    handleOpenDialog();
  };
  

  //confirm pause
  const handleConfirmPause = () => {
    const quizState = {
      selectedQuestionIndex,
      questions,
      timeLeft
    };
    localStorage.setItem(LOCAL_STORAGE_QUIZ_KEY, JSON.stringify({ setId, paused: true, quizState }));
    setIsPaused(true);
    handleCloseDialog();
  };

  //submit
  const handleConfirmSubmit = async () => { // Mark the function as async
    setOpenSubmitDialog(false);
  
    const finalScore = calculateScore(); // Store the returned score in a variable
    setQuizFinished(true);
    localStorage.removeItem(LOCAL_STORAGE_QUIZ_KEY);
  
    // Assuming you have a way to get the current user's ID
    const uid = FlashcardRepo.getCurrentUid(); // Replace with the actual method to get the user ID
    if (finalScore !== null && uid) {
      try {
        await FlashcardRepo.updateQuizScore(setId, uid, finalScore); // Use the finalScore here
        console.log('Score updated successfully in the database');
      } catch (error) {
        console.error('Failed to update score in the database:', error);
      }
    }
  };
  


  //for resume, with saved status
  const handleResume = () => {
    setIsPaused(false);
    const savedState = JSON.parse(localStorage.getItem(LOCAL_STORAGE_QUIZ_KEY));
    if (savedState && savedState.setId === setId) {
      setSelectedQuestionIndex(savedState.quizState.selectedQuestionIndex);
      setQuestions(savedState.quizState.questions);
      setTimeLeft(savedState.quizState.timeLeft);
    } else {
      console.log('No saved quiz state found');
    }
  };
  

  //for randomly diplay answer option so each time they not in the same spot
  const shuffleChoices = useCallback((choices) => {
    for (let i = choices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [choices[i], choices[j]] = [choices[j], choices[i]];
      }
      return choices;
    }, []);


  //save
  useEffect(() => {
    const savedState = JSON.parse(localStorage.getItem(LOCAL_STORAGE_QUIZ_KEY));
    if (savedState && savedState.setId === setId) {
      setIsPaused(savedState.paused);
      setSelectedQuestionIndex(savedState.quizState.selectedQuestionIndex);
      setQuestions(savedState.quizState.questions);
      setTimeLeft(savedState.quizState.timeLeft);
    }
  }, [setId]);


  //fetch question from database, include questions and answers
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const questionData = await FlashcardRepo.getQuestionItems(setId);
        const questionsArray = Object.keys(questionData).map(key => {
        const correctAnswerIndex = questionData[key].correctChoice;
        const correctAnswer = questionData[key].choices[correctAnswerIndex];
        const shuffledChoices = shuffleChoices([...questionData[key].choices]);
        const newCorrectIndex = shuffledChoices.indexOf(correctAnswer);
          return {
            ...questionData[key],
            choices: shuffledChoices,
            correctChoice: newCorrectIndex,
            userAnswer: null
          };
        });
        setQuestions(questionsArray);
        setSelectedQuestionIndex(0);
        setTimeLeft(questionsArray.length * 5 * 60);
      } catch (error) {
        console.error("Failed to fetch questions:", error);
      }
    };
    fetchQuestions();}, 
    [setId, shuffleChoices]);
  

  //update timeleft when change length of question
  useEffect(() => {
    setTimeLeft(calculateInitialTime());
  }, [calculateInitialTime, questions.length]);

  useEffect(() => {
    let timer = null;
    if (timeLeft > 0 && !isPaused && !quizFinished) {
      timer = setInterval(() => {
        setTimeLeft(prevTimeLeft => prevTimeLeft - 1);
      }, 1000);
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [timeLeft, isPaused, quizFinished]);
  

  //time format
  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  

  //check if answer is correct
  const checkAnswer = (choiceIndex) => {
    setQuestions(prevQuestions => {
      return prevQuestions.map((question, index) => {
        if (index === selectedQuestionIndex) {
          const isCorrect = choiceIndex === question.correctChoice;
          return {
            ...question,
            userAnswer: 
            choiceIndex,
          isCorrect: isCorrect,
        };
      }
      return question;
    });
  });
  };

  //calculate score
  const calculateScore = () => {
    const correctAnswers = questions.reduce((acc, question) => {
    //Count the number of correct answers
    return acc + (question.userAnswer === question.correctChoice ? 1 : 0);
  }, 0);
  //calculate the score percentage based on the total number of questions
  const scorePercentage = (correctAnswers / questions.length) * 100;
  setScore(scorePercentage);
  return scorePercentage;
};


  //for submit quiz
  const handleSubmit = () => {
      handleOpenSubmitDialog();
    };
    

  //for previous button
  const handlePrevious = () => {
    setSelectedQuestionIndex(prevIndex => Math.max(prevIndex - 1, 0));
  };
  

  //for next button
  const handleNext = () => {
    setSelectedQuestionIndex(prevIndex => Math.min(prevIndex + 1, questions.length - 1));
  };


  //back button 
  const handleBack = () => {
    navigate('/flashcard'); //navigate to the flashcards page
  };


  //mark options
  const getButtonStyle = (choiceIndex, questionIndex) => {
    if (questions.length > 0) {
      const question = questions[questionIndex];
      const isSelected = question.userAnswer !== null && choiceIndex === question.userAnswer;
      const isCorrect = quizFinished && choiceIndex === question.correctChoice;
      if (isCorrect) {
        return { backgroundColor: 'green', color: 'white' };
      } else if (isSelected) {
        return { backgroundColor: '#1976d2', color: 'red' };
      }
    }
    return {};
  };
  

  //function to determine the style for each question in the sidebar,answered and not answered
  const getQuestionStyle = (index) => {
    if (questions[index].userAnswer !== null) {
      return { color: 'green' };
    } else {
      return { color: 'black' };
    }
  };


  return (
    <div>
      {/*appBar for the main header */}
      <AppBar position="static">
        <Toolbar style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" component="h2" style={{ margin: 0 }}>
            Quiz
          </Typography>
          <div style={{ position: 'relative' }}>
            {!quizFinished && (
              <>
                {/*timer display */}
                <Typography variant="h6" style={{ marginRight: '20px' }}>
                  Time Left: {formatTime()}
                </Typography>
              </>
            )}
          </div>
          {/*submit button */}
          <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          style={{ position: 'absolute', top: '100px', right: '0' }}
          disabled={isPaused}>
            Submit Quiz
          </Button>

          {/*pause and resume button*/}
          {!quizFinished && !isPaused && (
          <Button 
          variant="contained" 
          color="primary" 
          onClick={handlePause}>
            Pause Quiz
          </Button>
            )}
          {!quizFinished && isPaused && (
          <Button 
          variant="contained" 
          color="primary" 
          onClick={handleResume}>
            resume
          </Button>
              )}
        </Toolbar>
      </AppBar>
    
      <div style={{ display: 'flex', marginTop: '20px' }}>
        {/*sidebar for questions */}
        <Paper elevation={3} style={{ width: '20%', maxHeight: '100vh', overflow: 'auto', padding: '10px' }}>
          <List>
            {questions.map((_, index) => (
              <ListItem 
                button 
                key={index} 
                onClick={() => setSelectedQuestionIndex(index)}
                style={getQuestionStyle(index)}
              >
                {`Question ${index + 1}`}
              </ListItem>
            ))}
          </List>
        </Paper>
    
        {/*main content area for displaying questions and answer options */}
        <div style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {selectedQuestionIndex !== null && questions[selectedQuestionIndex] && (
            <>
              {/*question display */}
              <Typography variant="h4" component="h2" style={{ marginBottom: '30px' }}>
                {`Question ${selectedQuestionIndex + 1}`}
              </Typography>
              <Typography variant="h6" component="h2" style={{ marginBottom: '30px' }}>
                {questions[selectedQuestionIndex].question}
              </Typography>
  
              {/*answer options */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '10px',
                marginTop: '20px'
              }}>
                {questions[selectedQuestionIndex].choices.map((choice, index) => (
                  <Button
                    key={index}
                    variant="contained"
                    style={getButtonStyle(index, selectedQuestionIndex)}
                    onClick={() => checkAnswer(index)}
                    disabled={quizFinished || isPaused}
                  >
                    {choice}
                  </Button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/*previous and next buttons */}
      <div style={{ marginTop: '30px' }}>
        <Button variant="contained" color="primary" onClick={handlePrevious} disabled={selectedQuestionIndex === 0}>
          Previous
        </Button>
        
        <Button variant="contained" color="primary" onClick={handleNext} disabled={selectedQuestionIndex === questions.length - 1} style={{ marginLeft: '10px' }}>
          Next
        </Button>
        </div>
      
      {/*display score and button group*/}
      {quizFinished && (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Typography variant="h4" component="h2">
            {`Your score: ${score ? score.toFixed(2) : 0}%`}
          </Typography>
          
          {/*button group*/}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '10px' }}>

            {/*back button */}
            <Button
              variant="contained"
              color="secondary"
              onClick={handleBack}
            >
              Back
            </Button>
          </div>
        </div>
      )}
      

      {/*submit quiz dialog*/}
      <Dialog
        open={openSubmitDialog}
        onClose={() => setOpenSubmitDialog(false)}
        aria-labelledby="submit-dialog-title"
        aria-describedby="submit-dialog-description">
          
          <DialogTitle id="submit-dialog-title">{"Submit Quiz"}</DialogTitle>
          <DialogContent>
          <DialogContentText id="submit-dialog-description">
            Are you sure you want to submit the quiz?
          </DialogContentText>
          </DialogContent>
          <DialogActions>
          <Button onClick={handleConfirmSubmit} color="primary">
            Yes
          </Button>
          <Button onClick={() => setOpenSubmitDialog(false)} color="primary">
            No
          </Button>
          </DialogActions>
          </Dialog>
      
      {/*pause quiz dialog*/}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        
          <DialogTitle id="alert-dialog-title">{"Pause Quiz"}</DialogTitle>
            <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to pause the quiz?
            </DialogContentText>
            </DialogContent>
            <DialogActions>
            <Button onClick={handleConfirmPause} color="primary" autoFocus>
              Yes
              </Button>
              <Button onClick={handleCloseDialog} color="primary">
              No
              </Button>
              </DialogActions>
              </Dialog>
              </div>
              );
            }

export default MainQuizPage;

      
      
