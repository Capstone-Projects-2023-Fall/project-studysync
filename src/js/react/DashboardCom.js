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
import { useState, useEffect } from 'react';
import { userRepository } from '../../firebase';
import RecentCards from './DashboardUI/RecentCards';
import './DashboardUI/RecentFlash.css';
import './DashboardUI/Dashboard.css';
import { useNavigate } from 'react-router-dom';
import FlashcardRepo from '../repositories/FlashcardRepo';
// import Lottie from "react-lottie-player";

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

  const { user } = useUser();
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [friends, setFriends] = useState([]);
  const [events, setEvents] = useState([]);
  const [ownedFlashcards, setOwnedFlashcards] = useState([]);
  const [ownedQuizzes, setOwnedQuizzes] = useState([]);
  const [lottieAnimation1, setLottieAnimation1] = useState(null);
  const [lottieAnimation2, setLottieAnimation2] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {

    fetch(
      " https://lottie.host/8c32c3eb-15d3-4936-89b6-53f877c19f3d/INgllsQVvi.json"
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("Animation data:", data);
        setLottieAnimation1(data);
      });

    fetch(
      " https://lottie.host/89c7c698-4d86-4bda-a24d-0b0867cbdc7f/r5aaMdEQgM.json"
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("Animation data:", data);
        setLottieAnimation2(data);
      });

    if (user) {
      setIsLoading(true);


      Promise.all([
        userRepository.getFriends(user.uid),
        userRepository.getUpcomingEvents(user.uid),
        userRepository.getOwnedFlashcards(user.uid),

        userRepository.getOwnedQuizzes(user.uid).then(async (quizzes) => {
          return await Promise.all(quizzes.map(async (quiz) => {
            const setId = await FlashcardRepo.getSetIdByQuizId(quiz.id);
            return { ...quiz, setId };
          }));
        }),
      ])
        .then(([friends, events, ownedFlashcards, enrichedQuizzes]) => {

          setFriends(friends);
          setEvents(events);
          setOwnedFlashcards(ownedFlashcards);
          setOwnedQuizzes(enrichedQuizzes);
        })
        .catch((e) => {
          console.error(e);
          setError(e);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }

  }, [user]);



  if (error) {
    console.log(error);
    return (
      <>
        <head>
          <link href="//maxcdn.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css" rel="stylesheet" id="bootstrap-css" />
          <script src="//maxcdn.bootstrapcdn.com/bootstrap/4.1.1/js/bootstrap.min.js"></script>
          <script src="//cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
        </head>
        <div class="container emp-profile">
          <h2>Error Fetching data in DashBoard......</h2>
        </div>

      </>
    )
  }

  if (isLoading) {
    return (
      <>
        <head>
          <link href="//maxcdn.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css" rel="stylesheet" id="bootstrap-css" />
          <script src="//maxcdn.bootstrapcdn.com/bootstrap/4.1.1/js/bootstrap.min.js"></script>
          <script src="//cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
        </head>
        <div class="container emp-profile">
          <h2>LOADING DashBoard...</h2>
        </div>

      </>
    )
  }


  return (
    <>
      <div class="banner animated tada">
        <div class=" big-text animated tada">StudySync - Your Ultimate Studying Companion!
        </div>

        <a id='banner-link' onClick={() => navigate('/flashcard')}>Get Started !</a>
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
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
              <Grid container spacing={5}>
                {/* Events */}
                <Grid item xs={12} md={8} lg={9} className='eventgrid'>
                  <Paper
                    sx={{
                      p: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      height: 240,
                    }}
                  >
                    <Events events={events} />
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
                    <Friends friends={friends} />
                  </Paper>
                </Grid>
                {/* RECENT FLASHCARDS */}
                <div className='recent-headers'>
                  Recent flashcards:
                </div>
                <Grid id='flashcard-grid' container spacing={4}>
                  {ownedFlashcards ? ownedFlashcards.map((card, index) => (
                    <RecentCards key={index} card={card}
                      lottieAnimation={lottieAnimation1}
                      cardLink={`/flashcard-ui/${card.id}`} />
                  )) : <a href='/flashcard' className='EmptyCards'>No flashcards? Create flashcards to study your topics here!</a>}
                </Grid>
                {/* RECENT Quizzes */}
                <div className='recent-headers'>
                  Recent Quizzes:
                </div>
                <Grid id='flashcard-grid' container spacing={4}>
                  {ownedQuizzes ?
                    ownedQuizzes.map((card, index) => (
                      <RecentCards
                        key={index}
                        card={card}
                        lottieAnimation={lottieAnimation2}
                        cardLink={`/quizFlash/${card.setId}/quiz/${card.id}`}
                      />
                    )) : <a href={`/mysets/${user && user.uid}`}>No quizzes? Get started here!</a>
                  }
                </Grid>
              </Grid>
            </Container>
          </Box>
        </Box>
      </ThemeProvider>
    </>
  );
}  