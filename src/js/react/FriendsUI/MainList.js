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
import { useEffect } from 'react';


const friends = ["Sean","Jess"];
const following = ["Sean","Jess"];
const followers = ["Sean","Jess","James"];



export default function MainList(props) {

  useEffect(()=>{
    console.log('Changed');
  },[props])



  // let showList = friendList();
  const {user} = useUser();
  const {UserId} = useParams();

  

  const type = props.type;
  function showList(user){
    if(type == 'Following'){
      return followingList(user);
    }else if(type == 'Followers'){
      return followersList(user);
    }else{
      return friendList(user);
    }  
  }



  const styles={
    paddingTop: '50px',
    paddingBottom: '50px',
  };
  
  function acceptRequest(){
    console.log('clicked')
  }
  function declineRequest(){

  }
  function blockFollower(){

  }
  function removeFriend(){

  }
  function viewFollower(){

  }
  function viewFriend(){

  }
  function friendList(user){
  
    return(
      <>
        <TableCell>{user}</TableCell>
        <TableCell></TableCell>
        <TableCell></TableCell>
        <TableCell><Button onClick={()=>viewFriend()} variant="contained">View Profile</Button></TableCell>
        <TableCell align="right"><Button onClick={()=>removeFriend()} sx={{backgroundColor:'red'}} variant="contained">Remove friend</Button></TableCell>    
      </>
    )
  }
  function followingList(user){
    return(
      <>
        <TableCell>{user}</TableCell>
        <TableCell></TableCell>
        <TableCell></TableCell>
        <TableCell><Button variant="contained" onClick={()=>acceptRequest()}>Accept</Button></TableCell>
        <TableCell align="right"><Button onClick={()=>declineRequest()} sx={{backgroundColor:'red'}} variant="contained">Decline</Button></TableCell>    
      </>
    )
  }
  function followersList(user){


    return(
      <>
        <TableCell>{user}</TableCell>
        <TableCell></TableCell>
        <TableCell></TableCell>
        <TableCell><Button onClick={()=>viewFollower()} variant="contained">View Profile</Button></TableCell>
        <TableCell align="right"><Button onClick={()=>blockFollower()} sx={{backgroundColor:'red'}} variant="contained">Block</Button></TableCell>    
      </>
    )
  }
  function displayList(){
    if(type == 'Following'){
      return following;
    }else if(type == 'Followers'){
      return followers;
    }
    return friends;
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
          {displayList().map((user,index) => (
            <TableRow key={index}>
              {showList(user)}
            </TableRow>
          ))}
        </TableBody>
      </Table>

    </React.Fragment>
  );
}