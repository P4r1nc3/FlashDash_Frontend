import { useEffect, useState } from 'react';
import {
    Container,
    Typography,
    Box,
    Card,
    CardContent,
    CircularProgress,
    IconButton,
} from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { getCardsInDeck } from '../api/cards';
import { useParams } from 'react-router-dom';

interface CardData {
    question: string;
    answer: string;
}

const FlashGame = () => {
    const { deckId } = useParams<{ deckId: string }>();
    const [cards, setCards] = useState<CardData[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCards = async () => {
            try {
                if (!deckId) {
                    setError('Invalid deck ID.');
                    setLoading(false);
                    return;
                }

                const fetchedCards = await getCardsInDeck(deckId);
                setCards(fetchedCards || []); // Ensure it's always an array
            } catch (error) {
                console.error('Failed to fetch cards:', error);
                setError('Failed to fetch cards. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchCards();
    }, [deckId]);

    const handleNext = () => {
        if (cards.length > 0) {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % cards.length);
            setIsFlipped(false);
        }
    };

    const handlePrev = () => {
        if (cards.length > 0) {
            setCurrentIndex((prevIndex) =>
                prevIndex === 0 ? cards.length - 1 : prevIndex - 1
            );
            setIsFlipped(false);
        }
    };

    const currentCard = cards.length > 0 ? cards[currentIndex] : null;

    if (loading) {
        return (
            <Container sx={{ textAlign: 'center', mt: 4 }}>
                <CircularProgress />
                <Typography sx={{ mt: 2 }}>Loading cards...</Typography>
            </Container>
        );
    }

    if (error) {
        return (
            <Container sx={{ textAlign: 'center', mt: 4 }}>
                <Typography color="error">{error}</Typography>
            </Container>
        );
    }

    return (
        <Container>
            <Box sx={{ textAlign: 'center', my: 4 }}>
                <Typography variant="h4">Flashcards</Typography>
            </Box>

            {currentCard ? (
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        my: 4,
                        position: 'relative',
                    }}
                >
                    {/* Left Navigation Arrow */}
                    <IconButton
                        onClick={handlePrev}
                        disabled={cards.length === 0}
                        sx={{
                            position: 'absolute',
                            left: 0,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            zIndex: 10,
                        }}
                    >
                        <ArrowBackIosIcon />
                    </IconButton>

                    {/* Flashcard */}
                    <Box
                        onClick={() => setIsFlipped((prev) => !prev)}
                        sx={{
                            width: '100%',
                            maxWidth: 700,
                            height: 400,
                            perspective: '1000px',
                            cursor: 'pointer',
                        }}
                    >
                        <Box
                            sx={{
                                position: 'relative',
                                width: '100%',
                                height: '100%',
                                transformStyle: 'preserve-3d',
                                transition: 'transform 0.6s',
                                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                            }}
                        >
                            {/* Front Side */}
                            <Card
                                sx={{
                                    position: 'absolute',
                                    width: '100%',
                                    height: '100%',
                                    backfaceVisibility: 'hidden',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: '#e0e0e0', // Original shade
                                }}
                            >
                                <CardContent>
                                    <Typography variant="h5">{currentCard.question}</Typography>
                                </CardContent>
                            </Card>

                            {/* Back Side */}
                            <Card
                                sx={{
                                    position: 'absolute',
                                    width: '100%',
                                    height: '100%',
                                    backfaceVisibility: 'hidden',
                                    transform: 'rotateY(180deg)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: '#f5f5f5', // Slightly lighter shade
                                }}
                            >
                                <CardContent>
                                    <Typography variant="h5">{currentCard.answer}</Typography>
                                </CardContent>
                            </Card>
                        </Box>
                    </Box>

                    {/* Right Navigation Arrow */}
                    <IconButton
                        onClick={handleNext}
                        disabled={cards.length === 0}
                        sx={{
                            position: 'absolute',
                            right: 0,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            zIndex: 10,
                        }}
                    >
                        <ArrowForwardIosIcon />
                    </IconButton>
                </Box>
            ) : (
                <Typography>No cards available to display</Typography>
            )}

            {/* Pagination */}
            <Box sx={{ textAlign: 'center', mt: 3 }}>
                <Typography>
                    {cards.length > 0 ? `${currentIndex + 1} / ${cards.length}` : '0 / 0'}
                </Typography>
            </Box>
        </Container>
    );
};

export default FlashGame;
