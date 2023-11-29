import * as React from 'react';
import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import './ProfileStyles.css';
import useUser from '../useUser';
import { useState,useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@mui/material';
import { userRepository } from '../../../firebase';

function Main(props) {
  const { userDescription, title, flag } = props;
  const {user} = useUser();
  const {UserId} = useParams(); 
  const [edit,setEdit] = useState(false);
  const [_bio,setBio] = useState('');
  const [_email,setEmail] = useState('');
  const [_phone,setPhone] = useState('');
  const [btn,setBtn] = useState('');
  
  useEffect(()=>{
    setBtn('Edit Description');
    setBio(userDescription.bio);
    setEmail(userDescription.email);
    setPhone(userDescription.phone);
  },[])

  useEffect(()=>{
    if(btn == 'Edit Description'){
      setBtn('save');
    }else{
      setBtn('Edit Description');
    }
  },[edit])

  function editBtn(){
    if(edit == false){
      setEdit(true)
    }else{
      userRepository.saveUserProfile(UserId,{bio:_bio,phone: _phone}).then(()=>{
          console.log('Saved information to the database.')
          }).catch(()=>{
            console.log('Error in saving data in Main Section.')
          })      
      setEdit(false)
    }
  }
  const bioText=()=>{
    if(btn == 'Edit Description'){
      return(
        <div className='bio'>Bio: {_bio}</div>
      )
    }else{
      return(
        <div >
        Bio:
        <input className='bioInput' type="text"  placeholder='bio'
          value={_bio} onChange={(e)=> setBio(e.target.value)}/>
        </div>
      )
    }
  }

  const phoneText=()=>{
    if(btn == 'Edit Description'){
      return(
        <div className='phone'>Phone: {_phone}</div>
      )
    }else{
      return(
        <div className='phoneEdit'>
          Phone:
        <input className='phoneInput' type="text"  placeholder='123-123-1234'
          value={_phone} onChange={(e)=> setPhone(e.target.value)}/>
        </div>
      )
    }
  } 


  return (
    <Grid
      item
      xs={12}
      md={8}
      sx={{
        '& .markdown': {
          py: 3,
        },
      }}
    >
      <Typography variant="h6" gutterBottom >
        <div>{title}</div>
        <div className='description-btn'>         
   
          {(user && user.uid == UserId) && <Button variant="contained" href="#contained-buttons" onClick={()=> editBtn()}>
              {btn}
          </Button>}
        </div>
      </Typography>
      <Divider />
      <div className='user-about'>
        {bioText()}
        {userDescription.email && <div className='email'>Email: {userDescription.email}</div>}
        {phoneText()}
      </div>
      
    </Grid>
  );
}

Main.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.string).isRequired,
  title: PropTypes.string.isRequired,
};

export default Main;