import React, {useState,useEffect,useCallback} from 'react';
import {AppBar, Toolbar, Typography, Button, List, ListItem,Paper,Menu, MenuItem } from '@mui/material';
import {useNavigate,useParams } from 'react-router-dom';
import FlashcardRepo from '../repositories/FlashcardRepo';

//mainQuizPage component
function MainQuizPage() {

  const navigate = useNavigate();
  const { setId } = useParams(); //aroute param to identify the quiz set
  const [questions, setQuestions] = useState([]); //array to hold question data from database
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

      //fetch questions from the database when the component mounts
      useEffect(() => {
        const fetchQuestions = async () => {
          try {
            const questionData = await FlashcardRepo.getQuestionItems(setId);
            const questionsArray = Object.keys(questionData).map(key => ({
              question: questionData[key].question,
              choices: questionData[key].choices,
              correct: questionData[key].correct, //set correct answer
              userAnswer: null,
              questionId: key
             
            }));
            setQuestions(questionsArray);
    console.log(questionsArray); // Log to see the fetched data
          } catch (error) {
            console.error("Failed to fetch questions:", error);
          }
        };
    
        fetchQuestions();
      }, [setId]);

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


  //start quiz button
  const startQuiz = () => {
    setQuizStarted(true);
  };

  //check if answer is correct
  const checkAnswer = (option) => {
    setQuestions(prevQuestions => {
      const newQuestions = [...prevQuestions];
      newQuestions[selectedQuestionIndex].userAnswer = option;
      return newQuestions;
    });
  };

  //calculate and update the score, now also handles unanswered question after user submit,
  const calculateScore = () => {
    const correctAnswers = questions.reduce((acc, question) => {
      //Count the number of correct answers
      return acc + (question.userAnswer === question.correct ? 1 : 0);
    }, 0);
    //count the number of answered questions
    const answeredQuestions = questions.reduce((acc, question) => {
      return acc + (question.userAnswer !== null ? 1 : 0);
    }, 0);
    //calculate the score percentage
    const scorePercentage = answeredQuestions > 0 ? (correctAnswers / answeredQuestions) * 100 : 0;
    setScore(scorePercentage);
  };

  //for submit
  const handleSubmit = () => {
    const confirmSubmit = window.confirm("Are you sure you want to submit the quiz?");
    if (confirmSubmit) {
      calculateScore();
      setQuizFinished(true);
    }
  };


  //change color of answer when picked
  const getButtonStyle = (option, questionIndex) => {
    const isSelected = questions[questionIndex].userAnswer === option;
    return isSelected ? { backgroundColor: '#1976d2', color: 'red' } : {};
  };

  //function to determine the style for each question in the sidebar
  const getQuestionStyle = (index) => {
    if (quizStarted && questions[index].userAnswer !== null) {
      return { color: 'green' }; //change this to your preferred color for answered questions
    } else {
      return { color: 'black' }; //default color
    }
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
        </div>
      </Toolbar>
    </AppBar>
      
      <div style={{ display: 'flex', marginTop: '20px' }}>
        <Paper elevation={3} style={{ width: '20%', maxHeight: '100vh', overflow: 'auto', padding: '10px' }}>
          {/*left side bar for all the question*/}
          <List>

            {/*loop thought to diplay each question*/}
            {questions.map((_, index) => (
              <ListItem 
              button 
              key={index} 
              onClick={() => setSelectedQuestionIndex(index)}
              style={getQuestionStyle(index)} //apply the style based on answered state
            >
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
            {!quizStarted && (
              <Button variant="contained" color="primary" onClick={startQuiz}>
                Start Quiz
              </Button>
            )}
          </div>
        </Paper>
        
         {/* Display questions and answer options */}
         <div style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {selectedQuestionIndex !== null && (<>
          {/* Question display */}
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
                        style={getButtonStyle(option, selectedQuestionIndex)}
                        onClick={() => checkAnswer(option)}
                      >
                        {option}
                      </Button>
                    ))}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '50%', marginBottom: '40px' }}>
                    {questions[selectedQuestionIndex].options.slice(2, 4).map((option, index) => (
                      <Button
                        key={index}
                        variant="contained"
                        style={getButtonStyle(option, selectedQuestionIndex)}
                        onClick={() => checkAnswer(option)}
                      >
                        {option}
                      </Button>
                    ))}
                  </div></>)}</>)}
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