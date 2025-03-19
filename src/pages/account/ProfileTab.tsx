import { useEffect, useState } from "react";
import { getUserInfo } from "../../api/user.ts";
import { motion } from "framer-motion";
import { AiOutlineUser, AiOutlineMail, AiOutlineCalendar } from "react-icons/ai";
import { FaRegStar, FaFire } from "react-icons/fa";

const ProfileTab = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const data = await getUserInfo();
                setUser(data);
            } catch (err) {
                console.error("Failed to fetch user information:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchUserInfo();
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-md w-full">
                <div className="h-1 w-full bg-gradient-to-r from-blue-400 to-indigo-400 rounded-t-xl"></div>
                <div className="p-6 flex justify-center items-center h-64">
                    <div className="animate-pulse flex flex-col items-center">
                        <div className="h-8 w-32 bg-blue-100 rounded mb-4"></div>
                        <div className="h-4 w-48 bg-gray-100 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-md w-full">
            <div className="h-1 w-full bg-gradient-to-r from-blue-400 to-indigo-400 rounded-t-xl"></div>

            <div className="p-6">
                <h2 className="text-xl font-bold text-blue-600 flex items-center gap-2 mb-1">
                    <AiOutlineUser size={22} className="text-indigo-500" /> Profile Information
                </h2>
                <p className="text-gray-500 mb-6 text-sm">Your personal account details.</p>

                {user ? (
                    <div>
                        {/* Profile Card */}
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 mb-6 border border-indigo-100">
                            <div className="flex items-center mb-6">
                                <div className="w-20 h-20 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full flex items-center justify-center shadow-md mr-4">
                                    <span className="text-2xl font-bold text-white">
                                        {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                                    </span>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                                        {user.firstName} {user.lastName}
                                    </h3>
                                    <p className="text-gray-600 flex items-center gap-1">
                                        <AiOutlineMail className="text-indigo-400" /> {user.email}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white p-3 rounded-lg shadow-sm">
                                    <div className="flex items-center justify-between mb-1">
                                        <p className="text-gray-600 font-medium text-sm">Points</p>
                                        <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full flex items-center justify-center shadow-sm">
                                            <FaRegStar className="text-white text-xs" />
                                        </div>
                                    </div>
                                    <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500">
                                        {user.points || 0}
                                    </p>
                                </div>

                                <div className="bg-white p-3 rounded-lg shadow-sm">
                                    <div className="flex items-center justify-between mb-1">
                                        <p className="text-gray-600 font-medium text-sm">Streak</p>
                                        <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-red-400 rounded-full flex items-center justify-center shadow-sm">
                                            <FaFire className="text-white text-xs" />
                                        </div>
                                    </div>
                                    <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
                                        {user.streak || 0} days
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Account Details */}
                        <div className="space-y-4">
                            <div className="p-4 bg-white border border-gray-100 rounded-lg shadow-sm">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                        <AiOutlineUser className="text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-sm">Username</p>
                                        <p className="font-medium">{user.username}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 bg-white border border-gray-100 rounded-lg shadow-sm">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                                        <AiOutlineCalendar className="text-indigo-600" />
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-sm">Account Created</p>
                                        <p className="font-medium">{formatDate(user.createdAt)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                        <AiOutlineUser size={48} className="text-gray-300 mb-3" />
                        <p className="text-center">Unable to load user data.</p>
                        <p className="text-center text-sm mt-2">Please try again later.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileTab;