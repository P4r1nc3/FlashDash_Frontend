import { useEffect, useState } from "react";
import { getUserInfo } from "../../api/user.ts";
import {User} from "../../interfaces/User.ts";
import { motion } from "framer-motion";
import { AiOutlineUser, AiOutlineMail, AiOutlineCalendar } from "react-icons/ai";
import { FaRegStar, FaFire, FaRegClock, FaGamepad } from "react-icons/fa";
import Card from "../../components/ui/Card";
import EmptyState from "../../components/ui/EmptyState";
import GradientButton from "../../components/ui/GradientButton";
import { toast } from "react-toastify";

const ProfileTab = () => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const data = await getUserInfo();
                setUser(data);
            } catch (error) {
                console.error("Error fetching user info:", error);
                toast.error("Failed to fetch user information");
            }
        };

        fetchUserInfo().catch(error => {
            console.error("Unhandled error in fetchUserInfo:", error);
        });
    }, []);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getCreationYear = (dateString: string) => {
        const date = new Date(dateString);
        return date.getFullYear();
    };

    const formatStudyTime = (minutes: number) => {
        if (!minutes) return "0 min";

        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;

        if (hours === 0) return `${remainingMinutes} min`;
        if (remainingMinutes === 0) return `${hours} hrs`;
        return `${hours} hrs ${remainingMinutes} min`;
    };

    const renderUserProfile = () => {
        if (!user) {
            return (
                <EmptyState
                    icon={<AiOutlineUser size={48} />}
                    title="Unable to load user data."
                    description="Please try again later."
                    action={
                        <GradientButton
                            onClick={() => window.location.reload()}
                            className="mt-4 px-4 py-2"
                            startColor="from-indigo-400"
                            endColor="to-indigo-500"
                        >
                            Retry
                        </GradientButton>
                    }
                />
            );
        }

        return (
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
                                {user.firstName.charAt(0)}{user.lastName.charAt(0)}
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
                                    <AiOutlineCalendar className="mr-1" /> Joined {formatDate(user.createdAt).split(' ').slice(0, 2).join(' ')} {getCreationYear(user.createdAt)}
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
                            <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-amber-400 rounded-full flex items-center justify-center shadow-sm">
                                <FaGamepad className="text-white" />
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs">Games Played</p>
                                <p className="text-xl font-bold text-yellow-600">{user.gamesPlayed || 0}</p>
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
                            <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-red-400 rounded-full flex items-center justify-center shadow-sm">
                                <FaFire className="text-white" />
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs">Streak</p>
                                <p className="text-xl font-bold text-orange-500">{user.streak || 0} days</p>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    };

    return (
        <Card
            title="Profile Information"
            description="Your personal account details and current statistics."
            icon={<AiOutlineUser size={22} />}
        >
            {renderUserProfile()}
        </Card>
    );
};

export default ProfileTab;