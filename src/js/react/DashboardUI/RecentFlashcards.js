import * as React from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';

function RecentFlashcards(props) {
  const { card } = props;


  return (
    <Grid item xs={12} md={6}>
      <CardActionArea component="a" href='#'>
        <Card sx={{ display: 'flex' }}>
          <CardContent sx={{ flex: 1 }}>
            <Typography component="h2" variant="h5">
              Title
            </Typography>
            <Typography variant="subtitle1" paragraph>
              description
            </Typography>
          </CardContent>
          <CardMedia
            component="img"
            sx={{ width: 160, display: { xs: 'none', sm: 'block' } }}
            image='https://source.unsplash.com/random?wallpapers'
            alt='flashcards-pictures'
          />
        </Card>
      </CardActionArea>
    </Grid>
  );
}

RecentFlashcards.propTypes = {
  post: PropTypes.shape({
    date: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    imageLabel: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
};

export default RecentFlashcards;
