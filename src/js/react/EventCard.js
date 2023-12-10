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

/**
 * @class EventCard
 * @classdesc EventCard - A functional React component for displaying event details in card format.
 *
 * @param {Object} props - Props for EventCard including event details and onDelete callback.
 * @returns {React.Component} A card component displaying event details.
 */

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
  /**
   * @memberof EventCard
   * @function handleClickOpen
   * @description Opens the dialog to edit event details.
   * @param {Object} e - Event object to prevent event bubbling.
   */
  const handleClickOpen = (e) => {
    e.stopPropagation();
    const formattedDate = formatDateToYYYYMMDD(event.date);
    const formattedTime = convertTo24Hour(event.time);
    setTempEvent({ ...event, date: formattedDate, time: formattedTime });
    setOpen(true);
  };

  /**
   * @memberof EventCard
   * @function handleClose
   * @description Closes the edit event dialog.
   */
  const handleClose = () => {
    setOpen(false);
  };

  /**
   * @memberof EventCard
   * @function updateEvent
   * @description Updates the event details in the database.
   * @returns {Promise<Boolean>} Promise indicating the success of the update operation.
   */
  const updateEvent = async () => {
    const { id, ...eventWithoutId } = tempEvent;
    await eventRepository.updateUpcomingEvent(id, eventWithoutId);
    return true;
  };

  /**
   * @memberof EventCard
   * @function handleClickSaveChanges
   * @description Handles the click event on the Save Changes button.
   */
  const handleClickSaveChanges = async () => {
    console.log("save changes clicked");
    updateEvent().then((res) => {
      console.log("update event res is: ", res);
      const formattedDate = formatDateToDayMonDDYYYY(tempEvent.date);
      const formattedTime = userRepository.convertTo12HourFormat(tempEvent.time);
      setEvent({ ...tempEvent, date: formattedDate, time: formattedTime });
      setOpen(false);
    });
  };

  /**
   * @memberof EventCard
   * @function handleChange
   * @description Handles changes to the event fields in the dialog.
   * @param {string} prop - Property name of the event to update.
   * @returns {Function} A function that takes an event object and updates the event state.
   */
  const handleChange = (prop) => (e) => {
    // setEvent({ ...event, [prop]: e.target.value });
    setTempEvent({ ...tempEvent, [prop]: e.target.value });
  };

  /**
   * @memberof EventCard
   * @function handleDialogKeyDown
   * @description Handles key down event on the dialog, specifically the Escape key.
   * @param {Object} event - The key down event object.
   */
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
          {`${event.type} : ${event.itemName}`}
        </Typography>
        <Typography variant="body2" color="text.secondary" fontWeight="bold">
          {event.date}
        </Typography>
        <Typography variant="body2" color="text.secondary" fontWeight="bold">
          {event.time ? event.time : "Wed Jan 24 2024 19:00:00 GMT-0500"}
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
              type="date"
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
              type="time"
              fullWidth
              margin="normal"
              value={tempEvent.time}
              onChange={handleChange("time")}
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

// Convert a date string to YYYY-MM-DD format
function formatDateToYYYYMMDD(dateString) {
  const date = new Date(dateString);
  let month = "" + (date.getMonth() + 1);
  let day = "" + date.getDate();
  const year = date.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}

// Convert 12-hour time format to 24-hour format
function convertTo24Hour(timeString) {
  const [time, modifier] = timeString.split(" ");
  let [hours, minutes] = time.split(":");
  if (hours === "12") {
    hours = "00";
  }
  if (modifier === "PM") {
    hours = parseInt(hours, 10) + 12;
  }
  return `${hours}:${minutes}`;
}

function formatDateToDayMonDDYYYY(date) {
  const [year, _, day] = date.split("-");

  const dd = new Date(date);

  const dateToStore =
    userRepository.getDayOfWeekShort(dd) +
    " " +
    userRepository.getMonthAbbreviation(dd) +
    " " +
    day +
    " " +
    year;
  return dateToStore;
}

export default EventCard;