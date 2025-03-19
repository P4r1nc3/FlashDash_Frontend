import { useState } from "react";
import { AiOutlineBook, AiOutlineShareAlt } from "react-icons/ai";
import MainLayout from "../../components/MainLayout";
import YourDecksTab from "./YourDecksTab.tsx";
import SharedDecksTab from "./SharedDecksTab";

const DeckManager = () => {
    const [tabIndex, setTabIndex] = useState("yourDecks");

    return (
        <MainLayout
            title="Your Library"
            description="Manage your learning materials."
            tabs={[
                { id: "yourDecks", icon: <AiOutlineBook size={22} />, label: "Your Decks" },
                { id: "sharedDecks", icon: <AiOutlineShareAlt size={22} />, label: "Shared Decks" },
            ]}
            activeTab={tabIndex}
            setActiveTab={setTabIndex}
        >
            {tabIndex === "yourDecks" && <YourDecksTab />}
            {tabIndex === "sharedDecks" && <SharedDecksTab />}
        </MainLayout>
    );
};

export default DeckManager;