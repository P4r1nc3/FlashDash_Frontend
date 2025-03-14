import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getGameSession } from "../api/gameSession.ts";
import { GameSessionResult } from "../interfaces/GameSession.ts";
import { motion } from "framer-motion";
import { AiOutlineArrowLeft, AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";

const GameSession = () => {
    const { deckId, gameSessionId } = useParams<{ deckId: string; gameSessionId: string }>();
    const navigate = useNavigate();

    const [gameSession, setGameSession] = useState<GameSessionResult | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchGameSession = async () => {
            if (!deckId || !gameSessionId) return;
            try {
                const sessionData = await getGameSession(deckId, gameSessionId);
                setGameSession(sessionData);
            } catch (err) {
                setError("Failed to fetch game session.");
            } finally {
                setLoading(false);
            }
        };

        fetchGameSession();
    }, [deckId, gameSessionId]);

    if (loading) return <p className="text-center mt-6">Loading game session...</p>;
    if (error) return <p className="text-center mt-6 text-red-500">{error}</p>;

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-gray-100 to-gray-300">
            <div className="relative w-full max-w-4xl bg-white shadow-xl rounded-xl p-8 min-h-[80vh] flex flex-col">

                {/* Przycisk powrotu */}
                <button
                    className="absolute top-4 left-4 text-gray-600 hover:text-gray-800 flex items-center gap-2"
                    onClick={() => navigate(`/decks/${deckId}`)}
                >
                    <AiOutlineArrowLeft size={20} /> Back
                </button>

                {/* Nagłówek Wyniku */}
                <h2 className="text-3xl font-bold text-center mb-4">Game Results</h2>

                {/* Podsumowanie */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-100 p-4 rounded-lg shadow-md text-center mb-6"
                >
                    <p className="text-xl font-semibold">Score: <span className="text-blue-600">{gameSession?.score}%</span></p>
                    <p className="text-md text-gray-600">{gameSession?.correctAnswers} / {gameSession?.totalQuestions} correct answers</p>
                    <p className="text-sm text-gray-500">Duration: {gameSession?.duration}</p>
                </motion.div>

                {/* Lista pytań */}
                <div className="overflow-y-auto max-h-[50vh] p-2 space-y-4">
                    {gameSession?.sessionDetails.map((question, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="p-4 bg-gray-50 border-l-4 rounded-lg shadow-md"
                            style={{
                                borderColor: question.wasCorrect ? "green" : "red"
                            }}
                        >
                            {/* Pytanie */}
                            <h3 className="font-semibold flex items-center gap-2">
                                {question.wasCorrect ? <AiOutlineCheckCircle className="text-green-500" /> : <AiOutlineCloseCircle className="text-red-500" />}
                                {index + 1}. {question.questionText}
                            </h3>

                            {/* Poprawne odpowiedzi */}
                            <p className="text-sm text-green-600 mt-2">✅ Correct: {question.correctAnswers.join(", ")}</p>

                            {/* Odpowiedzi zaznaczone przez użytkownika */}
                            <p className="text-sm mt-2">
                                {question.wasCorrect ? (
                                    <span className="text-green-500">🎯 You answered correctly</span>
                                ) : (
                                    <span className="text-red-500">❌ Incorrect answer(s)</span>
                                )}
                            </p>

                            {/* Złe odpowiedzi zaznaczone */}
                            {question.userAnswers.filter(ans => !question.correctAnswers.includes(ans)).length > 0 && (
                                <p className="text-sm text-orange-500 mt-1">⚠️ Incorrectly selected: {question.userAnswers.filter(ans => !question.correctAnswers.includes(ans)).join(", ")}</p>
                            )}

                            {/* Poprawne odpowiedzi, których użytkownik nie zaznaczył */}
                            {question.correctAnswers.filter(ans => !question.userAnswers.includes(ans)).length > 0 && (
                                <p className="text-sm text-blue-500 mt-1">🔹 Missed correct: {question.correctAnswers.filter(ans => !question.userAnswers.includes(ans)).join(", ")}</p>
                            )}
                        </motion.div>
                    ))}
                </div>

                {/* Przycisk powrotu */}
                <button
                    className="mt-6 bg-blue-500 text-white py-3 px-6 rounded-lg w-full hover:bg-blue-600"
                    onClick={() => navigate(`/decks/${deckId}`)}
                >
                    Back to Deck
                </button>
            </div>
        </div>
    );
};

export default GameSession;
