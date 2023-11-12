import * as React from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
// import MainList from './FriendsUI/MainList';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import PeopleIcon from '@mui/icons-material/People';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import { useState,useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import Title from './FriendsUI/Title';
import { userRepository } from '../../firebase';
import useUser from './useUser'; 
import { useParams } from 'react-router-dom';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="#">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const drawerWidth = 240;


const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);

const defaultTheme = createTheme();

export default function FriendsPage() {
  const {UserId } = useParams();
  const [open, setOpen] = React.useState(true);
  const [type,setType] = useState('Friends');
  const [showList,setShowList] = useState([]);
  const [isLoading,setIsLoading] = useState(false);
  const [error, setError] = useState(null)  
  // const [showFriends,setShowFriends] = useState([]);
  // const [showFollowing,setShowFollowing] = useState([]);

  useEffect(()=>{
    setIsLoading(true)
    userRepository.getFriends(UserId).then((friends)=>{
      console.log(`friends: ${friends}`);
      setShowList(friends);
      setIsLoading(false)
    }).catch((e)=>{
      setError(e);
      setIsLoading(false);
      console.log(`Error: ${e}`);
    })               
  },[])

  useEffect(()=>{
    setIsLoading(true)
    // console.log(`Changed to: ${type}`);
    if(type == "Following"){
      userRepository.getFollowing(UserId).then((_following)=>{
        setShowList(_following);
        setIsLoading(false)        
      }).catch((e)=>{
        setError(e);
        setIsLoading(false);        
        console.log(`Error: ${e}`);
      })                    
    }else if(type == "Followers"){
      userRepository.getFollowers(UserId).then((followers)=>{
        console.log(`followers: ${followers}`);
        setShowList(followers);
        setIsLoading(false)

      }).catch((e)=>{
        setError(e);
        setIsLoading(false);        
        console.log(`Error: ${e}`);
      })                    
    }else{
      userRepository.getFriends(UserId).then((friends)=>{
        console.log(`friends: ${friends}`);
        setShowList(friends);
        setIsLoading(false)
      }).catch((e)=>{
        setError(e);
        setIsLoading(false);        
        console.log(`Error: ${e}`);
      })                    
    }
  },[type])


  const toggleDrawer = () => {
    setOpen(!open);
  };

  const styles ={
    marginBottom:'10%',
  }
  const mainListItems = (

    <React.Fragment>
      <ListItemButton style={styles}>
        <ListItemIcon>
          <PeopleIcon onClick={()=>{setType('Friends')}}/>
        </ListItemIcon>
        <ListItemText primary="Friends" onClick={()=>{setType('Friends')}}/>
      </ListItemButton>
      <ListItemButton style={styles}>
        <ListItemIcon>
          <PersonAddAltIcon onClick={()=>{setType('Following')}}/>
        </ListItemIcon>
        <ListItemText primary="Following" onClick={()=>{setType('Following')}}/>
      </ListItemButton>
      <ListItemButton style={styles}>
        <ListItemIcon>
          <PeopleOutlineIcon onClick={()=>{setType('Followers')}}/>
        </ListItemIcon>
        <ListItemText primary="Followers" onClick={()=>{setType('Followers')}}/>
      </ListItemButton>
    </React.Fragment>
  );


  function MainList(props) {







    // useEffect(()=>{
    //   console.log('Changed');
    // },[props])
  
  
  
    // // let showList = friendList();
    // const {user} = useUser();
    // const {UserId} = useParams();
    // const friends = ["Sean","Jess"];
    // const following = ["Sean","Jess"];
    // const followers = ["Sean","Jess","James"];  
    
  
    // const type = props.type;
    // function showList(user){
    //   if(type == 'Following'){
    //     return followingList(user);
    //   }else if(type == 'Followers'){
    //     return followersList(user);
    //   }else{
    //     return friendList(user);
    //   }  
    // }
  
  
  
    // const styles={
    //   paddingTop: '50px',
    //   paddingBottom: '50px',
    // };
    
    // function acceptRequest(){
    //   console.log('clicked')
    // }
    // function declineRequest(){
  
    // }
    // function blockFollower(){
  
    // }
    // function removeFriend(){
  
    // }
    // function viewFollower(){
  
    // }
    // function viewFriend(){
  
    // }
    // function friendList(user){
    
    //   return(
    //     <>
    //       <TableCell>{user}</TableCell>
    //       <TableCell></TableCell>
    //       <TableCell></TableCell>
    //       <TableCell><Button onClick={()=>viewFriend()} variant="contained">View Profile</Button></TableCell>
    //       <TableCell align="right"><Button onClick={()=>removeFriend()} sx={{backgroundColor:'red'}} variant="contained">Remove friend</Button></TableCell>    
    //     </>
    //   )
    // }
    // function followingList(user){
    //   return(
    //     <>
    //       <TableCell>{user}</TableCell>
    //       <TableCell></TableCell>
    //       <TableCell></TableCell>
    //       <TableCell><Button variant="contained" onClick={()=>acceptRequest()}>Accept</Button></TableCell>
    //       <TableCell align="right"><Button onClick={()=>declineRequest()} sx={{backgroundColor:'red'}} variant="contained">Decline</Button></TableCell>    
    //     </>
    //   )
    // }
    // function followersList(user){
  
  
    //   return(
    //     <>
    //       <TableCell>{user}</TableCell>
    //       <TableCell></TableCell>
    //       <TableCell></TableCell>
    //       <TableCell><Button onClick={()=>viewFollower()} variant="contained">View Profile</Button></TableCell>
    //       <TableCell align="right"><Button onClick={()=>blockFollower()} sx={{backgroundColor:'red'}} variant="contained">Block</Button></TableCell>    
    //     </>
    //   )
    // }
    // function displayList(){
    //   if(type == 'Following'){
    //     return following;
    //   }else if(type == 'Followers'){
    //     return followers;
    //   }
    //   return friends;
    // }
  
    function tableContent(){
      console.log(`${type} list has ${showList.length} elements`);
      return(
        <>
          {showList.map((user)=>(
            <TableRow>
              <TableCell>{user.firstName}</TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell><Button  variant="contained">View Profile</Button></TableCell>
              <TableCell align="right"><Button  sx={{backgroundColor:'red'}} variant="contained">Block</Button></TableCell>                  
            </TableRow>
          ))}
           
        </>
      )      
    }
    

    if(isLoading){
      return (
          <>
              <head>
                  <link href="//maxcdn.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css" rel="stylesheet" id="bootstrap-css"/>
                  <script src="//maxcdn.bootstrapcdn.com/bootstrap/4.1.1/js/bootstrap.min.js"></script>
                  <script src="//cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>      
              </head>
              <div class="container emp-profile">
                  <h2>LOADING {type}...</h2>
              </div>
              
          </>
      )
    }

    if(error){
      return(
          <>
              <head>
                  <link href="//maxcdn.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css" rel="stylesheet" id="bootstrap-css"/>
                  <script src="//maxcdn.bootstrapcdn.com/bootstrap/4.1.1/js/bootstrap.min.js"></script>
                  <script src="//cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>      
              </head>
              <div class="container emp-profile">
                  <h2>ERROR LOADING {type}...</h2>
              </div>
              
          </>
      )
    }    

    return (
      <React.Fragment>
        <Title> {type}
          </Title>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody >
            {/* {displayList().map((user,index) => (
              <TableRow key={index}>
                {showList(user)}
              </TableRow>
            ))} */}
            {tableContent()}
          </TableBody>
        </Table>
  
      </React.Fragment>
    );
  }





  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />

        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
            {mainListItems}
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>

              <Grid item xs={12}>
                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                  {/* <MainList type={type}/> */}
                  {MainList()}
                </Paper>
              </Grid>
            </Grid>
            <Copyright sx={{ pt: 4 }} />
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}