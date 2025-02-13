import {
    Container,
    Typography,
    Box,
    Button,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Divider,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDecks, createDeck, updateDeck, deleteDeck } from '../api/decks';
import { Deck } from '../interfaces/Deck';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const DeckManager = () => {
    const [decks, setDecks] = useState<Deck[]>([]);
    const [filteredDecks, setFilteredDecks] = useState<Deck[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOption, setSortOption] = useState('recent');
    const [modalOpen, setModalOpen] = useState(false);
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [deckToDelete, setDeckToDelete] = useState<number | null>(null);
    const [editingDeck, setEditingDeck] = useState<Deck | null>(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchDecks();
    }, []);

    useEffect(() => {
        filterAndSortDecks();
    }, [decks, searchTerm, sortOption]);

    const fetchDecks = async () => {
        try {
            const data = await getDecks();
            setDecks(data);
        } catch (error) {
            console.error('Failed to fetch decks:', error);
        }
    };

    const filterAndSortDecks = () => {
        let filtered = decks;

        if (searchTerm) {
            filtered = filtered.filter((deck) =>
                deck.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (sortOption === 'recent') {
            filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        } else if (sortOption === 'alphabetical') {
            filtered.sort((a, b) => a.name.localeCompare(b.name));
        }

        setFilteredDecks(filtered);
    };

    const handleAddDeck = () => {
        resetModalState();
        setModalOpen(true);
    };

    const handleEditDeck = (deck: Deck) => {
        setEditingDeck(deck);
        setName(deck.name);
        setDescription(deck.description);
        setModalOpen(true);
    };

    const handleDeleteDeck = async () => {
        if (deckToDelete !== null) {
            try {
                await deleteDeck(deckToDelete);
                fetchDecks();
                setConfirmDeleteOpen(false);
            } catch (error) {
                console.error('Failed to delete deck:', error);
            }
        }
    };

    const openConfirmDeleteDialog = (deckId: number) => {
        setDeckToDelete(deckId);
        setConfirmDeleteOpen(true);
    };

    const resetModalState = () => {
        setEditingDeck(null);
        setName('');
        setDescription('');
    };

    const handleSubmitDeck = async () => {
        try {
            if (editingDeck) {
                await updateDeck(editingDeck.id, { name, description });
            } else {
                await createDeck({ name, description });
            }
            fetchDecks();
            setModalOpen(false);
        } catch (error) {
            console.error('Failed to save deck:', error);
        }
    };

    const formatDate = (date: string) => {
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long' };
        return new Date(date).toLocaleDateString('en-US', options);
    };

    const groupedDecksByDate = () => {
        const grouped: { [key: string]: Deck[] } = {};
        filteredDecks.forEach((deck) => {
            const dateKey = formatDate(deck.createdAt);
            if (!grouped[dateKey]) grouped[dateKey] = [];
            grouped[dateKey].push(deck);
        });
        return grouped;
    };

    const groupedDecks = groupedDecksByDate();

    return (
        <Container maxWidth="lg">
            <Box sx={{ textAlign: 'center', my: 4 }}>
                <Typography variant="h4" fontWeight="bold">
                    Your Library
                </Typography>
            </Box>
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={3}
                flexWrap="wrap"
                gap={2}
            >
                <FormControl sx={{ minWidth: 150 }}>
                    <InputLabel id="sort-select-label">Sort By</InputLabel>
                    <Select
                        labelId="sort-select-label"
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                    >
                        <MenuItem value="recent">Recent</MenuItem>
                        <MenuItem value="alphabetical">Alphabetical</MenuItem>
                    </Select>
                </FormControl>
                <TextField
                    placeholder="Search decks"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    fullWidth
                    sx={{ maxWidth: 400 }}
                />
                <Button variant="contained" color="primary" onClick={handleAddDeck}>
                    Add Deck
                </Button>
            </Box>
            {Object.keys(groupedDecks).map((date) => (
                <Box key={date} mb={4}>
                    <Box display="flex" alignItems="center" mb={1}>
                        <Typography
                            variant="subtitle1"
                            fontWeight="bold"
                            color="textSecondary"
                            sx={{
                                fontSize: '0.9rem',
                                color: '#757575',
                                flex: '0 0 auto',
                            }}
                        >
                            In {date}
                        </Typography>
                        <Divider
                            sx={{
                                flex: '1 1 auto',
                                marginLeft: 2,
                                borderColor: '#e0e0e0',
                            }}
                        />
                    </Box>
                    {groupedDecks[date].map((deck) => (
                        <Box
                            key={deck.id}
                            onClick={() => navigate(`/decks/${deck.id}`)}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: 2,
                                border: '1px solid #e0e0e0',
                                borderRadius: '8px',
                                marginBottom: 1,
                                cursor: 'pointer',
                                backgroundColor: '#fff',
                                '&:hover': { backgroundColor: '#f9f9f9' },
                            }}
                        >
                            <Box>
                                <Typography variant="h6">{deck.name}</Typography>
                                <Typography
                                    variant="body2"
                                    color="textSecondary"
                                    gutterBottom
                                >
                                    {deck.description}
                                </Typography>
                            </Box>
                            <Box>
                                <IconButton
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleEditDeck(deck);
                                    }}
                                >
                                    <EditIcon />
                                </IconButton>
                                <IconButton
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        openConfirmDeleteDialog(deck.id);
                                    }}
                                    color="error"
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </Box>
                        </Box>
                    ))}
                </Box>
            ))}
            <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
                <DialogTitle>{editingDeck ? 'Edit Deck' : 'Create Deck'}</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setModalOpen(false)} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmitDeck} variant="contained" color="primary">
                        {editingDeck ? 'Update' : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={confirmDeleteOpen} onClose={() => setConfirmDeleteOpen(false)}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete this deck? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteDeck} variant="outlined" color="error">
                        Delete
                    </Button>
                    <Button
                        onClick={() => setConfirmDeleteOpen(false)}
                        variant="contained"
                        sx={{ backgroundColor: '#f44336', color: '#fff', '&:hover': { backgroundColor: '#d32f2f' } }}
                    >
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default DeckManager;
