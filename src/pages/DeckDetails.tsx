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
import {
    ArrowBackIos as ArrowBackIosIcon,
    ArrowForwardIos as ArrowForwardIosIcon,
    Edit as EditIcon,
    Add as AddIcon,
    Delete as DeleteIcon,
} from '@mui/icons-material';
import { Difficulty } from '../enums/Difficulty';
import { getQuestionsInDeck, addQuestionToDeck, updateQuestion, deleteQuestion } from '../api/questions';
import { getDeckDetails } from '../api/decks';
import { QuestionResponse } from '../interfaces/Question';

const DeckDetails = () => {
    const { deckId } = useParams<{ deckId: string }>();
    const navigate = useNavigate();

    const [deckName, setDeckName] = useState('');
    const [deckDescription, setDeckDescription] = useState('');
    const [questions, setQuestions] = useState<QuestionResponse[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const [modalOpen, setModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editItemId, setEditItemId] = useState<string | null>(null);

    const [newQuestion, setNewQuestion] = useState('');
    const [correctAnswers, setCorrectAnswers] = useState<string[]>(['']);
    const [incorrectAnswers, setIncorrectAnswers] = useState<string[]>(['']);
    const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.MEDIUM);

    useEffect(() => {
        const fetchDeckDetails = async () => {
            try {
                if (!deckId) return;
                const deckDetails = await getDeckDetails(deckId);
                setDeckName(deckDetails.name);
                setDeckDescription(deckDetails.description);
                const questionData = await getQuestionsInDeck(deckId);
                setQuestions(questionData);
            } catch (error) {
                console.error('Failed to fetch deck details:', error);
            }
        };
        fetchDeckDetails();
    }, [deckId]);

    const openAddModal = () => {
        setIsEditing(false);
        resetModalFields();
        setModalOpen(true);
    };

    const openEditModal = (item: QuestionResponse) => {
        setIsEditing(true);
        setEditItemId(item.questionId);
        setNewQuestion(item.question);
        setCorrectAnswers(item.correctAnswers || []);
        setIncorrectAnswers(item.incorrectAnswers || []);
        setDifficulty(item.difficulty as Difficulty);
        setModalOpen(true);
    };

    const resetModalFields = () => {
        setEditItemId(null);
        setNewQuestion('');
        setCorrectAnswers(['']);
        setIncorrectAnswers(['']);
        setDifficulty(Difficulty.MEDIUM);
    };

    const saveQuestion = async () => {
        if (!deckId) return;
        try {
            const payload = {
                question: newQuestion,
                correctAnswers: correctAnswers.filter(Boolean),
                incorrectAnswers: incorrectAnswers.filter(Boolean),
                difficulty,
            };
            if (isEditing && editItemId) {
                await updateQuestion(deckId, editItemId, payload);
            } else {
                await addQuestionToDeck(deckId, payload);
            }
            setQuestions(await getQuestionsInDeck(deckId));
        } catch (error) {
            console.error('Failed to save question:', error);
        } finally {
            setModalOpen(false);
        }
    };

    const deleteCurrentQuestion = async (itemId: string) => {
        try {
            if (!deckId) return;
            await deleteQuestion(deckId, itemId);
            setQuestions(await getQuestionsInDeck(deckId));
        } catch (error) {
            console.error('Failed to delete question:', error);
        }
    };

    const nextQuestion = () => setCurrentIndex((prev) => (prev + 1) % questions.length);
    const prevQuestion = () => setCurrentIndex((prev) => (prev === 0 ? questions.length - 1 : prev - 1));

    const currentQuestion = questions[currentIndex];

    return (
        <Container>
            {/* Header Section */}
            <Box textAlign="center" my={4}>
                <Typography variant="h4" fontWeight="bold">{deckName}</Typography>
                {deckDescription && <Typography color="textSecondary">{deckDescription}</Typography>}
            </Box>

            {/* Action Buttons */}
            <Box display="flex" justifyContent="space-between" mb={3}>
                <Button variant="outlined" onClick={() => navigate('/decks')}>Back to Decks</Button>
                <Button variant="contained" startIcon={<AddIcon />} onClick={openAddModal}>Add Question</Button>
            </Box>
            <Box textAlign="center" mb={3}>
                <Button variant="contained" color="primary" onClick={() => navigate(`/decks/${deckId}/quiz`)}>Quiz Game</Button>
            </Box>

            {/* Question Viewer */}
            {questions.length > 0 ? (
                <Box display="flex" alignItems="center" justifyContent="center" mt={5} mb={5}>
                    <IconButton onClick={prevQuestion}><ArrowBackIosIcon /></IconButton>
                    <Card sx={{ width: 600, p: 3, position: 'relative' }}>
                        {currentQuestion && (
                            <>
                                <Box position="absolute" top={16} right={16} display="flex" gap={1}>
                                    <IconButton onClick={() => openEditModal(currentQuestion)}><EditIcon /></IconButton>
                                    <IconButton onClick={() => deleteCurrentQuestion(currentQuestion.questionId)} color="error"><DeleteIcon /></IconButton>
                                </Box>
                                <CardContent>
                                    <Typography variant="h5" textAlign="center">{currentQuestion.question}</Typography>
                                    <Typography mt={2}><strong>Correct:</strong> {currentQuestion.correctAnswers.join(', ')}</Typography>
                                    <Typography mt={1}><strong>Incorrect:</strong> {currentQuestion.incorrectAnswers.join(', ')}</Typography>
                                </CardContent>
                            </>
                        )}
                    </Card>
                    <IconButton onClick={nextQuestion}><ArrowForwardIosIcon /></IconButton>
                </Box>
            ) : (
                <Typography align="center">No questions available. Add a new question to get started.</Typography>
            )}

            <Typography align="center" color="textSecondary">
                {questions.length > 0 ? `${currentIndex + 1} / ${questions.length}` : ''}
            </Typography>

            {/* Modal for Adding/Editing Questions */}
            <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
                <DialogTitle>{isEditing ? 'Edit Question' : 'Add Question'}</DialogTitle>
                <DialogContent>
                    <TextField fullWidth label="Question" value={newQuestion} onChange={(e) => setNewQuestion(e.target.value)} margin="normal" />
                    <Typography mt={2}>Correct Answers</Typography>
                    {correctAnswers.map((answer, index) => (
                        <Box key={index} display="flex" mb={1}>
                            <TextField
                                fullWidth
                                value={answer}
                                onChange={(e) => setCorrectAnswers(correctAnswers.map((a, i) => (i === index ? e.target.value : a)))}
                            />
                            <Button color="error" onClick={() => setCorrectAnswers(correctAnswers.filter((_, i) => i !== index))}>Remove</Button>
                        </Box>
                    ))}
                    <Button onClick={() => setCorrectAnswers([...correctAnswers, ''])} size="small">Add Correct Answer</Button>

                    <Typography mt={2}>Incorrect Answers</Typography>
                    {incorrectAnswers.map((answer, index) => (
                        <Box key={index} display="flex" mb={1}>
                            <TextField
                                fullWidth
                                value={answer}
                                onChange={(e) => setIncorrectAnswers(incorrectAnswers.map((a, i) => (i === index ? e.target.value : a)))}
                            />
                            <Button color="error" onClick={() => setIncorrectAnswers(incorrectAnswers.filter((_, i) => i !== index))}>Remove</Button>
                        </Box>
                    ))}
                    <Button onClick={() => setIncorrectAnswers([...incorrectAnswers, ''])} size="small">Add Incorrect Answer</Button>

                    <FormControl fullWidth margin="normal">
                        <InputLabel>Difficulty</InputLabel>
                        <Select value={difficulty} onChange={(e) => setDifficulty(e.target.value as Difficulty)}>
                            {Object.values(Difficulty).map((level) => (
                                <MenuItem key={level} value={level}>{level}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setModalOpen(false)}>Cancel</Button>
                    <Button onClick={saveQuestion} variant="contained">Save</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default DeckDetails;
