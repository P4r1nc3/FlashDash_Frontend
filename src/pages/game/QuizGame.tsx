import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { startGameSession, endGameSession } from "../../api/gameSession.ts";
import { QuestionRequest, QuestionResponse } from "../../interfaces/Question.ts";
import MainLayout from "../../components/MainLayout";
import EmptyState from "../../components/ui/EmptyState";
import { toast } from "react-toastify";
import { BsCheck2, BsXCircle, BsArrowRight, BsStopwatch, BsQuestionCircle } from "react-icons/bs";
import { FaSignal } from "react-icons/fa";

const QuizGame = () => {
    const { deckFrn } = useParams<{ deckFrn: string }>();
    const navigate = useNavigate();

    const [questions, setQuestions] = useState<QuestionResponse[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
    const [showResult, setShowResult] = useState(false);
    const [showCountdown, setShowCountdown] = useState(true);
    const [countdown, setCountdown] = useState(3);
    const [shuffledAnswers, setShuffledAnswers] = useState<string[]>([]);
    const [userAnswersList, setUserAnswersList] = useState<QuestionRequest[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [deckName, setDeckName] = useState("Quiz");
    const [timeSpent, setTimeSpent] = useState(0);
    const [startTime, setStartTime] = useState<number | null>(null);

    // Initialize game session on component mount
    useEffect(() => {
        if (deckFrn) {
            startGameSession(deckFrn)
                .then(fetchedQuestions => {
                    setQuestions(fetchedQuestions || []);
                    if (fetchedQuestions?.length > 0) {
                        setDeckName(fetchedQuestions[0].deckName || "Quiz Game");
                        shuffleAnswers(fetchedQuestions[0]);
                    }
                })
                .catch(() => toast.error("Failed to start game session"));
        }
    }, [deckFrn]);

    // Handle countdown
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(prev => prev - 1), 1000);
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

    // Handle game completion
    useEffect(() => {
        if (showResult && !isSubmitting) {
            setIsSubmitting(true);
            if (deckFrn && userAnswersList.length > 0) {
                endGameSession(deckFrn, userAnswersList)
                    .then(result => {
                        navigate(`/decks/${deckFrn}/gameSession/${result.gameSessionFrn}`);
                    })
                    .catch(() => toast.error("Failed to end game session"));
            }
        }
    }, [showResult, isSubmitting]);

    const shuffleAnswers = (question: QuestionResponse) => {
        const allAnswers = [...question.correctAnswers, ...question.incorrectAnswers];
        setShuffledAnswers(allAnswers.sort(() => Math.random() - 0.5));
    };

    const handleAnswerSelect = (answer: string) => {
        const currentQuestion = questions[currentIndex];

        if (currentQuestion.correctAnswers.length > 1) {
            setSelectedAnswers(prev =>
                prev.includes(answer) ? prev.filter(a => a !== answer) : [...prev, answer]
            );
        } else {
            setSelectedAnswers([answer]);
        }
    };

    const getCurrentQuestionAnswer = (): QuestionRequest => {
        const currentQuestion = questions[currentIndex];
        return {
            question: currentQuestion.question,
            correctAnswers: selectedAnswers,
            incorrectAnswers: shuffledAnswers.filter(answer => !selectedAnswers.includes(answer)),
            difficulty: currentQuestion.difficulty
        };
    };

    const handleNextQuestion = () => {
        // Save answer without checking correctness
        setUserAnswersList(prev => [...prev, getCurrentQuestionAnswer()]);

        if (currentIndex + 1 < questions.length) {
            setCurrentIndex(prevIndex => prevIndex + 1);
            setSelectedAnswers([]);
            shuffleAnswers(questions[currentIndex + 1]);
        } else {
            setShowResult(true);
        }
    };

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const getDifficultyBadge = (difficulty: string) => {
        switch (difficulty?.toLowerCase()) {
            case 'easy': return {
                label: 'EASY',
                color: 'bg-gradient-to-r from-green-400 to-green-500',
                textColor: 'text-white'
            };
            case 'medium': return {
                label: 'MEDIUM',
                color: 'bg-gradient-to-r from-yellow-400 to-yellow-500',
                textColor: 'text-white'
            };
            case 'hard': return {
                label: 'HARD',
                color: 'bg-gradient-to-r from-red-400 to-red-500',
                textColor: 'text-white'
            };
            default: return {
                label: 'NORMAL',
                color: 'bg-gradient-to-r from-blue-400 to-blue-500',
                textColor: 'text-white'
            };
        }
    };

    // Render helper components
    const renderCountdown = () => (
        <div className="flex items-center justify-center h-full absolute inset-0">
            <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center justify-center"
            >
                <div className="w-40 h-40 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center shadow-lg relative overflow-hidden">
                    <div className="absolute inset-0 bg-white/20 mix-blend-overlay"></div>
                    <div className="w-36 h-36 bg-white rounded-full flex items-center justify-center shadow-inner">
                        <span className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600">
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
                    {countdown === 3 ? "Ready..." :
                        countdown === 2 ? "Steady..." :
                            countdown === 1 ? "Almost there..." : "Go!"}
                </motion.p>
            </motion.div>
        </div>
    );

    const renderQuizContent = () => {
        const currentQuestion = questions[currentIndex];
        const isMultipleChoice = currentQuestion.correctAnswers.length > 1;
        const progress = ((currentIndex) / questions.length) * 100;
        const difficultyBadge = getDifficultyBadge(currentQuestion.difficulty);
        const letterOptions = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

        return (
            <div className="flex flex-col h-full">
                {/* Progress bar at the very top */}
                <div className="h-1.5 w-full bg-gray-200 rounded-full mb-6 overflow-hidden">
                    <motion.div
                        className="h-full bg-blue-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5 }}
                    />
                </div>

                {/* Question with integrated header */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                        className="mb-5"
                    >
                        {/* Stats Bar */}
                        <div className="flex justify-between items-center mb-3 text-sm">
                            {/* Question counter - left */}
                            <div className="flex items-center gap-3 text-gray-500">
                                <span className="font-medium">Question {currentIndex + 1} of {questions.length}</span>
                            </div>

                            {/* Difficulty - center */}
                            <div className={`flex items-center ${difficultyBadge.color} ${difficultyBadge.textColor} px-3 py-1.5 rounded-full`}>
                                <FaSignal className="mr-1.5" size={12} />
                                <span className="font-medium">{difficultyBadge.label}</span>
                            </div>

                            {/* Time - right */}
                            <div className="flex items-center bg-gray-100 px-3 py-1.5 rounded-full">
                                <BsStopwatch className="text-gray-600 mr-1.5" size={14} />
                                <span className="text-gray-700 font-medium">{formatTime(timeSpent)}</span>
                            </div>
                        </div>

                        {/* Question Text - Enhanced Visual Display */}
                        <motion.div
                            className="relative bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl shadow-md border border-blue-100 mb-5"
                            initial={{ boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)" }}
                            animate={{ boxShadow: "0 10px 15px rgba(59, 130, 246, 0.1)" }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            {/* Question icon */}
                            <div className="flex items-center mb-3">
                                <motion.div
                                    className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center mr-3"
                                    initial={{ rotate: -10 }}
                                    animate={{ rotate: [0, 10, 0] }}
                                    transition={{ duration: 2, delay: 0.5 }}
                                >
                                    <BsQuestionCircle className="text-white" size={20} />
                                </motion.div>

                                <div className="text-xs uppercase tracking-wider text-blue-800 font-semibold bg-blue-100 px-3 py-1 rounded-full">
                                    {isMultipleChoice ? "Multiple Choice" : "Single Choice"}
                                </div>
                            </div>

                            {/* The actual question text */}
                            <motion.h3
                                className="text-xl font-medium text-gray-800 leading-relaxed"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                {currentQuestion.question}
                            </motion.h3>
                        </motion.div>
                    </motion.div>
                </AnimatePresence>

                {/* Answer Options with animation matching questions */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={`answers-${currentIndex}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-3 mb-4 flex-grow"
                    >
                        {shuffledAnswers.map((answer, index) => {
                            const isSelected = selectedAnswers.includes(answer);

                            return (
                                <motion.button
                                    key={`${answer}-${index}`}
                                    whileTap={{ scale: 0.98 }}
                                    className={`flex items-center w-full p-4 rounded-xl text-left transition-all ${
                                        isSelected
                                            ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md"
                                            : "bg-white hover:bg-gray-50 text-gray-800 border border-gray-200"
                                    }`}
                                    onClick={() => handleAnswerSelect(answer)}
                                >
                                    <div className={`flex-shrink-0 w-8 h-8 flex items-center justify-center mr-3 ${
                                        isMultipleChoice
                                            ? "rounded-md"
                                            : "rounded-full"
                                    } ${
                                        isSelected
                                            ? "bg-white"
                                            : "border border-gray-300 bg-gray-50"
                                    }`}>
                                        {isSelected ? (
                                            <BsCheck2
                                                className="text-blue-600"
                                                size={18}
                                            />
                                        ) : (
                                            <span className="text-gray-600 font-medium">
                                                {letterOptions[index]}
                                            </span>
                                        )}
                                    </div>

                                    <span className={`text-base ${isSelected ? 'font-medium' : ''}`}>
                                        {answer}
                                    </span>
                                </motion.button>
                            );
                        })}
                    </motion.div>
                </AnimatePresence>

                {/* Next Button */}
                <div className="flex justify-end mt-auto">
                    <motion.button
                        onClick={handleNextQuestion}
                        disabled={selectedAnswers.length === 0}
                        whileHover={selectedAnswers.length > 0 ? { scale: 1.03 } : {}}
                        whileTap={selectedAnswers.length > 0 ? { scale: 0.97 } : {}}
                        className={`px-5 py-3 rounded-lg flex items-center gap-2 font-medium transition-all ${
                            selectedAnswers.length > 0
                                ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-md"
                                : "bg-gray-200 text-gray-400 cursor-not-allowed"
                        }`}
                    >
                        {currentIndex + 1 === questions.length ? "Finish Quiz" : "Next Question"}
                        <BsArrowRight />
                    </motion.button>
                </div>
            </div>
        );
    };

    return (
        <MainLayout
            title={deckName}
            description={showCountdown ? "Prepare for quiz" : "Choose the correct answer"}
            onBack={() => navigate(`/decks/${deckFrn}`)}
        >
            {showCountdown ? renderCountdown() :
                questions.length === 0 ? <EmptyState
                    icon={<BsXCircle size={48}/>}
                    title="No questions yet."
                    description="No questions available for this deck."
                /> : renderQuizContent()}
        </MainLayout>
    );
};

export default QuizGame;