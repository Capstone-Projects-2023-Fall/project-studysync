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

export default function QuizList() {
  const [state, setState] = React.useState({
    left: false,
  });

  const [quizList, setQuizList] = useState([]);

  useEffect(() =>{
    const fetchQuizTitle = async () => {
      try{
        const quizDate = await FlashcardRepo.getQuestionItems(setId);
        console.log("fetching question", questionData);
        const questionsArray = Object.keys(questionData).map(key => {
            return {
                question: questionData[key].question,
                choices: questionData[key].choices,
                questionId: key
            };
        });
        setQuizData(questionsArray);
    } catch (error) {
        console.error("Failed to fetch flashcards:", error);
    }
};
  })

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
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
        {quizList.map((quiz, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <QuizIcon/>
              </ListItemIcon>
              <ListItemText primary={quiz.quizTitle} />
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