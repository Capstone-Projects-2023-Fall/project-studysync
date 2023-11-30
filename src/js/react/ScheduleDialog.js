import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CloseIcon from "@mui/icons-material/Close";

export default function ScheduleDialog({ open, onClose, onSchedule }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('');

  const handleDateChange = (e) => {
    setSelectedDate(new Date(e.target.value));
  };

  const handleTimeChange = (e) => {
    setSelectedTime(e.target.value);
  };

  const handleClose = () => {
    setSelectedDate(new Date());
    setSelectedTime('');
    onClose();
  };

  const handleSchedule = () => {
    onSchedule(selectedDate, selectedTime);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs" onClick={(e)=>{ e.stopPropagation()}}>
      <DialogContent>
      <Button
                    onClick={handleClose}
                    color="primary"
                    style={{ position: "absolute", top: "8px", right: "8px" }} // Position the close button
                    >
                    <CloseIcon /> {/* Add a CloseIcon from Material-UI */}
                    </Button>
        <TextField
          type="date"
          label="Select Date"
          value={selectedDate.toISOString().split('T')[0]}
          onChange={handleDateChange}
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          type="time"
          label="Select Time"
          value={selectedTime}
          onChange={handleTimeChange}
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
        />
        <Button variant="contained" color="primary" onClick={handleSchedule}>
          Schedule
        </Button>
      </DialogContent>
    </Dialog>
  );
}