import * as React from 'react';
import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import CardMedia from '@mui/material/CardMedia';
import { Button } from '@mui/material';
import useUser from '../useUser';
import { useParams } from 'react-router-dom';
import './ProfileStyles.css';

function Sidebar(props) {
  const { archives, description, social, title,imageURL,friends,following,followers} = props;
  const {user} = useUser();
  const {UserId} = useParams();

  const friendLink = (id)=>{
    return `/profile/${id}` ;
  }

  const imageBtn= ()=>{
    if(user && user.uid == UserId){
      return(
        <Button variant="contained" href="#contained-buttons"  >
          Change Image
        </Button>      
      )      
    }
  }


  return (
    <Grid item xs={12} md={4}>

      <CardMedia
          component="img"
          sx={{ width: 160, display: { xs: 'none', sm: 'block' } }}
          image={imageURL}
          alt="Profile image"
        />
      <div className='profile-image'>{imageBtn()}</div>        
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