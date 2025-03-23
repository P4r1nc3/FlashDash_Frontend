import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getDecks, createDeck, updateDeck, deleteDeck } from "../../api/decks.ts";
import { getQuestionsInDeck } from "../../api/questions.ts";
import { addQuestionToDeck } from "../../api/questions.ts";
import { Deck, CreateDeckRequest } from "../../interfaces/Deck.ts";
import { toast } from "react-toastify";
import { AiOutlinePlus, AiOutlineEdit, AiOutlineDelete, AiOutlineSearch, AiOutlineDownload, AiOutlineUpload } from "react-icons/ai";
import { BiSortAlt2 } from "react-icons/bi";
import { BsBook, BsBookHalf } from "react-icons/bs";
import Card from "../../components/ui/Card";
import Modal from "../../components/ui/Modal";
import GradientButton from "../../components/ui/GradientButton";
import EmptyState from "../../components/ui/EmptyState";
import { QuestionRequest } from "../../interfaces/Question.ts";

interface ExportDeck {
    name: string;
    description: string;
    questions: QuestionRequest[];
}

const YourDecksTab = () => {
    const [decks, setDecks] = useState<Deck[]>([]);
    const [filteredDecks, setFilteredDecks] = useState<Deck[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOption, setSortOption] = useState("recent");
    const [modalOpen, setModalOpen] = useState(false);
    const [uploadModalOpen, setUploadModalOpen] = useState(false);
    const [editingDeck, setEditingDeck] = useState<Deck | null>(null);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    const filterAndSortDecks = useCallback(() => {
        let filtered = [...decks];

        if (searchTerm) {
            filtered = filtered.filter((deck) =>
                deck.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                deck.description?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        if (sortOption === "recent") {
            filtered = filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        } else if (sortOption === "alphabetical") {
            filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));
        }

        setFilteredDecks(filtered);
    }, [decks, searchTerm, sortOption]);

    const fetchDecks = async () => {
        try {
            const data = await getDecks();
            setDecks(data);
        } catch (error) {
            console.error("Error while fetching decks:", error);
            toast.error("Failed to fetch decks.");
        }
    };

    useEffect(() => {
        void fetchDecks();
    }, []);

    useEffect(() => {
        filterAndSortDecks();
    }, [filterAndSortDecks]);

    const handleCreateOrUpdateDeck = async () => {
        if (!name.trim()) {
            toast.error("Deck name is required.");
            return;
        }

        try {
            const deckData: CreateDeckRequest = {
                name,
                description: description || ""
            };

            if (editingDeck) {
                await updateDeck(editingDeck.deckFrn, deckData);
                toast.success("Deck updated successfully!");
            } else {
                await createDeck(deckData);
                toast.success("Deck created successfully!");
            }
            setName("");
            setDescription("");
            setEditingDeck(null);
            await fetchDecks();
            setModalOpen(false);
        } catch (error) {
            console.error("Error while saving the deck:", error);
            toast.error("Failed to save deck.");
        }
    };

    const handleDeleteDeck = async (deckFrn: string) => {
        try {
            await deleteDeck(deckFrn);
            toast.success("Deck deleted successfully.");
            await fetchDecks();
        } catch (error) {
            console.error("Error while deleting the deck:", error);
            toast.error("Failed to delete deck.");
        }
    };

    const handleDownloadDeck = async (deck: Deck) => {
        try {
            const questions = await getQuestionsInDeck(deck.deckFrn);

            const deckData: ExportDeck = {
                name: deck.name,
                description: deck.description || "",
                questions: questions.map(q => ({
                    question: q.question,
                    correctAnswers: q.correctAnswers,
                    incorrectAnswers: q.incorrectAnswers,
                    difficulty: q.difficulty
                }))
            };

            const dataStr = JSON.stringify(deckData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);

            const a = document.createElement('a');
            a.href = url;
            a.download = `${deck.name.replace(/\s+/g, '_')}.json`;
            document.body.appendChild(a);
            a.click();

            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            toast.success("Deck downloaded successfully!");
        } catch (error) {
            console.error("Error downloading deck:", error);
            toast.error("Failed to download deck.");
        }
    };

    const handleUploadDeck = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setIsUploading(true);
            const file = event.target.files?.[0];
            if (!file) {
                setIsUploading(false);
                return;
            }

            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const result = e.target?.result;
                    if (typeof result !== 'string') {
                        throw new Error("Failed to read file content");
                    }

                    const content = JSON.parse(result) as ExportDeck;

                    if (!content.name || !Array.isArray(content.questions)) {
                        throw new Error("Invalid deck format");
                    }

                    const deckData: CreateDeckRequest = {
                        name: content.name,
                        description: content.description || ""
                    };

                    const newDeck = await createDeck(deckData);

                    for (const question of content.questions) {
                        await addQuestionToDeck(newDeck.deckFrn, {
                            question: question.question,
                            correctAnswers: question.correctAnswers,
                            incorrectAnswers: question.incorrectAnswers,
                            difficulty: question.difficulty
                        });

                        await new Promise(resolve => setTimeout(resolve, 100));
                    }

                    await fetchDecks();

                    toast.success("Deck imported successfully!");
                    setUploadModalOpen(false);
                } catch (error) {
                    console.error("Error parsing deck file:", error);
                    toast.error("Failed to import deck: Invalid file format");
                }

                setIsUploading(false);
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
            };

            reader.onerror = () => {
                toast.error("Failed to read file");
                setIsUploading(false);
            };

            reader.readAsText(file);
        } catch (error) {
            console.error("Error uploading deck:", error);
            toast.error("Failed to upload deck");
            setIsUploading(false);
        }
    };

    const openEditModal = (deck: Deck) => {
        setEditingDeck(deck);
        setName(deck.name);
        setDescription(deck.description || "");
        setModalOpen(true);
    };

    const openCreateModal = () => {
        setEditingDeck(null);
        setName("");
        setDescription("");
        setModalOpen(true);
    };

    const renderDeckList = () => {
        if (filteredDecks.length === 0) {
            return (
                <EmptyState
                    icon={<BsBook size={48} />}
                    title="No decks found."
                    description={searchTerm ? "Try different search terms." : "Click \"Add Deck\" to create your first deck."}
                />
            );
        }

        return filteredDecks.map((deck) => (
            <div
                key={deck.deckFrn}
                className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-sm border border-indigo-100 cursor-pointer hover:shadow-md hover:bg-gradient-to-br hover:from-blue-100 hover:to-indigo-100 transition-colors duration-200 mb-3"
                onClick={() => navigate(`/decks/${deck.deckFrn}`)}
            >
                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full flex items-center justify-center shadow-sm mr-3">
                            <BsBookHalf className="text-white" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800">{deck.name}</h3>
                            {deck.description && (
                                <p className="text-gray-600 text-sm">{deck.description}</p>
                            )}
                        </div>
                    </div>
                    <div className="flex space-x-2">
                        <button
                            className="text-blue-500 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 p-1.5 rounded-md transition-colors"
                            onClick={(e) => {
                                e.stopPropagation();
                                void handleDownloadDeck(deck);
                            }}
                            title="Download deck"
                        >
                            <AiOutlineDownload size={18} />
                        </button>
                        <button
                            className="text-indigo-500 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 p-1.5 rounded-md transition-colors"
                            onClick={(e) => { e.stopPropagation(); openEditModal(deck); }}
                            title="Edit deck"
                        >
                            <AiOutlineEdit size={18} />
                        </button>
                        <button
                            className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-1.5 rounded-md transition-colors"
                            onClick={(e) => {
                                e.stopPropagation();
                                void handleDeleteDeck(deck.deckFrn);
                            }}
                            title="Delete deck"
                        >
                            <AiOutlineDelete size={18} />
                        </button>
                    </div>
                </div>
            </div>
        ));
    };

    return (
        <Card
            title="Your Decks"
            description="Manage your study decks and card collections."
            icon={<BsBook size={22} />}
            actions={
                <div className="flex gap-2">
                    <GradientButton
                        onClick={() => setUploadModalOpen(true)}
                        className="bg-gradient-to-r from-emerald-500 to-teal-500 w-44 mr-1"
                        icon={<AiOutlineUpload size={18} />}
                    >
                        Import Deck
                    </GradientButton>
                    <GradientButton
                        onClick={openCreateModal}
                        icon={<AiOutlinePlus size={18} />}
                        className="w-44 mr-2"
                    >
                        Add Deck
                    </GradientButton>
                </div>
            }
            scrollable={true}
            fullHeight={true}
        >
            <div className="flex justify-between mb-6 items-center gap-3">
                <div className="relative flex-grow">
                    <input
                        type="text"
                        placeholder="Search decks..."
                        className="p-2.5 pl-10 w-full bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <AiOutlineSearch className="text-gray-400" size={20} />
                    </div>
                </div>

                <div className="relative w-44">
                    <select
                        className="w-full py-2.5 pl-10 pr-4 border border-gray-200 rounded-lg bg-gray-50 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-300 text-gray-700 cursor-pointer"
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                    >
                        <option value="recent">Most Recent</option>
                        <option value="alphabetical">Alphabetical</option>
                    </select>
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <BiSortAlt2 className="text-gray-400" size={20} />
                    </div>
                </div>
            </div>

            {renderDeckList()}

            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title={editingDeck ? "Edit Deck" : "Create New Deck"}
                onSave={handleCreateOrUpdateDeck}
                saveText={editingDeck ? "Update Deck" : "Create Deck"}
            >
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-1 text-sm">
                        Deck Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        placeholder="Enter deck name"
                        className="p-2.5 w-full bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-1 text-sm">
                        Description
                    </label>
                    <textarea
                        placeholder="Enter description (optional)"
                        className="p-2.5 w-full bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 min-h-[100px]"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
            </Modal>

            <Modal
                isOpen={uploadModalOpen}
                onClose={() => setUploadModalOpen(false)}
                title="Import Deck"
                onSave={() => setUploadModalOpen(false)}
            >
                <div className="mb-4">
                    <p className="text-gray-600 mb-4">
                        Upload a deck JSON file to import a deck with all its questions. The file should be in the format exported by the "Download Deck" function.
                    </p>

                    <div
                        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-indigo-300 hover:bg-indigo-50 transition-colors duration-200"
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            e.currentTarget.classList.add('border-indigo-400', 'bg-indigo-50');
                        }}
                        onDragLeave={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            e.currentTarget.classList.remove('border-indigo-400', 'bg-indigo-50');
                        }}
                        onDrop={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            e.currentTarget.classList.remove('border-indigo-400', 'bg-indigo-50');

                            const files = e.dataTransfer.files;
                            if (files && files.length > 0) {
                                const syntheticEvent = {
                                    target: {
                                        files: files
                                    }
                                } as React.ChangeEvent<HTMLInputElement>;
                                void handleUploadDeck(syntheticEvent);
                            }
                        }}
                    >
                        <AiOutlineUpload className="mx-auto text-gray-400 mb-2" size={32} />
                        <p className="text-sm text-gray-500 mb-1">
                            Drag & drop a JSON file here
                        </p>
                        <p className="text-xs text-gray-400">
                            or click to browse files
                        </p>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".json"
                            onChange={handleUploadDeck}
                            className="hidden"
                        />

                        {isUploading && (
                            <div className="mt-3">
                                <div className="animate-pulse flex space-x-2 justify-center">
                                    <div className="h-2 w-2 bg-indigo-500 rounded-full"></div>
                                    <div className="h-2 w-2 bg-indigo-500 rounded-full"></div>
                                    <div className="h-2 w-2 bg-indigo-500 rounded-full"></div>
                                </div>
                                <p className="text-sm text-gray-500 mt-1">Uploading and processing...</p>
                            </div>
                        )}
                    </div>
                </div>
            </Modal>
        </Card>
    );
};

export default YourDecksTab;