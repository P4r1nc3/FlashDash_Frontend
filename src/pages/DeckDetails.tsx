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
    const [cards, setCards] = useState<CardResponse[]>([]);
    const [questions, setQuestions] = useState<QuestionResponse[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch deck details and data based on the deck type
    useEffect(() => {
        const fetchDeckDetails = async () => {
            try {
                if (!deckId) return;

                const deckDetails = await getDeckDetails(deckId);
                setDeckType(deckDetails.deckType);

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

    // Add a card or question based on the deck type
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

    // Delete a card or question
    const handleDelete = async (id: string) => {
        try {
            if (!deckId) return;

            if (deckType === 'CARD') {
                await deleteCard(deckId, id);
                const updatedCards = await getCardsInDeck(deckId);
                setCards(updatedCards);
            } else if (deckType === 'QUESTION') {
                await deleteQuestion(deckId, id);
                const updatedQuestions = await getQuestionsInDeck(deckId);
                setQuestions(updatedQuestions);
            }
        } catch (error) {
            console.error('Failed to delete item:', error);
        }
    };

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
            <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography variant="h4">
                    {deckType === 'CARD' ? 'Manage Cards' : 'Manage Questions'}
                </Typography>
            </Box>
            <Button
                variant="contained"
                onClick={handleAdd}
                sx={{ mb: 3 }}
            >
                Add {deckType === 'CARD' ? 'Card' : 'Question'}
            </Button>
            <Grid container spacing={3}>
                {(deckType === 'CARD' ? cards : questions).map((item) => {
                    const id = deckType === 'CARD' ? (item as CardResponse).cardId : (item as QuestionResponse).questionId;
                    const question = deckType === 'CARD' ? (item as CardResponse).question : (item as QuestionResponse).question;
                    const answer = deckType === 'CARD' ? (item as CardResponse).answer : null;

                    return (
                        <Grid item xs={12} sm={6} md={4} key={id}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6">{question}</Typography>
                                    {answer && (
                                        <Typography
                                            variant="body2"
                                            color="textSecondary"
                                        >
                                            {answer}
                                        </Typography>
                                    )}
                                </CardContent>
                                <CardActions>
                                    <Button
                                        color="error"
                                        onClick={() => handleDelete(id!)}
                                    >
                                        Delete
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>
            <Button
                variant="outlined"
                sx={{ mt: 3 }}
                onClick={() => navigate('/decks')}
            >
                Back to Decks
            </Button>
        </Container>
    );
};

export default DeckDetails;
