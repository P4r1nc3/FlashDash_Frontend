import { useEffect, useState } from "react";
import { getUserInfo } from "../../api/user.ts";
import { motion } from "framer-motion";
import { AiOutlineUser, AiOutlineMail, AiOutlineCalendar, AiOutlineTrophy, AiOutlineClockCircle } from "react-icons/ai";
import { FaRegStar, FaFire, FaRegClock, FaRegLightbulb, FaGamepad } from "react-icons/fa";

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

    const formatStudyTime = (minutes) => {
        if (!minutes) return "0 min";

        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;

        if (hours === 0) return `${remainingMinutes} min`;
        if (remainingMinutes === 0) return `${hours} godz`;
        return `${hours} godz ${remainingMinutes} min`;
    };

    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-md w-full">
                <div className="h-1 w-full bg-gradient-to-r from-blue-400 to-indigo-400 rounded-t-xl"></div>
                <div className="p-6 flex justify-center items-center h-80">
                    <div className="animate-pulse flex flex-col items-center w-full max-w-lg">
                        <div className="h-20 w-20 bg-blue-100 rounded-full mb-4"></div>
                        <div className="h-6 w-48 bg-blue-100 rounded mb-3"></div>
                        <div className="h-4 w-32 bg-gray-100 rounded mb-6"></div>
                        <div className="h-24 w-full bg-gray-100 rounded mb-4"></div>
                        <div className="grid grid-cols-2 gap-4 w-full">
                            <div className="h-12 bg-gray-100 rounded"></div>
                            <div className="h-12 bg-gray-100 rounded"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            className="bg-white rounded-xl shadow-md w-full"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="h-1 w-full bg-gradient-to-r from-blue-400 to-indigo-400 rounded-t-xl"></div>

            <div className="p-6">
                <h2 className="text-xl font-bold text-blue-600 flex items-center gap-2 mb-2">
                    <AiOutlineUser size={22} className="text-indigo-500" /> Profile Information
                </h2>
                <p className="text-gray-500 mb-6 text-sm">Your personal account details and current statistics.</p>

                {user ? (
                    <motion.div
                        className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-indigo-100 shadow-sm overflow-hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1, duration: 0.4 }}
                    >
                        {/* Card Header */}
                        <div className="p-8 pb-6">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                                <div className="w-24 h-24 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center shadow-lg mx-auto sm:mx-0">
                                    <span className="text-3xl font-bold text-white">
                                        {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                                    </span>
                                </div>
                                <div className="text-center sm:text-left">
                                    <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-1">
                                        {user.firstName} {user.lastName}
                                    </h3>
                                    <p className="text-gray-600 flex items-center gap-2 justify-center sm:justify-start mb-2">
                                        <AiOutlineMail className="text-indigo-400" />
                                        <span>{user.email}</span>
                                    </p>
                                    <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                                        <div className="inline-flex items-center px-3 py-1 bg-indigo-100 text-indigo-600 rounded-full text-sm">
                                            <AiOutlineUser className="mr-1" /> {user.username}
                                        </div>
                                        <div className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">
                                            <AiOutlineCalendar className="mr-1" /> Dołączono {formatDate(user.createdAt).split(' ').slice(0, 2).join(' ')}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-indigo-100">
                            <div className="bg-white p-5">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full flex items-center justify-center shadow-sm">
                                        <FaRegStar className="text-white" />
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-xs">Points</p>
                                        <p className="text-xl font-bold text-blue-600">{user.points || 0}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-5">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-red-400 rounded-full flex items-center justify-center shadow-sm">
                                        <FaFire className="text-white" />
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-xs">Streak</p>
                                        <p className="text-xl font-bold text-orange-500">{user.streak || 0} days</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-5">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center shadow-sm">
                                        <FaRegClock className="text-white" />
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-xs">Study Time</p>
                                        <p className="text-xl font-bold text-purple-600">{formatStudyTime(user.studyTime)}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-5">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-amber-400 rounded-full flex items-center justify-center shadow-sm">
                                        <FaGamepad className="text-white" />
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-xs">Games Played</p>
                                        <p className="text-xl font-bold text-yellow-600">{user.gamesPlayed || 0}</p>
                                    </div>
                                </div>
                            </div>
                        </div>



                        {/* Card Footer */}
                        <div className="p-6 bg-white border-t border-indigo-100">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                    <FaRegLightbulb className="text-green-600" />
                                </div>
                                <div className="text-gray-600 text-sm">
                                    <span className="font-medium text-green-600">Active Learner</span> - Keep up the great work!
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        className="flex flex-col items-center justify-center py-12 text-gray-500 bg-gray-50 rounded-lg"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <AiOutlineUser size={48} className="text-gray-300 mb-3" />
                        <p className="text-center">Unable to load user data.</p>
                        <p className="text-center text-sm mt-2">Please try again later.</p>
                        <button
                            className="mt-4 px-4 py-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition-colors"
                            onClick={() => window.location.reload()}
                        >
                            Retry
                        </button>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
};

export default ProfileTab;