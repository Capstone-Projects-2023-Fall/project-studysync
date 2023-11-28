import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Title from './Title';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';


export default function Events(props) {
  const {events} = props;
  const _events = events.slice(0,4);
  const theme = useTheme();

  return (
    <React.Fragment>
      <Title>Events</Title>
      <Table size='small'>
        <TableBody>
          {_events.map((event)=>(
            <TableRow key={event.id}>
              <TableCell>{event.name}</TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell align="right">{event.eventType}</TableCell>     
            </TableRow>
          ))}
      
        </TableBody>
      
      </Table>
    </React.Fragment>
  );
}