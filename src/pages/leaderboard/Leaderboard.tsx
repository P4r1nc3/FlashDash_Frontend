import { useState } from "react";
import { AiOutlineTrophy } from "react-icons/ai";
import MainLayout from "../../components/MainLayout";
import LeaderboardTab from "./LeaderboardTab";

const Leaderboard = () => {
    const [tabIndex, setTabIndex] = useState("global");

    return (
        <MainLayout
            title="Leaderboard"
            description="See how you compare with others in our learning community."
            tabs={[
                { id: "global", icon: <AiOutlineTrophy size={22} />, label: "Leaderboard" },
            ]}
            activeTab={tabIndex}
            setActiveTab={setTabIndex}
        >
            <LeaderboardTab />
        </MainLayout>
    );
};

export default Leaderboard;