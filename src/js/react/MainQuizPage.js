import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, List, ListItem, Paper, Avatar, Menu, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// MainQuizPage component
function MainQuizPage() {
  const navigate = useNavigate(); // Navigation function for avatar
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(null); // Current selected question index
  const [selectedOption, setSelectedOption] = useState(null); // State for selected option by user
  const [answered, setAnswered] = useState(false); // State to track if question is answered
  const [anchorEl, setAnchorEl] = useState(null); // State to track current element that the menu is anchored to
  const [menuQuestionIndex, setMenuQuestionIndex] = useState(null); // State for the current question index in the menu 

  // Generate question based on index
  const generateQuestion = (i) => {
    const correctAnswer = `${2 * (i + 1)}`;
    const options = [correctAnswer, `${2 * (i + 2)}`, `${2 * (i + 3)}`, `${2 * (i + 4)}`].sort(() => Math.random() - 0.5);
    return {
      text: `${i + 1} + ${i + 1}`,
      options,
      correct: correctAnswer
    };
  }

  // Store list of questions
  const [questions, setQuestions] = useState(Array.from({ length: 10 }, (_, i) => generateQuestion(i)));

  // Open menu function
  const handleMenuOpen = (event, index) => {
    setAnchorEl(event.currentTarget);
    setMenuQuestionIndex(index);
  };

  // Close menu function
  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuQuestionIndex(null);
  };

  // Delete question function
  const deleteQuestion = () => {
    setQuestions(prev => prev.filter((_, index) => index !== menuQuestionIndex));
    handleMenuClose();
  };

  // Edit question function
  const editQuestion = () => {
    console.log('Editing question:', menuQuestionIndex + 1);
    handleMenuClose();
  };

  // Add question
  const addQuestion = () => {
    setQuestions(prev => [...prev, generateQuestion(prev.length)]);
  };

  // Start quiz button
  const startQuiz = () => {
    setQuizStarted(true);
  };

  // Check if answer is correct
  const checkAnswer = (option) => {
    setSelectedOption(option);
    setAnswered(true);
  };

  // To track if the quiz has started or not
  const [quizStarted, setQuizStarted] = useState(false);

  // To determine the styles for each option
  const getOptionStyle = (option, correct) => {
    if (!answered) return {}; // When not answered
    if (option === selectedOption && option === correct) return { backgroundColor: 'green' }; // Selected correct answer
    if (option === selectedOption) return { backgroundColor: 'red' }; // Selected incorrect answer
    if (option !== selectedOption && option === correct) return { backgroundColor: 'green' }; // When correct answer not selected show green too
    return {}; // Default case
  };

  // Render component
  return (
    
    //start menu container, user profile icon takes user to probfile page and leaderboard button for future implementation
    <div>
      <AppBar position="static">
        <Toolbar style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" component="h2" style={{ margin: 0 }}>
            Quiz
          </Typography>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button onClick={() => navigate('/profile/:UserId')}>
              <Avatar alt="User Profile" src="https://via.placeholder.com/40" />
            </Button>
            <Button variant="contained">
              LEADERBOARD
            </Button>
          </div>
        </Toolbar>
      </AppBar>

        {/*main container with a flex display*/}
      <div style={{ display: 'flex', marginTop: '20px' }}>
        <Paper elevation={3} style={{ width: '20%', maxHeight: '100vh', overflow: 'auto', padding: '10px' }}>
        
        {/*list of questions*/}
          <List>

            {/*individual question item*/}
            {questions.map((_, index) => (
              <ListItem button key={index} onClick={() => { setSelectedQuestionIndex(index); setAnswered(false); setSelectedOption(null); }}>
                {`Question ${index + 1}`}

                {/*button to display options menu (three dots) for each question*/}
                <Button style={{ marginLeft: '10px', color: 'black', textTransform: 'none' }} 
                onClick={(e) => handleMenuOpen(e, index)}>
                  <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '4px' }}>
                    <span style={{ color: 'black' }}>•</span>
                    <span style={{ color: 'black' }}>•</span>
                    <span style={{ color: 'black' }}>•</span>
                  </div>
                </Button>
                
                {/*dropdown menu to edit or delete a question*/}
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

          {/*button to add a new question*/}
          <Button variant="contained" color="primary" onClick={addQuestion} style={{ margin: '10px' }}>Add Question</Button>
        </Paper>
        
        {/*right side main content area for question and anser optionns*/}
        <div style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {selectedQuestionIndex !== null && (
            <>

            {/*display content when a question is selected*/}
              <Typography variant="h4" component="h2" style={{ marginBottom: '30px' }}>
                {`Question ${selectedQuestionIndex + 1}`}
              </Typography>
              <Typography variant="h4" component="h2" style={{ marginBottom: '30px' }}>
                {questions[selectedQuestionIndex].text}
              </Typography>

              {/* Check if the quiz has started before showing options */}
              {quizStarted && (
                <>

                {/* First two options */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '50%', marginBottom: '20px' }}>
                    {questions[selectedQuestionIndex].options.slice(0, 2).map((option, index) => (
                      <Button
                        key={index}
                        variant="contained"
                        style={getOptionStyle(option, questions[selectedQuestionIndex].correct)}
                        onClick={() => !answered && checkAnswer(option)}
                      >
                        {option}
                      </Button>
                    ))}
                  </div>

                  {/* Last two options */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '50%', marginBottom: '40px' }}>
                    {questions[selectedQuestionIndex].options.slice(2, 4).map((option, index) => (
                      <Button
                        key={index}
                        variant="contained"
                        style={getOptionStyle(option, questions[selectedQuestionIndex].correct)}
                        onClick={() => !answered && checkAnswer(option)}
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                </>
              )}

              {/* Start the quiz button will only be displayed if the quiz hasn't started */}
              {!quizStarted && (
                <Button variant="contained" color="primary" onClick={startQuiz} style={{ marginTop: '20px' }}>
                  Start Quiz
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default MainQuizPage;
