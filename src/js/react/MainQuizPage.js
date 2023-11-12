import React, {useState,useEffect,useCallback} from 'react';
import {AppBar, Toolbar, Typography, Button, List, ListItem,Paper,Menu, MenuItem } from '@mui/material';
import {useNavigate } from 'react-router-dom';

  //generate question based on index
  const generateQuestion = (i) => {
    const correctAnswer = `${2 * (i + 1)}`;
    const options = [correctAnswer, `${2 * (i + 2)}`, `${2 * (i + 3)}`, `${2 * (i + 4)}`].sort(() => Math.random() - 0.5);
    return {
      text: `${i + 1} + ${i + 1}`,
      options,
      correct: correctAnswer,
      userAnswer: null,
      answered: false
    };
  }

//mainQuizPage component
function MainQuizPage() {
  const navigate = useNavigate(); //navigation function for avatar
  const [questions, setQuestions] = useState(Array.from({ length: 10 }, (_, i) => generateQuestion(i)));
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(null); //current selected question index
  const [anchorEl, setAnchorEl] = useState(null); //state to track current element that the menu is anchored to
  const [menuQuestionIndex, setMenuQuestionIndex] = useState(null); //state for the current question index in the menu 
  const [quizStarted, setQuizStarted] = useState(false); //to track if the quiz has started or not
  const [score, setScore] = useState(null);//for score
  const [quizFinished, setQuizFinished] = useState(false);//check if quiz is done for return to quiz page button
  const [timeLeft, setTimeLeft] = useState(10 * 5 * 60);//default time
  const calculateInitialTime = useCallback(() => {
    return questions.length * 5 * 60; // 5 minutes per question
  }, [questions.length]);

  //update timeleft when change length of question
  useEffect(() => {
    setTimeLeft(calculateInitialTime());
  }, [calculateInitialTime, questions.length]);

  useEffect(() => {
    let timer = null;
    if (quizStarted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prevTimeLeft => prevTimeLeft - 1);
      }, 1000);
    }
    if (timeLeft === 0 || quizFinished) {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [quizStarted, timeLeft, quizFinished]);

  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  //for submit
  const handleSubmit = () => {
    //confirmation dialog
    const confirmSubmit = window.confirm("Are you sure you want to submit the quiz?");
    if (confirmSubmit) {
      calculateScore(true);
      setQuizFinished(true);
    }
  };


  //open menu
  const handleMenuOpen = (event, index) => {
    //prevent opening the menu if the quiz has started
    if (quizStarted) {
      return;
    }
    setAnchorEl(event.currentTarget);
    setMenuQuestionIndex(index);
  };

  //close menu function
  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuQuestionIndex(null);
  };

  //delete question function
  const deleteQuestion = () => {
    if (quizStarted) {
        console.log("Can't delete questions during an active quiz");
        return;
    }
    setQuestions(prevQuestions => {
        //remove the selected question
        const newQuestions = prevQuestions.filter((_, index) => index !== menuQuestionIndex);
        //if the deleted question was the one selected or the last in the list, reset the selectedQuestionIndex
        if (selectedQuestionIndex === menuQuestionIndex || selectedQuestionIndex >= newQuestions.length) {
          setSelectedQuestionIndex(null);} 
          else if (menuQuestionIndex < selectedQuestionIndex) {
            //adjust the selectedQuestionIndex if a question before it was deleted
          setSelectedQuestionIndex(prevIndex => prevIndex - 1);}
          return newQuestions;});
          
          handleMenuClose();
};

  //edit question function
  const editQuestion = () => {
    if (quizStarted) {
      console.log("Can't edit questions during an active quiz");
      return;
    }
    console.log('Editing question:', menuQuestionIndex + 1);
    handleMenuClose();
  };

  //add question
  const addQuestion = () => {
    if (quizStarted) {
      console.log("Can't add questions during an active quiz");
      return;
    }
    setQuestions(prev => [...prev, generateQuestion(prev.length)]);
  };

  //start quiz button
  const startQuiz = () => {
    setQuizStarted(true);
  };

  //check if answer is correct
  const checkAnswer = (option) => {
    setQuestions(prevQuestions => {
      const newQuestions = [...prevQuestions];
      newQuestions[selectedQuestionIndex].userAnswer = option;
      newQuestions[selectedQuestionIndex].answered = true;
      checkIfQuizIsFinished();
      return newQuestions;
    });
  };

  //to determine the styles for each option
  const getOptionStyle = (option, question) => {
    if (!question.answered) return {}; 
    if (option === question.userAnswer && option === question.correct) return { backgroundColor: 'green' }; 
    if (option === question.userAnswer) return { backgroundColor: 'red' }; 
    if (option !== question.userAnswer && option === question.correct) return { backgroundColor: 'green' }; 
    return {};
  };

  //calculate and update the score, now also handles unanswered question after user submit,
  const calculateScore = (isSubmitting = false) => {
    const correctAnswers = questions.reduce((acc, question) => {
      return acc + (question.answered && question.userAnswer === question.correct ? 1 : 0);}, 0);
    const answeredQuestions = isSubmitting ? questions.length : questions.filter(q => q.answered).length;
    const scorePercentage = (correctAnswers / answeredQuestions) * 100;
    setScore(scorePercentage);
  };

  //check if quiz completed
  const checkIfQuizIsFinished = () => { 
    const allAnswered = questions.every(question => question.answered); 
    if (allAnswered) {
      calculateScore();
      setQuizFinished(true);
    }
  };

  //handle return fucntion
  const handleReturnToQuiz = () => {
    setQuizStarted(false);
    setQuizFinished(false);
    setSelectedQuestionIndex(null);
    setScore(null);
    const newQuestions = Array.from({ length: 10 }, (_, i) => generateQuestion(i));
    setQuestions(newQuestions);
    setTimeLeft(calculateInitialTime()); //recalculate time based on the number of new questions
    navigate('/quizmain');
  };

  return (
    <div>
    {/*appBar for the main header*/}
    <AppBar position="static">
      <Toolbar style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h2" style={{ margin: 0 }}>
          Quiz
        </Typography>
        <div style={{ position: 'relative' }}>
          {quizStarted && !quizFinished && (
            <>
              {/*timer display*/}
              <Typography variant="h6" style={{ marginRight: '20px' }}>
                Time Left: {formatTime()}
              </Typography>

              {/*submit button*/}
              <Button variant="contained" color="primary" onClick={handleSubmit} style={{ position: 'absolute', top: '50px', right: '0' }}>
                Submit Quiz
              </Button>
            </>
          )}
          {!quizStarted && (
            <Button variant="contained">
              LEADERBOARD
            </Button>
          )}
        </div>
      </Toolbar>
    </AppBar>
      
      <div style={{ display: 'flex', marginTop: '20px' }}>
        <Paper elevation={3} style={{ width: '20%', maxHeight: '100vh', overflow: 'auto', padding: '10px' }}>
          {/*left side bar for all the question*/}
          <List>

            {/*loop thought to diplay each question*/}
            {questions.map((_, index) => (
              <ListItem button key={index} onClick={() => { setSelectedQuestionIndex(index); }}>
                {`Question ${index + 1}`}

                {/*option menu the thrre dots to edit and delte the question*/}
                <Button style={{ marginLeft: '10px', color: 'black', textTransform: 'none' }} 
                        disabled={quizStarted} 
                        onClick={(e) => handleMenuOpen(e, index)}>
                  <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '4px' }}>
                    <span style={{ color: 'black' }}>•</span>
                    <span style={{ color: 'black' }}>•</span>
                    <span style={{ color: 'black' }}>•</span>
                  </div>
                </Button>
            
                <Menu
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl) && menuQuestionIndex === index}
                  onClose={handleMenuClose}
                >
                  <MenuItem onClick={editQuestion}>Edit</MenuItem>
                  <MenuItem onClick={deleteQuestion}>Delete</MenuItem>
                </Menu>
              </ListItem>
            ))}
          </List>
        

         {/*Add question and start quiz button*/}
          <div style={{ display: 'flex', justifyContent: 'space-between', margin: '10px' }}>
            <Button variant="contained" color="primary" onClick={addQuestion} disabled={quizStarted}>
              Add Question
            </Button>
            {!quizStarted && (
              <Button variant="contained" color="primary" onClick={startQuiz}>
                Start Quiz
              </Button>
            )}
          </div>
        </Paper>
        

        {/*diplay questions and answer options*/}
        <div style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {selectedQuestionIndex !== null && (
            <>
              <Typography variant="h4" component="h2" style={{ marginBottom: '30px' }}>
                {`Question ${selectedQuestionIndex + 1}`}
              </Typography>
              <Typography variant="h4" component="h2" style={{ marginBottom: '30px' }}>
                {questions[selectedQuestionIndex].text}
              </Typography>

              
              {/*show answeer woptions when quiz is started*/}
              {quizStarted && (
                <>
                    {/*top two options*/}
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '50%', marginBottom: '20px' }}>
                    {questions[selectedQuestionIndex].options.slice(0, 2).map((option, index) => (
                      <Button
                        key={index}
                        variant="contained"
                        style={getOptionStyle(option, questions[selectedQuestionIndex])}
                        onClick={() => !questions[selectedQuestionIndex].answered && checkAnswer(option)}
                      >
                        {option}
                      </Button>
                    ))}
                  </div>

                  {/*bottom two option*/}
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '50%', marginBottom: '40px' }}>
                    {questions[selectedQuestionIndex].options.slice(2, 4).map((option, index) => (
                      <Button
                        key={index}
                        variant="contained"
                        style={getOptionStyle(option, questions[selectedQuestionIndex])}
                        onClick={() => !questions[selectedQuestionIndex].answered && checkAnswer(option)}
                      >
                        {option}
                      </Button>
                    ))}
         
                  </div>
                   {/*show result of question*/}     
                  {questions[selectedQuestionIndex].answered && (
                    <Typography variant="h5" component="h2">
                      {questions[selectedQuestionIndex].userAnswer === questions[selectedQuestionIndex].correct
                        ? "Correct"
                        : `Incorrect`}
                    </Typography>
                  )}
                </>
              )}
            </>
          )}
          
          </div>
          {/*display score and return button */}
          {quizFinished && (
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Typography variant="h4" component="h2">
              {`Your score: ${score.toFixed(2)}%`}
              </Typography>
              
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
               {/*return to Quiz button */}
               <Button
                variant="contained"
                color="primary"
                onClick={handleReturnToQuiz}
                style={{ marginBottom: '10px' }} //for layout
                >
                  Return to Quiz
                  </Button>
                  
                  {/* Share Score button */}
                  <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => {
                  console.log("not working yet");
                }}>
                  Share Score
                  </Button>
                  </div>
                  </div>
                  )}
                  </div>
                  </div>
                  );
                }
              
export default MainQuizPage;