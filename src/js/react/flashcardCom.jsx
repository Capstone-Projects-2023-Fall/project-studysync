import React, { useState } from 'react';
import {
  List, ListItem, ListItemText, Button, Divider, Dialog, DialogTitle,
  DialogContent, DialogContentText, DialogActions, TextField, InputAdornment, IconButton, Paper
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const astyle = {
  fontFamily: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'`,
  colors: {
    primary: '#007aff', // Apple blue
    secondary: '#f2f2f7' // Apple gray background
  },
  borderRadius: '10px' // Rounded corners typical of Apple design
};

const FlashcardComponent = () => {
  const [subjects, setSubjects] = useState(['Math', 'Computer Science']);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [flashcards, setFlashcards] = useState({});
  const [open, setOpen] = useState(false);
  const [newEntry, setNewEntry] = useState('');
  const [dialogType, setDialogType] = useState('subject'); // can be 'subject' or 'topic'

  const handleAdd = () => {
    const trimmedEntry = newEntry.trim();

    if (trimmedEntry) {
        if (dialogType === 'subject') {
            if (!subjects.includes(trimmedEntry)) {
                setSubjects(prev => [...prev, trimmedEntry]);
                setFlashcards(prev => ({ ...prev, [trimmedEntry]: [] }));
            }
        } else if (dialogType === 'topic' && selectedSubject) {
            const currentFlashcards = flashcards[selectedSubject] || [];
            if (!currentFlashcards.includes(trimmedEntry)) {
                setFlashcards(prev => ({
                    ...prev,
                    [selectedSubject]: [...currentFlashcards, trimmedEntry]
                }));
            }
        }
        setNewEntry('');
        setOpen(false);
    }
};


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

      {/* Flashcard Sets */}
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
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconButton>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        {flashcards[selectedSubject]?.map((topic, index) => (
          <div key={index} style={{ display: 'flex', flexDirection: 'column', marginBottom: '20px' }}>
            <h3>{topic}</h3>
            <div style={{ display: 'flex', gap: '10px' }}>
              <Button variant="outlined">Edit</Button>
              <Button variant="outlined">Flashcard</Button>
              <Button variant="outlined">Quiz</Button>
              <Button variant="outlined">AITutor</Button>
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
    </div>
  );
};

export default FlashcardComponent;


