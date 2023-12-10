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
import { useEffect,useState } from 'react';
import './ProfileStyles.css';
import { userRepository } from '../../../firebase';
import pfp from '../static/defaultPfp.jpg'


function Sidebar(props) {
  const { imageURL,friends,following,followers} = props;
  const {user} = useUser();
  const {UserId} = useParams();
  const [changeImage,setChangeImage] = useState(false);
  const [image,setImage] = useState('');
  useEffect(()=>{
      setImage(imageURL);
    
  },[])


  const friendLink = (id)=>{
    return `/profile/${id}` ;
  }
  function saveImage(){
    if(image == ''){
      setImage(pfp)
    }
    userRepository.saveUserProfile(UserId,{imageURL:image}).then(()=>{
      console.log('Saved image URL to database.')
    })
    setChangeImage(false);
  }

  const imageBtn= ()=>{
    if(user && user.uid == UserId){
      if(changeImage == false){
        return(
          <Button variant="contained" href="#contained-buttons" 
            onClick={()=>setChangeImage(true)}>
            Change Image
          </Button>      
        )      
      }else{
        return(
          <>
            <input className='imageLinkInput' type="text"  placeholder='Enter image link here'
            value={image} onChange={(e)=> setImage(e.target.value)}/>
            <Button variant="contained" href="#contained-buttons" 
              onClick={()=>saveImage()}>
              Save Image Link
            </Button>      
          </>
        )             
      }  
    }
  }
  return (
    <Grid item xs={12} md={4} className="profile-sidebar" >

      <CardMedia
          className='image-card'
          component="img"
          sx={{ width: 160, display: { xs: 'none', sm: 'block' } }}
          image={image}
          alt="Profile image"
        />
      <div className='profile-image'>{imageBtn()}</div>        
      <Typography variant="h6" gutterBottom sx={{ mt: 3 ,ml:6}} className='socials-list'>
        Friends
      </Typography>
      
      {friends.map((friend) => (
        <Link  sx={{mt:1, ml:6}} className='socials-list' display="block" variant="body1" href={friendLink(friend.id)} key={friend.id}>
          {friend.name}
        </Link>
      ))}
      <Typography  className='socials-list' variant="h6" gutterBottom sx={{ mt: 3 , ml:6 }}>
        Followers
      </Typography>
      {followers.map((follower) => (
        <Link sx={{mt:1,ml:6}} className='socials-list' display="block" variant="body1" href={friendLink(follower.id)} key={follower.id}>
          {follower.name}
        </Link>
      ))}
      <Typography  className='socials-list' variant="h6" gutterBottom sx={{ mt: 3,ml:6 }}>
        Following
      </Typography>
      {following.map((following) => (
        <Link sx={{ mt:1,ml:6}} className='socials-list' display="block" variant="body1" href={friendLink(following.id)} key={following.id}>
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