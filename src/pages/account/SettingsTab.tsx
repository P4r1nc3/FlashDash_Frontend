import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { changeUserPassword, deleteUserAccount } from "../../api/user.ts";
import { RiLockPasswordLine } from "react-icons/ri";
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineUserDelete } from "react-icons/ai";

const SettingsTab = () => {
    const [passwords, setPasswords] = useState({ oldPassword: "", newPassword: "" });
    const [showPassword, setShowPassword] = useState({ old: false, new: false });
    const [passwordError, setPasswordError] = useState("");
    const [modalOpen, setModalOpen] = useState(false);

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
                            type="button"
                            className="absolute inset-y-0 right-4 flex items-center text-gray-500 hover:text-gray-700"
                            onClick={() => setShowPassword({ ...showPassword, old: !showPassword.old })}
                        >
                            {showPassword.old ? <AiOutlineEyeInvisible size={24} /> : <AiOutlineEye size={24} />}
                        </button>
                    </div>
                </div>
                <div className="mt-4">
                    <label className="text-gray-700 font-semibold block mb-1">New Password</label>
                    <div className="relative">
                        <input
                            type={showPassword.new ? "text" : "password"}
                            placeholder="Enter new password"
                            className="p-3 w-full bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 text-lg"
                            value={passwords.newPassword}
                            onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-4 flex items-center text-gray-500 hover:text-gray-700"
                            onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}
                        >
                            {showPassword.new ? <AiOutlineEyeInvisible size={24} /> : <AiOutlineEye size={24} />}
                        </button>
                    </div>
                </div>
                {passwordError && <p className="text-red-500 mt-2">{passwordError}</p>}
                <button className="mt-4 bg-blue-500 text-white py-3 px-6 rounded-lg w-full" onClick={handleChangePassword}>
                    Change Password
                </button>
            </div>

            <div className="p-6 bg-gray-100 rounded-lg shadow">
                <h2 className="text-xl font-semibold text-red-500 flex items-center gap-2">
                    <AiOutlineUserDelete size={22} /> Delete Account
                </h2>
                <p className="text-gray-500 mt-2">This action cannot be undone.</p>
                <button className="mt-4 bg-red-500 text-white py-3 px-6 rounded-lg w-full" onClick={() => setModalOpen(true)}>
                    Confirm Delete
                </button>
            </div>

            {modalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-white p-6 rounded-lg shadow-lg w-96"
                    >
                        <h2 className="text-lg font-semibold">Confirm Account Deletion</h2>
                        <p className="text-gray-600 mt-3">Are you sure? This action cannot be undone.</p>
                        <div className="flex justify-end mt-4 space-x-4">
                            <button className="px-6 py-2 border rounded-lg" onClick={() => setModalOpen(false)}>
                                Cancel
                            </button>
                            <button className="px-6 py-2 bg-red-500 text-white rounded-lg" onClick={handleDeleteAccount}>
                                Delete
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </motion.div>
    );
};

export default SettingsTab;
