import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getQuestionsInDeck } from '../api/questions';
import {
    Container,
    Typography,
    Box,
    Card,
    CardContent,
    Button,
} from '@mui/material';

interface QuestionData {
    questionId: string;
    question: string;
    correctAnswers: string[];
    incorrectAnswers: string[];
}

const QuizGame = () => {
    const { deckId } = useParams<{ deckId: string }>();
    const [questions, setQuestions] = useState<QuestionData[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                if (!deckId) return;

                const fetchedQuestions = await getQuestionsInDeck(deckId);
                setQuestions(fetchedQuestions || []);
            } catch (error) {
                console.error('Failed to fetch questions:', error);
            }
        };

        fetchQuestions();
    }, [deckId]);

    const handleAnswerSelect = (answer: string) => {
        setSelectedAnswer(answer);
    };

    const handleNextQuestion = () => {
        const currentQuestion = questions[currentIndex];
        if (selectedAnswer) {
            if (currentQuestion.correctAnswers.includes(selectedAnswer)) {
                setScore((prevScore) => prevScore + 1);
            }
        }

        if (currentIndex + 1 < questions.length) {
            setCurrentIndex((prevIndex) => prevIndex + 1);
            setSelectedAnswer(null);
        } else {
            setShowResult(true);
        }
    };

    if (showResult) {
        return (
            <Container>
                <Typography variant="h4" align="center" sx={{ mt: 5 }}>
                    Quiz Completed
                </Typography>
                <Typography variant="h5" align="center" sx={{ mt: 3 }}>
                    Your Score: {score} / {questions.length}
                </Typography>
                <Box sx={{ textAlign: 'center', mt: 3 }}>
                    <Button variant="contained" onClick={() => window.location.reload()}>
                        Restart Quiz
                    </Button>
                </Box>
            </Container>
        );
    }

    if (questions.length === 0) {
        return (
            <Container>
                <Typography variant="h6" align="center" sx={{ mt: 5 }}>
                    No questions available for this quiz.
                </Typography>
            </Container>
        );
    }

    const currentQuestion = questions[currentIndex];
    const allAnswers = [
        ...currentQuestion.correctAnswers,
        ...currentQuestion.incorrectAnswers,
    ].sort(() => Math.random() - 0.5);

    return (
        <Container>
            <Typography variant="h5" align="center" sx={{ mt: 5 }}>
                Question {currentIndex + 1} / {questions.length}
            </Typography>
            <Card sx={{ mt: 4, p: 3 }}>
                <CardContent>
                    <Typography variant="h6">{currentQuestion.question}</Typography>
                    <Box sx={{ mt: 3 }}>
                        {allAnswers.map((answer, index) => (
                            <Button
                                key={index}
                                variant={
                                    selectedAnswer === answer
                                        ? 'contained'
                                        : 'outlined'
                                }
                                color={
                                    selectedAnswer === answer &&
                                    currentQuestion.correctAnswers.includes(answer)
                                        ? 'success'
                                        : selectedAnswer === answer &&
                                        !currentQuestion.correctAnswers.includes(answer)
                                            ? 'error'
                                            : 'primary'
                                }
                                onClick={() => handleAnswerSelect(answer)}
                                fullWidth
                                sx={{ mb: 2 }}
                            >
                                {answer}
                            </Button>
                        ))}
                    </Box>
                </CardContent>
            </Card>
            <Box sx={{ textAlign: 'center', mt: 4 }}>
                <Button
                    variant="contained"
                    onClick={handleNextQuestion}
                    disabled={!selectedAnswer}
                >
                    {currentIndex + 1 === questions.length
                        ? 'Finish Quiz'
                        : 'Next Question'}
                </Button>
            </Box>
        </Container>
    );
};

export default QuizGame;
