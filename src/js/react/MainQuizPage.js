import React, {useState,useEffect,useCallback} from 'react';
import {AppBar, Toolbar, Typography, Button, List, ListItem,Paper} from '@mui/material';
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
  
  const calculateInitialTime = useCallback(() => {
    return questions.length * 5 * 60; //5 minutes per question
  }, [questions.length]);

  //for pausing
  const handlePause = () => {
    setIsPaused(true);
  };
  
  //for resume
  const handleResume = () => {
    setIsPaused(false);
  };

  
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
      setSelectedQuestionIndex(0);
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
    if (timeLeft > 0 && !isPaused && !quizFinished) {
      timer = setInterval(() => {
        setTimeLeft(prevTimeLeft => prevTimeLeft - 1);
      }, 1000);
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [timeLeft, isPaused, quizFinished]);
  

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

const calculateScore = () => {
  const correctAnswers = questions.reduce((acc, question) => {
    // Count the number of correct answers
    return acc + (question.userAnswer === question.correctChoice ? 1 : 0);
  }, 0);

  // Calculate the score percentage based on the total number of questions
  const scorePercentage = (correctAnswers / questions.length) * 100;
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
    navigate('/flashcard'); // Navigate to the flashcards page (adjust the path as needed)
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
          {/*pause and resume button*/}
          {!quizFinished && !isPaused && (
          <Button variant="contained" color="primary" onClick={handlePause}>
            Pause Quiz
            </Button>
            )}
            {!quizFinished && isPaused && (
            <Button variant="contained" color="primary" onClick={handleResume}>
              Resume Quiz
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

              {/*submit button */}
              <Button variant="contained" color="primary" onClick={handleSubmit} style={{ position: 'absolute', top: '150px', right: '20' }}>
                  Submit Quiz
                </Button>
  
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
            {/*share score button */}
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                console.log("Share score functionality not implemented yet");
              }}
              style={{ marginBottom: '10px' }} 
            >
              Share Score
            </Button>

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
    </div>
  );
}

export default MainQuizPage;