import { useEffect, useState } from "react";
import { getUserInfo, changeUserPassword, deleteUserAccount } from "../api/user";
import { User } from "../interfaces/User";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import {
    AiOutlineUser,
    AiOutlineSetting,
    AiOutlineEye,
    AiOutlineEyeInvisible,
    AiOutlineUserDelete
} from "react-icons/ai";
import { RiLockPasswordLine } from "react-icons/ri";

const Account = () => {
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState("");
    const [tabIndex, setTabIndex] = useState("profile");
    const [passwords, setPasswords] = useState({ oldPassword: "", newPassword: "" });
    const [showPassword, setShowPassword] = useState({ old: false, new: false });
    const [passwordError, setPasswordError] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const accountCreatedDate = user?.createdAt ? new Date(user.createdAt) : new Date();

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const data = await getUserInfo();
                setUser(data);
            } catch (err: any) {
                setError(err.response?.data?.cause || "Failed to fetch user information.");
            }
        };
        fetchUserInfo();
    }, []);

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
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-gray-100 to-gray-300">
            <div className="w-full max-w-4xl bg-white shadow-xl rounded-xl p-8 min-h-[80vh] flex flex-col">
                <h1 className="text-4xl font-bold text-center">Welcome, {user?.firstName}!</h1>
                <p className="text-center text-gray-500">It is great to see you again!</p>

                {/* Nawigacja */}
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
                    {tabIndex === "profile" && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 bg-gray-100 rounded-lg shadow">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <AiOutlineUser size={22} /> Profile Information
                            </h2>
                            <div className="mt-4 space-y-4">
                                <div>
                                    <p className="text-gray-500 text-sm">First Name</p>
                                    <p className="text-lg font-semibold">{user?.firstName}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm">Last Name</p>
                                    <p className="text-lg font-semibold">{user?.lastName}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm">Email</p>
                                    <p className="text-lg font-semibold">{user?.email}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm">Account Created</p>
                                    <p className="text-lg font-semibold">{accountCreatedDate.toLocaleDateString()}</p>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {tabIndex === "settings" && (
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
                                        <button type="button" className="absolute inset-y-0 right-4 flex items-center text-gray-500 hover:text-gray-700" onClick={() => setShowPassword({ ...showPassword, old: !showPassword.old })}>
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
                                        <button type="button" className="absolute inset-y-0 right-4 flex items-center text-gray-500 hover:text-gray-700" onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}>
                                            {showPassword.new ? <AiOutlineEyeInvisible size={24} /> : <AiOutlineEye size={24} />}
                                        </button>
                                    </div>
                                </div>
                                {passwordError && <p className="text-red-500 mt-2">{passwordError}</p>}
                                <button className="mt-4 bg-blue-500 text-white py-3 px-6 rounded-lg w-full" onClick={handleChangePassword}>Change Password</button>
                            </div><div className="p-6 bg-gray-100 rounded-lg shadow">
                            <h2 className="text-xl font-semibold text-red-500 flex items-center gap-2">
                                <AiOutlineUserDelete size={22} /> Delete Account
                            </h2>
                            <p className="text-gray-500 mt-2">This action cannot be undone.</p>
                            <button className="mt-4 bg-red-500 text-white py-3 px-6 rounded-lg w-full" onClick={() => setModalOpen(true)}>Confirm Delete</button>
                        </div>
                        </motion.div>
                    )}
                </div>
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
                            <button className="px-6 py-2 border rounded-lg" onClick={() => setModalOpen(false)}>Cancel</button>
                            <button className="px-6 py-2 bg-red-500 text-white rounded-lg" onClick={handleDeleteAccount}>Delete</button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default Account;
