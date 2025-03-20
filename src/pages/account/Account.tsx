import { useState } from "react";
import { AiOutlineUser, AiOutlineSetting, AiOutlineTrophy } from "react-icons/ai";
import ProfileTab from "./ProfileTab";
import AchievementsTab from "./AchievementsTab";
import SettingsTab from "./SettingsTab";
import MainLayout from "../../components/MainLayout";

const Account = () => {
    const [tabIndex, setTabIndex] = useState("profile");

    return (
        <MainLayout
            title="Your Account"
            description="Manage your profile, achievements, and settings."
            tabs={[
                { id: "profile", icon: <AiOutlineUser size={22} />, label: "Profile" },
                { id: "achievements", icon: <AiOutlineTrophy size={22} />, label: "Achievements" },
                { id: "settings", icon: <AiOutlineSetting size={22} />, label: "Settings" },
            ]}
            activeTab={tabIndex}
            setActiveTab={setTabIndex}
        >
            {tabIndex === "profile" && <ProfileTab />}
            {tabIndex === "achievements" && <AchievementsTab />}
            {tabIndex === "settings" && <SettingsTab />}
        </MainLayout>
    );
};

export default Account;