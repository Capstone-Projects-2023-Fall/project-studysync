import React, { useEffect, useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { AppBar, Toolbar, Typography, Button, List, ListItem, Paper, Avatar, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { database } from '../../firebase';
import { QuizRepository } from '../repositories/QuizRepository';

function MainQuizPage() {
    
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [open, setOpen] = useState(false); 
    const [subjects, setSubjects] = useState(['Math', 'English', 'History', 'Music']);
    const [newSubject, setNewSubject] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const quizRepository = new QuizRepository(database);
        quizRepository.getAllQuizes()
            .then((quizzes) => {
                const uniqueSubjects = Array.from(new Set(quizzes.map(quiz => quiz.subject)));
                setSubjects(uniqueSubjects);
            })
            .catch((error) => {
                console.error('Error retrieving quizzes:', error);
            });
    }, []);

    const handleAddSubject = () => {
        if (newSubject) {
            const subjectsCollection = collection(database, 'quizzes');
            addDoc(subjectsCollection, { subject: newSubject })
                .then(() => {
                    setSubjects(prevSubjects => [...prevSubjects, newSubject]);
                    setNewSubject('');
                    setOpen(false);
                })
                .catch((error) => {
                    console.error('Error adding new subject:', error);
                });
        }
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

                <div style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {selectedSubject && (
                        <>
                        </>
                    )}
                </div>
            </div>

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
