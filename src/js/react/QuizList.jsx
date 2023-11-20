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
  const { setId } = useParams();  // retrieve the flashcard set in order to go to a certain quiz
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizTitle = async () => {
      try{
        const quizData = await FlashcardRepo.getQuizTitle(setId);
        console.log("Fetching Quiz Title:", quizData);
        setQuizList(quizData);

    } catch (error) {
        console.error("Failed to fetch flashcards:", error);
    }
    };
  
      fetchQuizTitle();
  
  }, [setId]);

  //navigate to quiz page by passing flashcardSet ID as parameter
  const handleQuizTitleClick = async (quizName) => {
      try {
        const quizId = await FlashcardRepo.getQuizTitleId(quizName);
        if (quizId) {
          console.log("Your Set Id is: ", setId);
          console.log("Your Quiz Id is: ", quizId);
          console.log("Navigating to: ", `/quiz/${setId}/${quizId}`);
          // navigate(`/flashcard-ui/${setId}/${quizId}`);
        } else {
          console.error("Unable to fetch set ID for topic:", quizName);
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