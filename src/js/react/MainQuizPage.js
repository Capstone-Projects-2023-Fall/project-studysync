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
  const [score, setScore] = useState(null);//for score
  const [quizFinished, setQuizFinished] = useState(false);//check if quiz is done for return to quiz page button
  const [timeLeft, setTimeLeft] = useState(10 * 5 * 60);//default time
  const calculateInitialTime = useCallback(() => {
    return questions.length * 5 * 60; // 5 minutes per question
  }, [questions.length]);

      //for randomly diplay answer option so each time they not in the same spot
  const shuffleChoices = useCallback((choices) => {
    for (let i = choices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [choices[i], choices[j]] = [choices[j], choices[i]];
      }
      return choices;
    }, []);

  //fetch questions from the database when the component mounts
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const questionData = await FlashcardRepo.getQuestionItems(setId);
        const questionsArray = Object.keys(questionData).map(key => ({
          ...questionData[key],
          // Assuming questionData[key].choices is an array with one correct and three incorrect choices
          choices: shuffleChoices([...questionData[key].choices]),
        }));
        setQuestions(questionsArray);
        setTimeLeft(questionsArray.length * 5 * 60); // 5 minutes per question
      } catch (error) {
        console.error("Failed to fetch questions:", error);
      }
    };

    fetchQuestions();
  }, [setId, shuffleChoices]);
      
      

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


  //change color of answer when picked
  const getButtonStyle = (option, questionIndex) => {
    const isSelected = questions[questionIndex].userAnswer === option;
    return isSelected ? { backgroundColor: '#1976d2', color: 'red' } : {};
  };

  //function to determine the style for each question in the sidebar
  const getQuestionStyle = (index) => {
    if (questions[index].userAnswer !== null) {
      return { color: 'green' }; //change this to your preferred color for answered questions
    } else {
      return { color: 'black' }; //default color
    }
  };

  return (
    <div>
      {/* appBar for the main header */}
      <AppBar position="static">
        <Toolbar style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" component="h2" style={{ margin: 0 }}>
            Quiz
          </Typography>
          <div style={{ position: 'relative' }}>
            {!quizFinished && (
              <>
                {/* timer display */}
                <Typography variant="h6" style={{ marginRight: '20px' }}>
                  Time Left: {formatTime()}
                </Typography>
  
                {/* submit button */}
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
          {/* left side bar for all the question */}
          <List>
            {/* loop thought to diplay each question */}
            {questions.map((_, index) => (
              <ListItem 
                button 
                key={index} 
                onClick={() => setSelectedQuestionIndex(index)}
                style={getQuestionStyle(index)} //apply the style based on answered state
              >
                {`Question ${index + 1}`}
              </ListItem>
            ))}
          </List>
        </Paper>
  
        {/* Display questions and answer options */}
        <div style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {selectedQuestionIndex !== null && (
            <>
              {/* Question display */}
              <Typography variant="h4" component="h2" style={{ marginBottom: '30px' }}>
                {`Question ${selectedQuestionIndex + 1}`}
              </Typography>
              <Typography variant="h4" component="h2" style={{ marginBottom: '30px' }}>
                {questions[selectedQuestionIndex].question}
              </Typography>
  
              {/* show answer options when quiz is started */}
              <div>
        {questions[selectedQuestionIndex].choices.map((choice, index) => (
        <Button
        key={index}
        variant="contained"
        style={getButtonStyle(choice, selectedQuestionIndex)}
        onClick={() => checkAnswer(choice)}>
          {choice}
          </Button>
          ))}
          </div>
          </>
          )}
          </div>
        
        {/* display score and return button */}
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
                console.log("not working yet");
              }}
            >
              Share Score
            </Button>
          </div>
        )}
      </div>
    </div>
  ); 
}          
export default MainQuizPage;