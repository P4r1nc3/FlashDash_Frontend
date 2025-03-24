import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getGameSession } from "../../api/gameSession.ts";
import { GameSessionResult } from "../../interfaces/GameSession.ts";
import { FaRegClock, FaCalendarAlt, FaTrophy, FaCheckCircle } from "react-icons/fa";
import { BsCheckCircleFill, BsXCircleFill } from "react-icons/bs";
import { AiOutlineLineChart } from "react-icons/ai";
import MainLayout from "../../components/MainLayout.tsx";
import Card from "../../components/ui/Card";
import StatItem from "../../components/ui/StatItem";
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
                scrollable={true}
                fullHeight={true}
                className="h-full"
            >
                <div className="grid grid-cols-4 gap-2 mb-4 flex-shrink-0">
                    <StatItem
                        label="Score"
                        value={gameSession?.score || 0}
                        icon={<FaTrophy className="text-white text-[10px]" />}
                    />

                    <StatItem
                        label="Correct"
                        value={`${gameSession?.correctAnswers || 0} / ${gameSession?.totalQuestions || 0}`}
                        icon={<FaCheckCircle className="text-white text-[10px]" />}
                    />

                    <StatItem
                        label="Duration"
                        value={gameSession?.duration || ""}
                        icon={<FaRegClock className="text-white text-[10px]" />}
                    />

                    <StatItem
                        label="Date"
                        value={gameSession?.startTime ? formatDate(gameSession.startTime) : ""}
                        icon={<FaCalendarAlt className="text-white text-[10px]" />}
                        title={gameSession?.startTime ? formatDate(gameSession.startTime) : ""}
                    />
                </div>

                <div className="space-y-4">
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
                                <div className="flex items-center mb-2">
                                    <div className="flex items-center gap-2 mr-4">
                                        <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                                            <span className="text-blue-700 text-xs font-bold">{index + 1}</span>
                                        </div>
                                        <h4 className="font-semibold text-base text-gray-800">Question {index + 1}</h4>
                                    </div>
                                    <span className={`px-3 py-1.5 rounded-md text-xs font-medium ${
                                        question.wasCorrect ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                    }`}>
                                        {question.wasCorrect ? "Correct" : "Incorrect"}
                                    </span>
                                </div>
                                <p className="text-gray-700 mb-3 text-sm">{question.questionText}</p>

                                <div className="space-y-2">
                                    {allAnswers.map((answer, i) => {
                                        let className = "p-2 rounded-lg text-sm font-medium flex items-center";
                                        let icon = null;

                                        if (correctAnswers.includes(answer) && userAnswers.includes(answer)) {
                                            className += " bg-green-50 text-green-700 border border-green-200";
                                            icon = <BsCheckCircleFill className="text-green-500 mr-2 text-xs flex-shrink-0" />;
                                        } else if (!correctAnswers.includes(answer) && userAnswers.includes(answer)) {
                                            className += " bg-red-50 text-red-700 border border-red-200";
                                            icon = <BsXCircleFill className="text-red-500 mr-2 text-xs flex-shrink-0" />;
                                        } else if (correctAnswers.includes(answer) && !userAnswers.includes(answer)) {
                                            className += " bg-yellow-50 text-yellow-700 border border-yellow-200";
                                            icon = <BsCheckCircleFill className="text-yellow-500 mr-2 text-xs flex-shrink-0" />;
                                        } else {
                                            className += " bg-gray-50 text-gray-500 border border-gray-200";
                                            icon = <BsXCircleFill className="text-gray-400 mr-2 text-xs flex-shrink-0" />;
                                        }

                                        return (
                                            <div key={i} className={className}>
                                                {icon}
                                                <span>{answer}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="hidden">
                    <GradientButton onClick={() => navigate(`/decks/${deckFrn}`)}>
                        Back to Deck
                    </GradientButton>
                </div>
            </Card>
        </MainLayout>
    );
};

export default GameSession;