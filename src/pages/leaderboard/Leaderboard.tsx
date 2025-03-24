import { useState } from "react";
import { MdOutlineLeaderboard } from "react-icons/md";
import MainLayout from "../../components/MainLayout";
import LeaderboardTab from "./LeaderboardTab";

const Leaderboard = () => {
    const [tabIndex, setTabIndex] = useState("global");

    return (
        <MainLayout
            title="Leaderboard"
            description="See how you compare with others in our learning community."
            tabs={[
                { id: "global", icon: <MdOutlineLeaderboard size={22} />, label: "Leaderboard" },
            ]}
            activeTab={tabIndex}
            setActiveTab={setTabIndex}
        >
            <LeaderboardTab />
        </MainLayout>
    );
};

export default Leaderboard;