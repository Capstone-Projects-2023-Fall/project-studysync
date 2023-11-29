import React, { useEffect, useState } from 'react';
import FlashcardRepo from '../repositories/FlashcardRepo';
import { useParams, useNavigate } from 'react-router-dom';

import {
  Box,
  Drawer,
  Button,
  List,
  Divider,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import QuizIcon from '@mui/icons-material/Quiz';
import MoreVertIcon from '@mui/icons-material/MoreVert';

function QuizList() {
  const [state, setState] = React.useState({
    left: false,
  });

  const navigate = useNavigate();
  const [quizList, setQuizList] = useState([]); // store the quiz title that retreived from database
  const { setId, quizId } = useParams();  // retrieve the flashcard set in order to go to a certain quiz
  
  const [currentQuiz, setCurrentQuiz] = useState(null); // capture the current quizID in order to show by def
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const [currentlyEditingTitle, setCurrentlyEditingTitle] = useState(null); // store the quiz title for user editting
  const [editedTitle, setEditedTitle] = useState(''); // store the user input which is the edited quiz title


  useEffect(() => {
    const fetchQuizTitle = async () => {
      try{
        const quizData = await FlashcardRepo.getQuizTitleFromFlashcardSet(setId);
        console.log("Fetching Quiz Title:", quizData);
        setQuizList(quizData);

        // // if quizId is available, set it as the current open quiz
        // if (quizId) {
        //   setCurrentQuiz(quizId);
        //   console.log("Current Quiz ID: ", quizId);
        // } else if (quizData.length > 0) {
        //   // if no specific quizId is provided, navigate to the first quiz in the list by default
        //   const firstQuizId = await FlashcardRepo.getQuizTitleId(quizData[0]);
        //   const firstSetId = await FlashcardRepo.getSetIdByQuizId(firstQuizId);
        //   navigate(`/quizFlash/${firstSetId}/quiz/${firstQuizId}`);
        //   setCurrentQuiz(firstQuizId);
        // }

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

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

        // check if the dialog is open, and if yes, do not close the drawer
    if (isDialogOpen) {
      return;
    }
    setState({ ...state, [anchor]: open });
  };

  // capture the quiz title data when the user clicked
  const handleClick = (event, title) => {
    // prevent the drawer from closing when the MoreVertIcon is clicked
    event.stopPropagation();
    setCurrentlyEditingTitle(title);
    setEditedTitle(title);
    setAnchorEl(event.currentTarget);
    console.log("You have clicked on: ", title);
  };
 
  // set the Anchor to null
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [isDialogOpen, setDialogOpen] = useState(false);

  // handle the dialog when open
  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  // handle the dialog when closed
  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  // this handler will edit the quiz title
  const handleEditQuizTitle = async () => {
    console.log('handleEdit called');  

    if (editedTitle.trim() === "" || !currentlyEditingTitle) {
      console.log('Empty edited name or no topic being edited, exiting');  
      return;
    }

    try {

      const quizId = await FlashcardRepo.getQuizTitleId(currentlyEditingTitle);
      console.log('Quiz ID by quiz title:', quizId);

      // Update the Firebase database
      await FlashcardRepo.updateQuizTitle(quizId, editedTitle.trim());

      // Update the local state
      const updatedQuizTitle = quizList.map(t => t === currentlyEditingTitle ? editedTitle.trim() : t);
      console.log('Updated Quiz Title:', updatedQuizTitle);

      setQuizList(updatedQuizTitle);

      setCurrentlyEditingTitle(null);
      setEditedTitle('');


    } catch (error) {
      console.error("Error editing flashcard set name:", error);
    }
    handleCloseDialog();
  };

  // this handler will delete the quiz
  const handleDeleteQuiz = async () => {
    console.log("Are you sure you want to delete this? ", currentlyEditingTitle);
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
              <IconButton
                  id="quiz-dropdown-button"
                  aria-controls={open ? 'quiz-dropdown-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? 'true' : undefined}
                  onClick={(event) => handleClick(event, quizTitle)}>
                <MoreVertIcon/>
              </IconButton>
            </ListItem>
            ))}
            <Menu
                    id="quiz-dropdown-menu"
                    aria-labelledby="quiz-dropdown-button"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                >
                  <MenuItem
                     onClick={() => {
                      handleOpenDialog();
                      handleClose();
                      }}>Rename</MenuItem>
                  <MenuItem onClick={() => {
                      handleDeleteQuiz();
                      handleClose();
                      }}>Delete</MenuItem>
                </Menu>
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
            open={state[anchor] || isDialogOpen}
            onClose={toggleDrawer(anchor, false)}
          >
            {list(anchor)}
          </Drawer>
        </React.Fragment>
      ))}

      <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus                
            margin="dense"               
            label="Enter a New Quiz Title"                
            fullWidth                
            value={editedTitle}                
            onChange={(e) => setEditedTitle(e.target.value)}                
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleEditQuizTitle} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
export default QuizList;