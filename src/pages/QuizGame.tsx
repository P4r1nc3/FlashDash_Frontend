import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { startGameSession, endGameSession } from "../api/gameSession.ts";
import { QuestionRequest, QuestionResponse } from "../interfaces/Question.ts";
import { GameSessionResult } from "../interfaces/GameSession.ts";

const GameSession = () => {
    const { deckId } = useParams<{ deckId: string }>();
    const navigate = useNavigate();

    const [questions, setQuestions] = useState<QuestionResponse[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
    const [showResult, setShowResult] = useState(false);
    const [showCountdown, setShowCountdown] = useState(true);
    const [countdown, setCountdown] = useState(3);
    const [shuffledAnswers, setShuffledAnswers] = useState<string[]>([]);
    const [gameResult, setGameResult] = useState<GameSessionResult | null>(null);
    const [userAnswersList, setUserAnswersList] = useState<QuestionRequest[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false); // Nowy stan, aby uniknąć wielokrotnego wysyłania

    useEffect(() => {
        handleStartGameSession();
    }, [deckId]);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setShowCountdown(false);
        }
    }, [countdown]);

    const handleStartGameSession = async () => {
        if (!deckId) return;
        try {
            const fetchedQuestions = await startGameSession(deckId);
            setQuestions(fetchedQuestions || []);
            if (fetchedQuestions.length > 0) {
                shuffleAnswers(fetchedQuestions[0]);
            }
        } catch (error) {
            console.error("Failed to start game session:", error);
        }
    };

    const shuffleAnswers = (question: QuestionResponse) => {
        const allAnswers = [...question.correctAnswers, ...question.incorrectAnswers];
        setShuffledAnswers(allAnswers.sort(() => Math.random() - 0.5));
    };

    const handleAnswerSelect = (answer: string) => {
        setSelectedAnswers((prev) =>
            prev.includes(answer) ? prev.filter((a) => a !== answer) : [...prev, answer]
        );
    };

    const saveUserAnswer = () => {
        const currentQuestion = questions[currentIndex];

        const userAnswer: QuestionRequest = {
            question: currentQuestion.question,
            correctAnswers: selectedAnswers,
            incorrectAnswers: shuffledAnswers.filter(answer => !selectedAnswers.includes(answer)),
            difficulty: currentQuestion.difficulty
        };

        setUserAnswersList(prev => [...prev, userAnswer]);
    };

    const handleNextQuestion = () => {
        saveUserAnswer();

        if (currentIndex + 1 < questions.length) {
            setCurrentIndex(prevIndex => prevIndex + 1);
            setSelectedAnswers([]);
            shuffleAnswers(questions[currentIndex + 1]);
        } else {
            setShowResult(true);
        }
    };

    useEffect(() => {
        if (showResult && !isSubmitting) {
            setIsSubmitting(true);
            saveUserAnswer();
            handleEndGameSession();
        }
    }, [showResult]);

    const handleEndGameSession = async () => {
        if (!deckId || userAnswersList.length === 0) return;
        try {
            const result = await endGameSession(deckId, userAnswersList);
            setGameResult(result);
        } catch (error) {
            console.error("Failed to end game session:", error);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-gray-100 to-gray-300">
            <div className="relative w-full max-w-4xl bg-white shadow-xl rounded-xl p-8 min-h-[80vh] flex flex-col">

                {/* Back Button */}
                <button
                    className="absolute top-4 left-4 text-gray-600 hover:text-gray-800 flex items-center gap-2"
                    onClick={() => navigate(`/decks/${deckId}`)}
                >
                    <AiOutlineArrowLeft size={20} /> Back
                </button>

                {/* Pasek nawigacyjny */}
                <div className="flex justify-center mt-6 space-x-6 border-b pb-3">
                    <button className="px-6 py-3 flex items-center gap-2 rounded-lg bg-blue-500 text-white">
                        Quiz Game
                    </button>
                </div>

                {/* Odliczanie przed startem quizu */}
                {showCountdown ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1 }}
                        className="flex flex-col items-center justify-center flex-1"
                    >
                        <div className="w-24 h-24 border-4 border-blue-500 rounded-full flex items-center justify-center text-4xl font-bold">
                            {countdown > 0 ? countdown : "GO!"}
                        </div>
                        {countdown === 3 && <p className="mt-4 text-xl font-semibold">Ready...</p>}
                        {countdown === 2 && <p className="mt-4 text-xl font-semibold">Steady...</p>}
                        {countdown === 1 && <p className="mt-4 text-xl font-semibold">Go!</p>}
                    </motion.div>
                ) : showResult && gameResult ? (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mt-6">
                        <h2 className="text-2xl font-bold">Quiz Completed</h2>
                        <p className="text-lg text-gray-600 mt-2">Your Score: <span className="font-semibold">{gameResult.score} / {gameResult.totalQuestions}</span></p>
                        <p className="text-md text-gray-500">Accuracy: {gameResult.accuracy}%</p>
                        <p className="text-md text-gray-500">Time Taken: {gameResult.duration}</p>
                        <button
                            className="mt-6 bg-blue-500 text-white py-3 px-6 rounded-lg"
                            onClick={() => window.location.reload()}
                        >
                            Restart Quiz
                        </button>
                    </motion.div>
                ) : questions.length === 0 ? (
                    <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center text-gray-500 mt-6">
                        No questions available for this quiz.
                    </motion.p>
                ) : (
                    <>
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} key={currentIndex} className="flex flex-col items-center mt-6">
                            <h2 className="text-xl font-semibold">Question {currentIndex + 1} / {questions.length}</h2>
                            <div className="bg-gray-100 p-6 rounded-lg shadow-lg mt-4 w-full text-center">
                                <p className="text-lg font-semibold">{questions[currentIndex].question}</p>
                            </div>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
                            {shuffledAnswers.map((answer, index) => (
                                <button
                                    key={index}
                                    className={`block w-full py-3 px-4 mt-3 text-lg font-semibold rounded-lg transition ${
                                        selectedAnswers.includes(answer) ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"
                                    }`}
                                    onClick={() => handleAnswerSelect(answer)}
                                >
                                    {answer}
                                </button>
                            ))}
                        </motion.div>

                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-6 flex justify-center">
                            <button
                                className="px-6 py-3 rounded-lg text-white font-semibold bg-blue-500 hover:bg-blue-600"
                                onClick={handleNextQuestion}
                            >
                                {currentIndex + 1 === questions.length ? "Finish Quiz" : "Next Question"}
                            </button>
                        </motion.div>
                    </>
                )}
            </div>
        </div>
    );
};

export default GameSession;
