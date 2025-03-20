import { useState } from "react";
import { AiOutlineBook } from "react-icons/ai";
import MainLayout from "../../components/MainLayout";
import YourDecksTab from "./YourDecksTab.tsx";

const DeckManager = () => {
    const [tabIndex, setTabIndex] = useState("yourDecks");

    return (
        <MainLayout
            title="Your Library"
            description="Manage your learning materials."
            tabs={[
                { id: "yourDecks", icon: <AiOutlineBook size={22} />, label: "Your Decks" },
            ]}
            activeTab={tabIndex}
            setActiveTab={setTabIndex}
        >
            {tabIndex === "yourDecks" && <YourDecksTab />}
        </MainLayout>
    );
};

export default DeckManager;