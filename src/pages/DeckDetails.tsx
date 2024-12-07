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
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { Difficulty } from '../enums/Difficulty'; // Import the Difficulty Enum
import {
    getCardsInDeck,
    addCardToDeck,
    updateCard,
} from '../api/cards';
import {
    getQuestionsInDeck,
    addQuestionToDeck,
    updateQuestion,
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
    const [isEditing, setIsEditing] = useState(false);
    const [editItemId, setEditItemId] = useState<string | null>(null);

    const [newQuestion, setNewQuestion] = useState('');
    const [newAnswer, setNewAnswer] = useState('');
    const [correctAnswers, setCorrectAnswers] = useState<string[]>(['']);
    const [incorrectAnswers, setIncorrectAnswers] = useState<string[]>(['']);
    const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.MEDIUM);

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
        setIsEditing(false);
        setEditItemId(null);
        setNewQuestion('');
        setNewAnswer('');
        setCorrectAnswers(['']);
        setIncorrectAnswers(['']);
        setDifficulty(Difficulty.MEDIUM);
        setModalOpen(true);
    };

    const handleEdit = (itemId: string) => {
        const item = deckType === 'CARD'
            ? cards.find((card) => card.cardId === itemId)
            : questions.find((question) => question.questionId === itemId);

        if (!item) return;

        setIsEditing(true);
        setEditItemId(itemId);
        setNewQuestion(item.question);

        if (deckType === 'CARD') {
            setNewAnswer(item.answer || '');
        } else if (deckType === 'QUESTION') {
            setCorrectAnswers(item.correctAnswers || []);
            setIncorrectAnswers(item.incorrectAnswers || []);
        }

        setDifficulty(item.difficulty as Difficulty);

        setModalOpen(true);
    };

    const handleSave = async () => {
        try {
            if (!deckId) return;

            if (deckType === 'CARD') {
                if (isEditing && editItemId) {
                    await updateCard(deckId, editItemId, {
                        question: newQuestion,
                        answer: newAnswer, // Cards require a single answer
                        difficulty,
                    });
                } else {
                    await addCardToDeck(deckId, {
                        question: newQuestion,
                        answer: newAnswer,
                        difficulty,
                    });
                }
                const updatedCards = await getCardsInDeck(deckId);
                setCards(updatedCards);
            } else if (deckType === 'QUESTION') {
                if (isEditing && editItemId) {
                    await updateQuestion(deckId, editItemId, {
                        question: newQuestion,
                        correctAnswers: correctAnswers.filter((ans) => ans),
                        incorrectAnswers: incorrectAnswers.filter((ans) => ans),
                        difficulty,
                    });
                } else {
                    await addQuestionToDeck(deckId, {
                        question: newQuestion,
                        correctAnswers: correctAnswers.filter((ans) => ans),
                        incorrectAnswers: incorrectAnswers.filter((ans) => ans),
                        difficulty,
                    });
                }
                const updatedQuestions = await getQuestionsInDeck(deckId);
                setQuestions(updatedQuestions);
            }

            setModalOpen(false);
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
                            onClick={() => handleEdit(deckType === 'CARD' ? currentItem.cardId : currentItem.questionId)}
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
                            {deckType === 'QUESTION' && (
                                <>
                                    <Typography
                                        variant="body2"
                                        color="textSecondary"
                                        sx={{ mt: 2 }}
                                    >
                                        <strong>Correct Answers:</strong> {currentItem?.correctAnswers?.join(', ')}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="textSecondary"
                                        sx={{ mt: 1 }}
                                    >
                                        <strong>Incorrect Answers:</strong> {currentItem?.incorrectAnswers?.join(', ')}
                                    </Typography>
                                </>
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

            {/* Add/Edit Modal */}
            <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
                <DialogTitle>
                    {isEditing ? 'Edit' : 'Add'} {deckType === 'CARD' ? 'Card' : 'Question'}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        label="Question"
                        value={newQuestion}
                        onChange={(e) => setNewQuestion(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    {deckType === 'CARD' && (
                        <TextField
                            label="Answer"
                            value={newAnswer}
                            onChange={(e) => setNewAnswer(e.target.value)}
                            fullWidth
                            margin="normal"
                        />
                    )}
                    {deckType === 'QUESTION' && (
                        <>
                            <Typography variant="subtitle1" sx={{ mt: 2 }}>
                                Correct Answers
                            </Typography>
                            {correctAnswers.map((answer, index) => (
                                <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <TextField
                                        label={`Correct Answer ${index + 1}`}
                                        value={answer}
                                        onChange={(e) =>
                                            setCorrectAnswers((prev) =>
                                                prev.map((ans, i) => (i === index ? e.target.value : ans))
                                            )
                                        }
                                        fullWidth
                                    />
                                    <Button
                                        onClick={() =>
                                            setCorrectAnswers((prev) =>
                                                prev.filter((_, i) => i !== index)
                                            )
                                        }
                                        sx={{ ml: 1 }}
                                        color="error"
                                    >
                                        Remove
                                    </Button>
                                </Box>
                            ))}
                            <Button
                                onClick={() => setCorrectAnswers((prev) => [...prev, ''])}
                                variant="outlined"
                                size="small"
                            >
                                Add Correct Answer
                            </Button>

                            <Typography variant="subtitle1" sx={{ mt: 3 }}>
                                Incorrect Answers
                            </Typography>
                            {incorrectAnswers.map((answer, index) => (
                                <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <TextField
                                        label={`Incorrect Answer ${index + 1}`}
                                        value={answer}
                                        onChange={(e) =>
                                            setIncorrectAnswers((prev) =>
                                                prev.map((ans, i) => (i === index ? e.target.value : ans))
                                            )
                                        }
                                        fullWidth
                                    />
                                    <Button
                                        onClick={() =>
                                            setIncorrectAnswers((prev) =>
                                                prev.filter((_, i) => i !== index)
                                            )
                                        }
                                        sx={{ ml: 1 }}
                                        color="error"
                                    >
                                        Remove
                                    </Button>
                                </Box>
                            ))}
                            <Button
                                onClick={() => setIncorrectAnswers((prev) => [...prev, ''])}
                                variant="outlined"
                                size="small"
                            >
                                Add Incorrect Answer
                            </Button>
                        </>
                    )}
                    <FormControl fullWidth margin="normal" sx={{ mt: 3 }}>
                        <InputLabel id="difficulty-label">Difficulty</InputLabel>
                        <Select
                            labelId="difficulty-label"
                            value={difficulty}
                            onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                        >
                            {Object.values(Difficulty).map((level) => (
                                <MenuItem key={level} value={level}>
                                    {level}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
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
