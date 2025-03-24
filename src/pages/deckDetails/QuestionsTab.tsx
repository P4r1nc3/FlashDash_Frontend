import { useEffect, useState } from "react";
import {
    AiOutlineQuestionCircle,
    AiOutlinePlus,
} from "react-icons/ai";
import { toast } from "react-toastify";
import { getQuestionsInDeck, addQuestionToDeck, updateQuestion, deleteQuestion } from "../../api/questions.ts";
import { QuestionResponse } from "../../interfaces/Question.ts";
import { Difficulty } from "../../enums/Difficulty.ts";
import Card from "../../components/ui/Card";
import Modal from "../../components/ui/Modal";
import GradientButton from "../../components/ui/GradientButton";
import EmptyState from "../../components/ui/EmptyState";
import Question from "../../components/ui/Question";
import { useParams } from "react-router-dom";
import { BsXCircleFill } from "react-icons/bs";

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
                    // Format answers for the Question component
                    const answers = [
                        ...q.correctAnswers.map(text => ({ text, isCorrect: true })),
                        ...q.incorrectAnswers.map(text => ({ text, isCorrect: false }))
                    ];

                    return (
                        <Question
                            key={q.questionFrn}
                            index={index + 1}
                            question={q.question}
                            answers={answers}
                            difficulty={q.difficulty}
                            editable={true}
                            onEdit={() => openEditModal(q)}
                            onDelete={() => deleteCurrentQuestion(q.questionFrn)}
                        />
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