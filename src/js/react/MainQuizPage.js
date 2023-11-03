import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, List, ListItem, Paper, Avatar, Menu, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';

//MainQuizPage component
function MainQuizPage() {
    const navigate = useNavigate();//navagfation function for avatar
    const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(null);//Current selected question index
    const [selectedOption, setSelectedOption] = useState(null);//state for selected option by user
    const [answered, setAnswered] = useState(false);//state to ctrack if question is answer
    const [anchorEl, setAnchorEl] = useState(null);//state to track current element that the menu is anchored
    const [menuQuestionIndex, setMenuQuestionIndex] = useState(null);//state for the current question index in the muen 

    //generate question based on index
    //generate corrected anser and three random
    //return question object, question, correct answer and incorrect answer
    const generateQuestion = (i) => {
        const correctAnswer = `${2 * (i + 1)}`;
        const options = [correctAnswer, `${2 * (i + 2)}`, `${2 * (i + 3)}`, `${2 * (i + 4)}`].sort(() => Math.random() - 0.5);
        return {
            text: `${i + 1} + ${i + 1}`,
            options,
            correct: correctAnswer
        };
    }

    //store list of question
    const [questions, setQuestions] = useState(Array.from({ length: 10 }, (_, i) => generateQuestion(i)));

    const handleMenuOpen = (event, index) => {
        setAnchorEl(event.currentTarget);
        setMenuQuestionIndex(index);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setMenuQuestionIndex(null);
    };

    const deleteQuestion = () => {
        setQuestions(prev => prev.filter((_, index) => index !== menuQuestionIndex));
        handleMenuClose();
    };

    const editQuestion = () => {
       
        console.log('Editing question:', menuQuestionIndex + 1);
        handleMenuClose();
    };

    const addQuestion = () => {
        setQuestions(prev => [...prev, generateQuestion(prev.length)]);
    };

    const startQuiz = () => {
        
    };

    const checkAnswer = (option) => {
        setSelectedOption(option);
        setAnswered(true);
    };

    const getOptionStyle = (option, correct) => {
        if (!answered) return {};
        if (option === selectedOption && option === correct) return { backgroundColor: 'green' };
        if (option === selectedOption) return { backgroundColor: 'red' };
        if (option !== selectedOption && option === correct) return { backgroundColor: 'green' };
        return {};
    };

    return (
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

            <div style={{ display: 'flex', marginTop: '20px' }}>
    <Paper elevation={3} style={{ width: '20%', maxHeight: '100vh', overflow: 'auto', padding: '10px' }}>
        <List>
            {questions.map((_, index) => (
                <ListItem button key={index} onClick={() => { setSelectedQuestionIndex(index); setAnswered(false); setSelectedOption(null); }}>
                    {`Question ${index + 1}`}
                    <Button 
                        style={{ marginLeft: '10px', color: 'black', textTransform: 'none' }} 
                        onClick={(e) => handleMenuOpen(e, index)}
                    >
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
        <Button variant="contained" color="primary" onClick={addQuestion} style={{ margin: '10px' }}>Add Question</Button>
    </Paper>

                <div style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {selectedQuestionIndex !== null && (
                        <>
                            <Typography variant="h4" component="h2" style={{ marginBottom: '30px' }}>
                                {`Question ${selectedQuestionIndex + 1}`}
                            </Typography>
                            <Typography variant="h4" component="h2" style={{ marginBottom: '30px' }}>
                                {questions[selectedQuestionIndex].text}
                            </Typography>
                            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
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
                            </div>
                            <Button variant="contained" color="primary" onClick={startQuiz} style={{ marginTop: '20px' }}>Start the Quiz</Button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default MainQuizPage;