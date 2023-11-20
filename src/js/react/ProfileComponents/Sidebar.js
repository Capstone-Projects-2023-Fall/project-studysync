import * as React from 'react';
import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import CardMedia from '@mui/material/CardMedia';


function Sidebar(props) {
  const { archives, description, social, title,imageURL,friends,following,followers} = props;
  const friendLink = (id)=>{
    return `/profile/${id}` ;
  }


  return (
    <Grid item xs={12} md={4}>

        <CardMedia
            component="img"
            sx={{ width: 160, display: { xs: 'none', sm: 'block' } }}
            image={imageURL}
            alt="Profile image"
          />
      <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
        Friends
      </Typography>
      
      {friends.map((friend) => (
        <Link display="block" variant="body1" href={friendLink(friend.id)} key={friend.id}>
          {friend.name}
        </Link>
      ))}
      <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
        Followers
      </Typography>
      {followers.map((follower) => (
        <Link display="block" variant="body1" href={friendLink(follower.id)} key={follower.id}>
          {follower.name}
        </Link>
      ))}
      <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
        Following
      </Typography>
      {following.map((following) => (
        <Link display="block" variant="body1" href={friendLink(following.id)} key={following.id}>
          {following.name}
        </Link>
      ))}      
    </Grid>
  );
}

Sidebar.propTypes = {
  archives: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    }),
  ).isRequired,
  description: PropTypes.string.isRequired,
  social: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.elementType,
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
  title: PropTypes.string.isRequired,
};

export default Sidebar;