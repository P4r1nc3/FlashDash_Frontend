import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    AiOutlineQuestionCircle,
    AiOutlineLineChart,
    AiOutlineSetting,
    AiOutlinePlayCircle,
    AiOutlineEdit,
    AiOutlineDelete,
    AiOutlinePlus,
    AiOutlineArrowLeft,
} from "react-icons/ai";
import { getQuestionsInDeck, addQuestionToDeck, updateQuestion, deleteQuestion } from "../api/questions";
import { getDeckDetails } from "../api/decks";
import { startGameSession } from "../api/gameSession";
import { QuestionResponse } from "../interfaces/Question";
import { Difficulty } from "../enums/Difficulty";

const DeckDetails = () => {
    const { deckId } = useParams<{ deckId: string }>();
    const navigate = useNavigate();

    const [tabIndex, setTabIndex] = useState("gameModes");
    const [deckName, setDeckName] = useState("");
    const [deckDescription, setDeckDescription] = useState("");
    const [questions, setQuestions] = useState<QuestionResponse[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editItemId, setEditItemId] = useState<string | null>(null);
    const [newQuestion, setNewQuestion] = useState("");
    const [correctAnswers, setCorrectAnswers] = useState<string[]>([]);
    const [incorrectAnswers, setIncorrectAnswers] = useState<string[]>([]);
    const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.MEDIUM);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchDeckDetails = async () => {
            if (!deckId) return;
            const deckDetails = await getDeckDetails(deckId);
            setDeckName(deckDetails.name);
            setDeckDescription(deckDetails.description);
            setQuestions(await getQuestionsInDeck(deckId));
        };
        fetchDeckDetails();
    }, [deckId]);

    const handleStartQuiz = async () => {
        if (!deckId) return;
        await startGameSession(deckId);
        navigate(`/decks/${deckId}/quiz`);
    };

    const openAddModal = () => {
        setIsEditing(false);
        resetModalFields();
        setModalOpen(true);
    };

    const openEditModal = (item: QuestionResponse) => {
        setIsEditing(true);
        setEditItemId(item.questionId);
        setNewQuestion(item.question);
        setCorrectAnswers(item.correctAnswers);
        setIncorrectAnswers(item.incorrectAnswers);
        setDifficulty(item.difficulty as Difficulty);
        setModalOpen(true);
    };

    const resetModalFields = () => {
        setEditItemId(null);
        setNewQuestion("");
        setCorrectAnswers([]);
        setIncorrectAnswers([]);
        setDifficulty(Difficulty.MEDIUM);
        setError("");
    };

    const saveQuestion = async () => {
        if (!deckId || !newQuestion.trim()) {
            setError("Question text is required.");
            return;
        }

        const payload = { question: newQuestion, correctAnswers, incorrectAnswers, difficulty };

        if (isEditing && editItemId) {
            await updateQuestion(deckId, editItemId, payload);
        } else {
            await addQuestionToDeck(deckId, payload);
        }

        setQuestions(await getQuestionsInDeck(deckId));
        setModalOpen(false);
    };

    const deleteCurrentQuestion = async (itemId: string) => {
        if (!deckId) return;
        await deleteQuestion(deckId, itemId);
        setQuestions(await getQuestionsInDeck(deckId));
    };
    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-gray-100 to-gray-300">
            <div className="relative w-full max-w-4xl bg-white shadow-xl rounded-xl p-8 min-h-[80vh] flex flex-col">

                {/* Back Button */}
                <button className="absolute top-4 left-4 text-gray-600 hover:text-gray-800 flex items-center gap-2" onClick={() => navigate("/decks")}>
                    <AiOutlineArrowLeft size={20} /> Back
                </button>

                <h1 className="text-4xl font-bold text-center">{deckName}</h1>
                <p className="text-center text-gray-500">{deckDescription}</p>

                {/* Navigation Tabs */}
                <div className="flex justify-center mt-6 space-x-6 border-b pb-3">
                    {[
                        { id: "gameModes", icon: <AiOutlinePlayCircle size={22} />, label: "Game Modes" },
                        { id: "questions", icon: <AiOutlineQuestionCircle size={22} />, label: "Questions" },
                        { id: "statistics", icon: <AiOutlineLineChart size={22} />, label: "Statistics" },
                        { id: "settings", icon: <AiOutlineSetting size={22} />, label: "Settings" },
                    ].map(({ id, icon, label }) => (
                        <button
                            key={id}
                            className={`px-6 py-3 flex items-center gap-2 rounded-lg transition-all ${
                                tabIndex === id ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-200"
                            }`}
                            onClick={() => setTabIndex(id)}
                        >
                            {icon} {label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="mt-6 flex-1">
                    {tabIndex === "gameModes" && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 bg-gray-100 rounded-lg shadow">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <AiOutlinePlayCircle size={22} /> Game Modes
                            </h2>
                            <button className="mt-4 bg-blue-500 text-white py-3 px-6 rounded-lg w-full" onClick={handleStartQuiz}>
                                Start Quiz
                            </button>
                        </motion.div>
                    )}

                    {tabIndex === "questions" && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                            <div className="p-6 bg-gray-100 rounded-lg shadow">
                                <h2 className="text-xl font-semibold flex items-center gap-2">
                                    <AiOutlineQuestionCircle size={22} /> Questions
                                </h2>
                                <button className="mt-4 bg-blue-500 text-white py-3 px-6 rounded-lg" onClick={openAddModal}>
                                    <AiOutlinePlus size={20} /> Add Question
                                </button>

                                {questions.length > 0 ? (
                                    questions.map((q) => (
                                        <div key={q.questionId} className="flex justify-between items-center mt-4 p-4 bg-white rounded-lg shadow">
                                            <span className="text-lg font-semibold">{q.question}</span>
                                            <div className="flex space-x-2">
                                                <button className="text-blue-500 hover:text-blue-700" onClick={() => openEditModal(q)}>
                                                    <AiOutlineEdit size={22} />
                                                </button>
                                                <button className="text-red-500 hover:text-red-700" onClick={() => deleteCurrentQuestion(q.questionId)}>
                                                    <AiOutlineDelete size={22} />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center text-gray-500 mt-2">No questions yet.</p>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {tabIndex === "statistics" && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 bg-gray-100 rounded-lg shadow">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <AiOutlineLineChart size={22} /> Statistics
                            </h2>
                            <p className="text-gray-500 mt-2">This section will display statistics related to your deck.</p>
                        </motion.div>
                    )}

                    {tabIndex === "settings" && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 bg-gray-100 rounded-lg shadow">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <AiOutlineSetting size={22} /> Settings
                            </h2>
                            <p className="text-gray-500 mt-2">This section will contain settings for this deck.</p>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Modal for Adding/Editing Questions */}
            {modalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
                    <motion.div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-lg font-semibold">{isEditing ? "Edit Question" : "Add Question"}</h2>

                        <label className="block text-gray-700 font-semibold mt-4">Question <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            placeholder="Enter question"
                            className="p-3 w-full bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                            value={newQuestion}
                            onChange={(e) => setNewQuestion(e.target.value)}
                        />
                        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

                        <label className="block text-gray-700 font-semibold mt-4">Difficulty</label>
                        <select
                            className="p-3 w-full bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                            value={difficulty}
                            onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                        >
                            <option value={Difficulty.EASY}>Easy</option>
                            <option value={Difficulty.MEDIUM}>Medium</option>
                            <option value={Difficulty.HARD}>Hard</option>
                        </select>

                        <h3 className="mt-4">Correct Answers</h3>
                        {correctAnswers.map((ans, index) => (
                            <div key={index} className="flex gap-2 mt-2">
                                <input type="text" className="border p-2 w-full" value={ans} onChange={(e) => {
                                    const newCorrect = [...correctAnswers];
                                    newCorrect[index] = e.target.value;
                                    setCorrectAnswers(newCorrect);
                                }} />
                                <button onClick={() => setCorrectAnswers(correctAnswers.filter((_, i) => i !== index))} className="text-red-500">X</button>
                            </div>
                        ))}
                        <button className="mt-2 text-blue-500" onClick={() => setCorrectAnswers([...correctAnswers, ""]) }>+ Add Correct Answer</button>

                        <h3 className="mt-4">Incorrect Answers</h3>
                        {incorrectAnswers.map((ans, index) => (
                            <div key={index} className="flex gap-2 mt-2">
                                <input type="text" className="border p-2 w-full" value={ans} onChange={(e) => {
                                    const newIncorrect = [...incorrectAnswers];
                                    newIncorrect[index] = e.target.value;
                                    setIncorrectAnswers(newIncorrect);
                                }} />
                                <button onClick={() => setIncorrectAnswers(incorrectAnswers.filter((_, i) => i !== index))} className="text-red-500">X</button>
                            </div>
                        ))}
                        <button className="mt-2 text-blue-500" onClick={() => setIncorrectAnswers([...incorrectAnswers, ""]) }>+ Add Incorrect Answer</button>

                        <div className="flex justify-end mt-4 space-x-2">
                            <button className="px-4 py-2 border rounded-lg" onClick={() => setModalOpen(false)}>Cancel</button>
                            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg" onClick={saveQuestion}>Save</button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default DeckDetails;
