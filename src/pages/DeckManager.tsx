import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getDecks, createDeck, updateDeck, deleteDeck } from "../api/decks";
import { Deck } from "../interfaces/Deck";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { AiOutlinePlus, AiOutlineEdit, AiOutlineDelete, AiOutlineBook, AiOutlineShareAlt } from "react-icons/ai";

const DeckManager = () => {
    const [tabIndex, setTabIndex] = useState("yourDecks");
    const [decks, setDecks] = useState<Deck[]>([]);
    const [filteredDecks, setFilteredDecks] = useState<Deck[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOption, setSortOption] = useState("recent");
    const [modalOpen, setModalOpen] = useState(false);
    const [deckToDelete, setDeckToDelete] = useState<number | null>(null);
    const [editingDeck, setEditingDeck] = useState<Deck | null>(null);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");
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
            setError("Title is required.");
            return;
        }

        try {
            if (editingDeck) {
                await updateDeck(editingDeck.deckFrn, { name, description: description || "" });
                toast.success("Deck updated!");
            } else {
                await createDeck({ name, description: description || "" });
                toast.success("Deck created!");
            }
            setName("");
            setDescription("");
            setEditingDeck(null);
            setError("");
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
        setError("");
        setModalOpen(true);
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-gray-100 to-gray-300">
            <div className="w-full max-w-4xl bg-white shadow-xl rounded-xl p-8 min-h-[80vh] flex flex-col">
                <h1 className="text-4xl font-bold text-center">Your Library</h1>
                <p className="text-center text-gray-500">Manage your learning materials.</p>

                <div className="flex justify-center mt-6 space-x-6 border-b pb-3">
                    {[
                        { id: "yourDecks", icon: <AiOutlineBook size={22} />, label: "Your Decks" },
                        { id: "sharedDecks", icon: <AiOutlineShareAlt size={22} />, label: "Shared Decks" },
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

                {tabIndex === "yourDecks" && (
                    <>
                        <div className="flex justify-between mt-6 mb-4 items-center space-x-4">
                            <select
                                className="p-3 border rounded-lg"
                                value={sortOption}
                                onChange={(e) => setSortOption(e.target.value)}
                            >
                                <option value="recent">Recent</option>
                                <option value="alphabetical">Alphabetical</option>
                            </select>
                            <input
                                type="text"
                                placeholder="Search decks..."
                                className="p-3 flex-1 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            {tabIndex === "yourDecks" && (
                                <button
                                    className="bg-blue-500 text-white px-4 py-3 rounded-lg flex items-center gap-2"
                                    onClick={() => { setModalOpen(true); setEditingDeck(null); setName(""); setDescription(""); setError(""); }}
                                >
                                    <AiOutlinePlus size={20} /> Add Deck
                                </button>
                            )}
                        </div>

                        <div className="space-y-4">
                            {filteredDecks.length > 0 ? (
                                filteredDecks.map((deck) => (
                                    <motion.div
                                        key={deck.deckFrn}
                                        className="flex justify-between items-center p-4 bg-gray-100 rounded-lg shadow cursor-pointer hover:bg-gray-200"
                                        onClick={() => navigate(`/decks/${deck.deckFrn}`)}
                                        whileHover={{ scale: 1.02 }}
                                    >
                                        <div>
                                            <h2 className="text-xl font-semibold">{deck.name}</h2>
                                            <p className="text-gray-600">{deck.description}</p>
                                        </div>
                                        <div className="flex space-x-3">
                                            <button className="text-blue-500 hover:text-blue-700" onClick={(e) => { e.stopPropagation(); openEditModal(deck); }}>
                                                <AiOutlineEdit size={22} />
                                            </button>
                                            <button className="text-red-500 hover:text-red-700" onClick={(e) => { e.stopPropagation(); setDeckToDelete(deck.deckFrn); handleDeleteDeck(deck.deckFrn); }}>
                                                <AiOutlineDelete size={22} />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <p className="text-center text-gray-500">No decks found.</p>
                            )}
                        </div>
                    </>
                )}

                {tabIndex === "sharedDecks" && (
                    <div className="flex justify-center items-center h-full">
                        <p className="text-gray-500 text-lg">Not implemented yet.</p>
                    </div>
                )}
            </div>

            {modalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
                    <motion.div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-lg font-semibold">{editingDeck ? "Edit Deck" : "Create Deck"}</h2>

                        {/* Deck Name */}
                        <label className="block text-gray-700 font-semibold mt-4">
                            Deck Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Enter deck name"
                            className="p-3 w-full bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

                        {/* Description */}
                        <label className="block text-gray-700 font-semibold mt-4">
                            Description
                        </label>
                        <input
                            type="text"
                            placeholder="Enter description"
                            className="p-3 w-full bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />

                        {/* Buttons */}
                        <div className="flex justify-end mt-4 space-x-2">
                            <button className="px-4 py-2 border rounded-lg" onClick={() => setModalOpen(false)}>Cancel</button>
                            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg" onClick={handleCreateOrUpdateDeck}>Save</button>
                        </div>
                    </motion.div>
                </div>
            )}

        </div>
    );
};

export default DeckManager;
