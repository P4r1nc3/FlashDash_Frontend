import { useState } from "react";
import { AiOutlineUser, AiOutlineSetting } from "react-icons/ai";
import ProfileTab from "./ProfileTab";
import SettingsTab from "./SettingsTab";
import MainLayout from "../../components/MainLayout";

const Account = () => {
    const [tabIndex, setTabIndex] = useState("profile");

    return (
        <MainLayout
            title="Your Account"
            description="Manage your profile and settings."
            tabs={[
                { id: "profile", icon: <AiOutlineUser size={22} />, label: "Profile" },
                { id: "settings", icon: <AiOutlineSetting size={22} />, label: "Settings" },
            ]}
            activeTab={tabIndex}
            setActiveTab={setTabIndex}
        >
            {tabIndex === "profile" && <ProfileTab />}
            {tabIndex === "settings" && <SettingsTab />}
        </MainLayout>
    );
};

export default Account;
