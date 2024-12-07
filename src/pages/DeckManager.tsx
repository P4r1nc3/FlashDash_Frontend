import {
    Container,
    Typography,
    Tabs,
    Tab,
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
import { Deck, DeckType } from '../interfaces/Deck';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const DeckManager = () => {
    const [decks, setDecks] = useState<Deck[]>([]);
    const [filteredDecks, setFilteredDecks] = useState<Deck[]>([]);
    const [activeTab, setActiveTab] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOption, setSortOption] = useState('recent');
    const [modalOpen, setModalOpen] = useState(false);
    const [editingDeck, setEditingDeck] = useState<Deck | null>(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [deckType, setDeckType] = useState<DeckType>('CARD');
    const navigate = useNavigate();

    useEffect(() => {
        fetchDecks();
    }, []);

    useEffect(() => {
        filterAndSortDecks();
    }, [decks, activeTab, searchTerm, sortOption]);

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

        if (activeTab === 1) {
            filtered = decks.filter((deck) => deck.deckType === 'CARD');
        } else if (activeTab === 2) {
            filtered = decks.filter((deck) => deck.deckType === 'QUESTION');
        }

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

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    const handleAddDeck = () => {
        resetModalState();
        setModalOpen(true);
    };

    const handleEditDeck = (deck: Deck) => {
        setEditingDeck(deck);
        setName(deck.name);
        setDescription(deck.description);
        setDeckType(deck.deckType);
        setModalOpen(true);
    };

    const handleDeleteDeck = async (deckId: number) => {
        try {
            await deleteDeck(deckId);
            fetchDecks();
        } catch (error) {
            console.error('Failed to delete deck:', error);
        }
    };

    const handleSubmitDeck = async () => {
        try {
            if (editingDeck) {
                // Update an existing deck
                await updateDeck(editingDeck.id, { name, description, deckType });
            } else {
                // Create a new deck
                await createDeck({ name, description, deckType });
            }
            fetchDecks();
            setModalOpen(false); // Close the modal
        } catch (error) {
            console.error('Failed to save deck:', error);
        }
    };

    const resetModalState = () => {
        setEditingDeck(null);
        setName('');
        setDescription('');
        setDeckType('CARD');
    };

    const formatDate = (date: string) => {
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long' };
        return new Date(date).toLocaleDateString(undefined, options);
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
            <Tabs
                value={activeTab}
                onChange={handleTabChange}
                centered
                textColor="primary"
                indicatorColor="primary"
                sx={{ marginBottom: 2 }}
            >
                <Tab label="Decks" />
                <Tab label="Card Decks" />
                <Tab label="Question Decks" />
            </Tabs>
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
                                <Typography variant="body2" color="textSecondary">
                                    {deck.deckType === 'CARD' ? 'Card Deck' : 'Question Deck'}
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
                                        handleDeleteDeck(deck.id);
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
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="deck-type-label">Deck Type</InputLabel>
                        <Select
                            labelId="deck-type-label"
                            value={deckType}
                            onChange={(e) => setDeckType(e.target.value as DeckType)}
                            disabled={!!editingDeck}
                        >
                            <MenuItem value="CARD">Card Deck</MenuItem>
                            <MenuItem value="QUESTION">Question Deck</MenuItem>
                        </Select>
                    </FormControl>
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
        </Container>
    );
};

export default DeckManager;
