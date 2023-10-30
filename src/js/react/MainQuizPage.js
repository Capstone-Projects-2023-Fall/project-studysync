import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, List, ListItem, Paper, Avatar, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function MainQuizPage() {
    
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [subjects, setSubjects] = useState(['Math', 'English', 'History', 'Music']);
    const [open, setOpen] = useState(false); 
    const [newSubject, setNewSubject] = useState('');
    const navigate = useNavigate();

    // Function to handle adding a new subject
    const handleAddSubject = () => {
        if (newSubject) {
            setSubjects(prevSubjects => [...prevSubjects, newSubject]);
            setNewSubject('');
            setOpen(false);
        }
    };

    return (
        <div>
            {/* Navigation Bar */}
            <AppBar position="static">
                <Toolbar style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h4" component="h2" style={{ margin: 0 }}>
                        Quiz
                    </Typography>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        {/* Profile Avatar Button */}
                        <Button onClick={() => navigate('/profile/:UserId')}>
    <Avatar alt="User Profile" src="https://via.placeholder.com/40" />
</Button>

                        <Button 
                            variant="contained"
                            // for future leaderboard page, implement navigation
                        >
                            LEADERBOARD
                        </Button>
                    </div>
                </Toolbar>
            </AppBar>

            <div style={{ display: 'flex', marginTop: '20px' }}>
                {/* Sidebar */}
                <Paper elevation={3} style={{ width: '20%', maxHeight: '100vh', overflow: 'auto' }}>
                    <List>
                        {subjects.map((subject) => (
                            <ListItem button key={subject} onClick={() => setSelectedSubject(subject)}>
                                {subject}
                            </ListItem>
                        ))}
                    </List>
                    <Button variant="contained" color="primary" onClick={() => setOpen(true)}>ADD SUBJECT</Button> 
                </Paper>

                {/* Main Content */}
                <div style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {selectedSubject && (
                        <>
                            {/* other content related to selectedSubject */}
                        </>
                    )}
                </div>
            </div>

            {/* Text box for adding a new subject */}
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Add a New Subject</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Subject Name"
                        type="text"
                        fullWidth
                        value={newSubject}
                        onChange={e => setNewSubject(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)} color="primary">CANCEL</Button>
                    <Button onClick={handleAddSubject} color="primary">ADD</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default MainQuizPage;
