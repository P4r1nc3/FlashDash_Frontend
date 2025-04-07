import { useEffect, useState } from "react";
import {
    AiOutlineQuestionCircle,
    AiOutlinePlus,
    AiOutlineSearch,
    AiOutlineRobot,
    AiOutlineDelete
} from "react-icons/ai";
import { BiSortAlt2 } from "react-icons/bi";
import { toast } from "react-toastify";
import { getQuestionsInDeck, addQuestionToDeck, updateQuestion, deleteQuestion, generateQuestions } from "../../api/questions.ts";
import { QuestionResponse } from "../../interfaces/Question.ts";
import { Difficulty } from "../../enums/Difficulty.ts";
import Card from "../../components/ui/Card";
import Modal from "../../components/ui/Modal";
import GradientButton from "../../components/ui/GradientButton";
import EmptyState from "../../components/ui/EmptyState";
import Question from "../../components/ui/Question";
import { useParams } from "react-router-dom";
import { BsCheckCircleFill, BsXCircleFill } from "react-icons/bs";

const QuestionsTab = () => {
    const { deckFrn } = useParams<{ deckFrn: string }>();
    const [questions, setQuestions] = useState<QuestionResponse[]>([]);
    const [filteredQuestions, setFilteredQuestions] = useState<QuestionResponse[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOption, setSortOption] = useState("recent");
    const [modalOpen, setModalOpen] = useState(false);
    const [generateModalOpen, setGenerateModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editItemId, setEditItemId] = useState<string | null>(null);
    const [newQuestion, setNewQuestion] = useState("");
    const [correctAnswers, setCorrectAnswers] = useState<string[]>([]);
    const [incorrectAnswers, setIncorrectAnswers] = useState<string[]>([]);
    const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.MEDIUM);
    const [generateCount, setGenerateCount] = useState(3);
    const [generateLanguage, setGenerateLanguage] = useState("English");
    const [generateDifficulty, setGenerateDifficulty] = useState(Difficulty.MEDIUM);
    const [generatePrompt, setGeneratePrompt] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);

    const fetchQuestions = async () => {
        if (!deckFrn) return;
        const fetchedQuestions = await getQuestionsInDeck(deckFrn);
        setQuestions(fetchedQuestions);
        setFilteredQuestions(fetchedQuestions);
    };

    useEffect(() => {
        void fetchQuestions();
    }, [deckFrn]);

    useEffect(() => {
        let filtered = [...questions];

        if (searchTerm) {
            filtered = filtered.filter((q) =>
                q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                q.correctAnswers.some(ans => ans.toLowerCase().includes(searchTerm.toLowerCase())) ||
                q.incorrectAnswers.some(ans => ans.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        if (sortOption === "recent") {
            filtered = filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        } else if (sortOption === "alphabetical") {
            filtered = filtered.sort((a, b) => a.question.localeCompare(b.question));
        } else if (sortOption === "difficulty") {
            const difficultyOrder = { [Difficulty.EASY]: 1, [Difficulty.MEDIUM]: 2, [Difficulty.HARD]: 3 };
            filtered = filtered.sort((a, b) =>
                difficultyOrder[a.difficulty as Difficulty] - difficultyOrder[b.difficulty as Difficulty]
            );
        }

        setFilteredQuestions(filtered);
    }, [questions, searchTerm, sortOption]);

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

        const payload = { question: newQuestion, correctAnswers, incorrectAnswers, difficulty };

        if (isEditing && editItemId) {
            await updateQuestion(deckFrn, editItemId, payload);
            toast.success("Question updated successfully!");
        } else {
            await addQuestionToDeck(deckFrn, payload);
            toast.success("Question added successfully!");
        }

        await fetchQuestions();
        setModalOpen(false);
    };

    const deleteCurrentQuestion = async (itemId: string) => {
        if (!deckFrn) return;
        await deleteQuestion(deckFrn, itemId);
        toast.success("Question deleted successfully.");
        await fetchQuestions();
    };

    const handleGenerateQuestions = () => {
        setGenerateModalOpen(true);
    };

    const handleSubmitGeneration = async () => {
        if (!deckFrn || !generatePrompt.trim() || isGenerating) {
            if (!generatePrompt.trim()) {
                toast.error("Please provide a topic for your questions.");
            }
            return;
        }

        setIsGenerating(true);

        const payload = {
            count: generateCount,
            language: generateLanguage,
            difficulty: generateDifficulty,
            prompt: generatePrompt
        };

        await generateQuestions(deckFrn, payload);

        toast.success(`Successfully generated ${generateCount} questions!`);
        await fetchQuestions();

        setIsGenerating(false);
        setGenerateModalOpen(false);

        // Reset the form for next time
        setGenerateCount(3);
        setGenerateLanguage("English");
        setGenerateDifficulty(Difficulty.MEDIUM);
        setGeneratePrompt("");
    };

    const renderToolbar = () => (
        <div className="flex flex-wrap items-center gap-3">
            <div className="relative w-full sm:w-auto sm:flex-1 max-w-md">
                <input
                    type="text"
                    placeholder="Search questions..."
                    className="p-2 pl-9 w-full bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-300 text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                    <AiOutlineSearch className="text-gray-400" size={18} />
                </div>
            </div>

            <div className="flex items-center">
                <label className="mr-2 text-xs text-gray-500 font-medium">Sort by:</label>
                <div className="relative">
                    <select
                        className="h-10 py-2 pl-8 pr-8 border border-gray-200 rounded-lg bg-gray-50 appearance-none focus:outline-none focus:ring-1 focus:ring-indigo-300 text-sm text-gray-700 cursor-pointer"
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                    >
                        <option value="recent">Most Recent</option>
                        <option value="alphabetical">Alphabetical</option>
                        <option value="difficulty">Difficulty</option>
                    </select>
                    <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                        <BiSortAlt2 className="text-gray-400" size={18} />
                    </div>
                    <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                        <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                    </div>
                </div>
            </div>

            <div className="flex gap-2 ml-auto">
                <GradientButton
                    onClick={handleGenerateQuestions}
                    startColor="from-emerald-400"
                    endColor="to-teal-400"
                    hoverStartColor="from-emerald-500"
                    hoverEndColor="to-teal-500"
                    icon={<AiOutlineRobot size={16} />}
                    className="text-sm"
                >
                    Generate Questions
                </GradientButton>
                <GradientButton
                    onClick={openAddModal}
                    startColor="from-blue-400"
                    endColor="to-indigo-400"
                    hoverStartColor="from-blue-500"
                    hoverEndColor="to-indigo-500"
                    icon={<AiOutlinePlus size={16} />}
                    className="text-sm"
                >
                    Add Question
                </GradientButton>
            </div>
        </div>
    );

    const renderQuestionsList = () => {
        if (filteredQuestions.length === 0) {
            return (
                <div className="h-full flex items-center justify-center pb-24">
                    <EmptyState
                        icon={<AiOutlineQuestionCircle size={48} />}
                        title="No questions found."
                        description={searchTerm ? "Try different search terms." : "Click the 'Add Question' button to get started."}
                    />
                </div>
            );
        }

        return (
            <div className="space-y-4">
                {filteredQuestions.map((q, index) => {
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
                <label className="block text-gray-700 font-medium mb-1 text-sm">Question <span className="text-red-500">*</span></label>
                <input
                    type="text"
                    placeholder="Enter question"
                    className="p-2.5 w-full bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 mb-4"
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                />
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                    Difficulty <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                    <button
                        type="button"
                        className={`flex-1 py-2 px-2 rounded-md text-sm ${
                            difficulty === Difficulty.EASY
                                ? "bg-green-100 text-green-700 border border-green-300"
                                : "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200"
                        }`}
                        onClick={() => setDifficulty(Difficulty.EASY)}
                    >
                        Easy
                    </button>
                    <button
                        type="button"
                        className={`flex-1 py-2 px-2 rounded-md text-sm ${
                            difficulty === Difficulty.MEDIUM
                                ? "bg-yellow-100 text-yellow-700 border border-yellow-300"
                                : "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200"
                        }`}
                        onClick={() => setDifficulty(Difficulty.MEDIUM)}
                    >
                        Medium
                    </button>
                    <button
                        type="button"
                        className={`flex-1 py-2 px-2 rounded-md text-sm ${
                            difficulty === Difficulty.HARD
                                ? "bg-red-100 text-red-700 border border-red-300"
                                : "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200"
                        }`}
                        onClick={() => setDifficulty(Difficulty.HARD)}
                    >
                        Hard
                    </button>
                </div>
            </div>

            <h3 className="font-medium text-blue-600 mb-2 text-sm">Answers</h3>
            <p className="text-xs text-gray-500 mb-3">Click the indicator to toggle between correct and incorrect answers.</p>

            {/* Combined answers section with improved styling and icons */}
            {[...correctAnswers.map(text => ({ text, isCorrect: true })),
                ...incorrectAnswers.map(text => ({ text, isCorrect: false }))]
                .sort((a, b) => Number(b.isCorrect) - Number(a.isCorrect))
                .map((answer, index) => (
                    <div key={index} className="flex gap-2 mb-2 items-center">
                        <button
                            type="button"
                            onClick={() => {
                                // Toggle between correct and incorrect
                                if (answer.isCorrect) {
                                    // Move from correct to incorrect
                                    const newCorrect = correctAnswers.filter(text => text !== answer.text);
                                    const newIncorrect = [...incorrectAnswers, answer.text];
                                    setCorrectAnswers(newCorrect);
                                    setIncorrectAnswers(newIncorrect);
                                } else {
                                    // Move from incorrect to correct
                                    const newIncorrect = incorrectAnswers.filter(text => text !== answer.text);
                                    const newCorrect = [...correctAnswers, answer.text];
                                    setIncorrectAnswers(newIncorrect);
                                    setCorrectAnswers(newCorrect);
                                }
                            }}
                            className={`flex-shrink-0 w-10 h-10 rounded-md flex items-center justify-center ${
                                answer.isCorrect
                                    ? "bg-green-100 text-green-600 hover:bg-green-200"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                            title={answer.isCorrect ? "Correct answer (click to change)" : "Incorrect answer (click to change)"}
                        >
                            {answer.isCorrect ? <BsCheckCircleFill className="text-green-500 text-xs" /> : <BsXCircleFill className="text-gray-400 text-xs" />}
                        </button>

                        <input
                            type="text"
                            className={`p-2 w-full border rounded-lg ${
                                answer.isCorrect ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"
                            }`}
                            value={answer.text}
                            onChange={(e) => {
                                const newText = e.target.value;
                                if (answer.isCorrect) {
                                    const newCorrect = [...correctAnswers];
                                    newCorrect[correctAnswers.indexOf(answer.text)] = newText;
                                    setCorrectAnswers(newCorrect);
                                } else {
                                    const newIncorrect = [...incorrectAnswers];
                                    newIncorrect[incorrectAnswers.indexOf(answer.text)] = newText;
                                    setIncorrectAnswers(newIncorrect);
                                }
                            }}
                        />

                        <button
                            type="button"
                            onClick={() => {
                                if (answer.isCorrect) {
                                    setCorrectAnswers(correctAnswers.filter(text => text !== answer.text));
                                } else {
                                    setIncorrectAnswers(incorrectAnswers.filter(text => text !== answer.text));
                                }
                            }}
                            className="flex-shrink-0 w-10 h-10 rounded-md flex items-center justify-center text-red-600 border border-red-200 bg-white hover:bg-red-50 transition-colors shadow-sm"
                        >
                            <AiOutlineDelete size={18} />
                        </button>
                    </div>
                ))}

            <button
                type="button"
                className="mb-6 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 py-2 px-3 rounded-lg text-sm flex items-center gap-1 transition-colors w-full justify-center"
                onClick={() => setIncorrectAnswers([...incorrectAnswers, ""]) }
            >
                <AiOutlinePlus size={16} /> Add New Answer
            </button>
        </>
    );

    return (
        <>
            <Card
                title="Questions"
                description="Manage questions in this deck."
                icon={<AiOutlineQuestionCircle size={22} />}
                toolbar={renderToolbar()}
                scrollable={filteredQuestions.length > 0}
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

            {/* Generate Questions Modal */}
            <Modal
                isOpen={generateModalOpen}
                onClose={() => !isGenerating && setGenerateModalOpen(false)}
                title="Generate Questions"
                onSave={handleSubmitGeneration}
                saveText="Generate"
                width="w-96 max-h-[90vh]"
            >
                <div className="mb-5">
                    {isGenerating ? (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                            <div className="animate-pulse flex space-x-2 justify-center">
                                <div className="h-2 w-2 bg-indigo-500 rounded-full"></div>
                                <div className="h-2 w-2 bg-indigo-500 rounded-full"></div>
                                <div className="h-2 w-2 bg-indigo-500 rounded-full"></div>
                            </div>
                            <p className="text-sm text-gray-500 mt-3">Generating questions... This may take up to 10 seconds.</p>
                        </div>
                    ) : (
                        <>
                            <p className="text-gray-600 text-sm mb-4">
                                AI will generate questions based on your specifications. This may take a few seconds.
                            </p>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-medium mb-2">
                                    Number of questions <span className="text-red-500">*</span>
                                </label>
                                <div className="flex items-center">
                                    <button
                                        className="bg-gray-200 text-gray-700 h-10 w-10 rounded-l-lg flex items-center justify-center hover:bg-gray-300"
                                        onClick={() => setGenerateCount(Math.max(1, generateCount - 1))}
                                    >
                                        -
                                    </button>
                                    <div className="h-10 px-4 bg-gray-100 flex items-center justify-center font-medium">
                                        {generateCount}
                                    </div>
                                    <button
                                        className="bg-gray-200 text-gray-700 h-10 w-10 rounded-r-lg flex items-center justify-center hover:bg-gray-300"
                                        onClick={() => setGenerateCount(Math.min(10, generateCount + 1))}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-medium mb-2">
                                    Language <span className="text-red-500">*</span>
                                </label>
                                <div className="flex gap-2">
                                    <button
                                        className={`flex-1 py-2 px-4 rounded-md text-sm ${
                                            generateLanguage === "English"
                                                ? "bg-blue-100 text-blue-700 border border-blue-300"
                                                : "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200"
                                        }`}
                                        onClick={() => setGenerateLanguage("English")}
                                    >
                                        English
                                    </button>
                                    <button
                                        className={`flex-1 py-2 px-4 rounded-md text-sm ${
                                            generateLanguage === "Polish"
                                                ? "bg-blue-100 text-blue-700 border border-blue-300"
                                                : "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200"
                                        }`}
                                        onClick={() => setGenerateLanguage("Polish")}
                                    >
                                        Polish
                                    </button>
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-medium mb-2">
                                    Difficulty <span className="text-red-500">*</span>
                                </label>
                                <div className="flex gap-2">
                                    <button
                                        className={`flex-1 py-2 px-2 rounded-md text-sm ${
                                            generateDifficulty === Difficulty.EASY
                                                ? "bg-green-100 text-green-700 border border-green-300"
                                                : "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200"
                                        }`}
                                        onClick={() => setGenerateDifficulty(Difficulty.EASY)}
                                    >
                                        Easy
                                    </button>
                                    <button
                                        className={`flex-1 py-2 px-2 rounded-md text-sm ${
                                            generateDifficulty === Difficulty.MEDIUM
                                                ? "bg-yellow-100 text-yellow-700 border border-yellow-300"
                                                : "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200"
                                        }`}
                                        onClick={() => setGenerateDifficulty(Difficulty.MEDIUM)}
                                    >
                                        Medium
                                    </button>
                                    <button
                                        className={`flex-1 py-2 px-2 rounded-md text-sm ${
                                            generateDifficulty === Difficulty.HARD
                                                ? "bg-red-100 text-red-700 border border-red-300"
                                                : "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200"
                                        }`}
                                        onClick={() => setGenerateDifficulty(Difficulty.HARD)}
                                    >
                                        Hard
                                    </button>
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-medium mb-2">
                                    Topic/Prompt <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    placeholder="Describe the topic for the questions (e.g. 'JavaScript basics' or 'European history')"
                                    className="p-2.5 w-full bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 min-h-[100px]"
                                    value={generatePrompt}
                                    onChange={(e) => setGeneratePrompt(e.target.value)}
                                />
                            </div>
                        </>
                    )}
                </div>
            </Modal>
        </>
    );
};

export default QuestionsTab;