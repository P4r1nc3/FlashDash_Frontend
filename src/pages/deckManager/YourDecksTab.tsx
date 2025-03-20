import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getDecks, createDeck, updateDeck, deleteDeck } from "../../api/decks.ts";
import { Deck } from "../../interfaces/Deck.ts";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { AiOutlinePlus, AiOutlineEdit, AiOutlineDelete, AiOutlineSearch, AiOutlineInfoCircle } from "react-icons/ai";
import { BiSortAlt2 } from "react-icons/bi";
import { BsBook, BsBookHalf } from "react-icons/bs";

const YourDecksTab = () => {
    const [decks, setDecks] = useState<Deck[]>([]);
    const [filteredDecks, setFilteredDecks] = useState<Deck[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOption, setSortOption] = useState("recent");
    const [modalOpen, setModalOpen] = useState(false);
    const [editingDeck, setEditingDeck] = useState<Deck | null>(null);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchDecks();
    }, []);

    useEffect(() => {
        filterAndSortDecks();
    }, [decks, searchTerm, sortOption]);

    const fetchDecks = async () => {
        setLoading(true);
        try {
            const data = await getDecks();
            setDecks(data);
        } catch (error) {
            toast.error("Failed to fetch decks.");
        } finally {
            setLoading(false);
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
            toast.error("Failed to save deck.");
        }
    };

    const handleDeleteDeck = async (deckId: number) => {
        try {
            await deleteDeck(deckId);
            toast.success("Deck deleted successfully.");
            fetchDecks();
        } catch (error) {
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

    return (
        <div className="bg-white rounded-xl shadow-md w-full">
            <div className="h-1 w-full bg-gradient-to-r from-blue-400 to-indigo-400 rounded-t-xl"></div>

            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-blue-600 flex items-center gap-2 mb-1">
                            <BsBook size={22} className="text-indigo-500" /> Your Decks
                        </h2>
                        <p className="text-gray-500 text-sm">Manage your study decks and card collections.</p>
                    </div>
                    <button
                        className="bg-gradient-to-r from-blue-400 to-indigo-400 hover:from-blue-500 hover:to-indigo-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors shadow-sm"
                        onClick={openCreateModal}
                    >
                        <AiOutlinePlus size={18} /> Add Deck
                    </button>
                </div>

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

                {loading ? (
                    <div className="py-8 flex justify-center">
                        <div className="animate-pulse space-y-4 w-full">
                            <div className="h-20 bg-gray-100 rounded-lg"></div>
                            <div className="h-20 bg-gray-100 rounded-lg"></div>
                            <div className="h-20 bg-gray-100 rounded-lg"></div>
                        </div>
                    </div>
                ) : (
                    <div className="max-h-[60vh] overflow-y-auto pr-2 space-y-3">
                        {filteredDecks.length > 0 ? (
                            filteredDecks.map((deck) => (
                                <div
                                    key={deck.deckFrn}
                                    className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-sm border border-indigo-100 cursor-pointer hover:shadow-md hover:bg-gradient-to-br hover:from-blue-100 hover:to-indigo-100 transition-colors duration-200"
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
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                                <BsBook size={48} className="text-gray-300 mb-3" />
                                <p className="text-center">No decks found.</p>
                                {searchTerm ? (
                                    <p className="text-center text-sm mt-2">Try different search terms.</p>
                                ) : (
                                    <p className="text-center text-sm mt-2">Click "Add Deck" to create your first deck.</p>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {modalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-w-full mx-4 relative">
                        <div className="h-1 w-full bg-gradient-to-r from-blue-400 to-indigo-400 absolute top-0 left-0 rounded-t-lg"></div>

                        <h2 className="text-xl font-bold text-blue-600 mb-4 mt-2">
                            {editingDeck ? "Edit Deck" : "Create New Deck"}
                        </h2>

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

                        <div className="flex justify-end space-x-3">
                            <button
                                className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                                onClick={() => setModalOpen(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-gradient-to-r from-blue-400 to-indigo-400 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg transition-colors shadow-sm"
                                onClick={handleCreateOrUpdateDeck}
                            >
                                {editingDeck ? "Update Deck" : "Create Deck"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default YourDecksTab;