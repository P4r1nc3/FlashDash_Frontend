import { useState } from "react";
import { motion } from "framer-motion";
import {
    AiOutlineUser,
    AiOutlineSetting
} from "react-icons/ai";
import ProfileTab from "./ProfileTab";
import SettingsTab from "./SettingsTab";

const Account = () => {
    const [tabIndex, setTabIndex] = useState("profile");

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-gray-100 to-gray-300">
            <div className="w-full max-w-4xl bg-white shadow-xl rounded-xl p-8 min-h-[80vh] flex flex-col">
                <h1 className="text-4xl font-bold text-center">Your Account</h1>
                <p className="text-center text-gray-500">Manage your profile and settings.</p>

                <div className="flex justify-center mt-6 space-x-6 border-b pb-3">
                    {[
                        { id: "profile", icon: <AiOutlineUser size={22} />, label: "Profile" },
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

                <div className="mt-6 flex-1">
                    {tabIndex === "profile" && <ProfileTab />}
                    {tabIndex === "settings" && <SettingsTab />}
                </div>
            </div>
        </div>
    );
};

export default Account;
