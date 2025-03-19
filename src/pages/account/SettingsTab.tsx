import { useEffect, useState } from "react";
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
                    setTempNotificationTime(notificationTime);
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
        <div className="space-y-6">
            {/* Notifications Settings */}
            <div className="bg-white rounded-xl shadow-md w-full">
                <div className="h-1 w-full bg-gradient-to-r from-blue-400 to-indigo-400 rounded-t-xl"></div>
                <div className="p-6">
                    <h2 className="text-xl font-bold text-blue-600 flex items-center gap-2 mb-1">
                        <AiOutlineBell size={22} className="text-indigo-500" /> Daily Notifications
                    </h2>
                    <div className="flex items-center justify-between gap-4">
                        <p className="text-gray-500 text-sm">Receive daily reminders to practice your decks.</p>
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={handleTimePickerOpen}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                                    notificationsEnabled
                                        ? "bg-gradient-to-br from-blue-50 to-indigo-50 border-indigo-200 text-indigo-700 hover:bg-gradient-to-br hover:from-blue-100 hover:to-indigo-100"
                                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                }`}
                            >
                                <FiClock className={notificationsEnabled ? "text-indigo-500" : "text-gray-400"} />
                                <span className="font-medium">{notificationTime}</span>
                            </button>

                            <button
                                className={`relative w-14 h-7 rounded-full transition-all ${
                                    notificationsEnabled
                                        ? "bg-gradient-to-r from-blue-400 to-indigo-400"
                                        : "bg-gray-300"
                                }`}
                                onClick={handleToggleNotifications}
                            >
                                <span
                                    className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow-sm transition-all ${
                                        notificationsEnabled ? "translate-x-7" : ""
                                    }`}
                                />
                            </button>
                        </div>
                    </div>

                    {/* Dropdown Time Picker */}
                    {showTimePicker && (
                        <div className="absolute top-full mt-2 left-0 p-4 bg-white rounded-lg shadow-lg border border-indigo-100 w-64 z-10">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500 mb-2">Hours</p>
                                    <div className="h-48 overflow-y-auto pr-2 grid grid-cols-3 gap-2 custom-scrollbar">
                                        {hours.map((hour) => (
                                            <button
                                                key={hour}
                                                onClick={() => handleTimeSelect("hour", hour)}
                                                className={`p-2 rounded-md ${
                                                    tempNotificationTime.split(":")[0] === hour
                                                        ? "bg-gradient-to-r from-blue-400 to-indigo-400 text-white"
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
                                                        ? "bg-gradient-to-r from-blue-400 to-indigo-400 text-white"
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
                                className="mt-4 w-full py-2 bg-gradient-to-r from-blue-400 to-indigo-400 text-white rounded-md hover:from-blue-500 hover:to-indigo-500 transition-colors"
                            >
                                Done
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Change Password */}
            <div className="bg-white rounded-xl shadow-md w-full">
                <div className="h-1 w-full bg-gradient-to-r from-blue-400 to-indigo-400 rounded-t-xl"></div>
                <div className="p-6">
                    <h2 className="text-xl font-bold text-blue-600 flex items-center gap-2 mb-1">
                        <RiLockPasswordLine size={22} className="text-indigo-500" /> Change Password
                    </h2>
                    <p className="text-gray-500 mb-4 text-sm">Update your account password.</p>

                    <div className="mb-4">
                        <label className="text-gray-700 font-medium block mb-1 text-sm">Old Password</label>
                        <input
                            type={showPassword.old ? "text" : "password"}
                            placeholder="Enter old password"
                            className="p-2.5 w-full bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
                            value={passwords.oldPassword}
                            onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })}
                        />
                        <div className="flex justify-end">
                            <button
                                className="text-xs text-indigo-500 mt-1"
                                onClick={() => setShowPassword({...showPassword, old: !showPassword.old})}
                            >
                                {showPassword.old ? 'Hide' : 'Show'} password
                            </button>
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="text-gray-700 font-medium block mb-1 text-sm">New Password</label>
                        <input
                            type={showPassword.new ? "text" : "password"}
                            placeholder="Enter new password"
                            className="p-2.5 w-full bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
                            value={passwords.newPassword}
                            onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                        />
                        <div className="flex justify-end">
                            <button
                                className="text-xs text-indigo-500 mt-1"
                                onClick={() => setShowPassword({...showPassword, new: !showPassword.new})}
                            >
                                {showPassword.new ? 'Hide' : 'Show'} password
                            </button>
                        </div>
                    </div>

                    <button
                        className="w-full bg-gradient-to-r from-blue-400 to-indigo-400 hover:from-blue-500 hover:to-indigo-500 text-white py-3 px-6 rounded-lg font-medium transition-colors shadow-sm"
                        onClick={handleChangePassword}
                    >
                        Change Password
                    </button>
                </div>
            </div>

            {/* Delete Account */}
            <div className="bg-white rounded-xl shadow-md w-full">
                <div className="h-1 w-full bg-gradient-to-r from-red-400 to-red-500 rounded-t-xl"></div>
                <div className="p-6">
                    <h2 className="text-xl font-bold text-red-500 flex items-center gap-2 mb-1">
                        <AiOutlineUserDelete size={22} /> Delete Account
                    </h2>
                    <p className="text-gray-500 mb-4 text-sm">Permanently delete your account and all associated data.</p>

                    <button
                        className="w-full bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-white py-3 px-6 rounded-lg font-medium transition-colors shadow-sm"
                        onClick={() => setModalOpen(true)}
                    >
                        Delete Account
                    </button>
                </div>
            </div>

            {/* Delete Account Modal */}
            {modalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-w-full mx-4 relative">
                        <div className="h-1 w-full bg-gradient-to-r from-red-400 to-red-500 absolute top-0 left-0 rounded-t-lg"></div>
                        <h2 className="text-xl font-bold text-red-500 mt-2 mb-4">Confirm Account Deletion</h2>
                        <p className="text-gray-600 mb-6">Are you sure you want to delete your account?</p>
                        <div className="flex justify-end space-x-3">
                            <button
                                className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                                onClick={() => setModalOpen(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-white rounded-lg transition-colors"
                                onClick={handleDeleteAccount}
                            >
                                Delete Account
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Add custom scrollbar styles
// Add custom scrollbar styles
const style = document.createElement('style');
style.innerHTML = `
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #60a5fa, #818cf8);
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #3b82f6, #6366f1);
}
`;
document.head.appendChild(style);

export default SettingsTab;