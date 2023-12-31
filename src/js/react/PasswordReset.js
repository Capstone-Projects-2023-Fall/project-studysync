import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase';
import { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';

const defaultTheme = createTheme();

const PasswordReset =() => {

    const [email,setEmail] = useState('');

    const navigate = useNavigate();

  const sendEmail = (event) => {
    event.preventDefault();




    sendPasswordResetEmail(auth,email)
        .then(()=>{
            alert('Password reset email sent!');
            navigate('/login');
        })
        .catch((error)=>{
            alert(`Error: ${error.message}`);
        })
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Reset Password
          </Typography>
          <Box component="form"  noValidate sx={{ mt: 1 }}>
            <TextField
              value={email}
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
            <Button
              onClick={sendEmail}
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}>
              Reset Password
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="/login" variant="body2">
                  Back to Login
                </Link>
              </Grid>

            </Grid>
          </Box>
        </Box>
        <div className='passwordreset-description' 
        style={{marginTop:'50px',color:'grey'}}>
            Please enter your email to reset your password.
        </div>
      </Container>
    </ThemeProvider>
  );
}
export default PasswordReset;