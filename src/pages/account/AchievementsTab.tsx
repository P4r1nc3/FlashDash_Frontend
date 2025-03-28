import { useEffect, useState, ReactElement } from "react";
import { motion } from "framer-motion";
import { getAllAchievementSchemas, getUserAchievements } from "../../api/achievements";
import { Achievement, AchievementSchema } from "../../interfaces/Achievement";
import { AiOutlineTrophy, AiOutlineFilter } from "react-icons/ai";
import { FaLock, FaFire, FaGamepad, FaLayerGroup, FaUserFriends, FaQuestion } from "react-icons/fa";
import { BsCheckCircleFill, BsStarFill } from "react-icons/bs";
import Card from "../../components/ui/Card";
import EmptyState from "../../components/ui/EmptyState";
import { AchievementType } from "../../enums/AchievementType";

interface FilterButton {
    id: AchievementType;
    label: string;
    icon: ReactElement;
}

const AchievementsTab = () => {
    const [achievementSchemas, setAchievementSchemas] = useState<AchievementSchema[]>([]);
    const [userAchievements, setUserAchievements] = useState<Achievement[]>([]);
    const [selectedAchievementType, setSelectedAchievementType] = useState<AchievementType>(AchievementType.ALL);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const schemas = await getAllAchievementSchemas();
                const achievements = await getUserAchievements();

                setAchievementSchemas(schemas);
                setUserAchievements(achievements);
            } catch (error) {
                console.error("Error fetching achievement data:", error);
            }
        };

        void fetchData();
    }, []);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getAchievementIcon = (type: string) => {
        switch (type) {
            case AchievementType.STREAK_ACHIEVEMENT:
                return <FaFire className="text-white" />;
            case AchievementType.GAMES_PLAYED:
                return <FaGamepad className="text-white" />;
            case AchievementType.DECKS_CREATED:
                return <FaLayerGroup className="text-white" />;
            case AchievementType.FRIENDS_ADDED:
                return <FaUserFriends className="text-white" />;
            case AchievementType.QUESTIONS_CREATED:
                return <FaQuestion className="text-white" />;
            default:
                return <AiOutlineTrophy className="text-white" />;
        }
    };

    const getAchievementColor = (type: string) => {
        switch (type) {
            case AchievementType.STREAK_ACHIEVEMENT:
                return {
                    bg: "from-orange-400 to-orange-600",
                    lightBg: "bg-orange-100",
                    text: "text-orange-700",
                    border: "border-orange-200",
                    shadow: "shadow-orange-200",
                    glow: "orange"
                };
            case AchievementType.GAMES_PLAYED:
                return {
                    bg: "from-indigo-400 to-indigo-600",
                    lightBg: "bg-indigo-100",
                    text: "text-indigo-700",
                    border: "border-indigo-200",
                    shadow: "shadow-indigo-200",
                    glow: "indigo"
                };
            case AchievementType.DECKS_CREATED:
                return {
                    bg: "from-blue-400 to-blue-600",
                    lightBg: "bg-blue-100",
                    text: "text-blue-700",
                    border: "border-blue-200",
                    shadow: "shadow-blue-200",
                    glow: "blue"
                };
            case AchievementType.FRIENDS_ADDED:
                return {
                    bg: "from-green-400 to-green-600",
                    lightBg: "bg-green-100",
                    text: "text-green-700",
                    border: "border-green-200",
                    shadow: "shadow-green-200",
                    glow: "green"
                };
            case AchievementType.QUESTIONS_CREATED:
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
            case AchievementType.STREAK_ACHIEVEMENT: return "Streak";
            case AchievementType.GAMES_PLAYED: return "Games";
            case AchievementType.DECKS_CREATED: return "Decks";
            case AchievementType.FRIENDS_ADDED: return "Friends";
            case AchievementType.QUESTIONS_CREATED: return "Questions";
            default: return "Unknown";
        }
    };

    // Count achievements by type
    const achievementCounts = {
        [AchievementType.ALL]: userAchievements.length,
        [AchievementType.STREAK_ACHIEVEMENT]: userAchievements.filter(a => a.achievementType === AchievementType.STREAK_ACHIEVEMENT).length,
        [AchievementType.GAMES_PLAYED]: userAchievements.filter(a => a.achievementType === AchievementType.GAMES_PLAYED).length,
        [AchievementType.DECKS_CREATED]: userAchievements.filter(a => a.achievementType === AchievementType.DECKS_CREATED).length,
        [AchievementType.FRIENDS_ADDED]: userAchievements.filter(a => a.achievementType === AchievementType.FRIENDS_ADDED).length,
        [AchievementType.QUESTIONS_CREATED]: userAchievements.filter(a => a.achievementType === AchievementType.QUESTIONS_CREATED).length
    };

    // Fix typing for filter buttons
    const filterButtons: FilterButton[] = [
        { id: AchievementType.ALL, label: "All", icon: <AiOutlineTrophy className={selectedAchievementType === AchievementType.ALL ? "text-indigo-600" : "text-gray-400"} /> },
        { id: AchievementType.STREAK_ACHIEVEMENT, label: "Streak", icon: <FaFire className={selectedAchievementType === AchievementType.STREAK_ACHIEVEMENT ? "text-indigo-600" : "text-gray-400"} /> },
        { id: AchievementType.GAMES_PLAYED, label: "Games", icon: <FaGamepad className={selectedAchievementType === AchievementType.GAMES_PLAYED ? "text-indigo-600" : "text-gray-400"} /> },
        { id: AchievementType.DECKS_CREATED, label: "Decks", icon: <FaLayerGroup className={selectedAchievementType === AchievementType.DECKS_CREATED ? "text-indigo-600" : "text-gray-400"} /> },
        { id: AchievementType.FRIENDS_ADDED, label: "Friends", icon: <FaUserFriends className={selectedAchievementType === AchievementType.FRIENDS_ADDED ? "text-indigo-600" : "text-gray-400"} /> },
        { id: AchievementType.QUESTIONS_CREATED, label: "Questions", icon: <FaQuestion className={selectedAchievementType === AchievementType.QUESTIONS_CREATED ? "text-indigo-600" : "text-gray-400"} /> }
    ];

    const renderToolbar = () => (
        <div className="flex flex-wrap items-center border border-gray-200 rounded-lg bg-gray-50 h-10 overflow-hidden">
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
                        {/* Fix the React.cloneElement issue by properly handling the icon */}
                        <span className={selectedAchievementType === button.id ? 'text-indigo-600' : 'text-gray-400'}>
                            {button.icon}
                        </span>
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
    );

    const filteredAchievements = achievementSchemas.filter(
        schema => selectedAchievementType === AchievementType.ALL || schema.achievementType === selectedAchievementType
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
                                        {isUnlocked && userAchievement ? (
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
            toolbar={renderToolbar()}
            actions={
                <div className="bg-yellow-50 text-yellow-700 px-3 py-2 rounded-lg font-bold flex items-center gap-2 border border-yellow-200 shadow-sm">
                    <AiOutlineTrophy className="text-yellow-500" />
                    <span>{userAchievements.length} / {achievementSchemas.length}</span>
                </div>
            }
            scrollable={true}
            fullHeight={true}
        >
            {renderAchievementList()}
        </Card>
    );
};

export default AchievementsTab;