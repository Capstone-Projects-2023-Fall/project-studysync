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
  for(let i =0; i < _friends.length;i++){
    if(_friends[i].imageURL == ''){
      _friends[i].imageURL = 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/b0b4c759-ad9c-4425-a9f4-ab89e2fd9837/de8cefl-35c0bc59-59b9-42ab-b19f-5c73828bb78e.png/v1/fit/w_512,h_512,q_70,strp/blank_youtube_profile_pic_by_redballbomb_de8cefl-375w-2x.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NTEyIiwicGF0aCI6IlwvZlwvYjBiNGM3NTktYWQ5Yy00NDI1LWE5ZjQtYWI4OWUyZmQ5ODM3XC9kZThjZWZsLTM1YzBiYzU5LTU5YjktNDJhYi1iMTlmLTVjNzM4MjhiYjc4ZS5wbmciLCJ3aWR0aCI6Ijw9NTEyIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmltYWdlLm9wZXJhdGlvbnMiXX0.hqiBNaqF1Cgdy2pNAPbUiUMF-KUtVBZkYsEKoxF3Dxc';
    }
  }

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