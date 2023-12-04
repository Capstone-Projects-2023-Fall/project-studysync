import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import React, { useState } from "react";

import {
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  Button,
} from "@mui/material";
import { eventRepository, userRepository } from "../../firebase";
import { useNavigate } from "react-router-dom";

const eventCardStyles = {
  titleBar: {
    backgroundColor: "#4b9cd3",
    color: "white",
    padding: "5px 10px",
    borderRadius: "4px",
    fontWeight: "bold",
    marginBottom: "10px", // add space below the title bar
  },
  button: {
    borderRadius: "10px", // This gives a pill-like shape, adjust as needed
    textTransform: "none",
    fontWeight: "bold", // Make the text inside the button bold
    padding: "8px 16px", // Adjust padding to match your design
    color: "white", // Text color inside the button
    display: "flex", // To align icon and text
    alignItems: "center", // Center them vertically
    justifyContent: "center", // Center them horizontally
    gap: "8px", // Adjust the space between the icon and text
  },
  cardStyle: {
    backgroundColor: "#ffffff", // pure white background for the card
    borderRadius: "8px",
    padding: "10px",
    margin: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.12), 0 6px 20px rgba(0, 0, 0, 0.08)", // enhanced shadow for depth
    transition: "box-shadow 0.3s",
    width: "100%", // take up 80% of the page width
    // maxWidth: "800px", // maximum width of the card
    cursor: "pointer",
    "&:hover": {
      boxShadow:
        "0 8px 16px rgba(0, 0, 0, 0.16), 0 12px 24px rgba(0, 0, 0, 0.12)", // further enhanced shadow on hover
    },
    maxWidth: 345,
  },
};

const EventCard = ({ initialEvent, onDelete }) => {
  const [event, setEvent] = useState({
    date: "",
    name: "",
    time: "",
    type: "",
    id: "",
    itemId: "",
    ...initialEvent,
  });
  const [open, setOpen] = useState(false);
  const [tempEvent, setTempEvent] = useState({ ...event });

  const navigate = useNavigate();

  const path =
    event.type === "Flashcard"
      ? `/flashcardshare/${event.itemId}`
      : `/quizmain/${event.itemId}`;

  const handleClickOpen = (e) => {
    e.stopPropagation();
    setTempEvent({ ...event });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const updateEvent = async () => {
    const { id, ...eventWithoutId } = tempEvent;
    await eventRepository.updateUpcomingEvent(id, eventWithoutId);
    return true;
  };

  const handleClickSaveChanges = async () => {
    console.log("save changes clicked");
    updateEvent().then((res) => {
      console.log("update event res is: ", res);
      setEvent({ ...tempEvent });
      setOpen(false);
    });
  };

  const handleChange = (prop) => (e) => {
    // setEvent({ ...event, [prop]: e.target.value });
    setTempEvent({ ...tempEvent, [prop]: e.target.value });
  };

  const handleDialogKeyDown = (event) => {
    if (event.key === "Escape") {
      event.stopPropagation();
      handleClose();
    }
  };

  return (
    <Card
      variant="outlined"
      sx={eventCardStyles.cardStyle}
      onClick={() => {
        navigate(path);
      }}
    >
      <CardContent>
        <div style={eventCardStyles.titleBar}>
          <Typography gutterBottom variant="h7" component="div">
            {event.name}
          </Typography>
        </div>

        <Typography variant="body2" color="text.secondary" fontWeight="bold">
          {event.date}
        </Typography>
        <Typography variant="body2" color="text.secondary" fontWeight="bold">
          {event.time ? event.time : "Wed Jan 24 2024 19:00:00 GMT-0500"}
        </Typography>
        <Typography variant="body2" color="text.secondary" fontWeight="bold">
          {event.type}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          onClick={handleClickOpen}
          style={eventCardStyles.button}
        >
          <EditIcon color="action" />
        </Button>
        <Button size="small" color="error" onClick={onDelete}>
          <DeleteIcon color="error" />
        </Button>
      </CardActions>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        onKeyDown={handleDialogKeyDown}
        onClick={(e) => e.stopPropagation()}
      >
        <DialogContent>
          <div style={{ padding: 16 }}>
            <Typography variant="h6" gutterBottom>
              Event Details
            </Typography>
            <TextField
              label="Date"
              type="text"
              fullWidth
              margin="normal"
              value={tempEvent.date}
              onChange={handleChange("date")}
              variant="outlined"
            />
            <TextField
              label="Name"
              type="text"
              fullWidth
              margin="normal"
              value={tempEvent.name}
              onChange={handleChange("name")}
              variant="outlined"
            />
            <TextField
              label="Time"
              type="text"
              fullWidth
              margin="normal"
              value={tempEvent.time}
              onChange={handleChange("time")}
              variant="outlined"
            />
            <TextField
              label="Type"
              type="text"
              fullWidth
              margin="normal"
              value={tempEvent.type}
              onChange={handleChange("type")}
              variant="outlined"
            />
            <Button
              variant="contained"
              color="primary"
              style={{ marginTop: 16 }}
              onClick={handleClickSaveChanges}
            >
              Save Changes
            </Button>
          </div>
        </DialogContent>
        <DialogActions></DialogActions>
      </Dialog>
    </Card>
  );
};

export default EventCard;
