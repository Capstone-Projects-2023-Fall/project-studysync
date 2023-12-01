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
function Sidebar(props) {
  const { archives, description, social, title,imageURL,friends,following,followers} = props;
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
      setImage('https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/b0b4c759-ad9c-4425-a9f4-ab89e2fd9837/de8cefl-35c0bc59-59b9-42ab-b19f-5c73828bb78e.png/v1/fit/w_512,h_512,q_70,strp/blank_youtube_profile_pic_by_redballbomb_de8cefl-375w-2x.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NTEyIiwicGF0aCI6IlwvZlwvYjBiNGM3NTktYWQ5Yy00NDI1LWE5ZjQtYWI4OWUyZmQ5ODM3XC9kZThjZWZsLTM1YzBiYzU5LTU5YjktNDJhYi1iMTlmLTVjNzM4MjhiYjc4ZS5wbmciLCJ3aWR0aCI6Ijw9NTEyIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmltYWdlLm9wZXJhdGlvbnMiXX0.hqiBNaqF1Cgdy2pNAPbUiUMF-KUtVBZkYsEKoxF3Dxc')
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
    <Grid item xs={12} md={4}>

      <CardMedia
          className='image-card'
          component="img"
          sx={{ width: 160, display: { xs: 'none', sm: 'block' } }}
          image={image}
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