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
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [editingDeck, setEditingDeck] = useState<Deck | null>(null);
    const [deletingDeck, setDeletingDeck] = useState<Deck | null>(null);
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

    const handleDeleteDeck = async () => {
        if (!deletingDeck) return;

        try {
            await deleteDeck(deletingDeck.deckFrn);
            toast.success("Deck deleted successfully.");
            await fetchDecks();
            setDeleteModalOpen(false);
            setDeletingDeck(null);
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
                <div className="h-full flex items-center justify-center">
                    <EmptyState
                        icon={<BsBook size={48} />}
                        title="No decks found."
                        description={searchTerm ? "Try different search terms." : "Click \"Add Deck\" to create your first deck."}
                    />
                </div>
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
                    <div className="flex space-x-3">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                void handleDownloadDeck(deck);
                            }}
                            className="flex items-center justify-center h-9 w-9 text-blue-600 border border-blue-200 bg-white hover:bg-blue-50 rounded-md transition-colors shadow-sm"
                            title="Download deck"
                        >
                            <AiOutlineDownload size={18} />
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                openEditModal(deck);
                            }}
                            className="flex items-center justify-center h-9 w-9 text-indigo-600 border border-indigo-200 bg-white hover:bg-indigo-50 rounded-md transition-colors shadow-sm"
                            title="Edit deck"
                        >
                            <AiOutlineEdit size={18} />
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setDeletingDeck(deck);
                                setDeleteModalOpen(true);
                            }}
                            className="flex items-center justify-center h-9 w-9 text-red-600 border border-red-200 bg-white hover:bg-red-50 rounded-md transition-colors shadow-sm"
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
            scrollable={filteredDecks.length > 0}
            fullHeight={true}
        >
            <div className="flex flex-wrap mb-6 items-center gap-3">
                <div className="relative w-full sm:w-auto sm:flex-1 max-w-md">
                    <input
                        type="text"
                        placeholder="Search decks..."
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
                        onClick={() => setUploadModalOpen(true)}
                        startColor="from-emerald-400"
                        endColor="to-teal-400"
                        hoverStartColor="from-emerald-500"
                        hoverEndColor="to-teal-500"
                        icon={<AiOutlineUpload size={16} />}
                        className="text-sm"
                    >
                        Import Deck
                    </GradientButton>
                    <GradientButton
                        onClick={openCreateModal}
                        startColor="from-blue-400"
                        endColor="to-indigo-400"
                        hoverStartColor="from-blue-500"
                        hoverEndColor="to-indigo-500"
                        icon={<AiOutlinePlus size={16} />}
                        className="text-sm"
                    >
                        Add Deck
                    </GradientButton>
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

            {/* Delete Deck Confirmation Modal */}
            <Modal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                title="Confirm Deck Deletion"
                onSave={handleDeleteDeck}
                saveText="Delete Deck"
                width="w-96"
            >
                <p className="text-gray-600 mb-6">
                    Are you sure you want to delete the deck "{deletingDeck?.name}"?
                    This action cannot be undone.
                </p>
            </Modal>
        </Card>
    );
};

export default YourDecksTab;