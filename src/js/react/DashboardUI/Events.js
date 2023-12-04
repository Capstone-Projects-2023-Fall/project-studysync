import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Title from './Title';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import './Events.css';

export default function Events(props) {
  let {events} = props;
  events = events.sort();

  const _events = events.slice(0,4);

  const convertToDate=(event)=>{
    let new_date = new Date(event.timestamp);
    let dateArr = new_date.toString().split(" ");
    const inputTime = dateArr[4] + " "+dateArr[5];
    // Extract hours and minutes from the input time
    const [hours, minutes] = inputTime.split(":").map(Number);

    // Create a new Date object and set hours and minutes
    const date = new Date();
    date.setUTCHours(hours);
    date.setUTCMinutes(minutes);

    // Convert to Eastern Standard Time (EST)
    const estTime = date.toLocaleTimeString("en-US", { timeZone: "America/New_York" });

    let display = dateArr[0] + " "+dateArr[1]+ " "+ dateArr[2] + 
      " "+ dateArr[3] + " " + dateArr[4]+" "+dateArr[5];
    return display;
  }

  return (
    <React.Fragment>
      <Title>Upcoming Events</Title>
      <Table size='small'>
        <TableBody>
          {_events.map((event,index)=>(
            <TableRow key={index}>
              <TableCell>{event.name}</TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell align="right">{convertToDate(event)}</TableCell>     
            </TableRow>
          ))}
      
        </TableBody>
      
      </Table>
    </React.Fragment>
  );
}