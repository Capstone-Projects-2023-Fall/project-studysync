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
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton';

function QuizList() {
  const [state, setState] = React.useState({
    left: false,
  });

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const [currentQuizMenu, setCurrentQuizMenu] = React.useState(null);
  const [quizMenu, setQuizMenu] = React.useState(null);

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

        // if quizId is available, set it as the current open quiz
        if (quizId) {
          setCurrentQuiz(quizId);
          console.log("Current Quiz ID: ", quizId);
        } else if (quizData.length > 0) {
          // if no specific quizId is provided, navigate to the first quiz in the list by default
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

  // navigate to quiz page by passing flashcardSet ID as parameter
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

  // navigate to the defualt quiz page by passing flashcardSet ID as parameter
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

  // handle the MoreVertIcon when clicked
  const handleClick = (event, menuType) => {
    // stop the event propagation to prevent the drawer from closing
    event.stopPropagation();
  
    setAnchorEl(event.currentTarget);
  
    // set the appropriate menu state based on the type
    if (menuType === 'currentQuiz') {
      setCurrentQuizMenu(event.currentTarget);
    } else if (menuType === 'quiz') {
      setQuizMenu(event.currentTarget);
    }
  };

  const handleClose = (menuType) => {
    setAnchorEl(null);

    // close the appropriate menu based on the type
    if (menuType === 'currentQuiz') {
      setCurrentQuizMenu(null);
    } else if (menuType === 'quiz') {
      setQuizMenu(null);
    }
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
              <IconButton
                  id="current-quiz-button"
                  aria-controls={currentQuizMenu ? 'current-quiz-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={Boolean(currentQuizMenu)}
                  onClick={(event) => handleClick(event, 'currentQuiz')}
              >
                <MoreVertIcon />
              </IconButton>
                <Menu
                  id="current-quiz-menu"
                  anchorEl={currentQuizMenu}
                  open={Boolean(currentQuizMenu)}
                  onClose={() => handleClose('currentQuiz')}
                  MenuListProps={{
                    'aria-labelledby': 'current-quiz-button',
                  }}
                >
                  <MenuItem onClick={() => handleClose('currentQuiz')}>Profile</MenuItem>
                  <MenuItem onClick={() => handleClose('currentQuiz')}>My account</MenuItem>
                </Menu>
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
              <IconButton
                  id={`quiz-button-${quizTitle}`}
                  aria-controls={quizMenu ? `quiz-menu-${quizTitle}` : undefined}
                  aria-haspopup="true"
                  aria-expanded={Boolean(quizMenu)}
                  onClick={(event) => handleClick(event, 'quiz')}
                >
                <MoreVertIcon />
              </IconButton>
                <Menu
                  id={`quiz-menu-${quizTitle}`}
                  anchorEl={quizMenu}
                  open={Boolean(quizMenu)}
                  onClose={() => handleClose('quiz')}
                  MenuListProps={{
                    'aria-labelledby': `quiz-button-${quizTitle}`,
                  }}
                >
                  <MenuItem onClick={() => handleClose('quiz')}>Rename</MenuItem>
                  <MenuItem onClick={() => handleClose('quiz')}>Delete</MenuItem>
                  <MenuItem onClick={() => handleClose('quiz')}>Share</MenuItem>
                </Menu>
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