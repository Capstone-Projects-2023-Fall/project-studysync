import useUser from './useUser';
import WelcomePage from "./WelcomePage";
import * as React from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link';
import Events from './DashboardUI/Events';
import Friends from './DashboardUI/Friends';
import {useState,useEffect} from 'react';
import { userRepository } from '../../firebase';
import RecentCards from './DashboardUI/RecentCards';
import './DashboardUI/RecentFlash.css';
import './DashboardUI/Dashboard.css';


function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}



const defaultTheme = createTheme();

export default function DashboardCom() {

    const {user} = useUser();
    const [userId,setUserId] = useState(null);
    const [isLoading,setIsLoading] = useState(false);
    const [error,setError ]= useState(null);
    const [friends,setFriends] = useState([]);
    const [events,setEvents] = useState([]);
    const [ownedFlashcards,setOwnedFlashcards] = useState([]);
    const [ownedQuizzes,setOwnedQuizzes] = useState([]);

    useEffect(() => {
      if (user) {
        setIsLoading(true);
    
        Promise.all([
          userRepository.getFriends(user.uid),
          userRepository.getEvents(user.uid),
          userRepository.getOwnedFlashcards(user.uid),
          // userRepository.getOwnedQuizzes(user.uid),
        ])
          .then(([friends, events,ownedFlashcards,ownedQuizzes]) => {
            console.log(`Friends: ${friends}`);
            console.log(`Events: ${events}`);
            console.log(`OwnedFlashcards: ${ownedFlashcards}`);
            // console.log(`OwnedQuizzes: ${ownedQuizzes}`);
            setFriends(friends);
            //REPLACE THIS WITH REAL EVENTS  
            // setEvents(events);
            setEvents([{name:"Upcoming Quiz",eventType:"New Quiz"},
            {name:"Upcoming FlashCard",eventType:"New FlashCard"}]);

            //REPLACE THIS WITH REAL OWNED FLASHCARDS
            //setOwnedFlashcards(ownedFlashcards);
            setOwnedFlashcards([{name:'card1'},
              {name:"card2"},{name:'card3'}]);

            //REPLACE THIS WITH REAL OWNED QUIZZES
            //setOwnedQuizzes(ownedQuizzes);
            setOwnedQuizzes([{name:'quiz1'},{name:'quiz2'},{name:'quiz3'}])
          })
          .catch((e) => {
            console.log(e);
            setError(e);
          })
          .finally(() => {
            setIsLoading(false);
          });
      }
    }, [user]);



    if(error){
      console.log(error);
      return(
        <>
            <head>
                <link href="//maxcdn.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css" rel="stylesheet" id="bootstrap-css"/>
                <script src="//maxcdn.bootstrapcdn.com/bootstrap/4.1.1/js/bootstrap.min.js"></script>
                <script src="//cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>      
            </head>
            <div class="container emp-profile">
                <h2>Error Fetching data in DashBoard......</h2>
            </div>
            
        </>        
      )
    }

    if(isLoading){
      return(
        <>
            <head>
                <link href="//maxcdn.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css" rel="stylesheet" id="bootstrap-css"/>
                <script src="//maxcdn.bootstrapcdn.com/bootstrap/4.1.1/js/bootstrap.min.js"></script>
                <script src="//cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>      
            </head>
            <div class="container emp-profile">
                <h2>LOADING DashBoard...</h2>
            </div>
            
        </>        
      )
    }
    //Welcome page for non logged in users
    if(!user){
      return(<WelcomePage />)
    }

  return (
    <>  
    <div class="banner animated tada">
    <div class=" big-text animated tada">95% OFF</div>
      <div>the entire store</div>
      <a href="#">Go to store</a>
    </div>    
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4}}>
            <Grid container spacing={5}>
              {/* Events */}
              <Grid item xs={12} md={8} lg={9}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 240,
                  }}
                >
                  <Events events={events}/>
                </Paper>
              </Grid>
              {/* Friends */}
              <Grid item xs={12} md={4} lg={3}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 240,
                  }}
                >
                  <Friends friends={friends}/>
                </Paper>
              </Grid>
              {/* RECENT FLASHCARDS */}
              <div className='recent-headers'>
                  Recent flashcards:
              </div>
              <Grid id='flashcard-grid' container spacing={4}>
                {ownedFlashcards.map((card,index,
                  imageLink='https://lovetoteach87.com/wp-content/uploads/2020/09/flashcards-1591812_1280-940x590.jpg') => (
                  <RecentCards key={index} card={card}/>
                ))}
              </Grid>
              {/* RECENT Quizzes */}
              <div className='recent-headers'>
                  Recent Quizzes:
              </div>       
              <Grid id='flashcard-grid' container spacing={4}>
                {ownedQuizzes.map((card,index,
                  imageLink='./DashboardUI/static/quizz-pic.webp') => (
                  <RecentCards key={index} card={card}/>
                ))}
              </Grid>                                   
            </Grid>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
    </>
  );
}  