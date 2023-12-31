import React, { useState, useEffect, useCallback } from 'react';
import { AppBar, Toolbar, Typography, Button, List, ListItem, Paper, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import FlashcardRepo from '../repositories/FlashcardRepo';



//mainQuizPage component
/**
 * @class MainQuizPage
 * @classdesc MainQuizPage - A functional React component for displaying and managing a quiz.
 * Includes quiz questions display, answer selection, score calculation, and navigation controls.
 * 
 * @returns {React.Component} A component for quiz interaction and management.
 */
function MainQuizPage() {


  const { quizId } = useParams(); //aroute param to identify the quiz set
  const [questions, setQuestions] = useState([]); //array to hold question data from database
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(null); //current selected question index
  const [score, setScore] = useState(null);//for score
  const [quizFinished, setQuizFinished] = useState(false);//check if quiz is done for return to quiz page button
  const [timeLeft, setTimeLeft] = useState(10 * 5 * 60);//default time
  const navigate = useNavigate();//navigation
  const [isPaused, setIsPaused] = useState(false);//pause quiz
  const [openDialog, setOpenDialog] = useState(false);//for dialog
  const LOCAL_STORAGE_QUIZ_KEY = 'quizPaused';//saved key
  const [openSubmitConfirm, setOpenSubmitConfirm] = useState(false);//dialog for submit quiz


  //handle time, each quiz 5 mins
  /**
  * @memberof MainQuizPage
  * @function calculateInitialTime
  * @description Calculates the initial time for the quiz based on the number of questions.
  * @returns {Number} Initial time for the quiz.
  */
  const calculateInitialTime = useCallback(() => {
    return questions.length * 5 * 60;
  }, [questions.length]);


  //open dialog
  /**
   * @memberof MainQuizPage
   * @function handleOpenDialog
   * @description Opens the dialog for pausing the quiz.
   */
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };


  //close dialog
  /**
  * @memberof MainQuizPage
  * @function handleCloseDialog
  * @description Closes the dialog for pausing the quiz.
  */
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };


  //for pausing
  /**
  * @memberof MainQuizPage
  * @function handlePause
  * @description Handles the action to pause the quiz.
  */
  const handlePause = () => {
    handleOpenDialog();
  };


  //confirm pause
  /**
  * @memberof MainQuizPage
  * @function handleConfirmPause
  * @description Confirms the pause action and saves the current state of the quiz.
  */
  const handleConfirmPause = () => {
    const quizState = {
      selectedQuestionIndex,
      questions,
      timeLeft
    };
    localStorage.setItem(LOCAL_STORAGE_QUIZ_KEY, JSON.stringify({ quizId, paused: true, quizState }));
    setIsPaused(true);
    handleCloseDialog();
  };


  //for resume, with saved status
  /**
 * @memberof MainQuizPage
 * @function handleResume
 * @description Resumes the quiz from the saved state.
 */
  const handleResume = () => {
    setIsPaused(false);
    const savedState = JSON.parse(localStorage.getItem(LOCAL_STORAGE_QUIZ_KEY));
    if (savedState && savedState.quizId === quizId) {
      setSelectedQuestionIndex(savedState.quizState.selectedQuestionIndex);
      setQuestions(savedState.quizState.questions);
      setTimeLeft(savedState.quizState.timeLeft);
    } else {
      console.log('No saved quiz state found');
    }
  };


  //for randomly diplay answer option so each time they not in the same spot
  /**
 * @memberof MainQuizPage
 * @function shuffleChoices
 * @description Randomly shuffles the choice options for each question.
 * @param {Array} choices - Array of choice options to shuffle.
 * @returns {Array} Shuffled choice options.
 */
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
    if (savedState && savedState.quizId === quizId) {
      setIsPaused(savedState.paused);
      setSelectedQuestionIndex(savedState.quizState.selectedQuestionIndex);
      setQuestions(savedState.quizState.questions);
      setTimeLeft(savedState.quizState.timeLeft);
    }
  }, [quizId]);


  //fetch question from database, include questions and answers
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const questionData = await FlashcardRepo.getQuestionItems(quizId);
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

    fetchQuestions();
  },
    [quizId, shuffleChoices]);


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
  /**
 * @memberof MainQuizPage
 * @function formatTime
 * @description Formats the remaining time for display.
 * @returns {String} Formatted time string.
 */
  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };


  //check if answer is correct
  /**
 * @memberof MainQuizPage
 * @function checkAnswer
 * @description Checks if the selected answer is correct and updates the question state.
 * @param {Number} choiceIndex - Index of the selected choice.
 */
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
      return acc + (question.userAnswer === question.correctChoice ? 1 : 0);
    }, 0);
    const scorePercentage = (correctAnswers / questions.length) * 100;
    return scorePercentage;
  };

  //open submit dialog
  const handleSubmit = () => {
    setOpenSubmitConfirm(true);
  };


  // for submit
  // Modify handleConfirmSubmit to use the returned score from calculateScore
  const handleConfirmSubmit = async () => {
    const calculatedScore = calculateScore(); // Get the score directly
    setQuizFinished(true);

    if (calculatedScore !== null) {
      try {
        const newAttemptId = await FlashcardRepo.updateScoreAndAddAttempt(quizId, calculatedScore);
        console.log(`New attempt recorded with ID: ${newAttemptId}`);
        setScore(calculatedScore); // Now you can update the state with the calculated score
      } catch (error) {
        console.error("Failed to update score and attempt:", error);
      }
    } else {
      console.error("Score calculation failed, cannot update score and attempt.");
    }

    localStorage.removeItem(LOCAL_STORAGE_QUIZ_KEY);
    setOpenSubmitConfirm(false);
  };





  //for previous button
  /**
 * @memberof MainQuizPage
 * @function handlePrevious
 * @description Navigates to the previous question.
 */
  const handlePrevious = () => {
    setSelectedQuestionIndex(prevIndex => Math.max(prevIndex - 1, 0));
  };


  //for next button
  /**
 * @memberof MainQuizPage
 * @function handleNext
 * @description Navigates to the next question.
 */
  const handleNext = () => {
    setSelectedQuestionIndex(prevIndex => Math.min(prevIndex + 1, questions.length - 1));
  };


  //back button 
  /**
 * @memberof MainQuizPage
 * @function handleBack
 * @description Navigates back to the flashcards page.
 */
  const handleBack = () => {
    navigate('/flashcard'); //navigate to the flashcards page
  };


  //mark options
  /**
 * @memberof MainQuizPage
 * @function getButtonStyle
 * @description Determines the style for each answer choice button.
 * @param {Number} choiceIndex - Index of the current choice.
 * @param {Number} questionIndex - Index of the current question.
 * @returns {Object} Style object for the button.
 */
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
  /**
 * @memberof MainQuizPage
 * @function getQuestionStyle
 * @description Determines the style for each question in the sidebar.
 * @param {Number} index - Index of the question.
 * @returns {Object} Style object for the question.
 */
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

      {/*submit Quiz Confirmation Dialog */}
      <Dialog open={openSubmitConfirm} onClose={() => setOpenSubmitConfirm(false)}>
        <DialogTitle>Submit Quiz</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to submit the quiz?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSubmitConfirm(false)} color="primary">
            No
          </Button>
          <Button onClick={handleConfirmSubmit} color="primary">
            Yes
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