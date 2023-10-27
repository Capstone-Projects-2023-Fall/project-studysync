import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, List, ListItem, Paper } from '@mui/material';

function MainQuizPage() {

    const [selectedSubject, setSelectedSubject] = useState(null);
    const subjects = ['Math', 'History', 'Science', 'English'];

    return (
        <div>
            {/* Navigation Bar */}
            <AppBar position="static">
                <Toolbar style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h4" component="h2" style={{ margin: 0 }}>
                        Quiz
                    </Typography>
                    <Button 
                        variant="contained"
                        // for fitutre ;learderboard page implement navigation
                    >leaderboard
                    </Button>
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
                            {/* other content related to selectedSubject*/}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default MainQuizPage;
