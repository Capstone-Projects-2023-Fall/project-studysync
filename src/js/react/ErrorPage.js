import React from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';

export default function ErrorPage(props){

    const {code } = props;
    const navigate = useNavigate();

    let error_message = '';
    if (code == "401"){
        error_message = "Invalid Access"
    }
    return (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh'
          }}
        >
          <Container maxWidth="md">
            <Grid container spacing={2}>
              <Grid xs={6}>
                <Typography variant="h1">
                  {code}
                </Typography>
                <Typography variant="h6">
                  {error_message}
                </Typography>
                <Button variant="contained" onClick={()=>{navigate('/')}}>Back Home</Button>
              </Grid>
              <Grid xs={6}>
                <img
                  src="https://cdn.pixabay.com/photo/2017/03/09/12/31/error-2129569__340.jpg"
                  alt=""
                  width={500} height={250}
                />
              </Grid>
            </Grid>
          </Container>
        </Box>
      );
}