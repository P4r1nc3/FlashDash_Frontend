import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getAllAchievementSchemas, getUserAchievements } from "../../api/achievements.ts";
import { Achievement, AchievementSchema } from "../../interfaces/Achievement";
import { AiOutlineTrophy, AiOutlineFilter } from "react-icons/ai";
import { FaLock, FaFire, FaGamepad, FaLayerGroup, FaUserFriends, FaQuestion } from "react-icons/fa";
import { BsCheckCircleFill, BsStarFill } from "react-icons/bs";
import Card from "../../components/ui/Card";
import EmptyState from "../../components/ui/EmptyState";
import { toast } from "react-toastify";

type AchievementType = "ALL" | "STREAK_ACHIEVEMENT" | "GAMES_PLAYED" | "DECKS_CREATED" | "FRIENDS_ADDED" | "QUESTIONS_CREATED";

const AchievementsTab = () => {
    const [achievementSchemas, setAchievementSchemas] = useState<AchievementSchema[]>([]);
    const [userAchievements, setUserAchievements] = useState<Achievement[]>([]);
    const [selectedAchievementType, setSelectedAchievementType] = useState<AchievementType>("ALL");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [schemas, achievements] = await Promise.all([
                    getAllAchievementSchemas(),
                    getUserAchievements()
                ]);

                setAchievementSchemas(schemas);
                setUserAchievements(achievements);
            } catch (error) {
                console.error("Error while fetching achievement data:", error);
                toast.error("Failed to fetch achievement data");
            }
        };
        // Execute fetchData and handle the Promise properly
        void fetchData();
    }, []);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getAchievementIcon = (type: string) => {
        switch (type) {
            case "STREAK_ACHIEVEMENT":
                return <FaFire className="text-white" />;
            case "GAMES_PLAYED":
                return <FaGamepad className="text-white" />;
            case "DECKS_CREATED":
                return <FaLayerGroup className="text-white" />;
            case "FRIENDS_ADDED":
                return <FaUserFriends className="text-white" />;
            case "QUESTIONS_CREATED":
                return <FaQuestion className="text-white" />;
            default:
                return <AiOutlineTrophy className="text-white" />;
        }
    };

    const getAchievementColor = (type: string) => {
        switch (type) {
            case "STREAK_ACHIEVEMENT":
                return {
                    bg: "from-orange-400 to-orange-600",
                    lightBg: "bg-orange-100",
                    text: "text-orange-700",
                    border: "border-orange-200",
                    shadow: "shadow-orange-200",
                    glow: "orange"
                };
            case "GAMES_PLAYED":
                return {
                    bg: "from-indigo-400 to-indigo-600",
                    lightBg: "bg-indigo-100",
                    text: "text-indigo-700",
                    border: "border-indigo-200",
                    shadow: "shadow-indigo-200",
                    glow: "indigo"
                };
            case "DECKS_CREATED":
                return {
                    bg: "from-blue-400 to-blue-600",
                    lightBg: "bg-blue-100",
                    text: "text-blue-700",
                    border: "border-blue-200",
                    shadow: "shadow-blue-200",
                    glow: "blue"
                };
            case "FRIENDS_ADDED":
                return {
                    bg: "from-green-400 to-green-600",
                    lightBg: "bg-green-100",
                    text: "text-green-700",
                    border: "border-green-200",
                    shadow: "shadow-green-200",
                    glow: "green"
                };
            case "QUESTIONS_CREATED":
                return {
                    bg: "from-purple-400 to-purple-600",
                    lightBg: "bg-purple-100",
                    text: "text-purple-700",
                    border: "border-purple-200",
                    shadow: "shadow-purple-200",
                    glow: "purple"
                };
            default:
                return {
                    bg: "from-blue-400 to-blue-600",
                    lightBg: "bg-blue-100",
                    text: "text-blue-700",
                    border: "border-blue-200",
                    shadow: "shadow-blue-200",
                    glow: "blue"
                };
        }
    };

    const getAchievementTypeName = (type: string): string => {
        switch (type) {
            case "STREAK_ACHIEVEMENT": return "Streak";
            case "GAMES_PLAYED": return "Games";
            case "DECKS_CREATED": return "Decks";
            case "FRIENDS_ADDED": return "Friends";
            case "QUESTIONS_CREATED": return "Questions";
            default: return "Unknown";
        }
    };

    // Count achievements by type
    const achievementCounts = {
        ALL: userAchievements.length,
        STREAK_ACHIEVEMENT: userAchievements.filter(a => a.achievementType === "STREAK_ACHIEVEMENT").length,
        GAMES_PLAYED: userAchievements.filter(a => a.achievementType === "GAMES_PLAYED").length,
        DECKS_CREATED: userAchievements.filter(a => a.achievementType === "DECKS_CREATED").length,
        FRIENDS_ADDED: userAchievements.filter(a => a.achievementType === "FRIENDS_ADDED").length,
        QUESTIONS_CREATED: userAchievements.filter(a => a.achievementType === "QUESTIONS_CREATED").length
    };

    const filterButtons = [
        { id: "ALL" as AchievementType, label: "All", icon: <AiOutlineTrophy className={selectedAchievementType === "ALL" ? "text-indigo-600" : "text-gray-400"} /> },
        { id: "STREAK_ACHIEVEMENT" as AchievementType, label: "Streak", icon: <FaFire className={selectedAchievementType === "STREAK_ACHIEVEMENT" ? "text-indigo-600" : "text-gray-400"} /> },
        { id: "GAMES_PLAYED" as AchievementType, label: "Games", icon: <FaGamepad className={selectedAchievementType === "GAMES_PLAYED" ? "text-indigo-600" : "text-gray-400"} /> },
        { id: "DECKS_CREATED" as AchievementType, label: "Decks", icon: <FaLayerGroup className={selectedAchievementType === "DECKS_CREATED" ? "text-indigo-600" : "text-gray-400"} /> },
        { id: "FRIENDS_ADDED" as AchievementType, label: "Friends", icon: <FaUserFriends className={selectedAchievementType === "FRIENDS_ADDED" ? "text-indigo-600" : "text-gray-400"} /> },
        { id: "QUESTIONS_CREATED" as AchievementType, label: "Questions", icon: <FaQuestion className={selectedAchievementType === "QUESTIONS_CREATED" ? "text-indigo-600" : "text-gray-400"} /> }
    ];

    const filteredAchievements = achievementSchemas.filter(
        schema => selectedAchievementType === "ALL" || schema.achievementType === selectedAchievementType
    );

    const renderAchievementList = () => {
        if (filteredAchievements.length === 0) {
            return (
                <EmptyState
                    icon={<AiOutlineTrophy size={48} />}
                    title="No achievements found in this category."
                />
            );
        }

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredAchievements.map((schema: AchievementSchema) => {
                    const userAchievement = userAchievements.find(a => a.schemaFrn === schema.schemaFrn);
                    const isUnlocked = !!userAchievement;
                    const colors = getAchievementColor(schema.achievementType);

                    return (
                        <motion.div
                            key={schema.schemaId}
                            className={`relative overflow-hidden rounded-lg ${isUnlocked ? 'shadow-lg ' + colors.shadow : 'shadow bg-gray-50'} border ${isUnlocked ? colors.border : 'border-gray-200'}`}
                            whileHover={{
                                y: -5,
                                transition: { duration: 0.2 }
                            }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {/* Achievement Header */}
                            <div className={`p-4 ${isUnlocked ? 'bg-gradient-to-r ' + colors.bg : 'bg-gray-200'}`}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isUnlocked ? 'bg-white bg-opacity-20 shadow-inner' : 'bg-gray-300'}`}>
                                            {isUnlocked ? (
                                                getAchievementIcon(schema.achievementType)
                                            ) : (
                                                <FaLock className="text-gray-500" size={16} />
                                            )}
                                        </div>
                                        <div>
                                            <h4 className={`font-bold text-lg ${isUnlocked ? 'text-white' : 'text-gray-600'}`}>
                                                {schema.name}
                                            </h4>
                                            <div className={`text-xs font-medium inline-block px-2 py-0.5 rounded-full ${isUnlocked ? 'bg-white bg-opacity-20 text-white' : 'bg-gray-300 text-gray-600'}`}>
                                                {getAchievementTypeName(schema.achievementType)}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="absolute top-2 right-2">
                                        <div className="flex">
                                            {[...Array(5)].map((_, i) => {
                                                const filled = isUnlocked ?
                                                    schema.level > i :
                                                    false;

                                                return (
                                                    <BsStarFill
                                                        key={i}
                                                        className={`${filled ? 'text-yellow-300' : 'text-gray-300'} drop-shadow-sm`}
                                                        size={16}
                                                    />
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Achievement Body */}
                            <div className="p-4">
                                <p className={`text-sm mb-4 ${isUnlocked ? 'text-gray-700' : 'text-gray-500'}`}>
                                    {schema.description}
                                </p>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        {isUnlocked ? (
                                            <>
                                                <BsCheckCircleFill className={colors.text} />
                                                <span className={`text-sm font-medium ${colors.text}`}>
                                                    Unlocked: {formatDate(userAchievement.achievedAt)}
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                <FaLock className="text-gray-500" size={14} />
                                                <span className="text-sm text-gray-500 font-medium">Locked</span>
                                            </>
                                        )}
                                    </div>

                                    <div className="text-right">
                                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                                            isUnlocked
                                                ? colors.lightBg + ' ' + colors.text
                                                : 'bg-gray-200 text-gray-600'
                                        }`}>
                                            {isUnlocked ? 'Completed: ' : 'Goal: '}{schema.threshold}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        );
    };

    return (
        <Card
            title="Your Achievements"
            description="Track your progress and unlock rewards as you learn."
            icon={<AiOutlineTrophy size={22} />}
            actions={
                <div className="bg-yellow-50 text-yellow-700 px-3 py-2 rounded-lg font-bold flex items-center gap-2 border border-yellow-200 shadow-sm">
                    <AiOutlineTrophy className="text-yellow-500" />
                    <span>{userAchievements.length} / {achievementSchemas.length}</span>
                </div>
            }
            scrollable={true}
            fullHeight={true}
        >
            {/* Filter buttons - updated to match LeaderboardTab style */}
            <div className="flex flex-wrap items-center mb-6 border border-gray-200 rounded-lg bg-gray-50 h-10 overflow-hidden">
                <div className="flex items-center h-full px-3 text-xs text-gray-500 font-medium">
                    <AiOutlineFilter className="mr-1.5" />
                    <span>Filter by:</span>
                </div>

                {filterButtons.map(button => (
                    <button
                        key={button.id}
                        className={`flex-1 flex items-center justify-center h-full px-3 py-2 text-sm ${
                            selectedAchievementType === button.id
                                ? 'bg-indigo-100 text-indigo-700'
                                : 'text-gray-600 hover:bg-gray-100'
                        }`}
                        onClick={() => setSelectedAchievementType(button.id)}
                    >
                        <span className="flex items-center">
                            {React.cloneElement(button.icon, {
                                className: selectedAchievementType === button.id ? 'text-indigo-600' : 'text-gray-400',
                                size: 16
                            })}
                            <span className="ml-1.5">{button.label}</span>
                        </span>
                        <span className={`ml-1 inline-flex items-center justify-center text-xs ${
                            selectedAchievementType === button.id
                                ? "bg-white bg-opacity-20 text-indigo-700 px-1.5 rounded-full"
                                : "text-gray-500"
                        }`}>
                            {achievementCounts[button.id]}
                        </span>
                    </button>
                ))}
            </div>

            {renderAchievementList()}
        </Card>
    );
};

export default AchievementsTab;