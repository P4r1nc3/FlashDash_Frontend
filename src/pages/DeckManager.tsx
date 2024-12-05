import { useEffect, useState } from 'react';
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Grid,
    Card,
    CardContent,
    CardActions,
    Alert,
} from '@mui/material';
import { getDecks, createDeck, updateDeck, deleteDeck } from '../api/decks';
import { Deck } from '../interfaces/Deck';


const DeckManager = () => {
    const [decks, setDecks] = useState<Deck[]>([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [deckType, setDeckType] = useState('QUESTION');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [editingDeck, setEditingDeck] = useState<Deck | null>(null);

    useEffect(() => {
        fetchDecks();
    }, []);

    const fetchDecks = async () => {
        try {
            const data = await getDecks();
            setDecks(data);
        } catch (err: any) {
            setError('Failed to load decks.');
        }
    };

    const handleCreateOrUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingDeck) {
                await updateDeck(editingDeck.id, { name, description, deckType });
                setSuccess('Deck updated successfully!');
            } else {
                await createDeck({ name, description, deckType });
                setSuccess('Deck created successfully!');
            }
            resetForm();
            fetchDecks();
        } catch (err: any) {
            setError('Failed to save deck.');
        }
    };

    const handleDelete = async (deckId: number) => {
        try {
            await deleteDeck(deckId);
            setSuccess('Deck deleted successfully!');
            fetchDecks();
        } catch (err: any) {
            setError('Failed to delete deck.');
        }
    };

    const resetForm = () => {
        setName('');
        setDescription('');
        setDeckType('QUESTION');
        setEditingDeck(null);
        setError('');
        setSuccess('');
    };

    const handleEdit = (deck: Deck) => {
        setEditingDeck(deck);
        setName(deck.name);
        setDescription(deck.description);
        setDeckType(deck.deckType);
    };

    return (
        <Container maxWidth="md">
            <Box sx={{ mt: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Manage Decks
                </Typography>
                <form onSubmit={handleCreateOrUpdate}>
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
                    <TextField
                        label="Deck Type"
                        value={deckType}
                        onChange={(e) => setDeckType(e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                    />
                    {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
                    {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2 }}
                    >
                        {editingDeck ? 'Update Deck' : 'Create Deck'}
                    </Button>
                    {editingDeck && (
                        <Button
                            variant="outlined"
                            sx={{ mt: 2, ml: 2 }}
                            onClick={resetForm}
                        >
                            Cancel Edit
                        </Button>
                    )}
                </form>
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h5" gutterBottom>
                        Existing Decks
                    </Typography>
                    <Grid container spacing={2}>
                        {decks.map((deck) => (
                            <Grid item xs={12} sm={6} md={4} key={deck.id}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6">{deck.name}</Typography>
                                        <Typography color="textSecondary">
                                            {deck.description}
                                        </Typography>
                                        <Typography color="textSecondary">
                                            Type: {deck.deckType}
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Button
                                            size="small"
                                            onClick={() => handleEdit(deck)}
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
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
};

export default DeckManager;
