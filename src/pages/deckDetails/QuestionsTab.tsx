import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    AiOutlineQuestionCircle,
    AiOutlineEdit,
    AiOutlineDelete,
    AiOutlinePlus,
} from "react-icons/ai";
import { getQuestionsInDeck, addQuestionToDeck, updateQuestion, deleteQuestion } from "../../api/questions.ts";
import { QuestionResponse } from "../../interfaces/Question.ts";
import { Difficulty } from "../../enums/Difficulty.ts";

interface QuestionsTabProps {
    deckId: string;
}

const QuestionsTab: React.FC<QuestionsTabProps> = ({ deckId }) => {
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
        fetchQuestions();
    }, [deckId]);

    const fetchQuestions = async () => {
        if (!deckId) return;
        const fetchedQuestions = await getQuestionsInDeck(deckId);
        setQuestions(fetchedQuestions);
    };

    const openAddModal = () => {
        setIsEditing(false);
        resetModalFields();
        setModalOpen(true);
    };

    const openEditModal = (item: QuestionResponse) => {
        setIsEditing(true);
        setEditItemId(item.questionFrn);
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

        fetchQuestions();
        setModalOpen(false);
    };

    const deleteCurrentQuestion = async (itemId: string) => {
        if (!deckId) return;
        await deleteQuestion(deckId, itemId);
        fetchQuestions();
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 bg-gray-100 rounded-lg shadow w-full h-full flex flex-col">
            <h2 className="text-xl font-semibold flex items-center gap-2">
                <AiOutlineQuestionCircle size={22} /> Questions
            </h2>
            <p className="text-gray-500 mt-2">Manage your questions in the deck.</p>

            <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg flex items-center gap-2" onClick={openAddModal}>
                <AiOutlinePlus size={20} /> Add Question
            </button>

            <div className="mt-6 overflow-y-auto max-h-[35vh] pr-2 space-y-4">
                {questions.length > 0 ? (
                    questions.map((q, index) => {
                        const correctAnswers = q.correctAnswers;
                        const allAnswers = new Set([...correctAnswers, ...q.incorrectAnswers]);

                        return (
                            <motion.div
                                key={q.questionFrn}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="p-4 bg-white rounded-lg shadow-md border-l-4 relative"
                                style={{ borderColor: "grey" }}
                            >
                                <div className="absolute top-3 right-3 flex space-x-2">
                                    <button className="text-blue-500 hover:text-blue-700" onClick={() => openEditModal(q)}>
                                        <AiOutlineEdit size={22} />
                                    </button>
                                    <button className="text-red-500 hover:text-red-700" onClick={() => deleteCurrentQuestion(q.questionFrn)}>
                                        <AiOutlineDelete size={22} />
                                    </button>
                                </div>

                                <h3 className="font-semibold flex items-center gap-2 text-lg">
                                    <AiOutlineQuestionCircle className="text-gray-800" />
                                    Question {index + 1}
                                </h3>
                                <p className="text-gray-800 mt-2">{q.question}</p>

                                <div className="mt-4 space-y-1">
                                    {[...allAnswers].map((answer, i) => {
                                        let textColor = "text-gray-800";
                                        let bgColor = "bg-white";
                                        let emoji = "";

                                        if (correctAnswers.includes(answer)) {
                                            textColor = "text-gray-500";
                                            bgColor = "bg-gray-100";
                                            emoji = "✅";
                                        } else {
                                            textColor = "text-gray-500";
                                            bgColor = "bg-gray-100";
                                            emoji = "⬜";
                                        }

                                        return (
                                            <p
                                                key={i}
                                                className={`p-2 rounded-md font-medium ${textColor} ${bgColor}`}
                                            >
                                                {emoji} {answer}
                                            </p>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        );
                    })
                ) : (
                    <p className="text-center text-gray-500 mt-2">No questions yet.</p>
                )}
            </div>

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
        </motion.div>
    );
};

export default QuestionsTab;
