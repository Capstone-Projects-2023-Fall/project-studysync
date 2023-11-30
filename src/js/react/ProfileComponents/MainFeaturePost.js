import * as React from 'react';
import PropTypes from 'prop-types';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import useUser from '../useUser';
import { useParams } from 'react-router-dom';
import { userRepository } from '../../../firebase';
import './ProfileStyles.css';
import { Button } from '@mui/material';
import { useEffect ,useState} from 'react';

function MainFeaturedPost(props) {
    const { post ,edit,setEdit} = props;
    const {user} = useUser();
    const {UserId} = useParams();
    const [btn,setBtn] = useState('');
    const [name,SetName] = useState('');
    const [profession,setProfession] = useState('');
    const [firstName,setFirstName] = useState('');
    const [lastName,setLastName] = useState('');


    useEffect(()=>{
      setBtn('edit');
      setFirstName(post.firstName);
      setLastName(post.lastName);
      setProfession(post.profession);
    },[])

    useEffect(()=>{
      if(btn == 'edit'){
        setBtn('save');
      }else{
        setBtn('edit');
      }
      
    },[edit])

    function editBtn(){
      if(edit == false){
        setEdit(true)
      }else{
        if(firstName == '' && lastName == ''){
          alert('Both name fields are empty !');
          return;
        }
        userRepository.saveUserProfile(UserId,{firstName:firstName,
          profession: profession,lastName: lastName}).then(()=>{
            console.log('Saved information to the database.')
            }).catch(()=>{
              console.log('Error in saving data in header.')
            })
        setEdit(false)
      }
    }
    
    const nameText = ()=>{

      if(btn == 'edit'){
        return(
          <Typography component="h1" variant="h3" color="inherit" gutterBottom>
            {`${firstName} ${lastName}`}
          </Typography>
        )
      }else{
        return(
          <>
            <Typography component="h1" variant="h3" color="inherit" gutterBottom>
              <div className='MainFeature'>
                <label className='name-label'>Enter first name</label>
                <input className='nameInput' type="text"  placeholder='Your name' 
                  value={firstName} onChange={(e)=>setFirstName(e.target.value)}/>
              </div>
            </Typography>
            <Typography component="h1" variant="h3" color="inherit" gutterBottom>
            <div className='MainFeature2'>
                <label className='name-label'>Enter last name</label>
                <input className='nameInput' type="text"  placeholder='Your name' 
                  value={lastName} onChange={(e)=>setLastName(e.target.value)}/>
              </div>            
            </Typography>
        </>
        )
      }
    }
    const professionText=()=>{
      if(btn == 'edit'){
        return(
          <>{profession}</>
        )
      }else{
        return(
          <div >
          <label className='profession-label'>Enter profession</label>
          <input className='professionInput' type="text"  placeholder='Student'
            value={profession} onChange={(e)=> setProfession(e.target.value)}/>
          </div>
        )
      }
    }

  return (

    
    <Paper
      sx={{
        position: 'relative',
        backgroundColor: 'grey.800',
        color: '#fff',
        mb: 4,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundImage: `url(${post.image})`,
      }}
    >
      {<img style={{ display: 'none' }} src={post.image} alt={post.imageText} />}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          right: 0,
          left: 0,
          backgroundColor: 'rgba(0,0,0,.3)',
        }}
      />
      <Grid container>
        <Grid item md={6}>
          <Box
            sx={{
              position: 'relative',
              p: { xs: 3, md: 6 },
              pr: { md: 0 },
            }}
          >
              {nameText()}
            <Typography variant="h5" color="inherit" paragraph>
              {professionText()}
            </Typography>        
            {(user && user.uid == UserId) && <Button variant="contained" href="#contained-buttons" onClick={()=> editBtn()}>
              {btn}
            </Button>}
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}

MainFeaturedPost.propTypes = {
  post: PropTypes.shape({
    description: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    imageText: PropTypes.string.isRequired,
    linkText: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
};

export default MainFeaturedPost;