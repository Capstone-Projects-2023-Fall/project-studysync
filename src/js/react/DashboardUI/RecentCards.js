import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Lottie from 'react-lottie-player';

function RecentCards(props) {
  const { card, lottieAnimation, cardLink } = props;

  return (
    <Grid item xs={12} md={4}>
      <CardActionArea component="a" href={cardLink}>
        <Card sx={{ display: 'flex' }}>
          <CardContent sx={{ flex: 1 }}>
            <Typography component="h2" variant="h5" className='cards'>
              {card.name.substring(0, 14)}
            </Typography>
            <Typography variant="subtitle1" paragraph>
            
            </Typography>
          </CardContent>
         
          {lottieAnimation && (
            <Lottie
              loop
              animationData={lottieAnimation}
              play
              style={{ width: 160, height: 160 }}
            />
          )}
        </Card>
      </CardActionArea>
    </Grid>
  );
}

RecentCards.propTypes = {
  card: PropTypes.object.isRequired,
  lottieAnimation: PropTypes.object, // Lottie animation data
  cardLink: PropTypes.string.isRequired,
};

export default RecentCards;
