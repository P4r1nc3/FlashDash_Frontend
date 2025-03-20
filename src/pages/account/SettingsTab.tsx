import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import { getNotificationSettings, enableNotifications, disableNotifications, changeUserPassword, deleteUserAccount } from "../../api/user.ts";
import { AiOutlineBell, AiOutlineUserDelete, AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { RiLockPasswordLine } from "react-icons/ri";
import { FiClock } from "react-icons/fi";
import Card from "../../components/ui/Card";
import GradientButton from "../../components/ui/GradientButton";
import Modal from "../../components/ui/Modal";

const SettingsTab = () => {
    const [passwords, setPasswords] = useState({ oldPassword: "", newPassword: "" });
    const [showPassword, setShowPassword] = useState({ old: false, new: false });
    const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(false);
    const [notificationTime, setNotificationTime] = useState<string>("08:00");
    const [tempNotificationTime, setTempNotificationTime] = useState<string>("08:00");
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const timePickerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchNotificationSettings();

        // Close time picker when clicking outside
        const handleClickOutside = (event: MouseEvent) => {
            if (timePickerRef.current && !timePickerRef.current.contains(event.target as Node)) {
                setShowTimePicker(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const fetchNotificationSettings = async () => {
        try {
            const data = await getNotificationSettings();
            setNotificationsEnabled(data.dailyNotifications);
            const time = data.notificationTime ? data.notificationTime.split("T")[1].substring(0, 5) : "08:00";
            setNotificationTime(time);
            setTempNotificationTime(time);
        } catch (error) {
            console.error("Error while fetching notifications settings:", error);
            toast.error("Failed to fetch notifications settings");
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
            console.error("Error while turning on notifications:", error);
            toast.error("Failed to update notifications.");
        }
    };

    const handleTimePickerOpen = () => {
        if (notificationsEnabled) {
            setTempNotificationTime(notificationTime);
            setShowTimePicker(!showTimePicker);
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
                    console.error("Error while updating notification time:", error);
                    toast.error("Failed to update notification time.");
                    setTempNotificationTime(notificationTime);
                }
            }
        }
        setShowTimePicker(false);
    };

    // Generate common time presets
    const timePresets = [
        { label: "Morning", time: "08:00" },
        { label: "Noon", time: "12:00" },
        { label: "Afternoon", time: "15:00" },
        { label: "Evening", time: "19:00" },
        { label: "Night", time: "21:00" }
    ];

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
            console.error("Error while changing password:", error);
            toast.error("Failed to change password.");
        }
    };

    const handleDeleteAccount = async () => {
        try {
            await deleteUserAccount();
            toast.error("Your account has been deleted.");
            window.location.href = "/";
        } catch (error) {
            console.error("Error while deleting an account:", error);
            toast.error("Failed to delete account.");
        }
    };

    const renderTimePicker = () => (
        showTimePicker && (
            <div
                ref={timePickerRef}
                className="absolute mt-2 right-10 p-4 bg-white rounded-lg shadow-lg border border-indigo-100 w-80 z-10"
            >
                <h3 className="text-md font-semibold text-gray-700 mb-3">Set notification time</h3>

                {/* Quick presets */}
                <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-2">Quick select</p>
                    <div className="flex flex-wrap gap-2">
                        {timePresets.map(preset => (
                            <button
                                key={preset.time}
                                onClick={() => setTempNotificationTime(preset.time)}
                                className={`px-3 py-1.5 text-sm rounded-md ${
                                    tempNotificationTime === preset.time
                                        ? "bg-gradient-to-r from-blue-400 to-indigo-400 text-white"
                                        : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                                }`}
                            >
                                {preset.label} ({preset.time})
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                        <p className="text-sm text-gray-500 mb-2">Hour</p>
                        <div className="h-40 overflow-y-auto pr-1 grid grid-cols-4 gap-1 custom-scrollbar">
                            {hours.map((hour) => (
                                <button
                                    key={hour}
                                    onClick={() => handleTimeSelect("hour", hour)}
                                    className={`p-2 text-sm rounded-md ${
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
                        <p className="text-sm text-gray-500 mb-2">Minute</p>
                        <div className="grid grid-cols-2 gap-1">
                            {minutes.map((minute) => (
                                <button
                                    key={minute}
                                    onClick={() => handleTimeSelect("minute", minute)}
                                    className={`p-2 text-sm rounded-md ${
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

                <div className="text-center mb-2">
                    <p className="text-md font-semibold text-blue-600">{tempNotificationTime}</p>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => setShowTimePicker(false)}
                        className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleTimeConfirm}
                        className="flex-1 py-2 bg-gradient-to-r from-blue-400 to-indigo-400 text-white rounded-md hover:from-blue-500 hover:to-indigo-500 transition-colors"
                    >
                        Apply
                    </button>
                </div>
            </div>
        )
    );

    return (
        <div className="space-y-6">
            {/* Notifications Settings */}
            <Card
                title="Daily Notifications"
                description="Receive daily reminders to practice your decks."
                icon={<AiOutlineBell size={22} />}
            >
                <div className="flex justify-end items-center space-x-3">
                    <button
                        onClick={handleTimePickerOpen}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                            notificationsEnabled
                                ? "bg-gradient-to-br from-blue-50 to-indigo-50 border-indigo-200 text-indigo-700 hover:bg-gradient-to-br hover:from-blue-100 hover:to-indigo-100"
                                : "bg-gray-100 text-gray-400 cursor-not-allowed"
                        }`}
                        disabled={!notificationsEnabled}
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
                        aria-label={notificationsEnabled ? "Disable notifications" : "Enable notifications"}
                    >
                        <span
                            className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow-sm transition-all ${
                                notificationsEnabled ? "translate-x-7" : ""
                            }`}
                        />
                    </button>
                </div>

                {renderTimePicker()}
            </Card>

            {/* Change Password */}
            <Card
                title="Change Password"
                description="Update your account password."
                icon={<RiLockPasswordLine size={22} />}
            >
                <div className="mb-4">
                    <label className="text-gray-700 font-medium block mb-1 text-sm">Old Password</label>
                    <div className="relative">
                        <input
                            type={showPassword.old ? "text" : "password"}
                            placeholder="Enter old password"
                            className="p-2.5 w-full bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
                            value={passwords.oldPassword}
                            onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })}
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-4 flex items-center text-gray-500 hover:text-indigo-500"
                            onClick={() => setShowPassword({...showPassword, old: !showPassword.old})}
                        >
                            {showPassword.old ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                        </button>
                    </div>
                </div>

                <div className="mb-6">
                    <label className="text-gray-700 font-medium block mb-1 text-sm">New Password</label>
                    <div className="relative">
                        <input
                            type={showPassword.new ? "text" : "password"}
                            placeholder="Enter new password"
                            className="p-2.5 w-full bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
                            value={passwords.newPassword}
                            onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-4 flex items-center text-gray-500 hover:text-indigo-500"
                            onClick={() => setShowPassword({...showPassword, new: !showPassword.new})}
                        >
                            {showPassword.new ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                        </button>
                    </div>
                </div>

                <GradientButton
                    onClick={handleChangePassword}
                    className="w-full py-3 px-6"
                >
                    Change Password
                </GradientButton>
            </Card>

            {/* Delete Account */}
            <div className="bg-white rounded-xl shadow-md w-full">
                <div className="h-1 w-full bg-gradient-to-r from-red-400 to-red-500 rounded-t-xl"></div>
                <div className="p-6">
                    <h2 className="text-xl font-bold text-red-500 flex items-center gap-2 mb-1">
                        <AiOutlineUserDelete size={22} /> Delete Account
                    </h2>
                    <p className="text-gray-500 mb-4 text-sm">Permanently delete your account and all associated data.</p>

                    <GradientButton
                        onClick={() => setModalOpen(true)}
                        className="w-full py-3 px-6"
                        startColor="from-red-400"
                        endColor="to-red-500"
                        hoverStartColor="from-red-500"
                        hoverEndColor="to-red-600"
                    >
                        Delete Account
                    </GradientButton>
                </div>
            </div>

            {/* Delete Account Modal */}
            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title="Confirm Account Deletion"
                onSave={handleDeleteAccount}
                saveText="Delete Account"
                width="w-96"
            >
                <p className="text-gray-600 mb-6">Are you sure you want to delete your account?</p>
            </Modal>
        </div>
    );
};

export default SettingsTab;