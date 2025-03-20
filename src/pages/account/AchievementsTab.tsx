import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getAllAchievementSchemas, getUserAchievements } from "../../api/achievements.ts";
import { Achievement, AchievementSchema } from "../../interfaces/Achievement";
import { AiOutlineTrophy, AiOutlineFilter } from "react-icons/ai";
import { FaLock, FaFire, FaGamepad, FaLayerGroup, FaUserFriends, FaQuestion } from "react-icons/fa";
import { BsCheckCircleFill } from "react-icons/bs";
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
        fetchData();
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
                return <FaFire className="text-orange-500" />;
            case "GAMES_PLAYED":
                return <FaGamepad className="text-indigo-500" />;
            case "DECKS_CREATED":
                return <FaLayerGroup className="text-blue-500" />;
            case "FRIENDS_ADDED":
                return <FaUserFriends className="text-green-500" />;
            case "QUESTIONS_CREATED":
                return <FaQuestion className="text-purple-500" />;
            default:
                return <AiOutlineTrophy className="text-blue-500" />;
        }
    };

    const getAchievementColor = (type: string) => {
        switch (type) {
            case "STREAK_ACHIEVEMENT":
                return {
                    bg: "bg-orange-100",
                    text: "text-orange-700",
                    border: "border-orange-200",
                    borderLeft: "border-orange-500"
                };
            case "GAMES_PLAYED":
                return {
                    bg: "bg-indigo-100",
                    text: "text-indigo-700",
                    border: "border-indigo-200",
                    borderLeft: "border-indigo-500"
                };
            case "DECKS_CREATED":
                return {
                    bg: "bg-blue-100",
                    text: "text-blue-700",
                    border: "border-blue-200",
                    borderLeft: "border-blue-500"
                };
            case "FRIENDS_ADDED":
                return {
                    bg: "bg-green-100",
                    text: "text-green-700",
                    border: "border-green-200",
                    borderLeft: "border-green-500"
                };
            case "QUESTIONS_CREATED":
                return {
                    bg: "bg-purple-100",
                    text: "text-purple-700",
                    border: "border-purple-200",
                    borderLeft: "border-purple-500"
                };
            default:
                return {
                    bg: "bg-blue-100",
                    text: "text-blue-700",
                    border: "border-blue-200",
                    borderLeft: "border-blue-500"
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
        { id: "ALL" as AchievementType, label: "All Achievements" },
        { id: "STREAK_ACHIEVEMENT" as AchievementType, label: "Streak" },
        { id: "GAMES_PLAYED" as AchievementType, label: "Games" },
        { id: "DECKS_CREATED" as AchievementType, label: "Decks" },
        { id: "FRIENDS_ADDED" as AchievementType, label: "Friends" },
        { id: "QUESTIONS_CREATED" as AchievementType, label: "Questions" }
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
            <div className="space-y-3">
                {filteredAchievements.map((schema: AchievementSchema) => {
                    const userAchievement = userAchievements.find(a => a.schemaFrn === schema.schemaFrn);
                    const isUnlocked = !!userAchievement;
                    const colors = getAchievementColor(schema.achievementType);

                    return (
                        <motion.div
                            key={schema.schemaId}
                            className={`p-4 rounded-lg shadow-sm border-l-4 ${
                                isUnlocked
                                    ? `${colors.borderLeft} ${colors.bg} bg-opacity-30`
                                    : 'border-gray-300 bg-gray-50'
                            }`}
                            whileHover={{ x: 3 }}
                            transition={{ duration: 0.2 }}
                        >
                            <div className="flex items-center mb-2">
                                <div className="flex items-center gap-2 mr-3">
                                    <div className={`w-10 h-10 rounded-full ${
                                        isUnlocked
                                            ? colors.bg
                                            : 'bg-gray-200'
                                    } flex items-center justify-center`}>
                                        {isUnlocked ? (
                                            getAchievementIcon(schema.achievementType)
                                        ) : (
                                            <FaLock className="text-gray-500" size={16} />
                                        )}
                                    </div>
                                    <h4 className={`font-semibold text-base ${
                                        isUnlocked
                                            ? colors.text
                                            : 'text-gray-500'
                                    }`}>
                                        {schema.name}
                                    </h4>
                                </div>
                                <div className={`px-2 py-1 rounded-md text-xs font-medium ml-auto ${
                                    isUnlocked
                                        ? `${colors.bg} ${colors.text}`
                                        : 'bg-gray-200 text-gray-600'
                                }`}>
                                    {getAchievementTypeName(schema.achievementType)}
                                </div>
                            </div>

                            <p className={`text-sm mb-3 ${
                                isUnlocked
                                    ? 'text-gray-700'
                                    : 'text-gray-500'
                            }`}>
                                {schema.description}
                            </p>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    {isUnlocked ? (
                                        <>
                                            <BsCheckCircleFill className={colors.text} />
                                            <span className={`text-sm font-medium ${colors.text}`}>
                                                Unlocked on {formatDate(userAchievement.achievedAt)}
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <FaLock className="text-gray-500" size={14} />
                                            <span className="text-sm text-gray-500 font-medium">Not yet unlocked</span>
                                        </>
                                    )}
                                </div>
                                <div className="text-right">
                                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                                        isUnlocked
                                            ? `${colors.bg} ${colors.text}`
                                            : 'bg-gray-200 text-gray-600'
                                    }`}>
                                        Threshold: {schema.threshold}
                                    </span>
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
                <div className="bg-indigo-50 text-indigo-700 px-3 py-2 rounded-lg font-medium">
                    {userAchievements.length} / {achievementSchemas.length} Unlocked
                </div>
            }
        >
            {/* Filter buttons */}
            <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
                <div className="text-gray-500 flex items-center gap-1 pr-2">
                    <AiOutlineFilter />
                    <span className="text-sm">Filter:</span>
                </div>
                {filterButtons.map(button => (
                    <button
                        key={button.id}
                        className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 ${
                            selectedAchievementType === button.id
                                ? "bg-indigo-100 text-indigo-700 border border-indigo-200"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200"
                        }`}
                        onClick={() => setSelectedAchievementType(button.id)}
                    >
                        {button.label}
                        <span className="ml-1 bg-white px-2 py-0.5 rounded-full text-xs">
                            {achievementCounts[button.id]}
                        </span>
                    </button>
                ))}
            </div>

            {/* Achievement list with scrolling */}
            <div className="max-h-[45vh] overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                {renderAchievementList()}
            </div>
        </Card>
    );
};

export default AchievementsTab;