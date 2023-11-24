import React, {useState,useEffect,useCallback} from 'react';
import {AppBar, Toolbar, Typography, Button, List, ListItem,Paper} from '@mui/material';
import {useParams } from 'react-router-dom';
import FlashcardRepo from '../repositories/FlashcardRepo';

//mainQuizPage component
function MainQuizPage() {

  const { setId } = useParams(); //aroute param to identify the quiz set
  const [questions, setQuestions] = useState([]); //array to hold question data from database
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(null); //current selected question index
  const [score, setScore] = useState(null);//for score
  const [quizFinished, setQuizFinished] = useState(false);//check if quiz is done for return to quiz page button
  const [timeLeft, setTimeLeft] = useState(10 * 5 * 60);//default time
  
  
  
  const calculateInitialTime = useCallback(() => {
    return questions.length * 5 * 60; //5 minutes per question
  }, [questions.length]);

  
  //for randomly diplay answer option so each time they not in the same spot
  const shuffleChoices = useCallback((choices) => {
    for (let i = choices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [choices[i], choices[j]] = [choices[j], choices[i]];
      }
      return choices;
    }, []);


  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const questionData = await FlashcardRepo.getQuestionItems(setId);
        const questionsArray = Object.keys(questionData).map(key => {
        //find the correct choice using the index provided by correctChoice
        const correctAnswerIndex = questionData[key].correctChoice;
        const correctAnswer = questionData[key].choices[correctAnswerIndex];
        //shuffle the choices
        const shuffledChoices = shuffleChoices([...questionData[key].choices]);
        //after shuffling, find the new index of the correct answer
        const newCorrectIndex = shuffledChoices.indexOf(correctAnswer);
        return {
          ...questionData[key],
          choices: shuffledChoices,
          correctChoice: newCorrectIndex, //update correctChoice to the new index after shuffling
          userAnswer: null //initialize userAnswer
        };
      });
      setQuestions(questionsArray);
      setTimeLeft(questionsArray.length * 5 * 60); //5 minutes per question
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
    if (timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prevTimeLeft => prevTimeLeft - 1);
      }, 1000);
    }
    if (timeLeft === 0 || quizFinished) {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [timeLeft, quizFinished]);

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

  //mark option with color when seleted
  const getButtonStyle = (choiceIndex, questionIndex) => {
    const question = questions[questionIndex];
    //add a check to ensure userAnswer is not null before comparing
    const isSelected = question.userAnswer !== null && choiceIndex === question.userAnswer;
    return isSelected ? { backgroundColor: '#1976d2', color: 'red' } : {};
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
      {/* AppBar for the main header */}
      <AppBar position="static">
        <Toolbar style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" component="h2" style={{ margin: 0 }}>
            Quiz
          </Typography>
          <div style={{ position: 'relative' }}>
            {!quizFinished && (
              <>
                {/* Timer display */}
                <Typography variant="h6" style={{ marginRight: '20px' }}>
                  Time Left: {formatTime()}
                </Typography>
    
                {/* Submit button */}
                <Button variant="contained" color="primary" onClick={handleSubmit} style={{ position: 'absolute', top: '50px', right: '0' }}>
                  Submit Quiz
                </Button>
              </>
            )}
          </div>
        </Toolbar>
      </AppBar>
    
      <div style={{ display: 'flex', marginTop: '20px' }}>
        {/* Sidebar for questions */}
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
    
        {/* Main content area for displaying questions and answer options */}
        <div style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {selectedQuestionIndex !== null && questions[selectedQuestionIndex] && (
            <>
              {/* Question display */}
              <Typography variant="h4" component="h2" style={{ marginBottom: '30px' }}>
                {`Question ${selectedQuestionIndex + 1}`}
              </Typography>
              <Typography variant="h6" component="h2" style={{ marginBottom: '30px' }}>
                {questions[selectedQuestionIndex].question}
              </Typography>
  
              {/* Answer options */}
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
                  >
                    {choice}
                  </Button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Display score and return button */}
      {quizFinished && (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Typography variant="h4" component="h2">
            {`Your score: ${score ? score.toFixed(2) : 0}%`}
          </Typography>
          
          {/* Share Score button */}
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              console.log("Share score functionality not implemented yet");
            }}
          >
            Share Score
          </Button>
        </div>
      )}
    </div>
  );
          }
  export default MainQuizPage;