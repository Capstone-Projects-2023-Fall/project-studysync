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
import Avatar from "@mui/material/Avatar";
import React from "react";
import { useEffect, useState } from "react";
import { userRepository } from "../../firebase";
import useUser from "./useUser";
import { useParams } from "react-router-dom";
import useNotificationCount from "./useNotificationCount";
import { useNavigate } from "react-router-dom";

import AccessTimeIcon from "@mui/icons-material/AccessTime"; // Import the timer icon
import ScheduleDialog from "./ScheduleDialog";
import CloseIcon from "@mui/icons-material/Close";
import { UPCOMING_EVENT_TYPE } from "../models/event";

export default function MySets() {
  const { UserId } = useParams();
  const [tab, setTab] = React.useState(0);
  const [ownedQuizzes, setOwnedQuizzes] = useState([]);
  const [users, setUsers] = useState([]);
  const [ownedFlashcards, setOwnedFlashcards] = useState([]);
  const [selectedFlashcardId, setSelectedFlashcardId] = useState(null); // Track the selected flashcard ID
  const [selectedQuizId, setSelectedQuizId] = useState(null);
  const { user, isLoading } = useUser();
  const [currUser, setCurrUser] = useState(null);
  const [sharedQuizzes, setSharedQuizzes] = useState([]);
  const [sharedFlashcards, setSharedFlashcards] = useState([]);

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  const handleShareClick = (id, isFlashcard) => {
    if (isFlashcard) {
      setSelectedFlashcardId(id);
      return;
    }
    // Open the modal
    setSelectedQuizId(id);
  };

  const handleShare = (selectedId, selectedUsers, isFlashcard) => {
    console.log(selectedId, selectedUsers, isFlashcard);
    if (isFlashcard) {
      for (const u of selectedUsers) {
        userRepository
          .shareFlashcard(UserId, u, selectedId)
          .then((res) => {
            console.log("Share Flashcard Success: ", res);
          })
          .catch((err) => {
            console.log("Share Flashcard Failure: ", err);
          });
      }
      setSelectedFlashcardId(null);
      return;
    }
    // Implement the logic to handle sharing quizzes

    for (const u of selectedUsers) {
      userRepository
        .shareQuiz(UserId, u, selectedId)
        .then((res) => {
          console.log("Share Quiz Success: ", res);
        })
        .catch((err) => {
          console.log("Share Quiz Failure: ", err);
        });
    }
    setSelectedQuizId(null);
  };

  useEffect(() => {
    if (user != null) {
      setCurrUser(currUser);
      userRepository.getOwnedQuizzes(user.uid).then((res) => {
        setOwnedQuizzes(res);
      });

      userRepository.getOwnedFlashcards(user.uid).then((res) => {
        setOwnedFlashcards(res);
      });

      userRepository.getSharedFlashcards(user.uid).then((res) => {
        setSharedFlashcards(res);
      });

      userRepository.getSharedQuizzes(user.uid).then((res) => {
        setSharedQuizzes(res);
      });
      userRepository.getAllUsers().then((res) => setUsers(res));
    }
  }, [isLoading, user, tab]);
  return (
    <>
      <Tabs
        value={tab}
        onChange={handleTabChange}
        textColor="primary"
        indicatorColor="primary"
      >
        <Tab label="Quizzes" />
        <Tab label="Flashcards" />
        <Tab label="Shared Quizzes" />
        <Tab label="Shared Flashcards" />
      </Tabs>

      {tab === 0 && (
        <div style={styles.containerStyle}>
          {ownedQuizzes.map((item) => (
            <FlashCardSet
              key={item.id}
              item={item}
              author={item.author.name}
              imageURL={item.author.imageURL}
              title={item.quizName}
              terms={`${Object.keys(item.questionItems).length} questions`}
              users={users}
              quizId={item.id}
              onShareClick={() => handleShareClick(item.id, false)}
              onShare={(selectedUsers) =>
                handleShare(item.id, selectedUsers, false)
              }
              authorId={item.authorId}
            />
          ))}
        </div>
      )}
      {tab === 1 && (
        <div style={styles.containerStyle}>
          {ownedFlashcards.map((item) => (
            <FlashCardSet
              key={item.id}
              item={item}
              users={users}
              author={item.author.name}
              imageURL={item.author.imageURL}
              title={item.name}
              flashcardId={item.id}
              authorId={item.authorId}
              terms={`${Object.keys(item.flashcardItems).length} terms`}
              onShareClick={() => handleShareClick(item.id, true)}
              onShare={(selectedUsers) =>
                handleShare(item.id, selectedUsers, true)
              }
            />
          ))}
        </div>
      )}

      {tab === 2 && (
        <div style={styles.containerStyle}>
          {sharedQuizzes.map((item) => (
            <FlashCardSet
              key={item.id}
              item={item}
              quizId={item.id}
              author={item.author.name}
              imageURL={item.author.imageURL}
              authorId={item.authorId}
              title={item.quizName}
              terms={`${Object.keys(item.questionItems).length} questions`}
              users={users}
              onShareClick={() => handleShareClick(item.id, false)}
              onShare={(selectedUsers) =>
                handleShare(item.id, selectedUsers, false)
              }
            />
          ))}
        </div>
      )}
      {tab === 3 && (
        <div style={styles.containerStyle}>
          {sharedFlashcards.map((item) => (
            <FlashCardSet
              key={item.id}
              item={item}
              users={users}
              authorId={item.authorId}
              author={item.author.name}
              imageURL={item.author.imageURL}
              title={item.name}
              flashcardId={item.id}
              terms={`${Object.keys(item.flashcardItems).length} terms`}
              onShareClick={() => handleShareClick(item.id, true)}
              onShare={(selectedUsers) =>
                handleShare(item.id, selectedUsers, true)
              }
            />
          ))}
        </div>
      )}
    </>
  );
}

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
}) {
  const [open, setOpen] = React.useState(false);
  const [checkedItems, setCheckedItems] = useState([]);
  const [scheduleDialogOpenD, setScheduleDialogOpenD] = useState(false);
  const [filteredData, setFilteredData] = useState(users || []);
  const navigate = useNavigate();
  const { UserId } = useParams();

  const openScheduleDialogD = (e) => {
    e.stopPropagation();
    setScheduleDialogOpenD(true);
  };

  const closeScheduleDialogD = () => {
    setScheduleDialogOpenD(false);
  };

  const handleScheduleD = (selectedDate, selectedTime) => {
    //Scheduling logic
    const name = quizId ? item.quizName : item.name;
    const type = quizId
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
        if (quizId) {
          navigate(`/quizmain/${quizId}`);
        } else {
          navigate(`/flashcard-ui/${flashcardId}`);
        }
      }}
    >
      <div style={styles.titleBar}>
        <Typography variant="subtitle1">
          {title || "What do the best college students do?"}
        </Typography>
      </div>
      <Typography variant="body2" style={styles.infoText}>
        {terms || "20 Terms"}
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
    padding: "20px",
    margin: "20px auto",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.12), 0 6px 20px rgba(0, 0, 0, 0.08)", // enhanced shadow for depth
    transition: "box-shadow 0.3s",
    width: "80%", // take up 80% of the page width
    maxWidth: "800px", // maximum width of the card
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
};

const SearchBar = ({ onSearch, width }) => {
  const handleSearch = (event) => {
    const searchTerm = event.target.value;
    onSearch(searchTerm);
  };

  return (
    <TextField
      label="Search"
      variant="outlined"
      onChange={handleSearch}
      sx={{ width: width }}
    />
  );
};
