import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Box,
    Button,
    IconButton,
    Card,
    CardContent,
} from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import {
    getCardsInDeck,
    addCardToDeck,
    deleteCard,
} from '../api/cards';
import {
    getQuestionsInDeck,
    addQuestionToDeck,
    deleteQuestion,
} from '../api/questions';
import { getDeckDetails } from '../api/decks';
import { DeckType } from '../interfaces/Deck';
import { CardResponse } from '../interfaces/Card';
import { QuestionResponse } from '../interfaces/Question';

const DeckDetails = () => {
    const { deckId } = useParams<{ deckId: string }>();
    const navigate = useNavigate();

    const [deckType, setDeckType] = useState<DeckType | null>(null);
    const [deckName, setDeckName] = useState('');
    const [deckDescription, setDeckDescription] = useState('');
    const [cards, setCards] = useState<CardResponse[]>([]);
    const [questions, setQuestions] = useState<QuestionResponse[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDeckDetails = async () => {
            try {
                if (!deckId) return;

                const deckDetails = await getDeckDetails(deckId);
                setDeckType(deckDetails.deckType);
                setDeckName(deckDetails.name);
                setDeckDescription(deckDetails.description);

                if (deckDetails.deckType === 'CARD') {
                    const cardData = await getCardsInDeck(deckId);
                    setCards(cardData);
                } else if (deckDetails.deckType === 'QUESTION') {
                    const questionData = await getQuestionsInDeck(deckId);
                    setQuestions(questionData);
                }
            } catch (error) {
                console.error('Failed to fetch deck details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDeckDetails();
    }, [deckId]);

    const handleAdd = async () => {
        try {
            if (!deckId) return;

            if (deckType === 'CARD') {
                await addCardToDeck(deckId, {
                    question: 'Sample Question',
                    answer: 'Sample Answer',
                    difficulty: 'medium',
                });
                const updatedCards = await getCardsInDeck(deckId);
                setCards(updatedCards);
            } else if (deckType === 'QUESTION') {
                await addQuestionToDeck(deckId, {
                    question: 'Sample Question',
                    correctAnswers: ['Correct Answer'],
                    incorrectAnswers: ['Wrong Answer 1', 'Wrong Answer 2'],
                    difficulty: 'medium',
                });
                const updatedQuestions = await getQuestionsInDeck(deckId);
                setQuestions(updatedQuestions);
            }
        } catch (error) {
            console.error('Failed to add item:', error);
        }
    };

    const handleNavigate = (direction: 'prev' | 'next') => {
        if (direction === 'prev') {
            setCurrentIndex((prevIndex) =>
                prevIndex === 0 ? currentDeck.length - 1 : prevIndex - 1
            );
        } else {
            setCurrentIndex((prevIndex) =>
                prevIndex === currentDeck.length - 1 ? 0 : prevIndex + 1
            );
        }
    };

    const handleEdit = (id: string) => {
        console.log(`Edit ${id}`);
    };

    const currentDeck = deckType === 'CARD' ? cards : questions;
    const currentItem = currentDeck[currentIndex];

    if (loading) {
        return (
            <Container>
                <Typography variant="h6" align="center" sx={{ mt: 5 }}>
                    Loading deck details...
                </Typography>
            </Container>
        );
    }

    return (
        <Container>
            <Box sx={{ textAlign: 'center', my: 4 }}>
                <Typography variant="h4" fontWeight="bold">
                    {deckName}
                </Typography>
                {deckDescription && (
                    <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{ mt: 1 }}
                    >
                        {deckDescription}
                    </Typography>
                )}
            </Box>

            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 3,
                }}
            >
                <Button variant="outlined" onClick={() => navigate('/decks')}>
                    Back to Decks
                </Button>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAdd}
                >
                    Add {deckType === 'CARD' ? 'Card' : 'Question'}
                </Button>
            </Box>

            {currentDeck.length > 0 ? (
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mt: 5,
                        mb: 5,
                        position: 'relative',
                    }}
                >
                    <IconButton onClick={() => handleNavigate('prev')}>
                        <ArrowBackIosIcon />
                    </IconButton>
                    <Card
                        sx={{
                            width: '100%',
                            maxWidth: 600,
                            p: 3,
                            position: 'relative',
                        }}
                    >
                        <IconButton
                            onClick={() => handleEdit(currentItem.cardId || currentItem.questionId)}
                            sx={{
                                position: 'absolute',
                                top: 16,
                                right: 16,
                                color: 'gray',
                            }}
                        >
                            <EditIcon />
                        </IconButton>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Typography variant="h5">
                                {currentItem?.question}
                            </Typography>
                            {deckType === 'CARD' && currentItem?.answer && (
                                <Typography
                                    variant="body2"
                                    color="textSecondary"
                                    sx={{ mt: 2 }}
                                >
                                    {currentItem?.answer}
                                </Typography>
                            )}
                        </CardContent>
                    </Card>
                    <IconButton onClick={() => handleNavigate('next')}>
                        <ArrowForwardIosIcon />
                    </IconButton>
                </Box>
            ) : (
                <Typography variant="body1" align="center" sx={{ mt: 5 }}>
                    No items in this deck yet. Add a{' '}
                    {deckType === 'CARD' ? 'Card' : 'Question'} to get started.
                </Typography>
            )}

            {currentDeck.length > 0 && (
                <Typography
                    variant="body2"
                    color="textSecondary"
                    align="center"
                    sx={{ mt: 2 }}
                >
                    {currentIndex + 1} / {currentDeck.length}
                </Typography>
            )}
        </Container>
    );
};

export default DeckDetails;
