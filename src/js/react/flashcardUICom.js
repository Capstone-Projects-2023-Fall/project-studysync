import React, { useState, useEffect } from 'react';
import { Button, TextField, Typography, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItem, IconButton, Avatar, ThemeProvider, createTheme } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SendIcon from '@mui/icons-material/Send';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useParams } from 'react-router-dom';
import FlashcardRepo from '../repositories/FlashcardRepo';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';

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
    const uid = FlashcardRepo.getCurrentUid();

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

        fetchFlashcards();
        fetchComments();
    }, [setId]);

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
                    uid: uid, // 这里添加了UID
                    date: new Date(), // 假设你想添加当前时间戳作为评论日期
                    like: 0 // 初始喜欢数为0
                };
                await FlashcardRepo.addComment(setId, newComment);

                setComment("");
                await fetchComments(); // 直接调用 fetchComments
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
                                <IconButton onClick={() => handleDeleteClick(card)}>
                                    <DeleteIcon />
                                </IconButton>
                            </ListItem>
                        ))}
                        <Button onClick={() => setOpenAdd(true)} startIcon={<AddIcon />}>
                            Add
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
                    </div>
                </div>

                <div style={{
                    maxHeight: "30%", overflowY: "scroll", backgroundColor: '#fff', borderRadius: '8px',
                    padding: '10px', boxShadow: '0px 0px 15px rgba(0,0,0,0.1)'
                }}>
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
                                        console.log("Like button clicked for commentId:", comment.commentId); // Adding console log here
                                        handleLikeClick(comment.commentId);
                                    }}
                                >
                                    {comment.likes || 0}
                                </Button>
                            </div>
                        </div>
                    ))}
                    <div style={{
                        display: "flex", alignItems: "center", padding: "10px", borderTop: '1px solid #e0e0e0'
                    }}>
                        <TextField fullWidth label="Add a comment" variant="outlined" value={comment} onChange={(e) => setComment(e.target.value)} />
                        <IconButton onClick={handleSendComment}>
                            <SendIcon />
                        </IconButton>
                    </div>
                </div>

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
                            onClick={confirmDelete} // confirm the deletion when "Yes" is clicked
                            color="primary"
                        >
                            Yes
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </ThemeProvider>
    );

}

export default FlashcardApp;
