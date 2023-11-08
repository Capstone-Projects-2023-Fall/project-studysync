import * as React from 'react';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import Title from './Title';

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

const styles={
  paddingTop: '50px',
  paddingBottom: '50px',
};


function friendList(){
  return(
    <>
      <TableCell>Friend name</TableCell>
      <TableCell></TableCell>
      <TableCell></TableCell>
      <TableCell><Button variant="contained">View Profile</Button></TableCell>
      <TableCell align="right"><Button sx={{backgroundColor:'red'}} variant="contained">Remove friend</Button></TableCell>    
    </>
  )
}
function requestList(){
  return(
    <>
      <TableCell>Request from: bob</TableCell>
      <TableCell></TableCell>
      <TableCell></TableCell>
      <TableCell><Button variant="contained">Accept</Button></TableCell>
      <TableCell align="right"><Button sx={{backgroundColor:'red'}} variant="contained">Decline</Button></TableCell>    
    </>
  )
}
function followersList(){
  return(
    <>
      <TableCell>Follwer</TableCell>
      <TableCell></TableCell>
      <TableCell></TableCell>
      <TableCell><Button variant="contained">View Profile</Button></TableCell>
      <TableCell align="right"><Button sx={{backgroundColor:'red'}} variant="contained">Block</Button></TableCell>    
    </>
  )
}
// function showList(type){
//   if(type == 'friends'){
//     return friendList;
//   }else if(type == 'requests'){
//     return requestList;
//   }else{
//     return followersList;
//   }
// }
export default function MainList(props) {
  let showList = friendList();
  const type = props.type;
  if(type == 'friends'){
    showList = friendList();
  }else if(type == 'requests'){
    showList = requestList();
  }else{
    showList = followersList();
  }

  return (
    <React.Fragment>
      <Title>Friends type: {props.type}</Title>
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