import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {useState } from 'react';
import { useNavigate } from "react-router-dom";
import {createUserWithEmailAndPassword,signInWithEmailAndPassword} from 'firebase/auth';
import { auth } from '../../firebase';

import { getFirestore, doc, setDoc } from 'firebase/firestore';

import { userRepository } from '../../firebase';



function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="/">
        StudySync
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

const SignUpForm = ()=> {

  const [_firstName, setFirstName] = useState('');  
  const [_lastName, setLastName] = useState(''); 
  const [_email,setEmail] = useState('');
  const [_password,setPassword] = useState('');
  const [_confirmPassword,setconfirmPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async(event) => {
    event.preventDefault();

      if(_email == '' || _password == '' || _confirmPassword == ''){
        alert('One or both of the fields are empty!');
        return;
      }
      if(_password != _confirmPassword){
        alert('Passwords do not match!');
        return;
      }
        try{
          const {user} = await createUserWithEmailAndPassword(auth,_email,_password);
          if(user != null){
            await userRepository.addUser(_email, "default-username", _firstName, _lastName, user.uid)
          }
          navigate('/');
      }catch(e){
          // setError(e.message);
          // alert(e.message);
          if(e.message == "Firebase: Error (auth/email-already-in-use)."){
            alert("Email already in use!");
          }
      }

  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: 'url(https://source.unsplash.com/random?wallpapers)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign up
            </Typography>
            
                <TextField
                margin="normal"
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                  value={_firstName}
                   onChange={e => setFirstName(e.target.value)}
                />
              
                <TextField
                margin="normal"
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                  value={_lastName}
                  onChange={e => setLastName(e.target.value)}
                />
             
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                value={_email}
                onChange={(e)=>setEmail(e.target.value)}
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
              />
              <TextField
                margin="normal"

                value={_password}
                onChange={(e)=>setPassword(e.target.value)}

                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
                <TextField
                margin="normal"

                value={_confirmPassword}
                onChange={(e)=>setconfirmPassword(e.target.value)}

                required
                fullWidth
                name="confirmpassword"
                label="re-enter password"
                type="password"
                id="confirmpassword"
                autoComplete="current-password"
              />              

              <Button
                onClick={handleSubmit}
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign Up
              </Button>
              <Grid container>

                <Grid item>
                  <Link href="/login" variant="body2">
                    {"Already have an account?"}
                  </Link>
                </Grid>
              </Grid>
              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

export default SignUpForm;