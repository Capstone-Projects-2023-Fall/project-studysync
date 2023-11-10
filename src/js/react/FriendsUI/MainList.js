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


export function createData(id, date, name, shipTo, paymentMethod, amount) {
  return { id, date, name, shipTo, paymentMethod, amount };
}

export const rows = [
  createData(
    0,
    '16 Mar, 2019',
    'Elvis Presley',
    'Tupelo, MS',
    'VISA ⠀•••• 3719',
    312.44,
  ),
  createData(
    1,
    '16 Mar, 2019',
    'Paul McCartney',
    'London, UK',
    'VISA ⠀•••• 2574',
    866.99,
  ),
  createData(2, '16 Mar, 2019', 'Tom Scholz', 'Boston, MA', 'MC ⠀•••• 1253', 100.81),
  createData(
    3,
    '16 Mar, 2019',
    'Michael Jackson',
    'Gary, IN',
    'AMEX ⠀•••• 2000',
    654.39,
  ),
  createData(
    4,
    '15 Mar, 2019',
    'Bruce Springsteen',
    'Long Branch, NJ',
    'VISA ⠀•••• 5919',
    212.79,
  ),
];


export default function MainList(props) {


  let showList = friendList();
  const {user} = useUser();
  const {UserId} = useParams();

  

  const type = props.type;
  if(type == 'Friends'){
    showList = friendList();
  }else if(type == 'Friend Requests'){
    showList = requestList();
  }else{
    showList = followersList();
  }  

  // useEffect(()=>{
  //   console.log(UserId);
  // },[props])

  // useEffect(()=>{
  //   userRepository.getFollowers(UserId).then((followers)=>{
  //     console.log(`Printing followers......`);
  //     console.log(followers);
  //   }).catch((e)=>{
  //     console.log(e);
  //   })      
  // },[])

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
  function friendList(){
  
    //get All the friends 
    // userRepository.getFriends();
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
  function requestList(){
    return(
      <>
        <TableCell>Request from: bob</TableCell>
        <TableCell></TableCell>
        <TableCell></TableCell>
        <TableCell><Button variant="contained" onClick={()=>acceptRequest()}>Accept</Button></TableCell>
        <TableCell align="right"><Button onClick={()=>declineRequest()} sx={{backgroundColor:'red'}} variant="contained">Decline</Button></TableCell>    
      </>
    )
  }
  function followersList(){
  



    return(
      <>
        <TableCell>Follwer</TableCell>
        <TableCell></TableCell>
        <TableCell></TableCell>
        <TableCell><Button onClick={()=>viewFollower()} variant="contained">View Profile</Button></TableCell>
        <TableCell align="right"><Button onClick={()=>blockFollower()} sx={{backgroundColor:'red'}} variant="contained">Block</Button></TableCell>    
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
          {rows.map((row) => (
            <TableRow key={row.id}>
              {showList}
            </TableRow>
          ))}
        </TableBody>
      </Table>

    </React.Fragment>
  );
}