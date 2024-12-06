import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Box,
    Typography,
    Button,
    Grid,
    Card,
    CardContent,
    CardActions,
} from '@mui/material';
import { getCardsInDeck, addCardToDeck, deleteCard } from '../api/cards';
import { getQuestionsInDeck, addQuestionToDeck, deleteQuestion } from '../api/questions';
import { getDeckDetails } from '../api/decks'; // Dodaj API do pobierania szczegółów decka
import { DeckType } from '../interfaces/Deck';
import { CardResponse } from '../interfaces/Card';
import { QuestionResponse } from '../interfaces/Question';

const DeckDetails = () => {
    const { deckId } = useParams();
    const [deckType, setDeckType] = useState<DeckType | null>(null);
    const [cards, setCards] = useState<CardResponse[]>([]);
    const [questions, setQuestions] = useState<QuestionResponse[]>([]);
    const navigate = useNavigate();

    // Ustal typ decka przy pierwszym renderowaniu
    useEffect(() => {
        fetchDeckTypeAndDetails();
    }, []);

    // Pobierz szczegóły decka, aby ustalić jego typ
    const fetchDeckTypeAndDetails = async () => {
        try {
            const deckDetails = await getDeckDetails(deckId!); // Pobiera dane decka
            setDeckType(deckDetails.deckType); // Ustaw typ decka na podstawie szczegółów
            if (deckDetails.deckType === 'CARD') {
                const cardData = await getCardsInDeck(deckId!);
                setCards(cardData);
            } else if (deckDetails.deckType === 'QUESTION') {
                const questionData = await getQuestionsInDeck(deckId!);
                setQuestions(questionData);
            }
        } catch (error) {
            console.error('Failed to fetch deck details:', error);
        }
    };

    const handleAdd = async () => {
        try {
            if (deckType === 'CARD') {
                await addCardToDeck(deckId!, {
                    question: 'Sample Question',
                    answer: 'Sample Answer',
                    difficulty: 'medium',
                });
                const updatedCards = await getCardsInDeck(deckId!); // Aktualizuj listę kart
                setCards(updatedCards);
            } else if (deckType === 'QUESTION') {
                await addQuestionToDeck(deckId!, {
                    question: 'Sample Question',
                    correctAnswers: ['Correct Answer'],
                    incorrectAnswers: ['Wrong Answer 1', 'Wrong Answer 2'],
                    difficulty: 'medium',
                });
                const updatedQuestions = await getQuestionsInDeck(deckId!); // Aktualizuj listę pytań
                setQuestions(updatedQuestions);
            }
        } catch (error) {
            console.error('Failed to add item:', error);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            if (deckType === 'CARD') {
                await deleteCard(deckId!, id);
                const updatedCards = await getCardsInDeck(deckId!); // Aktualizuj listę kart
                setCards(updatedCards);
            } else if (deckType === 'QUESTION') {
                await deleteQuestion(deckId!, id);
                const updatedQuestions = await getQuestionsInDeck(deckId!); // Aktualizuj listę pytań
                setQuestions(updatedQuestions);
            }
        } catch (error) {
            console.error('Failed to delete item:', error);
        }
    };

    return (
        <Container>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography variant="h4">
                    {deckType === 'CARD' ? 'Manage Cards' : 'Manage Questions'}
                </Typography>
            </Box>
            <Button variant="contained" onClick={handleAdd} sx={{ mb: 3 }}>
                Add {deckType === 'CARD' ? 'Card' : 'Question'}
            </Button>
            <Grid container spacing={3}>
                {(deckType === 'CARD' ? cards : questions).map((item) => (
                    <Grid item xs={12} sm={6} md={4} key={item.cardId || item.questionId}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">{item.question}</Typography>
                                {deckType === 'CARD' && (
                                    <Typography variant="body2" color="textSecondary">
                                        {item.answer}
                                    </Typography>
                                )}
                            </CardContent>
                            <CardActions>
                                <Button
                                    color="error"
                                    onClick={() =>
                                        handleDelete(item.cardId || item.questionId)
                                    }
                                >
                                    Delete
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <Button variant="outlined" sx={{ mt: 3 }} onClick={() => navigate('/decks')}>
                Back to Decks
            </Button>
        </Container>
    );
};

export default DeckDetails;
