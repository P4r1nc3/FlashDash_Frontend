import { useEffect, useState } from 'react';
import {
    Container,
    Box,
    Typography,
    Button,
    Grid,
    Card,
    CardContent,
    CardActions,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import { getDecks, createDeck, updateDeck, deleteDeck } from '../api/decks';
import { Deck, DeckType } from '../interfaces/Deck';
import { useNavigate } from 'react-router-dom';

const DeckManager = () => {
    const [decks, setDecks] = useState<Deck[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingDeck, setEditingDeck] = useState<Deck | null>(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [deckType, setDeckType] = useState<DeckType>(DeckType.QUESTION);
    const navigate = useNavigate();

    useEffect(() => {
        fetchDecks();
    }, []);

    const fetchDecks = async () => {
        try {
            const data = await getDecks();
            setDecks(data);
        } catch (error) {
            console.error('Failed to fetch decks:', error);
        }
    };

    const handleOpenModal = (deck?: Deck) => {
        if (deck) {
            setEditingDeck(deck);
            setName(deck.name);
            setDescription(deck.description);
            setDeckType(deck.deckType);
        } else {
            resetForm();
        }
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        resetForm();
    };

    const handleSubmit = async () => {
        try {
            if (editingDeck) {
                await updateDeck(editingDeck.id, { name, description, deckType });
            } else {
                await createDeck({ name, description, deckType });
            }
            fetchDecks();
            handleCloseModal();
        } catch (error) {
            console.error('Failed to save deck:', error);
        }
    };

    const handleDelete = async (deckId: number) => {
        try {
            await deleteDeck(deckId);
            fetchDecks();
        } catch (error) {
            console.error('Failed to delete deck:', error);
        }
    };

    const resetForm = () => {
        setEditingDeck(null);
        setName('');
        setDescription('');
        setDeckType(DeckType.QUESTION);
    };

    const handleViewDeck = (deckId: number) => {
        navigate(`/decks/${deckId}`);
    };

    return (
        <Container maxWidth="lg">
            <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Manage Decks
                </Typography>
            </Box>
            <Grid container spacing={3} justifyContent="center">
                {decks.map((deck) => (
                    <Grid item xs={12} sm={6} md={4} key={deck.id}>
                        <Card sx={{ height: 180, position: 'relative' }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    {deck.name}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {deck.description}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Type: {deck.deckType}
                                </Typography>
                            </CardContent>
                            <CardActions
                                sx={{ position: 'absolute', bottom: 8, right: 8 }}
                            >
                                <Button size="small" onClick={() => handleViewDeck(deck.id)}>
                                    View
                                </Button>
                                <Button
                                    size="small"
                                    onClick={() => handleOpenModal(deck)}
                                >
                                    Edit
                                </Button>
                                <Button
                                    size="small"
                                    color="error"
                                    onClick={() => handleDelete(deck.id)}
                                >
                                    Delete
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
                <Grid item xs={12} sm={6} md={4}>
                    <Card
                        onClick={() => handleOpenModal()}
                        sx={{
                            height: 180,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            border: '2px dashed gray',
                        }}
                    >
                        <Typography variant="h5" color="textSecondary">
                            + Add Deck
                        </Typography>
                    </Card>
                </Grid>
            </Grid>

            {/* Modal for Adding/Editing Deck */}
            <Dialog open={modalOpen} onClose={handleCloseModal}>
                <DialogTitle>
                    {editingDeck ? 'Edit Deck' : 'Create Deck'}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        label="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                    />
                    <TextField
                        label="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                    />
                    <FormControl fullWidth margin="normal" required>
                        <InputLabel id="deck-type-label">Deck Type</InputLabel>
                        <Select
                            labelId="deck-type-label"
                            value={deckType}
                            onChange={(e) =>
                                setDeckType(e.target.value as DeckType)
                            }
                            disabled={!!editingDeck} // Disable when editing
                        >
                            <MenuItem value={DeckType.QUESTION}>Question</MenuItem>
                            <MenuItem value={DeckType.CARD}>Card</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} variant="contained" color="primary">
                        {editingDeck ? 'Update' : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default DeckManager;
