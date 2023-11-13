import React, { useState, useEffect } from 'react';
import { Button, TextField, Typography, Dialog, DialogActions, FormControlLabel, Checkbox, DialogContent, DialogTitle, List, ListItem, IconButton, Avatar, ThemeProvider, createTheme } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SendIcon from '@mui/icons-material/Send';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useParams } from 'react-router-dom';
import FlashcardRepo from '../repositories/FlashcardRepo';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import EditIcon from '@mui/icons-material/Edit';


function FlashcardApp() {
    const [term, setTerm] = useState('');
    const [definition, setDefinition] = useState('');
    const [comment, setComment] = useState('');
    const [openAdd, setOpenAdd] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [showDefinition, setShowDefinition] = useState(false);
    const { setId } = useParams();
    const [cards, setCards] = useState([]);
    const [selectedCard, setSelectedCard] = useState(null);
    const [comments, setComments] = useState([]);
    const [cardToDelete, setCardToDelete] = useState(null);
    const [likedComments, setLikedComments] = useState({});
    const [userImage, setUserImage] = useState(null);
    const [openEdit, setOpenEdit] = useState(false);
    const [cardToEdit, setCardToEdit] = useState(null);
    const uid = FlashcardRepo.getCurrentUid();
    const [openAIDialog, setOpenAIDialog] = useState(false);
    const [numberOfFlashcards, setNumberOfFlashcards] = useState(1);
    const [topicName, setTopicName] = useState('');
    const [selectedButton, setSelectedButton] = useState(null);
    const [filterOptions, setFilterOptions] = useState({
        know: false,
        notSure: false,
        dontKnow: false
    });


    useEffect(() => {
        const fetchFlashcards = async () => {
            try {
                const flashcardData = await FlashcardRepo.getFlashcardItems(setId);
                console.log("fetching flashcards", flashcardData);
                const flashcardsArray = Object.keys(flashcardData).map(key => {
                    return {
                        term: flashcardData[key].term,
                        definition: flashcardData[key].definition,
                        flashcardId: key
                    };
                });
                setCards(flashcardsArray);
            } catch (error) {
                console.error("Failed to fetch flashcards:", error);
            }
        };

        const fetchComments = async () => {
            try {
                const commentsData = await FlashcardRepo.getCommentsWithUserData(setId);
                console.log("fetching comments", commentsData);

                // Convert Firebase Timestamp to Date objects
                const formattedComments = commentsData.map(comment => ({
                    ...comment,
                    date: comment.date.toDate()  // This converts the Timestamp to a Date object
                }));

                setComments(formattedComments);
            } catch (error) {
                console.error("Failed to fetch comments:", error);
            }
        };

        const fetchCurrentUserImage = async () => {
            const uid = await FlashcardRepo.getCurrentUid();
            console.log("uid", uid);
            try {

                const currentUserImg = await FlashcardRepo.getUserImageURLByUid(uid);

                setUserImage(currentUserImg);
            } catch (error) {
                console.error("Error fetching current user image:", error);
            }
        };

        const fetchTopicName = async () => {

            const fetchedTopicName = await FlashcardRepo.fetchTopicName(setId);
            setTopicName(fetchedTopicName);
        };

        if (openAIDialog) {
            fetchTopicName();
        }


        fetchCurrentUserImage();
        fetchFlashcards();
        fetchComments();
        fetchTopicName();
    }, [openAIDialog, setId]);

    const fetchComments = async () => {
        try {
            const commentsData = await FlashcardRepo.getCommentsWithUserData(setId);
            console.log("fetching comments", commentsData);

            // Convert Firebase Timestamp to Date objects
            const formattedComments = commentsData.map(comment => ({
                ...comment,
                date: comment.date.toDate()  // This converts the Timestamp to a Date object
            }));

            setComments(formattedComments);
        } catch (error) {
            console.error("Failed to fetch comments:", error);
        }
    };

    const handleSendComment = async () => {
        if (comment) {
            try {
                const newComment = {
                    content: comment,
                    uid: uid,
                    date: new Date(),
                    like: 0
                };
                await FlashcardRepo.addComment(setId, newComment);

                setComment("");
                await fetchComments();
            } catch (error) {
                console.error("Failed to send comment:", error);
            }
        }
    };


    const handlePrevCard = () => {
        const currentIndex = cards.indexOf(selectedCard);
        if (currentIndex > 0) {
            setSelectedCard(cards[currentIndex - 1]);
            setShowDefinition(false);
        }
    };
    const handleDeleteClick = (card) => {
        setCardToDelete(card);
        setOpenDelete(true);
    };

    const confirmDelete = async () => {
        if (cardToDelete) {
            try {
                await FlashcardRepo.deleteFlashcard(setId, cardToDelete.flashcardId);
                const updatedCards = cards.filter(card => card.flashcardId !== cardToDelete.flashcardId);
                setCards(updatedCards);
                setCardToDelete(null);
            } catch (error) {
                console.error("Failed to delete flashcard:", error);
            }
            setOpenDelete(false);
        }
    }

    const handleButtonClick = (buttonId) => {
        setSelectedButton(buttonId);
    };
    const handleNextCard = () => {
        const currentIndex = cards.indexOf(selectedCard);
        if (currentIndex < cards.length - 1) {
            setSelectedCard(cards[currentIndex + 1]);
            setShowDefinition(false);
        }
    };
    const handleAddFlashcard = async () => {
        if (term && definition) {
            try {
                const newFlashcardId = await FlashcardRepo.addFlashcardItem(setId, term, definition);
                setCards((prev) => [...prev, { term, definition, flashcardId: newFlashcardId }]);
                setTerm('');
                setDefinition('');
            } catch (error) {
                console.error("Failed to add flashcard:", error);
            }
        }
    };
    const handleLikeClick = async (commentId) => {
        const isLiked = likedComments[commentId] || false;

        let updatedLikes = comments.find(comment => comment.commentId === commentId).likes || 0;
        updatedLikes = isLiked ? updatedLikes - 1 : updatedLikes + 1;

        // This simulates updating the likes in the database
        try {
            await FlashcardRepo.updateLikesForComment(setId, commentId, updatedLikes);
            setComments(prevComments => {
                return prevComments.map(comment => {
                    if (comment.commentId === commentId) {
                        return { ...comment, likes: updatedLikes };
                    }
                    return comment;
                });
            });
        } catch (error) {
            console.error("Failed to update likes:", error);
        }
        console.log("current comment id: ", commentId);

        setLikedComments({
            ...likedComments,
            [commentId]: !isLiked
        });
    };

    const handleEditClick = (card) => {
        setTerm(card.term);
        setDefinition(card.definition);
        setCardToEdit(card);
        setOpenEdit(true);
    };

    const handleUpdateFlashcard = async () => {
        if (cardToEdit && term && definition) {
            try {
                await FlashcardRepo.updateFlashcard(setId, cardToEdit.flashcardId, term, definition);

                const updatedCards = cards.map(card => {
                    if (card.flashcardId === cardToEdit.flashcardId) {
                        return { ...card, term, definition };
                    }
                    return card;
                });
                setCards(updatedCards);
                setOpenEdit(false);
                setCardToEdit(null);
            } catch (error) {
                console.error("Failed to update flashcard:", error);
            }
        }
    };

    function parseGPTResponse(rawResponse) {
        try {
            // Regular expression to find JSON objects in the response
            const jsonRegex = /{[\s\S]*?}/g;
            const matches = rawResponse.match(jsonRegex);
            console.log("Raw JSON matches:", matches);

            if (!matches) return [];

            // Parse each JSON string into an object
            const flashcards = matches.map(jsonString => {
                try {
                    return JSON.parse(jsonString);
                } catch (error) {
                    console.error("Error parsing individual JSON string:", jsonString, error);
                    return null; // or some other error handling
                }
            }).filter(flashcard => flashcard != null);
            return flashcards;
        } catch (error) {
            console.error("Error parsing GPT response:", error);
            return [];
        }
    }


    const handleAIClick = () => {
        setOpenAIDialog(true);
    };

    const handleGenerateFlashcards = async () => {
        setOpenAIDialog(false);

        try {
            const responseString = await callYourCloudFunctionToGenerateFlashcards(numberOfFlashcards, topicName);

            const generatedFlashcards = responseString; // Since the response is already in the expected format

            const addFlashcardPromises = generatedFlashcards.map(async (flashcard) => {
                const newFlashcardId = await FlashcardRepo.addFlashcardItem(setId, flashcard.term, flashcard.definition);
                return { ...flashcard, flashcardId: newFlashcardId };
            });

            const addedFlashcards = await Promise.all(addFlashcardPromises);
            setCards(prev => [...prev, ...addedFlashcards]);

        } catch (error) {
            console.error("Error generating or adding flashcards with AI:", error);
        }
    };

    const callYourCloudFunctionToGenerateFlashcards = async (numFlashcards, topicName) => {
        try {
            const functionUrl = 'https://us-central1-studysync-a603a.cloudfunctions.net/askGPT';

            const response = await fetch(functionUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: `Please create ${numFlashcards}flashcards about ${topicName}. Format each flashcard as JSON with only 'term' and 'definition' fields, no other words in json , i need to parse it with only "term" and "definition"` }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            return parseGPTResponse(data.text); // Assuming the data.text is the string of JSON flashcards
        } catch (error) {
            console.error("Error calling cloud function:", error);
            throw error;
        }
    };

    const theme = createTheme({
        palette: {
            primary: { main: '#007aff' },
            secondary: { main: '#ff2d55' },
        },
        typography: {
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
        },
    });


    return (
        <ThemeProvider theme={theme}>
            <div style={{
                display: "flex", flexDirection: "column", height: "100vh",
                backgroundColor: '#f9f9f9', padding: '20px'
            }}>
                <div style={{ flex: 1, display: "flex", flexDirection: "row", justifyContent: "space-between", marginBottom: '20px' }}>
                    <List style={{
                        width: "30%", borderRight: "1px solid #e0e0e0",
                        borderRadius: '8px', overflow: 'hidden', boxShadow: '0px 0px 15px rgba(0,0,0,0.1)'
                    }}>
                        {cards.map((card, index) => (
                            <ListItem button key={index} onClick={() => { setSelectedCard(card); setShowDefinition(false); }}>
                                {card.term}
                                <IconButton onClick={() => handleEditClick(card)}>
                                    <EditIcon />
                                </IconButton>
                                <IconButton onClick={() => handleDeleteClick(card)}>
                                    <DeleteIcon />
                                </IconButton>
                            </ListItem>
                        ))}
                        <Button onClick={() => setOpenAdd(true)} startIcon={<AddIcon />}>
                            Add
                        </Button>
                        <Button
                            onClick={handleAIClick} // Define this function to handle AI interaction
                            startIcon={<AddIcon />}
                        >
                            AI Assist
                        </Button>
                    </List>


                    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", marginLeft: '20px' }}>
                        <Typography variant="h6">
                            {selectedCard ? `${cards.indexOf(selectedCard) + 1}/${cards.length}` : ""}
                        </Typography>
                        <div style={{
                            display: "flex", alignItems: "center", width: "80%", justifyContent: "space-between",
                            marginTop: '20px', borderRadius: '8px', padding: '10px', backgroundColor: '#fff', boxShadow: '0px 0px 15px rgba(0,0,0,0.1)'
                        }}>
                            <IconButton onClick={handlePrevCard}>
                                <ArrowBackIcon />
                            </IconButton>
                            <div
                                style={{
                                    flex: 1,
                                    height: "150px",
                                    border: "1px solid #e0e0e0",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    cursor: "pointer",
                                    borderRadius: '8px'
                                }}
                                onClick={() => setShowDefinition(!showDefinition)}
                            >
                                {selectedCard && (showDefinition ? selectedCard.definition : selectedCard.term)}
                            </div>

                            <IconButton onClick={handleNextCard}>
                                <ArrowForwardIcon />
                            </IconButton>

                        </div>
                        <div style={{ display: "flex", justifyContent: "center", marginTop: "10px", width: "100%" }}>
                            <Button
                                variant="outlined"
                                style={{ margin: "5px", backgroundColor: selectedButton === 'know' ? 'lightgreen' : '' }}
                                onClick={() => handleButtonClick('know')}
                            >
                                Know
                            </Button>
                            <Button
                                variant="outlined"
                                style={{ margin: "5px", backgroundColor: selectedButton === 'notSure' ? 'yellow' : '' }}
                                onClick={() => handleButtonClick('notSure')}
                            >
                                Not Sure
                            </Button>
                            <Button
                                variant="outlined"
                                style={{ margin: "5px", backgroundColor: selectedButton === 'dontKnow' ? 'lightcoral' : '' }}
                                onClick={() => handleButtonClick('dontKnow')}
                            >
                                Don't Know
                            </Button>
                        </div>
                    </div>
                </div>


                <div style={{ flex: 1, overflowY: 'auto', maxHeight: 'calc(30% - 60px)', backgroundColor: '#fff', borderRadius: '8px', padding: '10px', boxShadow: '0px 0px 15px rgba(0,0,0,0.1)' }}>
                    {comments.map((comment, index) => (
                        <div key={index} style={{
                            display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px", borderBottom: '1px solid #e0e0e0'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar src={comment.imageURL} />
                                <Typography variant="body1" style={{ marginLeft: "10px", fontWeight: 'bold' }}>
                                    {comment.username}
                                </Typography>
                                <Typography variant="body1" style={{ marginLeft: "10px" }}>
                                    {comment.content}
                                </Typography>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Typography variant="body2" style={{ marginRight: "10px" }}>
                                    {comment.date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                </Typography>
                                <Button
                                    startIcon={likedComments[comment.commentId] ? <ThumbUpIcon color="primary" /> : <ThumbUpOutlinedIcon />}
                                    onClick={() => {
                                        console.log("Like button clicked for commentId:", comment.commentId);
                                        handleLikeClick(comment.commentId);
                                    }}
                                >
                                    {comment.likes || 0}
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
                <div style={{ height: '60px', backgroundColor: '#fff', borderRadius: '8px', padding: '10px', boxShadow: '0px 0px 15px rgba(0,0,0,0.1)' }}>
                    <div style={{ display: "flex", alignItems: "center", }}>
                        <Avatar src={userImage} />
                        <TextField fullWidth label="Add a comment" variant="outlined" value={comment} onChange={(e) => setComment(e.target.value)} />
                        <IconButton onClick={handleSendComment}>
                            <SendIcon />
                        </IconButton>
                    </div>
                </div>


                <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
                    <DialogTitle>Edit flashcard</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Term"
                            fullWidth
                            value={term}
                            onChange={(e) => setTerm(e.target.value)}
                        />
                        <TextField
                            margin="dense"
                            label="Definition"
                            fullWidth
                            value={definition}
                            onChange={(e) => setDefinition(e.target.value)}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenEdit(false)} color="primary">
                            Cancel
                        </Button>
                        <Button
                            onClick={handleUpdateFlashcard}
                            color="primary"
                        >
                            Update
                        </Button>
                    </DialogActions>
                </Dialog>



                <Dialog open={openAdd} onClose={() => setOpenAdd(false)}>
                    <DialogTitle>Add a new flashcard</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Term"
                            fullWidth
                            onChange={(e) => setTerm(e.target.value)}
                        />
                        <TextField
                            margin="dense"
                            label="Definition"
                            fullWidth
                            onChange={(e) => setDefinition(e.target.value)}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenAdd(false)} color="primary">
                            Cancel
                        </Button>
                        <Button
                            onClick={() => {
                                handleAddFlashcard();
                                setOpenAdd(false);
                            }}
                            color="primary"
                        >
                            Add
                        </Button>
                    </DialogActions>
                </Dialog>


                <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
                    <DialogTitle>Confirm Deletion</DialogTitle>
                    <DialogContent>
                        <Typography>Are you sure you want to delete this flashcard?</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDelete(false)} color="primary">
                            No
                        </Button>
                        <Button
                            onClick={confirmDelete}
                            color="primary"
                        >
                            Yes
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={openAIDialog} onClose={() => setOpenAIDialog(false)}>
                    <DialogTitle>Generate Flashcards with AI</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Topic Name"
                            type="text"
                            fullWidth
                            value={topicName}
                            onChange={(e) => setTopicName(e.target.value)}
                        />
                        <TextField
                            margin="dense"
                            label="Number of Flashcards"
                            type="number"
                            fullWidth
                            value={numberOfFlashcards}
                            onChange={(e) => setNumberOfFlashcards(e.target.value)}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenAIDialog(false)} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleGenerateFlashcards} color="primary">
                            Generate
                        </Button>
                    </DialogActions>
                </Dialog>

            </div>
        </ThemeProvider>
    );

}

export default FlashcardApp;
