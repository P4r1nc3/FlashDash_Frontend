import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import {
    changeUserPassword,
    deleteUserAccount,
    getNotificationSettings,
    enableNotifications,
    disableNotifications
} from "../../api/user.ts";
import { RiLockPasswordLine } from "react-icons/ri";
import {
    AiOutlineEye,
    AiOutlineEyeInvisible,
    AiOutlineUserDelete,
    AiOutlineClockCircle,
    AiFillBell
} from "react-icons/ai";

const SettingsTab = () => {
    const [passwords, setPasswords] = useState({ oldPassword: "", newPassword: "" });
    const [showPassword, setShowPassword] = useState({ old: false, new: false });
    const [passwordError, setPasswordError] = useState("");
    const [modalOpen, setModalOpen] = useState(false);

    // Notifications state
    const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(false);
    const [notificationTime, setNotificationTime] = useState<string>("08:00");

    useEffect(() => {
        fetchNotificationSettings();
    }, []);

    const fetchNotificationSettings = async () => {
        try {
            const data = await getNotificationSettings();
            setNotificationsEnabled(data.dailyNotifications);
            setNotificationTime(data.notificationTime ? data.notificationTime.split("T")[1] : "08:00");
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
        }
    };

    const handleToggleNotifications = async () => {
        try {
            if (notificationsEnabled) {
                await disableNotifications();
                toast.info("Notifications disabled.");
            } else {
                await enableNotifications(notificationTime);
                toast.success("Notifications enabled.");
            }
            setNotificationsEnabled(!notificationsEnabled);
        } catch (error) {
            toast.error("Failed to update notifications.");
        }
    };

    const handleNotificationTimeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTime = e.target.value;
        setNotificationTime(newTime);
        if (notificationsEnabled) {
            await enableNotifications(newTime);
            toast.success("Notification time updated.");
        }
    };

    const handleChangePassword = async () => {
        if (!passwords.oldPassword || !passwords.newPassword) {
            setPasswordError("Both fields are required.");
            return;
        }
        try {
            await changeUserPassword({ oldPassword: passwords.oldPassword, newPassword: passwords.newPassword });
            setPasswords({ oldPassword: "", newPassword: "" });
            setPasswordError("");
            toast.success("Password changed successfully.");
        } catch (error) {
            toast.error("Failed to change password.");
        }
    };

    const handleDeleteAccount = async () => {
        try {
            await deleteUserAccount();
            toast.error("Your account has been deleted.");
            window.location.href = "/";
        } catch (error) {
            toast.error("Failed to delete account.");
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

            {/* Notifications Settings */}
            <div className="p-6 bg-gray-100 rounded-lg shadow">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    {notificationsEnabled ? <AiFillBell size={22} /> : <AiFillBell size={22} />} Notifications
                </h2>
                <p className="text-gray-500 mt-2">Enable or disable daily notifications.</p>

                {/* Toggle Switch */}
                <div className="flex items-center justify-between mt-4">
                    <span className="text-gray-700 font-semibold">{notificationsEnabled ? "Enabled" : "Disabled"}</span>
                    <button
                        className={`relative w-14 h-7 rounded-full transition-all ${
                            notificationsEnabled ? "bg-blue-500" : "bg-gray-400"
                        }`}
                        onClick={handleToggleNotifications}
                    >
                        <span
                            className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white transition-all ${
                                notificationsEnabled ? "translate-x-7" : ""
                            }`}
                        />
                    </button>
                </div>

                {notificationsEnabled && (
                    <div className="mt-4">
                        <label className="text-gray-700 font-semibold block mb-1 flex items-center gap-2">
                            <AiOutlineClockCircle size={20} /> Notification Time
                        </label>
                        <input
                            type="time"
                            value={notificationTime}
                            onChange={handleNotificationTimeChange}
                            className="p-3 w-full bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 text-lg"
                        />
                    </div>
                )}
            </div>

            {/* Change Password */}
            <div className="p-6 bg-gray-100 rounded-lg shadow">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    <RiLockPasswordLine size={22} /> Change Password
                </h2>
                <div className="mt-4">
                    <label className="text-gray-700 font-semibold block mb-1">Old Password</label>
                    <div className="relative">
                        <input
                            type={showPassword.old ? "text" : "password"}
                            placeholder="Enter old password"
                            className="p-3 w-full bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 text-lg"
                            value={passwords.oldPassword}
                            onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })}
                        />
                        <button
                            className="absolute inset-y-0 right-4 flex items-center text-gray-500 hover:text-gray-700"
                            onClick={() => setShowPassword({ ...showPassword, old: !showPassword.old })}
                        >
                            {showPassword.old ? <AiOutlineEyeInvisible size={24} /> : <AiOutlineEye size={24} />}
                        </button>
                    </div>
                </div>
                {passwordError && <p className="text-red-500 mt-2">{passwordError}</p>}
                <button className="mt-4 bg-blue-500 text-white py-3 px-6 rounded-lg w-full" onClick={handleChangePassword}>
                    Change Password
                </button>
            </div>

            {/* Delete Account */}
            <div className="p-6 bg-gray-100 rounded-lg shadow">
                <h2 className="text-xl font-semibold text-red-500 flex items-center gap-2">
                    <AiOutlineUserDelete size={22} /> Delete Account
                </h2>
                <p className="text-gray-500 mt-2">This action cannot be undone.</p>
                <button className="mt-4 bg-red-500 text-white py-3 px-6 rounded-lg w-full" onClick={() => setModalOpen(true)}>
                    Confirm Delete
                </button>
            </div>

            {/* Delete Account Modal */}
            {modalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
                    <motion.div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-lg font-semibold">Confirm Account Deletion</h2>
                        <p className="text-gray-600 mt-3">Are you sure? This action cannot be undone.</p>
                        <div className="flex justify-end mt-4 space-x-4">
                            <button className="px-6 py-2 border rounded-lg" onClick={() => setModalOpen(false)}>Cancel</button>
                            <button className="px-6 py-2 bg-red-500 text-white rounded-lg" onClick={handleDeleteAccount}>Delete</button>
                        </div>
                    </motion.div>
                </div>
            )}
        </motion.div>
    );
};

export default SettingsTab;
