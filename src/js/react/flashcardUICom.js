import React, { useState, useEffect } from 'react';
import { Button, TextField, Typography, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItem, IconButton, Avatar, ThemeProvider, createTheme } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SendIcon from '@mui/icons-material/Send';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useParams } from 'react-router-dom';
import FlashCardRepository from '../repositories/FlashCardRepository';

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

    useEffect(() => {
        const fetchFlashcards = async () => {
            try {
                const flashcardData = await FlashCardRepository.getFlashcardItems(setId);
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
                const commentsData = await FlashCardRepository.getCommentsWithUserData(setId);
                console.log("fetching comments", commentsData);
                setComments(commentsData);
            } catch (error) {
                console.error("Failed to fetch comments:", error);
            }
        };

        fetchFlashcards();
        fetchComments();
    }, [setId]);


    const handleSendComment = async () => {
        if (comment) {
            try {
                const newComment = { user: 'UserA', content: comment };
                await FlashCardRepository.addComment(setId, newComment);
                setComments(prevComments => [...prevComments, newComment]);
                setComment("");
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
                await FlashCardRepository.deleteFlashcard(setId, cardToDelete.flashcardId);
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
                const newFlashcardId = await FlashCardRepository.addFlashcardItem(setId, term, definition);
                setCards((prev) => [...prev, { term, definition, flashcardId: newFlashcardId }]); 
                setTerm('');
                setDefinition('');
            } catch (error) {
                console.error("Failed to add flashcard:", error);
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
                            display: "flex", alignItems: "center", padding: "10px", borderBottom: '1px solid #e0e0e0'
                        }}>
                            <Avatar src="/broken-image.jpg" />
                            <Typography variant="body1" style={{ marginLeft: "10px", fontWeight: 'bold' }}>
                                {comment.user}
                            </Typography>
                            <Typography variant="body1" style={{ marginLeft: "10px" }}>
                                {comment.content}
                            </Typography>
                            <IconButton>
                                <ThumbUpIcon />
                            </IconButton>
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
