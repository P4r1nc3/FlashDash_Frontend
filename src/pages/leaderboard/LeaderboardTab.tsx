import { useState, useEffect, useCallback } from "react";
import { getLeaderboard } from "../../api/leaderboards";
import { LeaderboardEntry } from "../../interfaces/LeaderboardEntry";
import { LeaderboardCriteria } from "../../enums/LeaderboardCriteria";
import { AiOutlineSearch, AiOutlineUser, AiOutlineGlobal } from "react-icons/ai";
import { MdOutlineLeaderboard } from "react-icons/md";
import { FaRegClock, FaGamepad, FaFire, FaRegStar } from "react-icons/fa";
import Card from "../../components/ui/Card";
import EmptyState from "../../components/ui/EmptyState";

const LeaderboardTab = () => {
    const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
    const [criteria, setCriteria] = useState<LeaderboardCriteria>(LeaderboardCriteria.POINTS);
    const [friendsOnly, setFriendsOnly] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState("");

    const getCriteriaIcon = (criteriaType: LeaderboardCriteria) => {
        switch (criteriaType) {
            case LeaderboardCriteria.STUDY_TIME:
                return <FaRegClock className="text-white" />;
            case LeaderboardCriteria.GAMES_PLAYED:
                return <FaGamepad className="text-white" />;
            case LeaderboardCriteria.STREAK:
                return <FaFire className="text-white" />;
            case LeaderboardCriteria.POINTS:
            default:
                return <FaRegStar className="text-white" />;
        }
    };

    const getCriteriaColor = (criteriaType: LeaderboardCriteria) => {
        switch (criteriaType) {
            case LeaderboardCriteria.STUDY_TIME: {
                return "bg-gradient-to-r from-purple-400 to-pink-400";
            }
            case LeaderboardCriteria.GAMES_PLAYED: {
                return "bg-gradient-to-r from-yellow-400 to-amber-400";
            }
            case LeaderboardCriteria.STREAK: {
                return "bg-gradient-to-r from-orange-400 to-red-400";
            }
            case LeaderboardCriteria.POINTS:
            default:
                return "bg-gradient-to-r from-blue-400 to-indigo-400";
        }
    };

    const getCriteriaLabel = (criteriaType: LeaderboardCriteria) => {
        switch (criteriaType) {
            case LeaderboardCriteria.STUDY_TIME:
                return "Study Time";
            case LeaderboardCriteria.GAMES_PLAYED:
                return "Games Played";
            case LeaderboardCriteria.STREAK:
                return "Streak";
            case LeaderboardCriteria.POINTS:
            default:
                return "Points";
        }
    };

    const formatValue = (value: number, criteriaType: LeaderboardCriteria) => {
        switch (criteriaType) {
            case LeaderboardCriteria.STUDY_TIME: {
                const hours = Math.floor(value / 60);
                const minutes = value % 60;
                if (hours === 0) return `${minutes} min`;
                if (minutes === 0) return `${hours} hrs`;
                return `${hours} hrs ${minutes} min`;
            }
            case LeaderboardCriteria.STREAK:
                return `${value} days`;
            default:
                return value.toLocaleString();
        }
    };

    const fetchLeaderboardData = useCallback(async () => {
        const data = await getLeaderboard(criteria, friendsOnly, 100);
        setEntries(data);
    }, [criteria, friendsOnly]);

    useEffect(() => {
        fetchLeaderboardData();
    }, [fetchLeaderboardData]);

    const filteredEntries = entries.filter(entry =>
        entry.user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${entry.user.firstName} ${entry.user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const renderToolbar = () => (
        <div className="flex flex-wrap gap-2 items-center">
            <div className="relative w-full sm:w-auto sm:flex-1 max-w-md">
                <input
                    type="text"
                    placeholder="Search users..."
                    className="p-2 pl-9 w-full bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-300 text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                    <AiOutlineSearch className="text-gray-400" size={18} />
                </div>
            </div>

            <div className="flex items-center">
                <label className="mr-2 text-xs text-gray-500 font-medium">Sort by:</label>
                <div className="relative">
                    <select
                        className="h-10 py-2 pl-8 pr-8 border border-gray-200 rounded-lg bg-gray-50 appearance-none focus:outline-none focus:ring-1 focus:ring-indigo-300 text-sm text-gray-700 cursor-pointer"
                        value={criteria}
                        onChange={(e) => setCriteria(e.target.value as LeaderboardCriteria)}
                    >
                        <option value={LeaderboardCriteria.POINTS}>Points</option>
                        <option value={LeaderboardCriteria.STUDY_TIME}>Study Time</option>
                        <option value={LeaderboardCriteria.GAMES_PLAYED}>Games Played</option>
                        <option value={LeaderboardCriteria.STREAK}>Streak</option>
                    </select>
                    <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                        {(() => {
                            switch (criteria) {
                                case LeaderboardCriteria.STUDY_TIME:
                                    return <FaRegClock className="text-purple-500" />;
                                case LeaderboardCriteria.GAMES_PLAYED:
                                    return <FaGamepad className="text-amber-500" />;
                                case LeaderboardCriteria.STREAK:
                                    return <FaFire className="text-orange-500" />;
                                case LeaderboardCriteria.POINTS:
                                default:
                                    return <FaRegStar className="text-blue-500" />;
                            }
                        })()}
                    </div>
                    <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                        <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                    </div>
                </div>
            </div>

            <div>
                <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50 h-10 overflow-hidden">
                    <button
                        className={`flex items-center px-3 py-2 text-sm ${!friendsOnly ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`}
                        onClick={() => setFriendsOnly(false)}
                    >
                        <AiOutlineGlobal className={`mr-1.5 ${!friendsOnly ? 'text-indigo-600' : 'text-gray-400'}`} size={16} />
                        Global
                    </button>
                    <button
                        className={`flex items-center px-3 py-2 text-sm ${friendsOnly ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`}
                        onClick={() => setFriendsOnly(true)}
                    >
                        <AiOutlineUser className={`mr-1.5 ${friendsOnly ? 'text-indigo-600' : 'text-gray-400'}`} size={16} />
                        Friends
                    </button>
                </div>
            </div>
        </div>
    );

    const renderLeaderboard = () => {
        if (filteredEntries.length === 0) {
            return (
                <div className="h-full flex items-center justify-center">
                    <EmptyState
                        icon={<MdOutlineLeaderboard size={48} />}
                        title="No leaderboard data found"
                        description={searchTerm ? "Try a different search term" : friendsOnly ? "Add friends to see them on the leaderboard" : "Be the first to join the leaderboard!"}
                    />
                </div>
            );
        }

        return (
            <div className="space-y-3">
                {filteredEntries.map((entry) => {
                    const index = entry.rank - 1;

                    return (
                        <div
                            key={`${entry.user.userFrn}-${entry.rank}`}
                            className={`p-4 rounded-lg shadow-sm border ${
                                index === 0
                                    ? "bg-gradient-to-br from-yellow-50 to-amber-50 border-amber-200"
                                    : index === 1
                                        ? "bg-gradient-to-br from-gray-50 to-slate-50 border-slate-200"
                                        : index === 2
                                            ? "bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200"
                                            : "bg-gradient-to-br from-blue-50 to-indigo-50 border-indigo-100"
                            }`}
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
                                                <span className="text-white font-bold">{entry.rank}</span>
                                            </div>
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 flex items-center justify-center shadow-sm">
                                                <span className="text-white font-bold">{entry.rank}</span>
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
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <Card
            title="Leaderboard"
            description="See how you rank against others"
            icon={<MdOutlineLeaderboard size={22} />}
            toolbar={renderToolbar()}
            scrollable={filteredEntries.length > 0}
            fullHeight={true}
        >
            <div className="custom-scrollbar h-full">
                {renderLeaderboard()}
            </div>
        </Card>
    );
};

export default LeaderboardTab;