import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, List, ListItem, Paper } from '@mui/material';

function MainQuizPage() {
    const [selectedSubject, setSelectedSubject] = useState(null);
    const subjects = ['Math', 'History', 'Science', 'English'];
    const quizzes = {
        Math: ['Quiz 1', 'Quiz 2', 'Quiz 3', 'Quiz 4'],
        History: ['Quiz 1', 'Quiz 2', 'Quiz 3', 'Quiz 4'],
        Science: ['Quiz 1', 'Quiz 2', 'Quiz 3', 'Quiz 4'], 
        English: ['Quiz 1', 'Quiz 2', 'Quiz 3', 'Quiz 4'],
   
    };
    
    return (
        <div>
            {/* Navigation Bar */}
            <AppBar position="static">
                <Toolbar style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Typography variant="h4" component="h2" style={{ margin: 0 }}>
                        Quiz
                    </Typography>
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
                </Paper>
                
                {/* Main Content */}
                    <div style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                     {selectedSubject && (
                                <>
                             <Typography variant="h5" component="h3" style={{ margin: '20px 0' }}>
                                  Quizzes for {selectedSubject}
                             </Typography>
                              <List>
                                  {quizzes[selectedSubject].map((quiz) => (
                                        <ListItem button key={quiz}>
                                            {quiz}
                                        </ListItem>
                                  ))}
                               </List>
                            </>
                      )}
                    </div>
             </div>
            </div>
       );
}

export default MainQuizPage;
