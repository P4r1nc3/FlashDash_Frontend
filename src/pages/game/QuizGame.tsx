import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { startGameSession, endGameSession } from "../../api/gameSession.ts";
import { QuestionRequest, QuestionResponse } from "../../interfaces/Question.ts";
import { GameSessionResult } from "../../interfaces/GameSession.ts";
import MainLayout from "../../components/MainLayout";
import GradientButton from "../../components/ui/GradientButton";
import EmptyState from "../../components/ui/EmptyState";
import { toast } from "react-toastify";
import { BsLightbulb, BsCheck2Circle, BsXCircle } from "react-icons/bs";
import { FaRegClock, FaTrophy, FaBrain, FaChartLine } from "react-icons/fa";


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
    const [setProgress] = useState(0);

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

    // Update progress bar
    useEffect(() => {
        if (questions.length > 0) {
            setProgress((currentIndex / questions.length) * 100);
        }
    }, [currentIndex, questions]);

    const handleStartGameSession = async () => {
        if (!deckId) return;
        try {
            const fetchedQuestions = await startGameSession(deckId);
            setQuestions(fetchedQuestions || []);

            // Get deck name from the first question
            if (fetchedQuestions && fetchedQuestions.length > 0) {
                setDeckName("Quiz Game");
                shuffleAnswers(fetchedQuestions[0]);
            }
        } catch (error) {

            toast.error("Failed to start game session");
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
            toast.error("Failed to end game session");
        }
    };

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty?.toLowerCase()) {
            case 'easy': return 'bg-green-100 text-green-700';
            case 'medium': return 'bg-yellow-100 text-yellow-700';
            case 'hard': return 'bg-red-100 text-red-700';
            default: return 'bg-blue-100 text-blue-700';
        }
    };

    const renderCountdown = () => (
        <div className="flex items-center justify-center h-full absolute inset-0">
            <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center justify-center"
            >
                <div className="w-40 h-40 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full flex items-center justify-center shadow-lg">
                    <div className="w-36 h-36 bg-white rounded-full flex items-center justify-center">
                        <span className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                            {countdown > 0 ? countdown : "GO!"}
                        </span>
                    </div>
                </div>
                <motion.p
                    className="mt-8 text-3xl font-semibold text-gray-700"
                    key={countdown}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {countdown === 3 && "Ready..."}
                    {countdown === 2 && "Steady..."}
                    {countdown === 1 && "Almost there..."}
                    {countdown === 0 && "Go!"}
                </motion.p>
            </motion.div>
        </div>
    );

    const renderQuizResults = () => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center text-center p-8"
        >
            <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full flex items-center justify-center mb-6 shadow-lg">
                <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center">
                    <FaTrophy size={54} className="text-yellow-500" />
                </div>
            </div>

            <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-8">
                Quiz Completed!
            </h2>

            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-indigo-400"></div>
                <div className="absolute -top-10 -right-10 w-20 h-20 bg-indigo-50 rounded-full opacity-50"></div>
                <div className="absolute -bottom-10 -left-10 w-20 h-20 bg-blue-50 rounded-full opacity-50"></div>

                <div className="grid grid-cols-2 gap-6 mb-8">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="flex flex-col items-center bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-lg shadow-sm"
                    >
                        <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500 mb-2">
                            {gameResult?.score}/{gameResult?.totalQuestions}
                        </div>
                        <div className="text-sm text-gray-600 flex items-center gap-1">
                            <FaChartLine />
                            <span>Score</span>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-col items-center bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-lg shadow-sm"
                    >
                        <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-teal-500 mb-2">
                            {gameResult?.accuracy}%
                        </div>
                        <div className="text-sm text-gray-600 flex items-center gap-1">
                            <FaBrain />
                            <span>Accuracy</span>
                        </div>
                    </motion.div>
                </div>

                <motion.div
                    className="flex items-center justify-center gap-3 text-lg text-gray-700 mb-8 bg-blue-50 py-3 px-6 rounded-full"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <FaRegClock className="text-indigo-500" />
                    <span>Time: {gameResult?.duration}</span>
                </motion.div>

                <GradientButton
                    onClick={() => window.location.reload()}
                    className="w-full py-3 px-6 relative overflow-hidden"
                    startColor="from-blue-500"
                    endColor="to-indigo-500"
                    hoverStartColor="from-blue-600"
                    hoverEndColor="to-indigo-600"
                >
                    Try Again
                    <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 animate-shine"></div>
                </GradientButton>
            </div>
        </motion.div>
    );

    const renderEmptyState = () => (
        <EmptyState
            icon={<BsXCircle size={40} className="text-blue-500" />}
            title="No questions available for this quiz."
        />
    );

    const renderQuizContent = () => (
        <>
            {/* Progress bar */}
            <div className="relative h-2 w-full bg-gray-100 rounded-full mb-6 overflow-hidden">
                <motion.div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full"
                    initial={{ width: `${(currentIndex / questions.length) * 100}%` }}
                    animate={{ width: `${(currentIndex / questions.length) * 100}%` }}
                    transition={{ duration: 0.3 }}
                />
            </div>

            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                    <span className="text-sm font-bold bg-gradient-to-r from-blue-400 to-indigo-400 text-white px-4 py-1.5 rounded-full shadow-sm">
                        {currentIndex + 1}/{questions.length}
                    </span>
                </div>

                {questions[currentIndex]?.difficulty && (
                    <span className={`text-base font-medium px-4 py-1.5 rounded-full ${getDifficultyColor(questions[currentIndex].difficulty)} shadow-sm`}>
                        {questions[currentIndex].difficulty}
                    </span>
                )}

                <div className="flex items-center bg-indigo-50 px-4 py-1.5 rounded-full">
                    <FaRegClock className="text-indigo-400 mr-2" />
                    <span className="text-indigo-600 font-medium">{formatTime(timeSpent)}</span>
                </div>
            </div>

            <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl shadow-sm mb-8 border border-blue-100">
                    <div className="flex items-start gap-4">
                        <div className="bg-white p-2 rounded-lg shadow-sm">
                            <BsLightbulb className="text-blue-500 text-2xl" />
                        </div>
                        <p className="text-xl font-medium text-gray-800 leading-relaxed">{questions[currentIndex].question}</p>
                    </div>
                </div>

                <div className="space-y-4">
                    {shuffledAnswers.map((answer, index) => {
                        const isSelected = selectedAnswers.includes(answer);
                        const isMultipleChoice = questions[currentIndex].correctAnswers.length > 1;

                        return (
                            <motion.button
                                key={index}
                                whileHover={{ scale: 1.02, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)" }}
                                whileTap={{ scale: 0.98 }}
                                className={`flex items-center w-full py-4 px-5 rounded-xl text-left transition-all ${
                                    isSelected
                                        ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md"
                                        : "bg-white hover:bg-gray-50 text-gray-800 border border-gray-200"
                                }`}
                                onClick={() => handleAnswerSelect(answer)}
                            >
                                {isMultipleChoice ? (
                                    <div className={`w-6 h-6 mr-4 flex items-center justify-center ${
                                        isSelected
                                            ? "bg-white"
                                            : "border-2 border-gray-300"
                                    } rounded-md`}>
                                        {isSelected && <BsCheck2Circle className="text-indigo-500" size={16} />}
                                    </div>
                                ) : (
                                    <div className={`w-6 h-6 mr-4 rounded-full flex items-center justify-center ${
                                        isSelected
                                            ? "bg-white"
                                            : "border-2 border-gray-300"
                                    }`}>
                                        {isSelected && <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400"></div>}
                                    </div>
                                )}
                                <span className={`text-lg ${isSelected ? 'font-medium' : ''}`}>{answer}</span>
                            </motion.button>
                        );
                    })}
                </div>
            </motion.div>

            <div className="flex justify-end mt-6">
                <GradientButton
                    onClick={handleNextQuestion}
                    disabled={selectedAnswers.length === 0}
                    className="px-8 py-3 relative overflow-hidden"
                    startColor="from-blue-500"
                    endColor="to-indigo-500"
                    hoverStartColor="from-blue-600"
                    hoverEndColor="to-indigo-600"
                >
                    {currentIndex + 1 === questions.length ? "Finish Quiz" : "Next Question"}
                    <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 animate-shine"></div>
                </GradientButton>
            </div>
        </>
    );

    return (
        <MainLayout
            title={deckName}
            description={showCountdown ? "Prepare for quiz" : showResult ? "Quiz results" : "Choose the correct answer"}
            onBack={() => navigate(`/decks/${deckId}`)}
        >
            {showCountdown ? (
                renderCountdown()
            ) : showResult && gameResult ? (
                renderQuizResults()
            ) : questions.length === 0 ? (
                renderEmptyState()
            ) : (
                renderQuizContent()
            )}
        </MainLayout>
    );
};

export default QuizGame;