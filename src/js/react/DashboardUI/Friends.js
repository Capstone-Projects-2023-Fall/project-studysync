import * as React from 'react';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Title from './Title';
import { userRepository } from '../../../firebase';
import {useEffect,useState} from 'react';
import useUser from '../useUser';
import './Friends.css';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';


function preventDefault(event) {
  event.preventDefault();
}

export default function Friends(props) {
    
  const {friends} = props;
  //List only 4 friends
  const _friends = friends.slice(0,3);

  const link =(id)=>{
    return (
      `/profile/${id}`
    )
  }
  return (
    <React.Fragment>
      <Title>Friends</Title>
      <Table size='small'>
        <TableBody>
          {_friends.map((friend)=>(
            <TableRow key={friend.id}>
              <TableCell id='friend-row'>
                {friend.imageURL &&
                <img src={friend.imageURL} alt="friend-profile-picture" class="avatar"/>
                }
                <a id='Friend-link' href={link(friend.id)}>{friend.name}</a>
              </TableCell>
            </TableRow>
          ))}
      
        </TableBody>
      
      </Table>

    </React.Fragment>
  );
}