import React from 'react';

import { Button, AppBar, Toolbar, Typography } from '@mui/material';

function MainQuizPage() {
  return (
    <div>
      {/* Navigation Bar */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div">
            StudySync
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <div style={{ padding: '20px' }}>
        <Typography variant="h4" component="h2">
          Quiz Main Menu
        </Typography>

        {/* Back Button */}
        <div style={{ marginTop: '20px' }}>
          <Button variant="contained" color="primary">
            Back
          </Button>
        </div>
      </div>
    </div>
  );
}

export default MainQuizPage;
