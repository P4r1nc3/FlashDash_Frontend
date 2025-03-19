import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { getNotificationSettings, enableNotifications, disableNotifications, changeUserPassword, deleteUserAccount } from "../../api/user.ts";
import { AiOutlineBell, AiOutlineUserDelete } from "react-icons/ai";
import { RiLockPasswordLine } from "react-icons/ri";
import { FiClock } from "react-icons/fi";

const SettingsTab = () => {
    const [passwords, setPasswords] = useState({ oldPassword: "", newPassword: "" });
    const [showPassword, setShowPassword] = useState({ old: false, new: false });
    const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(false);
    const [notificationTime, setNotificationTime] = useState<string>("08:00");
    const [tempNotificationTime, setTempNotificationTime] = useState<string>("08:00");
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        fetchNotificationSettings();
    }, []);

    const fetchNotificationSettings = async () => {
        try {
            const data = await getNotificationSettings();
            setNotificationsEnabled(data.dailyNotifications);
            const time = data.notificationTime ? data.notificationTime.split("T")[1] : "08:00";
            setNotificationTime(time);
            setTempNotificationTime(time);
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

    const handleTimePickerOpen = () => {
        if (notificationsEnabled) {
            setTempNotificationTime(notificationTime);
            setShowTimePicker(true);
        }
    };

    const handleTimeSelect = (type: "hour" | "minute", value: string) => {
        if (type === "hour") {
            setTempNotificationTime(`${value}:${tempNotificationTime.split(":")[1]}`);
        } else {
            setTempNotificationTime(`${tempNotificationTime.split(":")[0]}:${value}`);
        }
    };

    const handleTimeConfirm = async () => {
        if (tempNotificationTime !== notificationTime) {
            setNotificationTime(tempNotificationTime);
            if (notificationsEnabled) {
                try {
                    await enableNotifications(tempNotificationTime);
                    toast.success("Notification time updated.");
                } catch (error) {
                    toast.error("Failed to update notification time.");
                    setTempNotificationTime(notificationTime); // Revert to original on failure
                }
            }
        }
        setShowTimePicker(false);
    };

    const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0"));
    const minutes = ["00", "15", "30", "45"];

    const handleChangePassword = async () => {
        if (!passwords.oldPassword || !passwords.newPassword) {
            toast.error("Both fields are required.");
            return;
        }
        try {
            await changeUserPassword({ oldPassword: passwords.oldPassword, newPassword: passwords.newPassword });
            setPasswords({ oldPassword: "", newPassword: "" });
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
            <div className="p-6 bg-gray-100 rounded-lg shadow flex items-center justify-between">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    <AiOutlineBell size={22} /> Daily Notifications
                </h2>

                <div className="flex items-center space-x-4">
                    {/* Improved Time Picker */}
                    <div className="relative">
                        <button
                            onClick={handleTimePickerOpen}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                                notificationsEnabled
                                    ? "bg-white hover:bg-gray-50 border-blue-300 text-blue-700"
                                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                            }`}
                        >
                            <FiClock className={notificationsEnabled ? "text-blue-500" : "text-gray-500"} />
                            <span className="font-medium">{notificationTime}</span>
                        </button>

                        {/* Dropdown Time Picker */}
                        {showTimePicker && (
                            <div className="absolute top-full mt-2 right-0 p-4 bg-white rounded-lg shadow-lg border border-gray-200 w-64 z-10">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-2">Hours</p>
                                        <div className="h-48 overflow-y-auto pr-2 grid grid-cols-3 gap-2">
                                            {hours.map((hour) => (
                                                <button
                                                    key={hour}
                                                    onClick={() => handleTimeSelect("hour", hour)}
                                                    className={`p-2 rounded-md ${
                                                        tempNotificationTime.split(":")[0] === hour
                                                            ? "bg-blue-500 text-white"
                                                            : "hover:bg-gray-100"
                                                    }`}
                                                >
                                                    {hour}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-2">Minutes</p>
                                        <div className="flex flex-col space-y-2">
                                            {minutes.map((minute) => (
                                                <button
                                                    key={minute}
                                                    onClick={() => handleTimeSelect("minute", minute)}
                                                    className={`p-2 rounded-md ${
                                                        tempNotificationTime.split(":")[1] === minute
                                                            ? "bg-blue-500 text-white"
                                                            : "hover:bg-gray-100"
                                                    }`}
                                                >
                                                    {minute}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={handleTimeConfirm}
                                    className="mt-4 w-full py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                                >
                                    Done
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Toggle Button */}
                    <button
                        className={`relative w-16 h-8 rounded-full transition-all ${
                            notificationsEnabled ? "bg-blue-500" : "bg-gray-400"
                        }`}
                        onClick={handleToggleNotifications}
                    >
                        <span
                            className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white transition-all ${
                                notificationsEnabled ? "translate-x-8" : ""
                            }`}
                        />
                    </button>
                </div>
            </div>

            {/* Change Password */}
            <div className="p-6 bg-gray-100 rounded-lg shadow">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    <RiLockPasswordLine size={22} /> Change Password
                </h2>
                <div className="mt-4">
                    <label className="text-gray-700 font-semibold block mb-1">Old Password</label>
                    <input
                        type="password"
                        placeholder="Enter old password"
                        className="p-3 w-full bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 text-lg"
                        value={passwords.oldPassword}
                        onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })}
                    />
                </div>
                <div className="mt-4">
                    <label className="text-gray-700 font-semibold block mb-1">New Password</label>
                    <input
                        type="password"
                        placeholder="Enter new password"
                        className="p-3 w-full bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 text-lg"
                        value={passwords.newPassword}
                        onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                    />
                </div>
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
                <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white p-6 rounded-lg shadow-lg w-96"
                    >
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