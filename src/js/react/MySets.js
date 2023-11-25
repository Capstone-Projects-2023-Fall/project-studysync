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

export default function MySets() {
    const [tab, setTab] = React.useState(0);

    const handleTabChange = (event, newValue) => {
        setTab(newValue);
    };
    const recents = [1, 2, 3];
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
                    {[1, 2, 3, 4, 5].map((item) => (
                        <FlashCardSet key={item} />
                    ))}
                </div>
            )}
            {tab === 1 && (
                <div style={styles.containerStyle}>
                    {recents.map((item) => (
                        <FlashCardSet key={item} />
                    ))}
                </div>
            )}
        </>
    );
}

function FlashCardSet() {
    const [open, setOpen] = React.useState(false);
    const handleStudyClick = () => {
        // Implement the logic to open the card for study
        console.log("Study clicked");
    };
    const handleShareClick = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleShare = () => {
        // Implement the logic to handle sharing
        console.log("Shared!");
        handleClose();
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
                    What do the best college students do?
                </Typography>
                <Typography variant="body2" style={styles.flashcardInfo}>
                    20 terms
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
                <Typography variant="body2">Michael Scott</Typography>
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
                            {[
                                "User1",
                                "User2",
                                "User3",
                                "Banku",
                                "fufu",
                                "Damius",
                                "tranchis",
                                "mantis",
                            ].map((user) => (
                                <ListItem key={user}>
                                    <ListItemText primary={user} />
                                    <Checkbox />
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
