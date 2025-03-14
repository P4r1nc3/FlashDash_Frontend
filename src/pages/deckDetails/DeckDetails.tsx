import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    AiOutlineQuestionCircle,
    AiOutlineLineChart,
    AiOutlineSetting,
    AiOutlinePlayCircle,
    AiOutlineArrowLeft,
} from "react-icons/ai";
import { getDeckDetails } from "../../api/decks.ts";
import StatisticsTab from "./StatisticsTab.tsx";
import QuestionsTab from "./QuestionsTab.tsx";

const DeckDetails = () => {
    const { deckId } = useParams<{ deckId: string }>();
    const navigate = useNavigate();
    const [tabIndex, setTabIndex] = useState("gameModes");
    const [deckName, setDeckName] = useState("");
    const [deckDescription, setDeckDescription] = useState("");

    useEffect(() => {
        const fetchDeckDetails = async () => {
            if (!deckId) return;
            const deckDetails = await getDeckDetails(deckId);
            setDeckName(deckDetails.name);
            setDeckDescription(deckDetails.description);
        };
        fetchDeckDetails();
    }, [deckId]);

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-gray-100 to-gray-300">
            <div className="relative w-full max-w-4xl bg-white shadow-xl rounded-xl p-8 min-h-[80vh] flex flex-col">

                {/* Back Button */}
                <button className="absolute top-4 left-4 text-gray-600 hover:text-gray-800 flex items-center gap-2" onClick={() => navigate("/decks")}>
                    <AiOutlineArrowLeft size={20} /> Back
                </button>

                {/* Deck Name and Description */}
                <h1 className="text-4xl font-bold text-center">{deckName}</h1>
                <p className="text-center text-gray-500">{deckDescription}</p>

                {/* Navigation Tabs */}
                <div className="flex justify-center mt-6 space-x-6 border-b pb-3">
                    {[
                        { id: "gameModes", icon: <AiOutlinePlayCircle size={22} />, label: "Game Modes" },
                        { id: "questions", icon: <AiOutlineQuestionCircle size={22} />, label: "Questions" },
                        { id: "statistics", icon: <AiOutlineLineChart size={22} />, label: "Statistics" },
                        { id: "settings", icon: <AiOutlineSetting size={22} />, label: "Settings" },
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

                {/* Tab Content */}
                <div className="mt-6 flex-1">
                    {tabIndex === "gameModes" && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 bg-gray-100 rounded-lg shadow">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <AiOutlinePlayCircle size={22} /> Game Modes
                            </h2>
                            <button
                                className="mt-4 bg-blue-500 text-white py-3 px-6 rounded-lg w-full"
                                onClick={() => navigate(`/decks/${deckId}/quiz`)}
                            >
                                Start Quiz
                            </button>
                        </motion.div>
                    )}

                    {tabIndex === "questions" && <QuestionsTab deckId={deckId!} />}
                    {tabIndex === "statistics" && <StatisticsTab />}

                    {tabIndex === "settings" && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 bg-gray-100 rounded-lg shadow">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <AiOutlineSetting size={22} /> Settings
                            </h2>
                            <p className="text-gray-500 mt-2">This section will contain settings for this deck.</p>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DeckDetails;
