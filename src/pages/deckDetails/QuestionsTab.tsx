import { useEffect, useState } from "react";
import {
    AiOutlineQuestionCircle,
    AiOutlineEdit,
    AiOutlineDelete,
    AiOutlinePlus,
} from "react-icons/ai";
import { toast } from "react-toastify";
import { BsCheckCircleFill, BsXCircleFill } from "react-icons/bs";
import { getQuestionsInDeck, addQuestionToDeck, updateQuestion, deleteQuestion } from "../../api/questions.ts";
import { QuestionResponse } from "../../interfaces/Question.ts";
import { Difficulty } from "../../enums/Difficulty.ts";
import Card from "../../components/ui/Card";
import Modal from "../../components/ui/Modal";
import GradientButton from "../../components/ui/GradientButton";
import EmptyState from "../../components/ui/EmptyState";
import {useParams} from "react-router-dom";


const QuestionsTab = () => {
    const { deckFrn } = useParams<{ deckFrn: string }>();
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
    }, [deckFrn]);

    const fetchQuestions = async () => {
        if (!deckFrn) return;
        try {
            const fetchedQuestions = await getQuestionsInDeck(deckFrn);
            setQuestions(fetchedQuestions);
        } catch (error) {
            console.error("Error while loading the question:", error);
            toast.error("Failed to load questions.");
        }
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
        if (!deckFrn || !newQuestion.trim()) {
            toast.error("Question text is required.");
            return;
        }

        try {
            const payload = { question: newQuestion, correctAnswers, incorrectAnswers, difficulty };

            if (isEditing && editItemId) {
                await updateQuestion(deckFrn, editItemId, payload);
                toast.success("Question updated successfully!");
            } else {
                await addQuestionToDeck(deckFrn, payload);
                toast.success("Question added successfully!");
            }

            fetchQuestions();
            setModalOpen(false);
        } catch (error) {
            console.error("Error when saving the question:", error);
            toast.error("Failed to save question.");
        }
    };

    const deleteCurrentQuestion = async (itemId: string) => {
        if (!deckFrn) return;
        try {
            await deleteQuestion(deckFrn, itemId);
            toast.success("Question deleted successfully.");
            fetchQuestions();
        } catch (error) {
            console.error("Error while deleting the question:", error);
            toast.error("Failed to delete question.");
        }
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

    const renderQuestionsList = () => {
        if (questions.length === 0) {
            return (
                <EmptyState
                    icon={<AiOutlineQuestionCircle size={48} />}
                    title="No questions yet."
                    description="Click the 'Add Question' button to get started."
                />
            );
        }

        return (
            <div className="space-y-4">
                {questions.map((q, index) => {
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
                })}
            </div>
        );
    };

    const renderModalContent = () => (
        <>
            <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-1">Question <span className="text-red-500">*</span></label>
                <input
                    type="text"
                    placeholder="Enter question"
                    className="p-2.5 w-full bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 mb-4"
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                />
            </div>

            <div className="mb-4">
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
            </div>

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
        </>
    );

    return (
        <>
            <Card
                title="Questions"
                description="Manage questions in this deck."
                icon={<AiOutlineQuestionCircle size={22} />}
                actions={
                    <GradientButton
                        onClick={openAddModal}
                        icon={<AiOutlinePlus size={18} />}
                    >
                        Add Question
                    </GradientButton>
                }
                scrollable={true}
                fullHeight={true}
            >
                {renderQuestionsList()}
            </Card>

            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title={isEditing ? "Edit Question" : "Add Question"}
                onSave={saveQuestion}
                saveText="Save"
                width="w-96 max-h-[90vh]"
            >
                {renderModalContent()}
            </Modal>
        </>
    );
};

export default QuestionsTab;