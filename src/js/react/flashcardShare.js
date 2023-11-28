import React, { useState, useEffect } from 'react';
import { Typography, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItem, IconButton, ThemeProvider, createTheme } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useParams } from 'react-router-dom';
import FlashcardRepo from '../repositories/FlashcardRepo';

function FlashcardShare() {
    const [term, setTerm] = useState('');
    const [definition, setDefinition] = useState('');
    const { setId } = useParams();
    const [cards, setCards] = useState([]);
    const [selectedCard, setSelectedCard] = useState(null);
    const [isFlipped, setIsFlipped] = useState(false);

    useEffect(() => {
        const fetchFlashcards = async () => {
            try {
                const flashcardData = await FlashcardRepo.getFlashcardItems(setId);
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

        fetchFlashcards();
    }, [setId]);

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
                                color: 'white'
                            }}
                        >
                            share
                        </Button>
                    </div>
                </div>
            </div>
        </ThemeProvider>
    );
}

export default FlashcardShare;
