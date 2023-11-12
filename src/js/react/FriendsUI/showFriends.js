import * as React from 'react';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import Title from './Title';
import { userRepository } from '../../../firebase';
import useUser from '../useUser';
import { useParams } from 'react-router-dom';
import { useEffect,useState  } from 'react';


export default function showFriends(props) {


    const [_friends, setFriends] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const {UserId} = useParams();
    const [error, setError] = useState(null)
  
    const type = props.type;

    useEffect(()=>{
        //while awaiting database response, display some loading indication
        setIsLoading(true)
        //fetch and set user profile upon page load
        userRepository.getFriends(UserId).then((friends)=>{
            console.log("printing friends")
            console.log(friends)
            setFriends(friends)
            setIsLoading(false)
        }).catch((error)=>{
            //handle the error in the ui
            setError(error)
            setIsLoading(false)
            console.log(error)
        })
      }, [])
    
      if(isLoading){
        return (
            <>
                <head>
                    <link href="//maxcdn.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css" rel="stylesheet" id="bootstrap-css"/>
                    <script src="//maxcdn.bootstrapcdn.com/bootstrap/4.1.1/js/bootstrap.min.js"></script>
                    <script src="//cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>      
                </head>
                <div class="container emp-profile">
                    <h2>LOADING friends' List...</h2>
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
                    <h2>ERROR LOADING Friends...</h2>
                </div>
                
            </>
        )
      }


    function removeFriend(){
  
    }

    function viewFriend(){
  
    }
    function friendList(friend){
    
      return(
        <>
          <TableCell>Friend name</TableCell>
          <TableCell></TableCell>
          <TableCell></TableCell>
          <TableCell><Button onClick={()=>viewFriend()} variant="contained">View Profile</Button></TableCell>
          <TableCell align="right"><Button onClick={()=>removeFriend()} sx={{backgroundColor:'red'}} variant="contained">Remove friend</Button></TableCell>    
        </>
      )
    }
  
    
    return (
      <React.Fragment>
        <Title>{props.type}</Title>
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
            {_friends.map((friend,index) => (
              <TableRow key={index}>
                {friendList(friend)}
              </TableRow>
            ))}
          </TableBody>
        </Table>
  
      </React.Fragment>
    );
  }