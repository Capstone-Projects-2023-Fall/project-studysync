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
import { useNavigate} from "react-router-dom";

import AccessTimeIcon from '@mui/icons-material/AccessTime'; // Import the timer icon
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
    const [currUser, setCurrUser] = useState(null)
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
        if (isFlashcard) {
            for (const u of selectedUsers) {
                userRepository
                    .shareFlashcard(
                        UserId,
                        u,
                        selectedId
                    )
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
            setCurrUser(currUser)
            userRepository.getOwnedQuizzes(user.uid).then((res) => {
                setOwnedQuizzes(res);
            })

            userRepository.getOwnedFlashcards(user.uid).then((res) => {
                setOwnedFlashcards(res);
            })

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
                            onShareClick={() =>
                                handleShareClick(item.id, false)
                            }
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
                            terms={`${
                                Object.keys(item.flashcardItems).length
                            } terms`}
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
                            onShareClick={() =>
                                handleShareClick(item.id, false)
                            }
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
                                    terms={`${
                                        Object.keys(item.flashcardItems).length
                                    } terms`}
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

function FlashCardSet({ author, title, terms, users, onShareClick, onShare, imageURL, authorId, flashcardId, quizId, item}) {
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
    const name = quizId ? item.quizName : item.name
    const type = quizId ? UPCOMING_EVENT_TYPE.QUIZ : UPCOMING_EVENT_TYPE.FLASHCARD

    userRepository.addUpcomingEvent(UserId, name, selectedDate.toString(), selectedTime, type).then((res)=>{
        console.log('result of creating upcomig event is: ', res)
    })

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
                return item.name
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase());
            }
            if (item.firstName != null) {
                return item.firstName
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase());
            }
            if (item.email != null) {
                return item.email
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase());
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
            onClick={()=>{
                if(quizId){
                    navigate(`/quizmain/${quizId}`)
                }else{
                    navigate(`/flashcard-ui/${flashcardId}`)
                }
            }}
        >
            <div>
                <Typography variant="heading4">
                    {title || "What do the best college students do?"}
                </Typography>
                <Typography variant="body2" style={styles.flashcardInfo}>
                    {terms || "20 Terms"}
                </Typography>
            </div>

            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                }}
            >
                <Avatar alt={author} src={imageURL} onClick={(e)=>{
                    e.stopPropagation()
                    navigate(`/profile/${authorId}`)
                }}/>
                <Typography variant="body2">
                    {author || "Mike Scott"}
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleShareClick}
                >
                    Share
                </Button>

                <Button onClick={openScheduleDialogD} variant="contained" color="primary" >
                    <AccessTimeIcon /> 
                </Button>

                <ScheduleDialog
                open={scheduleDialogOpenD}
                onClose={closeScheduleDialogD}
                onSchedule={handleScheduleD}
            /> 
                <Dialog open={open} onClose={handleClose} onClick={(e)=>{e.stopPropagation()}}>
                    <DialogTitle>Select Users to Share With</DialogTitle>
                    <Button
                    onClick={handleClose}
                    color="primary"
                    style={{ position: "absolute", top: "8px", right: "8px" }} // Position the close button
                    >
                    <CloseIcon /> {/* Add a CloseIcon from Material-UI */}
                    </Button>
                    <SearchBar onSearch={handleSearch} sx={{ width: "70%" }} />
                    <DialogContent
                        style={{
                            height: "30rem",
                            overflow: "auto",
                            width: "20rem",
                        }}
                    >
                        <List>
                            {/* Replace the following with your actual list of users */}
                            {filteredData.map((user, index) => (
                                <ListItem key={user.id || index}>
                                    <ListItemText
                                        primary={
                                            user.name ||
                                            user.firstName ||
                                            user.email
                                        }
                                    />
                                    <Checkbox
                                        onChange={() =>
                                            handleCheckboxChange(user.id)
                                        }
                                        checked={checkedItems.includes(user.id)}
                                    />
                                </ListItem>
                            ))}
                        </List>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleShare}
                        >
                            Share
                        </Button>
                    </DialogContent>
                </Dialog>
            </div>
        </Paper>
    );
}

const styles = {
    termsStyle: {
        backgroundColor: "#E0E0E0", // Grey background
        borderRadius: "15px", // Rounded corners
        width: "30%",
    },

    cardStyle: {
        width: "100%", // Take one-third of the width minus the gap
        height: "7.5rem",
        overflow: "auto",
        marginBottom: "1rem", // Add some space at the bottom
        cursor: "pointer", // Changes the cursor to a pointer
        transition: "box-shadow 0.3s ease", // Smooth transition for the shadow
        padding: "0.3rem",

        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between", // Distribute space between child elements
        border: "1px solid #ccc", // Optional: Add a border for visibility
    },

    hoverStyle: {
        boxShadow: "0 8px 15px rgba(128, 90, 213, 0.2)", // Light purple shadow at the bottom
    },

    containerStyle: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between", // Distributes space evenly
        padding: "1rem",
    },

    header: {
        paddingLeft: "1rem",
    },

    centerFlex: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#E0E0E0", // Grey background
        borderRadius: "15px", // Rounded corners
        width: "fit-content",
        height: "fit-content",
        marginTop: "0.5rem",
    },
    flashcardInfo: {
        backgroundColor: "#E0E0E0",
        borderRadius: "15px",
        padding: "0.5rem", // Add some padding to the info for spacing
        width: "fit-content",
    },
};

const SearchBar = ({ onSearch }) => {
    const handleSearch = (event) => {
        const searchTerm = event.target.value;
        onSearch(searchTerm);
    };

    return (
        <TextField label="Search" variant="outlined" onChange={handleSearch} />
    );
};