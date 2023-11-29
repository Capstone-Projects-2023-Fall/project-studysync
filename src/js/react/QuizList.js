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
  Typography,
} from '@mui/material';
import QuizIcon from '@mui/icons-material/Quiz';
import MoreVertIcon from '@mui/icons-material/MoreVert';

function QuizList({ newQuizAdded }) {
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
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  
  const [deleteQuiz, setDeleteQuiz] = useState(null); 
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    const fetchQuizTitle = async () => {
      try{
        const quizData = await FlashcardRepo.getQuizTitleFromFlashcardSet(setId);
        console.log("Fetching Quiz Title:", quizData);
        setQuizList(quizData);
        if (newQuizAdded) {
          setQuizList(prevList => [...prevList, newQuizAdded]);
          // reset the newQuizAdded prop
          // this is crucial to prevent continuous addition of the same quiz title
          newQuizAdded = null;
        }

      } catch (error) {
          console.error("Failed to fetch flashcards:", error);
      }
    };
  
      fetchQuizTitle();
  
  }, [setId, quizId, navigate, newQuizAdded]);

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
    if (isEditDialogOpen || isDeleteDialogOpen) {
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
    setDeleteQuiz(title);
    setAnchorEl(event.currentTarget);
    console.log("You have clicked on: ", title);
  };
 
  // set the Anchor to null
  const handleClose = () => {
    setAnchorEl(null);
  };

  // handle open the edit dialog 
  const handleOpenEditDialog = () => {
    setEditDialogOpen(true);
  };

  // handle close the edit dialog 
  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
  };

  // handle open the deleting dialog
  const handleOpenDeleteDialog = () => {
    setDeleteDialogOpen(true);
  };
  
  // handle close the deleting dialog
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
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
    handleCloseEditDialog();
  };

//delete the question and update the question data (setQuizData(updateQuiz))
const handleDeleteQuiz = async () => {
  
  const uid = FlashcardRepo.getCurrentUid();
  // get the selected quiz id for the deletion
  const quizIdToDelete = await FlashcardRepo.getQuizTitleId(deleteQuiz, uid);
  console.log("This is the quiz id you want to delete?: ", quizIdToDelete);

    if (deleteQuiz) {
        try {
            await FlashcardRepo.deleteQuiz(quizIdToDelete);
            await FlashcardRepo.removeOwnedQuizFromUser(uid, quizIdToDelete);
            //update the quiz list so the deleted quiz doesnt show in the drawer
            const updatedQuiz = quizList.filter(quiz => quiz !== deleteQuiz);
            setQuizList(updatedQuiz);
            setDeleteQuiz(null);
        } catch (error) {
            console.error("Failed to delete flashcard:", error);
        }
        setDeleteDialogOpen(false);
    }
}
 
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
                    onClose={handleClose}>
                  <MenuItem
                     onClick={() => {
                      handleOpenEditDialog();
                      handleClose();
                      }}>
                      Rename
                    </MenuItem>
                  <MenuItem onClick={() => {
                      handleOpenDeleteDialog();
                      handleClose();
                      }}>
                      Delete
                    </MenuItem>
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
            open={state[anchor] || isEditDialogOpen || isDeleteDialogOpen}
            onClose={toggleDrawer(anchor, false)}
          >
            {list(anchor)}
          </Drawer>
        </React.Fragment>
      ))}

      <Dialog open={isEditDialogOpen} onClose={handleCloseEditDialog}>
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
          <Button onClick={handleCloseEditDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleEditQuizTitle} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirmation</DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to delete this quiz?</Typography>
          </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteQuiz}
            color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
export default QuizList;