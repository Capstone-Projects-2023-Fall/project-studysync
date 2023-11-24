import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import QuizIcon from '@mui/icons-material/Quiz';
import FlashcardRepo from '../repositories/FlashcardRepo';
import { useParams, useNavigate } from 'react-router-dom';

function QuizList() {
  const [state, setState] = React.useState({
    left: false,
  });

  const [quizList, setQuizList] = useState([]); // store the quiz title that retreived from database
  const { setId, quizId } = useParams();  // retrieve the flashcard set in order to go to a certain quiz
  const navigate = useNavigate();
  const [currentQuiz, setCurrentQuiz] = useState(null); // capture the current quizID in order to show by def

  useEffect(() => {
    const fetchQuizTitle = async () => {
      try{
        const quizData = await FlashcardRepo.getQuizTitleFromFlashcardSet(setId);
        console.log("Fetching Quiz Title:", quizData);
        setQuizList(quizData);

        // If quizId is available, set it as the current open quiz
        if (quizId) {
          setCurrentQuiz(quizId);
          console.log("Current Quiz ID: ", quizId);
        } else if (quizData.length > 0) {
          // If no specific quizId is provided, navigate to the first quiz in the list by default
          const firstQuizId = await FlashcardRepo.getQuizTitleId(quizData[0]);
          const firstSetId = await FlashcardRepo.getSetIdByQuizId(firstQuizId);
          navigate(`/quizFlash/${firstSetId}/quiz/${firstQuizId}`);
          setCurrentQuiz(firstQuizId);
        }

    } catch (error) {
        console.error("Failed to fetch flashcards:", error);
    }
    };
  
      fetchQuizTitle();
  
  }, [setId, quizId, navigate]);

  //navigate to quiz page by passing flashcardSet ID as parameter
  const handleQuizTitleClick = async (quizName) => {
      try {
        const quizId = await FlashcardRepo.getQuizTitleId(quizName);
        const setId = await FlashcardRepo.getSetIdByQuizId(quizId);

        if (quizId && setId) {
          console.log("Your Set Id is: ", setId);
          console.log("Your Quiz Id is: ", quizId);
          console.log("Navigating to: ", `/quizFlash/${setId}/quiz/${quizId}`);
          navigate(`/quizFlash/${setId}/quiz/${quizId}`);
        } else {
          console.error("Unable to fetch set ID for topic:", quizName);
        }
      } catch (error) {
        console.error("Error in handleFlashcardClick:", error);
      }
  
  };

  //navigate to the defualt quiz page by passing flashcardSet ID as parameter
  const handleDefaultQuizClick = async () => {
    try {
      if (setId) {
        console.log("Your Set Id is: ", setId);
        console.log("Your Quiz Id is: ", setId);
        console.log("Navigating to: ", `/quizFlash/${setId}/quiz/${setId}`);
        navigate(`/quizFlash/${setId}/quiz/${setId}`);
      } else {
        console.error("Unable to fetch set ID for topic:");
      }
    } catch (error) {
      console.error("Error in handleFlashcardClick:", error);
    }

};

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <h3>List of Quiz</h3>
      <Divider/>
      <List>
      {/* Button for the current open quiz */}
      {currentQuiz && (
          <ListItem key={currentQuiz} disablePadding onClick= {() => handleDefaultQuizClick()}>
            <ListItemButton>
              <ListItemIcon>
                <QuizIcon/>
              </ListItemIcon>
              <ListItemText primary={`Default Quiz`} />
            </ListItemButton>
          </ListItem>
        )}
      {quizList.map((quizTitle) => (
          <ListItem key={quizTitle} disablePadding>
            <ListItemButton onClick= {() => handleQuizTitleClick(quizTitle)}>
              <ListItemIcon>
                <QuizIcon/>
              </ListItemIcon>
              <ListItemText primary={quizTitle} />
            </ListItemButton>
          </ListItem>
          ))}
      </List>
    </Box>
  );

  return (
    <div>
      {['left'].map((anchor) => (
        <React.Fragment key={anchor}>
        <Button variant="contained" onClick={toggleDrawer(anchor, true)}>Quiz List</Button>
          <Drawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
          >
            {list(anchor)}
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}
export default QuizList;