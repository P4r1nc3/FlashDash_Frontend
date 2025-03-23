import { useState, useEffect, useCallback } from "react";
import { getLeaderboard } from "../../api/leaderboards";
import { LeaderboardEntry } from "../../interfaces/LeaderboardEntry";
import { AiOutlineTrophy, AiOutlineSearch, AiOutlineUser, AiOutlineGlobal } from "react-icons/ai";
import { FaRegClock, FaGamepad, FaFire, FaRegStar } from "react-icons/fa";
import { motion } from "framer-motion";
import Card from "../../components/ui/Card";
import EmptyState from "../../components/ui/EmptyState";
import { toast } from "react-toastify";

const LeaderboardTab = () => {
    const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [criteria, setCriteria] = useState<string>("points");
    const [friendsOnly, setFriendsOnly] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState("");

    const getCriteriaIcon = (criteriaType: string) => {
        switch (criteriaType) {
            case "studyTime":
                return <FaRegClock />;
            case "gamesPlayed":
                return <FaGamepad />;
            case "streak":
                return <FaFire />;
            case "points":
            default:
                return <FaRegStar />;
        }
    };

    const getCriteriaColor = (criteriaType: string) => {
        switch (criteriaType) {
            case "studyTime":
                return "bg-gradient-to-r from-purple-400 to-pink-400";
            case "gamesPlayed":
                return "bg-gradient-to-r from-yellow-400 to-amber-400";
            case "streak":
                return "bg-gradient-to-r from-orange-400 to-red-400";
            case "points":
            default:
                return "bg-gradient-to-r from-blue-400 to-indigo-400";
        }
    };

    const getCriteriaLabel = (criteriaType: string) => {
        switch (criteriaType) {
            case "studyTime":
                return "Study Time";
            case "gamesPlayed":
                return "Games Played";
            case "streak":
                return "Streak";
            case "points":
            default:
                return "Points";
        }
    };

    const formatValue = (value: number, criteriaType: string) => {
        switch (criteriaType) {
            case "studyTime":
                const hours = Math.floor(value / 60);
                const minutes = value % 60;
                if (hours === 0) return `${minutes} min`;
                if (minutes === 0) return `${hours} hrs`;
                return `${hours} hrs ${minutes} min`;
            case "streak":
                return `${value} days`;
            default:
                return value.toLocaleString();
        }
    };

    const fetchLeaderboardData = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getLeaderboard(criteria, friendsOnly, 100);
            setEntries(data);
        } catch (error) {
            console.error("Error fetching leaderboard:", error);
            toast.error("Failed to load leaderboard data");
        } finally {
            setLoading(false);
        }
    }, [criteria, friendsOnly]);

    useEffect(() => {
        fetchLeaderboardData();
    }, [fetchLeaderboardData]);

    const filteredEntries = entries.filter(entry =>
        entry.user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${entry.user.firstName} ${entry.user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const renderLeaderboard = () => {
        if (loading) {
            return (
                <div className="flex justify-center items-center h-48">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
            );
        }

        if (filteredEntries.length === 0) {
            return (
                <EmptyState
                    icon={<AiOutlineTrophy size={48} />}
                    title="No leaderboard data found"
                    description={searchTerm ? "Try a different search term" : friendsOnly ? "Add friends to see them on the leaderboard" : "Be the first to join the leaderboard!"}
                />
            );
        }

        return (
            <div className="space-y-3">
                {filteredEntries.map((entry, index) => (
                    <motion.div
                        key={`${entry.user.userFrn}-${index}`}
                        className={`p-4 rounded-lg shadow-sm border ${
                            index === 0
                                ? "bg-gradient-to-br from-yellow-50 to-amber-50 border-amber-200"
                                : index === 1
                                    ? "bg-gradient-to-br from-gray-50 to-slate-50 border-slate-200"
                                    : index === 2
                                        ? "bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200"
                                        : "bg-gradient-to-br from-blue-50 to-indigo-50 border-indigo-100"
                        } transition-all duration-200`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05, duration: 0.3 }}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
                                    {index < 3 ? (
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${
                                            index === 0
                                                ? "bg-gradient-to-r from-yellow-400 to-amber-400"
                                                : index === 1
                                                    ? "bg-gradient-to-r from-gray-400 to-slate-400"
                                                    : "bg-gradient-to-r from-orange-400 to-amber-400"
                                        }`}>
                                            <span className="text-white font-bold">{index + 1}</span>
                                        </div>
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 flex items-center justify-center shadow-sm">
                                            <span className="text-white font-bold">{index + 1}</span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-lg font-semibold text-gray-800 truncate">
                                        {entry.user.firstName} {entry.user.lastName}
                                    </p>
                                    <p className="text-sm text-gray-500 truncate">
                                        @{entry.user.username}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <div className={`h-10 w-10 ${getCriteriaColor(criteria)} rounded-full flex items-center justify-center mr-3 shadow-sm`}>
                                    {getCriteriaIcon(criteria)}
                                </div>
                                <div className="text-right">
                                    <div className="text-xl font-bold text-gray-800">
                                        {formatValue(entry.score, criteria)}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {getCriteriaLabel(criteria)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        );
    };

    return (
        <Card
            title="Leaderboard"
            description="See how you rank against others"
            icon={<AiOutlineTrophy size={22} />}
            scrollable={true}
            maxHeight="max-h-[70vh]"
        >
            <div className="flex flex-col gap-4 mb-6">
                <div className="flex flex-col md:flex-row justify-between gap-3">
                    <div className="relative flex-grow">
                        <input
                            type="text"
                            placeholder="Search users..."
                            className="p-2.5 pl-10 w-full bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <AiOutlineSearch className="text-gray-400" size={20} />
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <div className="relative">
                            <select
                                className="h-11 py-2.5 pl-10 pr-4 border border-gray-200 rounded-lg bg-gray-50 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-300 text-gray-700 cursor-pointer"
                                value={criteria}
                                onChange={(e) => setCriteria(e.target.value)}
                            >
                                <option value="points">Points</option>
                                <option value="studyTime">Study Time</option>
                                <option value="gamesPlayed">Games Played</option>
                                <option value="streak">Streak</option>
                            </select>
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                {getCriteriaIcon(criteria)}
                            </div>
                        </div>

                        <div className="relative">
                            <select
                                className="h-11 py-2.5 pl-10 pr-4 border border-gray-200 rounded-lg bg-gray-50 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-300 text-gray-700 cursor-pointer"
                                value={friendsOnly ? "friends" : "global"}
                                onChange={(e) => setFriendsOnly(e.target.value === "friends")}
                            >
                                <option value="global">Global</option>
                                <option value="friends">Friends Only</option>
                            </select>
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                {friendsOnly ?
                                    <AiOutlineUser className="text-gray-400" size={20} /> :
                                    <AiOutlineGlobal className="text-gray-400" size={20} />
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="custom-scrollbar">
                {renderLeaderboard()}
            </div>
        </Card>
    );
};

export default LeaderboardTab;