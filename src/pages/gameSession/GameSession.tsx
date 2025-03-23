import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getGameSession } from "../../api/gameSession.ts";
import { GameSessionResult } from "../../interfaces/GameSession.ts";
import { FaRegClock, FaCalendarAlt, FaTrophy, FaCheckCircle } from "react-icons/fa";
import { BsCheckCircleFill, BsXCircleFill } from "react-icons/bs";
import { AiOutlineLineChart } from "react-icons/ai";
import MainLayout from "../../components/MainLayout.tsx";
import Card from "../../components/ui/Card";
import GradientButton from "../../components/ui/GradientButton";
import { toast } from "react-toastify";

const GameSession = () => {
    const { deckFrn, gameSessionId } = useParams<{ deckFrn: string; gameSessionId: string }>();
    const navigate = useNavigate();
    const [gameSession, setGameSession] = useState<GameSessionResult | null>(null);

    useEffect(() => {
        const fetchGameSession = async () => {
            if (!deckFrn || !gameSessionId) return;
            try {
                const sessionData = await getGameSession(deckFrn, gameSessionId);
                setGameSession(sessionData);
            } catch {
                toast.error("Failed to fetch game session.");
            }
        };

        fetchGameSession();
    }, [deckFrn, gameSessionId]);

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
            onBack={() => navigate(`/decks/${deckFrn}`)}
        >
            <Card
                title="Game Overview"
                description="Your game session details at a glance."
                icon={<AiOutlineLineChart size={22} />}
            >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-3 rounded-lg shadow-sm">
                        <div className="flex items-center justify-between mb-1">
                            <p className="text-gray-600 font-medium text-sm">Score</p>
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full flex items-center justify-center shadow-sm">
                                <FaTrophy className="text-white text-xs" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500">
                            {gameSession?.score}
                        </p>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-3 rounded-lg shadow-sm">
                        <div className="flex items-center justify-between mb-1">
                            <p className="text-gray-600 font-medium text-sm">Correct</p>
                            <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-teal-400 rounded-full flex items-center justify-center shadow-sm">
                                <FaCheckCircle className="text-white text-xs" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-teal-500">
                            {gameSession?.correctAnswers} / {gameSession?.totalQuestions}
                        </p>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-3 rounded-lg shadow-sm">
                        <div className="flex items-center justify-between mb-1">
                            <p className="text-gray-600 font-medium text-sm">Duration</p>
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full flex items-center justify-center shadow-sm">
                                <FaRegClock className="text-white text-xs" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500">
                            {gameSession?.duration}
                        </p>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-3 rounded-lg shadow-sm">
                        <div className="flex items-center justify-between mb-1">
                            <p className="text-gray-600 font-medium text-sm">Date</p>
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full flex items-center justify-center shadow-sm">
                                <FaCalendarAlt className="text-white text-xs" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500">
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
                                        let className = "p-2 rounded-lg text-sm";
                                        let icon = null;

                                        if (correctAnswers.includes(answer) && userAnswers.includes(answer)) {
                                            className += " bg-green-50 text-green-700 border border-green-200";
                                            icon = <BsCheckCircleFill className="text-green-500 mr-2 flex-shrink-0" />;
                                        } else if (!correctAnswers.includes(answer) && userAnswers.includes(answer)) {
                                            className += " bg-red-50 text-red-700 border border-red-200";
                                            icon = <BsXCircleFill className="text-red-500 mr-2 flex-shrink-0" />;
                                        } else if (correctAnswers.includes(answer) && !userAnswers.includes(answer)) {
                                            className += " bg-yellow-50 text-yellow-700 border border-yellow-200";
                                            icon = <BsCheckCircleFill className="text-yellow-500 mr-2 flex-shrink-0" />;
                                        } else {
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

                <GradientButton
                    onClick={() => navigate(`/decks/${deckFrn}`)}
                    className="w-full"
                >
                    Back to Deck
                </GradientButton>
            </Card>
        </MainLayout>
    );
};

export default GameSession;