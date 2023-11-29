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

export default function MySets() {
    const [tab, setTab] = React.useState(0);
    const [ownedQuizzes, setOwnedQuizzes] = useState([]);
    const [users, setUsers] = useState([]);
    const [ownedFlashcards, setOwnedFlashcards] = useState([]);
    const [selectedFlashcardId, setSelectedFlashcardId] = useState(null); // Track the selected flashcard ID
    const [selectedQuizId, setSelectedQuizId] = useState(null);
    const { user, isLoading } = useUser();
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
            for (const user of selectedUsers) {
                userRepository
                    .shareFlashcard(
                        "bOJOSp8Xa0N80s576Ol19PirqH12",
                        user,
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
            console.log("Shared Selected Card!", selectedFlashcardId);
            console.log("shared selected users: ", selectedUsers);
            return;
        }
        // Implement the logic to handle sharing quizzes
        console.log("Shared Selected Card!", selectedQuizId);
        console.log("shared selected users: ", selectedUsers);

        for (const user of selectedUsers) {
            userRepository
                .shareQuiz("bOJOSp8Xa0N80s576Ol19PirqH12", user, selectedId)
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
            userRepository.getOwnedQuizzes(user.uid).then((res) => {
                setOwnedQuizzes(res);
            });

            userRepository.getOwnedFlashcards(user.uid).then((res) => {
                setOwnedFlashcards(res);
            });
            userRepository.getAllUsers().then((res) => setUsers(res));
        }
    }, [isLoading, user]);
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
            </Tabs>

            {tab === 0 && (
                <div style={styles.containerStyle}>
                    {ownedQuizzes.map((item) => (
                        <FlashCardSet
                            key={item.id}
                            author="me"
                            title={item.title}
                            terms={`${item.question} questions`}
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
            {tab === 1 && (
                <div style={styles.containerStyle}>
                    {ownedFlashcards.map((item) => (
                        <FlashCardSet
                            key={item.id}
                            users={users}
                            author="me"
                            title={item.name}
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

function FlashCardSet({ author, title, terms, users, onShareClick, onShare }) {
    const [open, setOpen] = React.useState(false);
    const [checkedItems, setCheckedItems] = useState([]);

    // const handleShareClick = () => {
    //     setOpen(true);
    // };

    const handleClose = () => {
        setOpen(false);
    };
    const handleShareClick = () => {
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

    return (
        <Paper
            elevation={3}
            style={styles.cardStyle}
            onMouseOver={(e) =>
                (e.currentTarget.style.boxShadow = styles.hoverStyle.boxShadow)
            }
            onMouseOut={(e) => (e.currentTarget.style.boxShadow = "")}
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
                <Avatar alt={"Michael Jordan"} src={"bankusrc"} />
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

                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>Select Users to Share With</DialogTitle>
                    <SearchBar onSearch={() => {}} sx={{ width: "70%" }} />
                    <DialogContent
                        style={{
                            height: "30rem",
                            overflow: "auto",
                            width: "20rem",
                        }}
                    >
                        <List>
                            {/* Replace the following with your actual list of users */}
                            {users.map((user) => (
                                <ListItem key={user.id}>
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
