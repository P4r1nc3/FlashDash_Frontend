import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
    Container,
    Typography,
    Box,
    Grid,
    Card,
    CardContent,
    Button,
    Paper,
} from '@mui/material';
import { getCardsInDeck } from '../api/cards';

interface CardResponse {
    cardId: string;
    question: string;
    answer: string;
}

const MatchingGame = () => {
    const { deckId } = useParams<{ deckId: string }>();
    const [cards, setCards] = useState<CardResponse[]>([]);
    const [answers, setAnswers] = useState<string[]>([]);
    const [matches, setMatches] = useState<{ [key: string]: string }>({});
    const [feedback, setFeedback] = useState<{ [key: string]: boolean } | null>(
        null
    );
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCards = async () => {
            try {
                if (!deckId) return;

                const fetchedCards = await getCardsInDeck(deckId);
                setCards(fetchedCards || []);
                setAnswers(
                    fetchedCards.map((card) => card.answer).sort(() => Math.random() - 0.5) // Shuffle answers
                );
            } catch (error) {
                console.error('Failed to fetch cards:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCards();
    }, [deckId]);

    const handleMatchChange = (question: string, answer: string) => {
        setMatches((prevMatches) => ({
            ...prevMatches,
            [question]: answer,
        }));
    };

    const handleCheck = () => {
        const feedback = cards.reduce((acc, card) => {
            acc[card.question] = matches[card.question] === card.answer;
            return acc;
        }, {} as { [key: string]: boolean });
        setFeedback(feedback);
    };

    const handleReset = () => {
        setMatches({});
        setFeedback(null);
        setAnswers((prevAnswers) => [...prevAnswers].sort(() => Math.random() - 0.5)); // Shuffle answers again
    };

    if (loading) {
        return (
            <Container sx={{ textAlign: 'center', mt: 4 }}>
                <Typography>Loading...</Typography>
            </Container>
        );
    }

    return (
        <Container>
            <Box sx={{ textAlign: 'center', my: 4 }}>
                <Typography variant="h4" fontWeight="bold">
                    Matching Game
                </Typography>
                <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
                    Drag and drop the answers to match them with the questions
                </Typography>
            </Box>

            <Grid container spacing={4}>
                {/* Questions Column */}
                <Grid item xs={12} md={6}>
                    <Paper
                        elevation={3}
                        sx={{
                            p: 3,
                            backgroundColor: '#f5f5f5',
                            borderRadius: '8px',
                        }}
                    >
                        <Typography variant="h5" gutterBottom>
                            Questions
                        </Typography>
                        {cards.map((card) => (
                            <Paper
                                key={card.cardId}
                                sx={{
                                    p: 2,
                                    mb: 2,
                                    border: feedback
                                        ? feedback[card.question]
                                            ? '2px solid green'
                                            : '2px solid red'
                                        : '2px solid #ccc',
                                    transition: 'border-color 0.3s',
                                    backgroundColor: feedback
                                        ? feedback[card.question]
                                            ? '#e8f5e9'
                                            : '#ffebee'
                                        : 'white',
                                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                                    borderRadius: '8px',
                                }}
                            >
                                <Typography>{card.question}</Typography>
                                <Box
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={(e) =>
                                        handleMatchChange(
                                            card.question,
                                            e.dataTransfer.getData('text')
                                        )
                                    }
                                    sx={{
                                        mt: 1,
                                        p: 2,
                                        border: '2px dashed #ccc',
                                        borderRadius: '8px',
                                        textAlign: 'center',
                                        backgroundColor: matches[card.question]
                                            ? '#f0f0f0'
                                            : 'transparent',
                                    }}
                                >
                                    {matches[card.question] || 'Drop answer here'}
                                </Box>
                            </Paper>
                        ))}
                    </Paper>
                </Grid>

                {/* Answers Column */}
                <Grid item xs={12} md={6}>
                    <Paper
                        elevation={3}
                        sx={{
                            p: 3,
                            backgroundColor: '#f5f5f5',
                            borderRadius: '8px',
                        }}
                    >
                        <Typography variant="h5" gutterBottom>
                            Answers
                        </Typography>
                        {answers.map((answer, index) => (
                            <Card
                                key={index}
                                sx={{
                                    mb: 2,
                                    backgroundColor: Object.values(matches).includes(answer)
                                        ? '#f0f0f0'
                                        : 'white',
                                    opacity: Object.values(matches).includes(answer) ? 0.6 : 1,
                                    pointerEvents: Object.values(matches).includes(answer)
                                        ? 'none'
                                        : 'auto',
                                    transition: 'background-color 0.3s, opacity 0.3s',
                                    cursor: 'grab',
                                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                                    borderRadius: '8px',
                                }}
                                draggable
                                onDragStart={(e) =>
                                    e.dataTransfer.setData('text', answer)
                                }
                            >
                                <CardContent>
                                    <Typography>{answer}</Typography>
                                </CardContent>
                            </Card>
                        ))}
                    </Paper>
                </Grid>
            </Grid>

            {/* Controls */}
            <Box
                sx={{
                    textAlign: 'center',
                    mt: 4,
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 2,
                }}
            >
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleCheck}
                    sx={{
                        px: 4,
                        py: 1.5,
                        fontSize: '16px',
                        fontWeight: 'bold',
                    }}
                >
                    Check
                </Button>
                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={handleReset}
                    sx={{
                        px: 4,
                        py: 1.5,
                        fontSize: '16px',
                        fontWeight: 'bold',
                    }}
                >
                    Reset
                </Button>
            </Box>
        </Container>
    );
};

export default MatchingGame;
