import {
    Container,
    Typography,
    Tabs,
    Tab,
    Box,
    Button,
    Grid,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Card,
    CardContent,
    CardActions,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDecks, createDeck, updateDeck, deleteDeck } from '../api/decks';
import { Deck, DeckType } from '../interfaces/Deck';

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
        setEditingDeck(null);
        setName('');
        setDescription('');
        setDeckType('CARD');
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
                await updateDeck(editingDeck.id, { name, description, deckType });
            } else {
                await createDeck({ name, description, deckType });
            }
            fetchDecks();
            setModalOpen(false);
        } catch (error) {
            console.error('Failed to save deck:', error);
        }
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
                {/* Sorting Dropdown */}
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
                {/* Search Bar */}
                <TextField
                    placeholder="Search decks"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    fullWidth
                    sx={{ maxWidth: 400 }}
                />
                {/* Add Deck Button */}
                <Button variant="contained" color="primary" onClick={handleAddDeck}>
                    Add Deck
                </Button>
            </Box>
            {/* Decks List */}
            {Object.keys(groupedDecks).map((date) => (
                <Box key={date} mb={4}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                        {date}
                    </Typography>
                    <Grid container spacing={3}>
                        {groupedDecks[date].map((deck) => (
                            <Grid item xs={12} sm={6} md={4} key={deck.id}>
                                <Card>
                                    <CardContent>
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
                                    </CardContent>
                                    <CardActions>
                                        <Button
                                            size="small"
                                            onClick={() =>
                                                navigate(`/decks/${deck.id}`)
                                            }
                                        >
                                            View
                                        </Button>
                                        <Button
                                            size="small"
                                            color="primary"
                                            onClick={() => handleEditDeck(deck)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            size="small"
                                            color="error"
                                            onClick={() => handleDeleteDeck(deck.id)}
                                        >
                                            Delete
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            ))}
            {/* Modal for Adding/Editing Deck */}
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
