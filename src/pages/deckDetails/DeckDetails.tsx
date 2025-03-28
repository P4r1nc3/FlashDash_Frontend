import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AiOutlineQuestionCircle, AiOutlineLineChart, AiOutlinePlayCircle } from "react-icons/ai";
import { getDeckDetails } from "../../api/decks.ts";
import StatisticsTab from "./StatisticsTab.tsx";
import QuestionsTab from "./QuestionsTab.tsx";
import GameModesTab from "./GameModesTab.tsx";
import MainLayout from "../../components/MainLayout";

const DeckDetails = () => {
    const { deckFrn } = useParams<{ deckFrn: string }>();
    const navigate = useNavigate();
    const [tabIndex, setTabIndex] = useState("gameModes");
    const [deckName, setDeckName] = useState<string | null>(null);
    const [deckDescription, setDeckDescription] = useState<string | null>(null);

    useEffect(() => {
        const fetchDeckDetails = async () => {
            if (!deckFrn) return;
            const deckDetails = await getDeckDetails(deckFrn);
            setDeckName(deckDetails.name || "Untitled Deck");
            setDeckDescription(deckDetails.description || "No description available.");
        };
        fetchDeckDetails();
    }, [deckFrn]);

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
            {tabIndex === "gameModes" && <GameModesTab />}
            {tabIndex === "questions" && <QuestionsTab />}
            {tabIndex === "statistics" && <StatisticsTab />}
        </MainLayout>
    );
};

export default DeckDetails;
