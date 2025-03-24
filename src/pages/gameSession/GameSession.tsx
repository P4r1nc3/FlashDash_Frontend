import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getGameSession } from "../../api/gameSession.ts";
import { GameSessionResult } from "../../interfaces/GameSession.ts";
import { FaRegClock, FaCalendarAlt, FaTrophy, FaCheckCircle } from "react-icons/fa";
import { AiOutlineLineChart } from "react-icons/ai";
import MainLayout from "../../components/MainLayout.tsx";
import Card from "../../components/ui/Card";
import StatItem from "../../components/ui/StatItem";
import Question from "../../components/ui/Question";
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

                        // Format answers for the Question component
                        const formattedAnswers = [
                            // Correct answers that user selected
                            ...correctAnswers
                                .filter(answer => userAnswers.includes(answer))
                                .map(text => ({
                                    text,
                                    isCorrect: true,
                                    isUserAnswer: true
                                })),

                            // Incorrect answers that user selected
                            ...question.incorrectAnswers
                                .filter(answer => userAnswers.includes(answer))
                                .map(text => ({
                                    text,
                                    isCorrect: false,
                                    isUserAnswer: true
                                })),

                            // Correct answers that user missed
                            ...correctAnswers
                                .filter(answer => !userAnswers.includes(answer))
                                .map(text => ({
                                    text,
                                    isCorrect: true,
                                    isMissed: true
                                })),

                            // Incorrect answers that user correctly avoided
                            ...question.incorrectAnswers
                                .filter(answer => !userAnswers.includes(answer))
                                .map(text => ({
                                    text,
                                    isCorrect: false
                                }))
                        ];

                        return (
                            <Question
                                key={index}
                                index={index + 1}
                                question={question.questionText}
                                answers={formattedAnswers}
                                status={question.wasCorrect ? 'correct' : 'incorrect'}
                            />
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