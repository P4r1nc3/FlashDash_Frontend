import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AiOutlineQuestionCircle, AiOutlineLineChart, AiOutlineSetting, AiOutlinePlayCircle } from "react-icons/ai";
import { getDeckDetails } from "../../api/decks.ts";
import StatisticsTab from "./StatisticsTab.tsx";
import QuestionsTab from "./QuestionsTab.tsx";
import MainLayout from "../../components/MainLayout";

const DeckDetails = () => {
    const { deckId } = useParams<{ deckId: string }>();
    const navigate = useNavigate();
    const [tabIndex, setTabIndex] = useState("gameModes");
    const [deckName, setDeckName] = useState<string | null>(null);
    const [deckDescription, setDeckDescription] = useState<string | null>(null);

    useEffect(() => {
        const fetchDeckDetails = async () => {
            if (!deckId) return;
            try {
                const deckDetails = await getDeckDetails(deckId);
                setDeckName(deckDetails.name || "Untitled Deck");
                setDeckDescription(deckDetails.description || "No description available.");
            } catch (err) {
                console.error("Error fetching deck details:", err);
            }
        };
        fetchDeckDetails();
    }, [deckId]);

    return (
        <MainLayout
            title={deckName || "Deck"}
            description={deckDescription || "No description available."}
            tabs={[
                { id: "gameModes", icon: <AiOutlinePlayCircle size={22} />, label: "Game Modes" },
                { id: "questions", icon: <AiOutlineQuestionCircle size={22} />, label: "Questions" },
                { id: "statistics", icon: <AiOutlineLineChart size={22} />, label: "Statistics" },
            ]}
            activeTab={tabIndex}
            setActiveTab={setTabIndex}
            onBack={() => navigate("/decks")}
        >
            {tabIndex === "gameModes" && (
                <div className="p-6 bg-gray-100 rounded-lg shadow">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <AiOutlinePlayCircle size={22} /> Game Modes
                    </h2>
                    <button
                        className="mt-4 bg-blue-500 text-white py-3 px-6 rounded-lg w-full"
                        onClick={() => navigate(`/decks/${deckId}/quiz`)}
                    >
                        Start Quiz
                    </button>
                </div>
            )}
            {tabIndex === "questions" && <QuestionsTab deckId={deckId!} />}
            {tabIndex === "statistics" && <StatisticsTab />}
        </MainLayout>
    );
};

export default DeckDetails;
