import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getGameSession } from "../api/gameSession.ts";
import { GameSessionResult } from "../interfaces/GameSession.ts";
import { motion } from "framer-motion";
import { AiOutlineLineChart, AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";
import MainLayout from "../components/MainLayout";

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

    return (
        <MainLayout
            title="Game Results"
            description="Review your answers and performance."
            onBack={() => navigate(`/decks/${deckId}`)}
        >
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 bg-gray-100 rounded-lg shadow w-full h-full flex flex-col"
            >
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    <AiOutlineLineChart size={22} /> Game Overview
                </h2>
                <p className="text-gray-500 mt-2">Your game session details at a glance.</p>

                <div className="grid grid-cols-4 gap-4 mt-4 text-center">
                    <div className="bg-white p-4 shadow-md rounded-lg">
                        <p className="text-gray-500">Score</p>
                        <p className="text-xl font-bold">{gameSession?.score}%</p>
                    </div>
                    <div className="bg-white p-4 shadow-md rounded-lg">
                        <p className="text-gray-500">Correct Answers</p>
                        <p className="text-xl font-bold">
                            {gameSession?.correctAnswers} / {gameSession?.totalQuestions}
                        </p>
                    </div>
                    <div className="bg-white p-4 shadow-md rounded-lg flex flex-col items-center">
                        <p className="text-gray-500">Duration</p>
                        <p className="text-xl font-bold">{gameSession?.duration}</p>
                    </div>
                    <div className="bg-white p-4 shadow-md rounded-lg flex flex-col items-center">
                        <p className="text-gray-500">Date Played</p>
                        <p className="text-xl font-bold">{new Date(gameSession?.startTime!).toLocaleDateString()}</p>
                    </div>
                </div>

                <div className="mt-6 overflow-y-auto max-h-[35vh] pr-2 space-y-4">
                    {gameSession?.sessionDetails.map((question, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="p-4 bg-white rounded-lg shadow-md border-l-4"
                            style={{ borderColor: question.wasCorrect ? "green" : "red" }}
                        >
                            <h3 className="font-semibold flex items-center gap-2 text-lg">
                                {question.wasCorrect ? (
                                    <AiOutlineCheckCircle className="text-green-500" />
                                ) : (
                                    <AiOutlineCloseCircle className="text-red-500" />
                                )}
                                Question {index + 1}
                            </h3>
                            <p className="text-gray-700 mt-2">{question.questionText}</p>

                            <div className="mt-4">
                                <p className="text-green-600 font-semibold">✅ Correct Answers:</p>
                                <p className="text-gray-800">{question.correctAnswers.join(", ")}</p>
                            </div>

                            <div className="mt-2">
                                <p className={`font-semibold ${question.wasCorrect ? "text-green-500" : "text-red-500"}`}>
                                    {question.wasCorrect ? "🎯 You answered correctly" : "❌ Your Answers:"}
                                </p>
                                <p className="text-gray-800">{question.userAnswers.join(", ") || "No answer provided"}</p>
                            </div>

                            {question.userAnswers.some(ans => !question.correctAnswers.includes(ans)) && (
                                <div className="mt-2">
                                    <p className="text-orange-500 font-semibold">⚠️ Incorrectly selected:</p>
                                    <p className="text-gray-800">
                                        {question.userAnswers.filter(ans => !question.correctAnswers.includes(ans)).join(", ")}
                                    </p>
                                </div>
                            )}

                            {question.correctAnswers.some(ans => !question.userAnswers.includes(ans)) && (
                                <div className="mt-2">
                                    <p className="text-blue-500 font-semibold">🔹 Missed Correct Answers:</p>
                                    <p className="text-gray-800">
                                        {question.correctAnswers.filter(ans => !question.userAnswers.includes(ans)).join(", ")}
                                    </p>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>

                <button
                    className="mt-6 bg-blue-500 text-white py-3 px-6 rounded-lg w-full hover:bg-blue-600"
                    onClick={() => navigate(`/decks/${deckId}`)}
                >
                    Back to Deck
                </button>
            </motion.div>
        </MainLayout>
    );
};

export default GameSession;
