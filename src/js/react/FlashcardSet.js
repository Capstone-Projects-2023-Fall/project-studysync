import {
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItemText,
  ListItem,
  Checkbox,
  TextField,
  ListItemAvatar,
  Tab,
  Tabs,
} from "@mui/material";
import SearchBar from "./SearchBar";
import SearchIcon from "@mui/icons-material/Search";
import Avatar from "@mui/material/Avatar";
import React from "react";
import { useEffect, useState } from "react";
import { userRepository } from "../../firebase";
import useUser from "./useUser";
import { useParams } from "react-router-dom";
import useNotificationCount from "./useNotificationCount";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

import AccessTimeIcon from "@mui/icons-material/AccessTime"; // Import the timer icon
import ScheduleDialog from "./ScheduleDialog";
import CloseIcon from "@mui/icons-material/Close";
import { UPCOMING_EVENT_TYPE } from "../models/event";
function FlashCardSet({
  author,
  title,
  terms,
  users,
  onShareClick,
  onShare,
  imageURL,
  authorId,
  flashcardId,
  quizId,
  item,
  isFlashcard,
}) {
  const { UserId } = useParams();
  const [open, setOpen] = React.useState(false);
  const [checkedItems, setCheckedItems] = useState([]);
  const [scheduleDialogOpenD, setScheduleDialogOpenD] = useState(false);
  const [filteredData, setFilteredData] = useState(
    users.filter((item) => {
      return item.id != UserId;
    })
  );
  const navigate = useNavigate();

  const openScheduleDialogD = (e) => {
    e.stopPropagation();
    setScheduleDialogOpenD(true);
  };

  const closeScheduleDialogD = () => {
    setScheduleDialogOpenD(false);
  };

  const handleScheduleD = (selectedDate, selectedTime) => {
    //Scheduling logic
    const name = isFlashcard == false ? item.quizName : item.name;
    const type =
      isFlashcard == false
        ? UPCOMING_EVENT_TYPE.QUIZ
        : UPCOMING_EVENT_TYPE.FLASHCARD;

    userRepository
      .addUpcomingEvent(
        UserId,
        name,
        selectedDate.toString(),
        selectedTime,
        type
      )
      .then((res) => {
        console.log("result of creating upcomig event is: ", res);
      });

    closeScheduleDialogD();
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleShareClick = (e) => {
    e.stopPropagation();
    setOpen(true);
    // Call the parent component's onShareClick function
    onShareClick();
  };

  const handleShare = () => {
    // Call the parent component's onShare function with the selected flashcard ID and checked users
    onShare(checkedItems);
    handleClose();
  };

  const handleCheckboxChange = (userId) => {
    if (checkedItems.includes(userId)) {
      // If the user is already checked, uncheck them
      setCheckedItems((prev) => prev.filter((id) => id !== userId));
    } else {
      // If the user is not checked, check them
      setCheckedItems((prev) => [...prev, userId]);
    }
  };

  const handleSearch = (searchTerm) => {
    const filtered = users.filter((item) => {
      if (item.name != null) {
        return item.name.toLowerCase().includes(searchTerm.toLowerCase());
      }
      if (item.firstName != null) {
        return item.firstName.toLowerCase().includes(searchTerm.toLowerCase());
      }
      if (item.email != null) {
        return item.email.toLowerCase().includes(searchTerm.toLowerCase());
      }
    });
    setFilteredData(filtered);
  };

  return (
    <Paper
      elevation={3}
      style={styles.cardStyle}
      onMouseOver={(e) =>
        (e.currentTarget.style.boxShadow = styles.hoverStyle.boxShadow)
      }
      onMouseOut={(e) => (e.currentTarget.style.boxShadow = "")}
      onClick={() => {
        if (isFlashcard == false) {
          navigate(`/quizmain/${quizId}`);
        } else {
          navigate(`/flashcard-ui/${flashcardId}`);
        }
      }}
    >
      <div style={styles.titleBar}>
        <Typography variant="subtitle1">{title}</Typography>
      </div>
      <Typography variant="body2" style={styles.infoText}>
        {terms}
      </Typography>
      <div style={styles.flexContainer}>
        <div style={styles.leftGroup}>
          <Avatar
            alt={author}
            src={imageURL}
            style={styles.avatar}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/profile/${authorId}`);
            }}
          />
          <Typography variant="body2">{author || "Mike Scott"}</Typography>
        </div>
        <div style={styles.rightGroup}>
          <Button
            style={styles.button}
            variant="contained"
            color="primary"
            onClick={handleShareClick}
          >
            Share
          </Button>
          <Button
            style={styles.button}
            onClick={openScheduleDialogD}
            variant="contained"
            color="primary"
          >
            <AccessTimeIcon />
          </Button>
        </div>

        <ScheduleDialog
          open={scheduleDialogOpenD}
          onClose={closeScheduleDialogD}
          onSchedule={handleScheduleD}
        />
        <Dialog
          open={open}
          onClose={handleClose}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <DialogTitle sx={{ fontSize: "1.0rem" }}>
            Select/Search Users to Share With
          </DialogTitle>
          <Button
            onClick={handleClose}
            color="primary"
            style={{ position: "absolute", top: "8px", right: "8px" }} // Position the close button
          >
            <CloseIcon /> {/* Add a CloseIcon from Material-UI */}
          </Button>

          <DialogContent
            style={{
              height: "30rem",
              overflow: "auto",
              width: "30rem",
            }}
          >
            <SearchBar width="100%" onSearch={handleSearch} />
            <List>
              {/* Replace the following with your actual list of users */}
              {filteredData.map((user, index) => (
                <ListItem
                  key={user.id || index}
                  sx={{
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.05)", // Grey highlight color
                      cursor: "pointer", // Change the cursor to a pointer on hover
                    },
                  }}
                >
                  <ListItemAvatar>
                    <Avatar
                      src={user.imageURL}
                      alt={user.name || user.firstName || user.email}
                      onClick={() => {
                        navigate(`/profile/${user.id}`);
                      }}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={user.name || user.firstName || user.email}
                  />
                  <Checkbox
                    onChange={() => handleCheckboxChange(user.id)}
                    checked={checkedItems.includes(user.id)}
                  />
                </ListItem>
              ))}
            </List>

            {filteredData.length > 0 && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleShare}
                style={styles.button}
              >
                Share
              </Button>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Paper>
  );
}

const styles = {
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
  },
  titleBar: {
    backgroundColor: "#4b9cd3",
    color: "white",
    padding: "5px 10px",
    borderRadius: "4px",
    fontWeight: "bold",
    marginBottom: "10px", // add space below the title bar
  },
  buttonz: {
    borderRadius: "20px",
    textTransform: "none",
    fontWeight: "normal",
    margin: "5px", // add margin around the button
  },
  infoText: {
    marginBottom: "10px", // space below the text
  },
  avatar: {
    marginRight: "10px", // space to the right of the avatar
  },
  flexContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "1px",
  },
  dialogContent: {
    height: "30rem",
    overflow: "auto",
    width: "30rem",
  },
  listItemHover: {
    "&:hover": {
      backgroundColor: "rgba(0, 0, 0, 0.05)",
      cursor: "pointer",
    },
  },
  leftGroup: {
    display: "flex",
    alignItems: "center",
    gap: "10px", // Space between avatar and text
  },
  rightGroup: {
    display: "flex",
    alignItems: "center",
    gap: "10px", // Space between buttons
  },
  boldText: {
    fontWeight: "bold",
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
  hoverStyle: {
    boxShadow: "0 8px 15px rgba(128, 90, 213, 0.2)", // Light purple shadow at the bottom
  },

  containerStyle: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between", // Distributes space evenly
    // padding: "1rem",
  },
};

export default FlashCardSet;
