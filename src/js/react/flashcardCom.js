import React, { useState, useEffect } from 'react';
import {
  List, ListItem, ListItemText, Button, Divider, Dialog, DialogTitle,
  DialogContent, DialogContentText, DialogActions, TextField, InputAdornment, IconButton, Paper, Close
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FlashcardRepo from '../repositories/FlashcardRepo';
import { useParams, useNavigate } from 'react-router-dom';
import ClearIcon from '@mui/icons-material/Clear';
import Quiz from './Quiz';



const astyle = {
  fontFamily: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'`,
  colors: {
    primary: '#007aff',
    secondary: '#f2f2f7'
  },
  borderRadius: '10px'
};
/**
 * @class FlashcardComponent
 * @classdesc FlashcardComponent
 * FlashcardComponent - A React component for managing flashcards.
 * This component allows users to view, add, edit, and delete flashcards and their subjects.
 * It also provides navigation to flashcard details and associated quizzes.
 */

const FlashcardComponent = () => {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [flashcards, setFlashcards] = useState({});
  const [open, setOpen] = useState(false);
  const [newEntry, setNewEntry] = useState('');
  const [dialogType, setDialogType] = useState('subject');
  const [editedName, setEditedName] = useState('');
  const [currentlyEditingTopic, setCurrentlyEditingTopic] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const { setId, quizId } = useParams();
  const [searchQuery, setSearchQuery] = useState('');


  /**
   * @memberof FlashcardComponent
   * @function handleSearchChange
   * @description Handles changes to the search field.
   * @public
   * @param {Object} event - The event object from the search input field.
   */
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };
  /**
   * @memberof FlashcardComponent
   * @function handleClearSearch
   * @description Clears the current search query.
   */
  const handleClearSearch = () => {
    setSearchQuery('');
  };
  /**
   * @memberof FlashcardComponent
   * @function filteredFlashcards
   * @description Filters flashcards based on the search query.
   * @public
   * @param {string} subject - The subject to filter flashcards under.
   * @returns {Array} An array of filtered flashcards.
   */
  const filteredFlashcards = (subject) => {
    return flashcards[subject] ? flashcards[subject].filter(topic => topic.toLowerCase().includes(searchQuery)) : [];
  };
  // Navigation hook from react-router-dom
  const navigate = useNavigate();

  /**
   * @memberof FlashcardComponent
   * @function handleFlashcardClick
   * @description Handles the action when a flashcard is clicked.
   * @description Navigates to the flashcard details page.
   * @public
   * @param {string} topicName - The name of the topic.
   */
  const handleFlashcardClick = async (topicName) => {
    try {
      const setId = await FlashcardRepo.getSetIdByTopicName(topicName);
      if (setId) {
        navigate(`/flashcard-ui/${setId}`);
      } else {
        console.error("Unable to fetch set ID for topic:", topicName);
      }
    } catch (error) {
      console.error("Error in handleFlashcardClick:", error);
    }
  };

  /**
   * @memberof FlashcardComponent
   * @function handleQuizClick
   * @description Handles the action when the quiz button is clicked.
   * @description Navigates to the associated quiz page.
   * @public
   * @param {string} topicName - The name of the topic.
   */
  const handleQuizClick = async (topicName) => {
    try {
      const setId = await FlashcardRepo.getSetIdByTopicName(topicName);
      const quizId = await FlashcardRepo.getQuizIdByTopicName(topicName);
      if (setId) {
        console.log("SetId: ", setId);
        console.log("QuizId: ", quizId);
        navigate(`/quizFlash/${setId}/quiz/${quizId}`);
      } else {
        console.error("Unable to fetch set ID for topic:", topicName);
      }
    } catch (error) {
      console.error("Error in handleFlashcardClick:", error);
    }
  };


  useEffect(() => {
    async function fetchData() {
      try {
        const uid = FlashcardRepo.getCurrentUid();
        console.log("User ID:", uid);

        if (uid) {
          const userSubjects = await FlashcardRepo.getUserSubjects(uid);
          console.log("Fetched user subjects:", userSubjects);

          setSubjects(userSubjects);

          const ownedFlashcardSetIds = await FlashcardRepo.getUserFlashcardSets(uid);
          console.log("Fetched flashcard set IDs:", ownedFlashcardSetIds);

          const ownedFlashcards = [];
          for (let setId of ownedFlashcardSetIds) {
            const flashcardSet = await FlashcardRepo.getFlashcardSetById(setId);
            console.log("Fetched flashcard set:", flashcardSet);
            ownedFlashcards.push(flashcardSet);
          }

          const flashcardData = {};
          for (let flashcardSet of ownedFlashcards) {
            const { name, subject } = flashcardSet;
            if (!flashcardData[subject]) {
              flashcardData[subject] = [];
            }
            flashcardData[subject].push(name);
          }
          console.log("Constructed flashcard data:", flashcardData);
          setFlashcards(flashcardData);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
    fetchData();
  }, []);
  /**
   * @memberof FlashcardComponent
   * @function handleAddTopic
     * @description Handles adding a new topic.
     */
  const handleAddTopic = async () => {
    try {
      const uid = FlashcardRepo.getCurrentUid();
      if (uid) {
        // retreived both flashcardSetID and quizSetID
        const { flashcardSetId, quizSetId } = await FlashcardRepo.createFlashcardSet({
          name: newEntry,
          subject: selectedSubject
        });
        console.log('selectedSubject:', selectedSubject);

        await FlashcardRepo.addOwnedFlashcardSetToUser(uid, flashcardSetId);
        // add user created quiz to the user collection
        await FlashcardRepo.addOwnedQuizSetToUser(uid, quizSetId);

        // Update the local state
        const currentFlashcards = flashcards[selectedSubject] || [];
        setFlashcards(prev => ({
          ...prev,
          [selectedSubject]: [...currentFlashcards, newEntry]
        }));
      }
    } catch (error) {
      console.error("Error adding new topic:", error);
    }
  };
  /**
   * @memberof FlashcardComponent
   * @function handleDelete
     * @description Handles the deletion of a topic.
     * @public
     * @param {string} topicName - The name of the topic to delete.
     */
  const handleDelete = async (topicName) => {
    try {
      const uid = FlashcardRepo.getCurrentUid();


      const setId = await FlashcardRepo.getSetIdByTopicName(topicName);


      await FlashcardRepo.removeSetIdFromUser(uid, setId);


      await FlashcardRepo.removeUidFromSharedWith(setId, uid);

      const updatedFlashcards = flashcards[selectedSubject].filter(t => t !== topicName);
      setFlashcards(prev => ({
        ...prev,
        [selectedSubject]: updatedFlashcards
      }));
    } catch (error) {
      console.error("Error deleting flashcard set:", error);
    }
  };
  /**
   * @memberof FlashcardComponent
   * @function handleAdd
     * @description Handles the action when the add button is clicked.
     */
  const handleAdd = async () => {
    const trimmedEntry = newEntry.trim();

    if (trimmedEntry) {
      if (dialogType === 'subject') {
        if (!subjects.includes(trimmedEntry)) {
          // Update the local state
          setSubjects(prev => [...prev, trimmedEntry]);
          setFlashcards(prev => ({ ...prev, [trimmedEntry]: [] }));

          // Update the Firebase database
          const uid = FlashcardRepo.getCurrentUid();
          if (uid) {
            try {
              await FlashcardRepo.addUserSubject(uid, trimmedEntry);
            } catch (error) {
              console.error("Error adding subject to Firebase:", error);
            }
          }
        }

      } else if (dialogType === 'topic' && selectedSubject) {

        handleAddTopic();
      }
    }
    setNewEntry('');
    setOpen(false);
  };
  /**
   * @memberof FlashcardComponent
   * @function handleEdit
     * @description Handles editing an existing topic.
     */
  const handleEdit = async () => {
    console.log('handleEdit called');

    if (editedName.trim() === "" || !currentlyEditingTopic) {
      console.log('Empty edited name or no topic being edited, exiting');
      return;
    }

    try {

      const setId = await FlashcardRepo.getSetIdByTopicName(currentlyEditingTopic);
      console.log('Set ID by topic name:', setId);

      // Update the Firebase database
      await FlashcardRepo.updateFlashcardSetName(setId, editedName.trim());

      // Update the local state
      const updatedFlashcards = flashcards[selectedSubject].map(t => t === currentlyEditingTopic ? editedName.trim() : t);
      console.log('Updated flashcards:', updatedFlashcards);

      setFlashcards(prev => ({
        ...prev,
        [selectedSubject]: updatedFlashcards
      }));

      setCurrentlyEditingTopic(null);
      setEditedName('');


    } catch (error) {
      console.error("Error editing flashcard set name:", error);
    }
  }

  return (
    <div style={{ display: 'flex', marginTop: '60px', fontFamily: astyle.fontFamily }}>
      {/* Sidebar */}
      <Paper elevation={3} style={{ width: '240px', overflow: 'auto' }}>
        <Divider />
        <List>
          {subjects.map((subject) => (
            <ListItem
              button
              key={subject}
              onClick={() => setSelectedSubject(subject)}
              style={{ padding: '15px 10px' }}
            >
              <ListItemText primary={subject} />
            </ListItem>
          ))}
        </List>
        <Button
          variant="contained"
          color="primary"
          style={{
            margin: 'auto 10px 10px 10px',
            backgroundColor: astyle.colors.primary,
            borderRadius: astyle.borderRadius
          }}
          onClick={() => {
            setOpen(true);
            setDialogType('subject');
          }}
        >
          Add Subject
        </Button>
      </Paper>

      {/* right Flashcard Sets */}
      <div style={{ flexGrow: 1, padding: '20px', marginLeft: '260px', backgroundColor: astyle.colors.secondary }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>{selectedSubject}</h2>
          <Button variant="contained" color="primary" onClick={() => { setOpen(true); setDialogType('topic'); }}>
            Add Topic
          </Button>
        </div>

        <TextField
          variant="outlined"
          size="small"
          fullWidth
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconButton>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
            endAdornment: searchQuery && (
              <InputAdornment position="end">
                <IconButton onClick={handleClearSearch}>
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            )
          }}
        />

        {flashcards[selectedSubject]?.map((topic, index) => (
          <div key={index} style={{ display: 'flex', flexDirection: 'column', marginBottom: '20px' }}>
            {
              currentlyEditingTopic === topic ? (
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <TextField
                    variant="outlined"
                    size="small"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                  />
                  <Button variant="contained" color="primary" onClick={handleEdit}>Save</Button>
                </div>
              ) : (
                <h3>{topic}</h3>
              )
            }
            <div style={{ display: 'flex', gap: '10px' }}>
              <Button variant="outlined" onClick={() => {

                if (currentlyEditingTopic) {

                  setCurrentlyEditingTopic(null);
                  setEditedName('');
                } else {

                  setCurrentlyEditingTopic(topic);
                  setEditedName(topic);
                }
              }}>Edit</Button>
              <Button variant="outlined" onClick={() => handleFlashcardClick(topic)}>Flashcard</Button>
              <Button variant="outlined" onClick={() => handleQuizClick(topic)}>Quiz</Button>
              <Button variant="outlined" color="secondary" onClick={() => handleDelete(topic)}>Delete</Button>
            </div>
          </div>
        ))}
      </div>

      {/* Shared Add Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{`Add a New ${dialogType.charAt(0).toUpperCase() + dialogType.slice(1)}`}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {`Please enter the name of the new ${dialogType} you'd like to add:`}
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label={`${dialogType.charAt(0).toUpperCase() + dialogType.slice(1)} Name`}
            type="text"
            fullWidth
            value={newEntry}
            onChange={(e) => setNewEntry(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAdd} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div >
  );


};

export default FlashcardComponent;