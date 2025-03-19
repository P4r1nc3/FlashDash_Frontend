const style = document.createElement('style');
style.innerHTML = `
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #60a5fa, #818cf8);
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #3b82f6, #6366f1);
}
`;
document.head.appendChild(style);import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getGameSession } from "../../api/gameSession.ts";
import { GameSessionResult } from "../../interfaces/GameSession.ts";
import { motion } from "framer-motion";
import { FaRegClock, FaCalendarAlt, FaTrophy, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { BsCheckCircleFill, BsXCircleFill } from "react-icons/bs";
import { AiOutlineLineChart } from "react-icons/ai";
import MainLayout from "../../components/MainLayout.tsx";

const GameSession = () => {
    const { deckId, gameSessionId } = useParams<{ deckId: string; gameSessionId: string }>();
    const navigate = useNavigate();
    const [gameSession, setGameSession] = useState<GameSessionResult | null>(null);

    useEffect(() => {
        const fetchGameSession = async () => {
            if (!deckId || !gameSessionId) return;
            try {
                const sessionData = await getGameSession(deckId, gameSessionId);
                setGameSession(sessionData);
            } catch {
                console.error("Failed to fetch game session.");
            }
        };

        fetchGameSession();
    }, [deckId, gameSessionId]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <MainLayout
            title="Quiz Results"
            description="Review your answers and performance"
            onBack={() => navigate(`/decks/${deckId}`)}
        >
            <div className="bg-white rounded-xl shadow-md w-full">
                {/* Top gradient line */}
                <div className="h-1 w-full bg-gradient-to-r from-blue-400 to-indigo-400 rounded-t-xl"></div>

                <div className="p-6">
                    <h2 className="text-xl font-bold text-blue-600 flex items-center gap-2 mb-1">
                        <AiOutlineLineChart size={22} className="text-indigo-500" /> Game Overview
                    </h2>
                    <p className="text-gray-500 mb-4 text-sm">Your game session details at a glance.</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                        {/* Score Card */}
                        <div className="bg-blue-50 p-3 rounded-lg">
                            <div className="flex items-center justify-between">
                                <p className="text-gray-600 font-medium text-sm">Score</p>
                                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                    <FaTrophy className="text-white text-xs" />
                                </div>
                            </div>
                            <p className="text-2xl font-bold text-blue-600">
                                {gameSession?.score}%
                            </p>
                        </div>

                        {/* Correct Answers Card */}
                        <div className="bg-green-50 p-3 rounded-lg">
                            <div className="flex items-center justify-between">
                                <p className="text-gray-600 font-medium text-sm">Correct</p>
                                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                    <FaCheckCircle className="text-white text-xs" />
                                </div>
                            </div>
                            <p className="text-2xl font-bold text-green-600">
                                {gameSession?.correctAnswers} / {gameSession?.totalQuestions}
                            </p>
                        </div>

                        {/* Duration Card */}
                        <div className="bg-blue-50 p-3 rounded-lg">
                            <div className="flex items-center justify-between">
                                <p className="text-gray-600 font-medium text-sm">Duration</p>
                                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                    <FaRegClock className="text-white text-xs" />
                                </div>
                            </div>
                            <p className="text-2xl font-bold text-blue-600">
                                {gameSession?.duration}
                            </p>
                        </div>

                        {/* Date Card */}
                        <div className="bg-blue-50 p-3 rounded-lg">
                            <div className="flex items-center justify-between">
                                <p className="text-gray-600 font-medium text-sm">Date</p>
                                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                    <FaCalendarAlt className="text-white text-xs" />
                                </div>
                            </div>
                            <p className="text-2xl font-bold text-blue-600">
                                {gameSession?.startTime ? formatDate(gameSession.startTime) : ""}
                            </p>
                        </div>
                    </div>

                    <h3 className="text-lg font-bold mb-3 text-gray-800">Question Review</h3>

                    <div className="space-y-4 mb-6 max-h-[30vh] overflow-y-auto pr-2 custom-scrollbar">
                        {gameSession?.sessionDetails.map((question, index) => {
                            const correctAnswers = question.correctAnswers;
                            const userAnswers = question.userAnswers;
                            const allAnswers = [...new Set([...correctAnswers, ...userAnswers, ...question.incorrectAnswers])];

                            return (
                                <div
                                    key={index}
                                    className={`p-4 bg-white rounded-lg border-l-4 ${
                                        question.wasCorrect ? "border-green-500" : "border-red-500"
                                    } shadow-sm`}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-semibold flex items-center gap-2 text-base text-gray-800">
                                            {question.wasCorrect ? (
                                                <BsCheckCircleFill className="text-green-500" />
                                            ) : (
                                                <BsXCircleFill className="text-red-500" />
                                            )}
                                            Question {index + 1}
                                        </h4>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            question.wasCorrect ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                        }`}>
                                            {question.wasCorrect ? "Correct" : "Incorrect"}
                                        </span>
                                    </div>
                                    <p className="text-gray-700 mb-3 text-sm">{question.questionText}</p>

                                    <div className="space-y-2">
                                        {allAnswers.map((answer, i) => {
                                            // Determine the styling for each answer
                                            let className = "p-2 rounded-lg text-sm";
                                            let icon = null;

                                            if (correctAnswers.includes(answer) && userAnswers.includes(answer)) {
                                                // User selected correct answer
                                                className += " bg-green-50 text-green-700 border border-green-200";
                                                icon = <BsCheckCircleFill className="text-green-500 mr-2 flex-shrink-0" />;
                                            } else if (!correctAnswers.includes(answer) && userAnswers.includes(answer)) {
                                                // User selected wrong answer
                                                className += " bg-red-50 text-red-700 border border-red-200";
                                                icon = <BsXCircleFill className="text-red-500 mr-2 flex-shrink-0" />;
                                            } else if (correctAnswers.includes(answer) && !userAnswers.includes(answer)) {
                                                // User missed correct answer
                                                className += " bg-yellow-50 text-yellow-700 border border-yellow-200";
                                                icon = <BsCheckCircleFill className="text-yellow-500 mr-2 flex-shrink-0" />;
                                            } else {
                                                // Incorrect answer not selected (good)
                                                className += " bg-gray-50 text-gray-500 border border-gray-200";
                                            }

                                            return (
                                                <div key={i} className={className}>
                                                    <div className="flex items-center">
                                                        {icon}
                                                        <span>{answer}</span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <button
                        className="w-full bg-gradient-to-r from-blue-400 to-indigo-400 hover:from-blue-500 hover:to-indigo-500 text-white py-3 px-6 rounded-lg font-medium transition-colors shadow-sm"
                        onClick={() => navigate(`/decks/${deckId}`)}
                    >
                        Back to Deck
                    </button>
                </div>
            </div>
        </MainLayout>
    );
};

export default GameSession;