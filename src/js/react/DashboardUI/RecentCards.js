import * as React from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';

function RecentCards(props) {
  const { card,imageLink ,cardLink} = props;



  return (
    <Grid item xs={12} md={4}>
      <CardActionArea component="a" href={cardLink}>
        <Card sx={{ display: 'flex' }}>
          <CardContent sx={{ flex: 1 }}>
            <Typography component="h2" variant="h5" className='cards'>
              {card.name.substring(0,14)}
            </Typography>
            <Typography variant="subtitle1" paragraph>
            </Typography>
          </CardContent>
          <CardMedia
            component="img"
            sx={{ width: 160, display: { xs: 'none', sm: 'block' } }}
            image={imageLink}
            alt='Recent cards Pictures'
          />
        </Card>
      </CardActionArea>
    </Grid>
  );
}

RecentCards.propTypes = {
  post: PropTypes.shape({
    date: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    imageLabel: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
};

export default RecentCards;
