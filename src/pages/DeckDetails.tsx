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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
} from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import {
    getCardsInDeck,
    addCardToDeck,
} from '../api/cards';
import {
    getQuestionsInDeck,
    addQuestionToDeck,
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
    const [modalOpen, setModalOpen] = useState(false);
    const [newQuestion, setNewQuestion] = useState('');
    const [newAnswer, setNewAnswer] = useState('');
    const [difficulty, setDifficulty] = useState('medium');
    const [incorrectAnswers, setIncorrectAnswers] = useState<string[]>(['', '', '']);

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

    const handleAdd = () => {
        setModalOpen(true);
    };

    const handleSave = async () => {
        try {
            if (!deckId) return;

            if (deckType === 'CARD') {
                await addCardToDeck(deckId, {
                    question: newQuestion,
                    answer: newAnswer,
                    difficulty,
                });
                const updatedCards = await getCardsInDeck(deckId);
                setCards(updatedCards);
            } else if (deckType === 'QUESTION') {
                await addQuestionToDeck(deckId, {
                    question: newQuestion,
                    correctAnswers: [newAnswer],
                    incorrectAnswers: incorrectAnswers.filter((ans) => ans),
                    difficulty,
                });
                const updatedQuestions = await getQuestionsInDeck(deckId);
                setQuestions(updatedQuestions);
            }

            setModalOpen(false);
            setNewQuestion('');
            setNewAnswer('');
            setDifficulty('medium');
            setIncorrectAnswers(['', '', '']);
        } catch (error) {
            console.error('Failed to save item:', error);
        }
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
                    <IconButton onClick={() => setCurrentIndex((prevIndex) => (prevIndex === 0 ? currentDeck.length - 1 : prevIndex - 1))}>
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
                    <IconButton onClick={() => setCurrentIndex((prevIndex) => (prevIndex === currentDeck.length - 1 ? 0 : prevIndex + 1))}>
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

            {/* Add Modal */}
            <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
                <DialogTitle>Add {deckType === 'CARD' ? 'Card' : 'Question'}</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Question"
                        value={newQuestion}
                        onChange={(e) => setNewQuestion(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label={deckType === 'CARD' ? 'Answer' : 'Correct Answer'}
                        value={newAnswer}
                        onChange={(e) => setNewAnswer(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    {deckType === 'QUESTION' && (
                        <>
                            {incorrectAnswers.map((incorrectAnswer, index) => (
                                <TextField
                                    key={index}
                                    label={`Incorrect Answer ${index + 1}`}
                                    value={incorrectAnswer}
                                    onChange={(e) =>
                                        setIncorrectAnswers((prev) =>
                                            prev.map((ans, i) =>
                                                i === index ? e.target.value : ans
                                            )
                                        )
                                    }
                                    fullWidth
                                    margin="normal"
                                />
                            ))}
                        </>
                    )}
                    <TextField
                        label="Difficulty"
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setModalOpen(false)} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleSave} variant="contained" color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default DeckDetails;
