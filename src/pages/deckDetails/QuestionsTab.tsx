import { useEffect, useState } from "react";
import {
    AiOutlineQuestionCircle,
    AiOutlineEdit,
    AiOutlineDelete,
    AiOutlinePlus,
} from "react-icons/ai";
import { BsCheckCircleFill, BsXCircleFill } from "react-icons/bs";
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
    };

    const saveQuestion = async () => {
        if (!deckId || !newQuestion.trim()) {
            alert("Question text is required.");
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

    const getDifficultyBadge = (difficulty: string) => {
        let colors = "";
        switch(difficulty?.toLowerCase()) {
            case 'easy':
                colors = "bg-green-100 text-green-700";
                break;
            case 'medium':
                colors = "bg-yellow-100 text-yellow-700";
                break;
            case 'hard':
                colors = "bg-red-100 text-red-700";
                break;
            default:
                colors = "bg-blue-100 text-blue-700";
        }
        return <span className={`px-3 py-1.5 rounded-md text-xs font-medium ${colors}`}>{difficulty}</span>;
    };

    return (
        <div className="bg-white rounded-xl shadow-md w-full">
            {/* Top gradient line */}
            <div className="h-1 w-full bg-gradient-to-r from-blue-400 to-indigo-400 rounded-t-xl"></div>

            <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h2 className="text-xl font-bold text-blue-600 flex items-center gap-2 mb-1">
                            <AiOutlineQuestionCircle size={22} className="text-indigo-500" /> Questions
                        </h2>
                        <p className="text-gray-500 text-sm">Manage questions in this deck.</p>
                    </div>
                    <button
                        className="bg-gradient-to-r from-blue-400 to-indigo-400 hover:from-blue-500 hover:to-indigo-500 text-white py-2 px-4 rounded-lg font-medium transition-colors shadow-sm flex items-center gap-2"
                        onClick={openAddModal}
                    >
                        <AiOutlinePlus size={18} /> Add Question
                    </button>
                </div>

                <div className="max-h-[40vh] overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                    {questions.length > 0 ? (
                        questions.map((q, index) => {
                            const correctAnswers = q.correctAnswers;
                            const allAnswers = [...new Set([...correctAnswers, ...q.incorrectAnswers])];

                            return (
                                <div
                                    key={q.questionFrn}
                                    className="p-4 bg-white rounded-lg shadow-sm border-l-4 border-blue-500 relative"
                                >
                                    <div className="absolute top-3 right-3 flex space-x-2">
                                        <button
                                            className="text-indigo-500 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 p-1.5 rounded-md transition-colors"
                                            onClick={() => openEditModal(q)}
                                        >
                                            <AiOutlineEdit size={18} />
                                        </button>
                                        <button
                                            className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-1.5 rounded-md transition-colors"
                                            onClick={() => deleteCurrentQuestion(q.questionFrn)}
                                        >
                                            <AiOutlineDelete size={18} />
                                        </button>
                                    </div>

                                    <div className="flex items-center mb-2">
                                        <div className="flex items-center gap-2 mr-4">
                                            <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                                                <span className="text-blue-700 text-xs font-bold">{index + 1}</span>
                                            </div>
                                            <h4 className="font-semibold text-base text-gray-800">Question {index + 1}</h4>
                                        </div>
                                        {q.difficulty && getDifficultyBadge(q.difficulty)}
                                    </div>
                                    <p className="text-gray-700 mb-3 text-sm">{q.question}</p>

                                    <div className="space-y-2">
                                        {allAnswers.map((answer, i) => {
                                            // Determine if this is a correct answer
                                            const isCorrect = correctAnswers.includes(answer);

                                            return (
                                                <div
                                                    key={i}
                                                    className={`p-2 rounded-lg text-sm font-medium flex items-center ${
                                                        isCorrect
                                                            ? "bg-green-50 text-green-700 border border-green-200"
                                                            : "bg-gray-50 text-gray-500 border border-gray-200"
                                                    }`}
                                                >
                                                    {isCorrect ? (
                                                        <BsCheckCircleFill className="text-green-500 mr-2 text-xs flex-shrink-0" />
                                                    ) : (
                                                        <BsXCircleFill className="text-gray-400 mr-2 text-xs flex-shrink-0" />
                                                    )}
                                                    <span>{answer}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                            <AiOutlineQuestionCircle size={48} className="text-gray-300 mb-3" />
                            <p className="text-center">No questions yet.</p>
                            <p className="text-center text-sm">Click the 'Add Question' button to get started.</p>
                        </div>
                    )}
                </div>
            </div>

            {modalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-h-[90vh] overflow-y-auto">
                        {/* Top gradient line */}
                        <div className="h-1 w-full bg-gradient-to-r from-blue-400 to-indigo-400 absolute top-0 left-0 rounded-t-lg"></div>

                        <h2 className="text-lg font-bold text-blue-600 mb-4 mt-2">
                            {isEditing ? "Edit Question" : "Add Question"}
                        </h2>

                        <label className="block text-gray-700 font-medium mb-1">Question <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            placeholder="Enter question"
                            className="p-2.5 w-full bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 mb-4"
                            value={newQuestion}
                            onChange={(e) => setNewQuestion(e.target.value)}
                        />

                        <label className="block text-gray-700 font-medium mb-1">Difficulty</label>
                        <select
                            className="p-2.5 w-full bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 mb-4"
                            value={difficulty}
                            onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                        >
                            <option value={Difficulty.EASY}>Easy</option>
                            <option value={Difficulty.MEDIUM}>Medium</option>
                            <option value={Difficulty.HARD}>Hard</option>
                        </select>

                        <h3 className="font-medium text-blue-600 mb-2">Correct Answers</h3>
                        {correctAnswers.map((ans, index) => (
                            <div key={index} className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    className="p-2 w-full border border-gray-200 rounded-lg bg-green-50"
                                    value={ans}
                                    onChange={(e) => {
                                        const newCorrect = [...correctAnswers];
                                        newCorrect[index] = e.target.value;
                                        setCorrectAnswers(newCorrect);
                                    }}
                                />
                                <button
                                    onClick={() => setCorrectAnswers(correctAnswers.filter((_, i) => i !== index))}
                                    className="bg-red-50 text-red-500 hover:bg-red-100 p-2 rounded-lg"
                                >
                                    <BsXCircleFill />
                                </button>
                            </div>
                        ))}
                        <button
                            className="mb-4 text-green-600 bg-green-50 hover:bg-green-100 py-1 px-3 rounded-lg text-sm flex items-center gap-1 transition-colors"
                            onClick={() => setCorrectAnswers([...correctAnswers, ""]) }
                        >
                            <AiOutlinePlus size={16} /> Add Correct Answer
                        </button>

                        <h3 className="font-medium text-blue-600 mb-2">Incorrect Answers</h3>
                        {incorrectAnswers.map((ans, index) => (
                            <div key={index} className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    className="p-2 w-full border border-gray-200 rounded-lg bg-red-50"
                                    value={ans}
                                    onChange={(e) => {
                                        const newIncorrect = [...incorrectAnswers];
                                        newIncorrect[index] = e.target.value;
                                        setIncorrectAnswers(newIncorrect);
                                    }}
                                />
                                <button
                                    onClick={() => setIncorrectAnswers(incorrectAnswers.filter((_, i) => i !== index))}
                                    className="bg-red-50 text-red-500 hover:bg-red-100 p-2 rounded-lg"
                                >
                                    <BsXCircleFill />
                                </button>
                            </div>
                        ))}
                        <button
                            className="mb-6 text-red-600 bg-red-50 hover:bg-red-100 py-1 px-3 rounded-lg text-sm flex items-center gap-1 transition-colors"
                            onClick={() => setIncorrectAnswers([...incorrectAnswers, ""]) }
                        >
                            <AiOutlinePlus size={16} /> Add Incorrect Answer
                        </button>

                        <div className="flex justify-end space-x-2">
                            <button
                                className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                                onClick={() => setModalOpen(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-gradient-to-r from-blue-400 to-indigo-400 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg transition-colors shadow-sm"
                                onClick={saveQuestion}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Add the custom scrollbar
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
document.head.appendChild(style);

export default QuestionsTab;