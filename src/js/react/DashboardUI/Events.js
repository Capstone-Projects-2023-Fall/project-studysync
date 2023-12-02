import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Title from './Title';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import './Events.css';
import { userRepository } from '../../../firebase';

export default function Events(props) {
  const {events} = props;
  const _events = events.slice(0,4);


  return (
    <React.Fragment>
      <Title>Upcoming Events</Title>
      <Table size='small'>
        <TableBody>
          {_events.map((event,index)=>(
            <TableRow key={index}>
              <TableCell>{event}</TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell align="right">{event}</TableCell>     
            </TableRow>
          ))}
      
        </TableBody>
      
      </Table>
    </React.Fragment>
  );
}