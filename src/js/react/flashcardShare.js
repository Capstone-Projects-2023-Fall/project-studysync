import React, { useState, useEffect } from 'react';
import { Button, TextField, Typography, List, ListItem, IconButton, Avatar, ThemeProvider, createTheme } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SendIcon from '@mui/icons-material/Send';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useParams } from 'react-router-dom';
import FlashcardRepo from '../repositories/FlashcardRepo';
import { useNavigate } from "react-router-dom";

function FlashcardShare() {
    const { setId, flashcardId } = useParams();
    const [cards, setCards] = useState([]);
    const [selectedCard, setSelectedCard] = useState(null);
    const [isFlipped, setIsFlipped] = useState(false);
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);
    const [userImage, setUserImage] = useState(null);
    const userId = FlashcardRepo.getCurrentUid();
    const navigate = useNavigate();
    console.log("flashcard", flashcardId)

    useEffect(() => {
        const fetchFlashcards = async () => {
            try {
                const flashcardData = await FlashcardRepo.getFlashcardItems(flashcardId);
                const flashcardsArray = Object.keys(flashcardData).map(key => {
                    return {
                        term: flashcardData[key].term,
                        definition: flashcardData[key].definition,
                        flashcardId: key,
                    };
                });
                setCards(flashcardsArray);
            } catch (error) {
                console.error("Failed to fetch flashcards:", error);
            }
        };
        const fetchComments = async () => {
            try {
                const commentsData = await FlashcardRepo.getCommentsWithUserData(flashcardId);
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

                const currentUserImg = await FlashcardRepo.getUserImageURLByUid(userId);

                setUserImage(currentUserImg);
            } catch (error) {
                console.error("Error fetching current user image:", error);
            }
        };
        fetchComments();
        fetchCurrentUserImage();
        fetchFlashcards();
    }, [setId]);

    const fetchComments = async () => {
        try {
            const commentsData = await FlashcardRepo.getCommentsWithUserData(flashcardId);
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
                    uid: userId,
                    date: new Date(),
                };
                await FlashcardRepo.addComment(flashcardId, newComment);

                setComment("");
                await fetchComments();
            } catch (error) {
                console.error("Failed to send comment:", error);
            }
        }
    };

    const selectCard = (card) => {
        setSelectedCard(card);
    };

    const handleNextCard = () => {
        const currentIndex = cards.indexOf(selectedCard);
        if (currentIndex < cards.length - 1) {
            setSelectedCard(cards[currentIndex + 1]);
        }
    };

    const handlePrevCard = () => {
        const currentIndex = cards.indexOf(selectedCard);
        if (currentIndex > 0) {
            setSelectedCard(cards[currentIndex - 1]);
        }
    };

    const toggleFlip = () => {
        setIsFlipped(!isFlipped);
    };
    const handleSaveToMyFlashcards = async () => {
        if (flashcardId) {
            try {
                const newFlashcardSetId = await FlashcardRepo.copyFlashcards(flashcardId, userId);
                navigate(`/flashcard-ui/${newFlashcardSetId}`);
                console.log("New flashcard set created with ID:", newFlashcardSetId);
            } catch (error) {
                console.error("Error saving to my flashcards:", error);
            }
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
                            <ListItem button key={index} onClick={() => selectCard(card)}>
                                {card.term}
                            </ListItem>
                        ))}
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
                                    borderRadius: '8px',
                                    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                                    transition: 'transform 0.6s',
                                    transformStyle: 'preserve-3d',
                                    position: 'relative'
                                }}
                                onClick={toggleFlip}
                            >

                                <div
                                    style={{
                                        position: 'absolute',
                                        width: '100%',
                                        height: '100%',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        backfaceVisibility: 'hidden',
                                    }}
                                >
                                    {selectedCard && !isFlipped && selectedCard.term}
                                </div>

                                <div
                                    style={{
                                        position: 'absolute',
                                        width: '100%',
                                        height: '100%',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        backfaceVisibility: 'hidden',
                                        transform: 'rotateY(180deg)'
                                    }}
                                >
                                    {selectedCard && isFlipped && selectedCard.definition}
                                </div>
                            </div>
                            <IconButton onClick={handleNextCard}>
                                <ArrowForwardIcon />
                            </IconButton>
                        </div>
                        <Button
                            variant="outlined"
                            style={{
                                marginTop: '10px',
                                backgroundColor: '#4f97e0',
                                color: 'white'
                            }}
                            onClick={handleSaveToMyFlashcards}
                        >
                            save to my flashcard
                        </Button>
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

            </div>

        </ThemeProvider>
    );
}

export default FlashcardShare;
