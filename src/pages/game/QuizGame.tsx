import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { startGameSession, endGameSession } from "../../api/gameSession.ts";
import { QuestionRequest, QuestionResponse } from "../../interfaces/Question.ts";
import { GameSessionResult } from "../../interfaces/GameSession.ts";
import MainLayout from "../../components/MainLayout";
import { BsLightbulb, BsCheck2Circle, BsXCircle } from "react-icons/bs";
import { FaRegClock } from "react-icons/fa";

const QuizGame = () => {
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
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [deckName, setDeckName] = useState("Quiz");
    const [timeSpent, setTimeSpent] = useState(0);
    const [startTime, setStartTime] = useState<number | null>(null);

    useEffect(() => {
        handleStartGameSession();
    }, [deckId]);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setShowCountdown(false);
            setStartTime(Date.now());
        }
    }, [countdown]);

    // Time counter update
    useEffect(() => {
        if (!showCountdown && !showResult && startTime) {
            const timer = setInterval(() => {
                setTimeSpent(Math.floor((Date.now() - startTime) / 1000));
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [showCountdown, showResult, startTime]);

    const handleStartGameSession = async () => {
        if (!deckId) return;
        try {
            const fetchedQuestions = await startGameSession(deckId);
            setQuestions(fetchedQuestions || []);

            // Get deck name from the first question
            if (fetchedQuestions && fetchedQuestions.length > 0) {
                setDeckName(fetchedQuestions[0].deckName || "Quiz Game");
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
        const currentQuestion = questions[currentIndex];

        // If question has multiple correct answers, allow multiple selections
        // Otherwise, only one answer can be selected
        if (currentQuestion.correctAnswers.length > 1) {
            setSelectedAnswers((prev) =>
                prev.includes(answer) ? prev.filter((a) => a !== answer) : [...prev, answer]
            );
        } else {
            setSelectedAnswers([answer]);
        }
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
            navigate(`/decks/${deckId}/gameSession/${result.gameSessionFrn}`);
        } catch (error) {
            console.error("Failed to end game session:", error);
        }
    };

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <MainLayout
            title={deckName}
            description={showCountdown ? "Prepare for quiz" : showResult ? "Quiz results" : "Choose the correct answer"}
            onBack={() => navigate(`/decks/${deckId}`)}
        >
            {showCountdown ? (
                <div className="flex items-center justify-center h-full absolute inset-0">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col items-center justify-center"
                    >
                        <div className="w-32 h-32 border-4 border-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-6xl font-bold text-blue-600">{countdown > 0 ? countdown : "GO!"}</span>
                        </div>
                        <p className="mt-6 text-2xl font-semibold text-gray-700">
                            {countdown === 3 && "Ready..."}
                            {countdown === 2 && "Steady..."}
                            {countdown === 1 && "Almost there..."}
                            {countdown === 0 && "Go!"}
                        </p>
                    </motion.div>
                </div>
            ) : showResult && gameResult ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center text-center p-8"
                >
                    <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                        <BsCheck2Circle size={64} className="text-blue-600" />
                    </div>

                    <h2 className="text-3xl font-bold text-gray-800 mb-6">Quiz Completed!</h2>

                    <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                        <div className="grid grid-cols-2 gap-6 mb-8">
                            <div className="flex flex-col items-center bg-gray-50 p-4 rounded-lg">
                                <div className="text-4xl font-bold text-blue-600 mb-2">
                                    {gameResult.score}/{gameResult.totalQuestions}
                                </div>
                                <div className="text-sm text-gray-500">Score</div>
                            </div>

                            <div className="flex flex-col items-center bg-gray-50 p-4 rounded-lg">
                                <div className="text-4xl font-bold text-green-600 mb-2">
                                    {gameResult.accuracy}%
                                </div>
                                <div className="text-sm text-gray-500">Accuracy</div>
                            </div>
                        </div>

                        <div className="flex items-center justify-center gap-3 text-lg text-gray-700 mb-8">
                            <FaRegClock className="text-blue-500" />
                            <span>Time: {gameResult.duration}</span>
                        </div>

                        <button
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                            onClick={() => window.location.reload()}
                        >
                            Try Again
                        </button>
                    </div>
                </motion.div>
            ) : questions.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center text-center p-8"
                >
                    <p className="text-xl text-gray-500">No questions available for this quiz.</p>
                </motion.div>
            ) : (
                <>
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center">
                            <span className="text-sm font-bold text-blue-600 bg-blue-100 px-4 py-1 rounded-full">
                                {currentIndex + 1}/{questions.length}
                            </span>
                        </div>
                        <div className="flex items-center">
                            <FaRegClock className="text-gray-400 mr-2" />
                            <span className="text-gray-600">{formatTime(timeSpent)}</span>
                        </div>
                    </div>

                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <div className="bg-blue-50 p-6 rounded-xl shadow-sm mb-8">
                            <div className="flex items-start gap-4">
                                <BsLightbulb className="text-blue-500 text-2xl flex-shrink-0 mt-1" />
                                <p className="text-xl font-medium text-gray-800">{questions[currentIndex].question}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {shuffledAnswers.map((answer, index) => {
                                const isSelected = selectedAnswers.includes(answer);
                                const isMultipleChoice = questions[currentIndex].correctAnswers.length > 1;

                                return (
                                    <motion.button
                                        key={index}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={`flex items-center w-full py-4 px-5 rounded-xl text-left transition-all ${
                                            isSelected
                                                ? "bg-blue-500 text-white shadow-md"
                                                : "bg-white hover:bg-gray-100 text-gray-800 border border-gray-200"
                                        }`}
                                        onClick={() => handleAnswerSelect(answer)}
                                    >
                                        {isMultipleChoice ? (
                                            <div className={`w-6 h-6 mr-4 flex items-center justify-center ${
                                                isSelected
                                                    ? "bg-white"
                                                    : "border-2 border-gray-300"
                                            } rounded-md`}>
                                                {isSelected && <BsCheck2Circle className="text-blue-500" size={16} />}
                                            </div>
                                        ) : (
                                            <div className={`w-6 h-6 mr-4 rounded-full flex items-center justify-center ${
                                                isSelected
                                                    ? "bg-white"
                                                    : "border-2 border-gray-300"
                                            }`}>
                                                {isSelected && <div className="w-3 h-3 rounded-full bg-blue-500"></div>}
                                            </div>
                                        )}
                                        <span className="text-lg">{answer}</span>
                                    </motion.button>
                                );
                            })}
                        </div>
                    </motion.div>

                    <div className="flex justify-end mt-6">
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            className="px-8 py-3 rounded-lg text-white font-semibold bg-blue-600 hover:bg-blue-700 shadow-md"
                            onClick={handleNextQuestion}
                        >
                            {currentIndex + 1 === questions.length ? "Finish Quiz" : "Next Question"}
                        </motion.button>
                    </div>
                </>
            )}
        </MainLayout>
    );
};

export default QuizGame;