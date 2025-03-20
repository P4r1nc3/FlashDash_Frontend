import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getDecks, createDeck, updateDeck, deleteDeck } from "../../api/decks.ts";
import { Deck } from "../../interfaces/Deck.ts";
import { toast } from "react-toastify";
import { AiOutlinePlus, AiOutlineEdit, AiOutlineDelete, AiOutlineSearch } from "react-icons/ai";
import { BiSortAlt2 } from "react-icons/bi";
import { BsBook, BsBookHalf } from "react-icons/bs";
import Card from "../../components/ui/Card";
import Modal from "../../components/ui/Modal";
import GradientButton from "../../components/ui/GradientButton";
import EmptyState from "../../components/ui/EmptyState";

const YourDecksTab = () => {
    const [decks, setDecks] = useState<Deck[]>([]);
    const [filteredDecks, setFilteredDecks] = useState<Deck[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOption, setSortOption] = useState("recent");
    const [modalOpen, setModalOpen] = useState(false);
    const [editingDeck, setEditingDeck] = useState<Deck | null>(null);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchDecks();
    }, []);

    useEffect(() => {
        filterAndSortDecks();
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

    const filterAndSortDecks = () => {
        let filtered = decks;

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
    };

    const handleCreateOrUpdateDeck = async () => {
        if (!name.trim()) {
            toast.error("Deck name is required.");
            return;
        }

        try {
            if (editingDeck) {
                await updateDeck(editingDeck.deckFrn, { name, description: description || "" });
                toast.success("Deck updated successfully!");
            } else {
                await createDeck({ name, description: description || "" });
                toast.success("Deck created successfully!");
            }
            setName("");
            setDescription("");
            setEditingDeck(null);
            fetchDecks();
            setModalOpen(false);
        } catch (error) {
            console.error("Error while saving the deck:", error);
            toast.error("Failed to save deck.");
        }
    };

    const handleDeleteDeck = async (deckId: number) => {
        try {
            await deleteDeck(deckId);
            toast.success("Deck deleted successfully.");
            fetchDecks();
        } catch (error) {
            console.error("Error while deleting the deck:", error);
            toast.error("Failed to delete deck.");
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
                            className="text-indigo-500 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 p-1.5 rounded-md transition-colors"
                            onClick={(e) => { e.stopPropagation(); openEditModal(deck); }}
                        >
                            <AiOutlineEdit size={18} />
                        </button>
                        <button
                            className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-1.5 rounded-md transition-colors"
                            onClick={(e) => { e.stopPropagation(); handleDeleteDeck(deck.deckFrn); }}
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
                <GradientButton
                    onClick={openCreateModal}
                    icon={<AiOutlinePlus size={18} />}
                >
                    Add Deck
                </GradientButton>
            }
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

                <div className="relative">
                    <select
                        className="py-2.5 pl-10 pr-4 border border-gray-200 rounded-lg bg-gray-50 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-300 text-gray-700 cursor-pointer"
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

            <div className="max-h-[60vh] overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                {renderDeckList()}
            </div>

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
        </Card>
    );
};

export default YourDecksTab;