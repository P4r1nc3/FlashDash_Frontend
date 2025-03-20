import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getGameSessions } from "../../api/gameSession.ts";
import { GameSessionResult } from "../../interfaces/GameSession.ts";
import { AiOutlineLineChart } from "react-icons/ai";
import { FaTrophy, FaRegClock, FaCalendarAlt, FaChartLine } from "react-icons/fa";
import ReactECharts from "echarts-for-react";
import { EChartsOption } from "echarts";

const StatisticsTab = () => {
    const { deckId } = useParams<{ deckId: string }>();
    const navigate = useNavigate();

    const [gameSessions, setGameSessions] = useState<GameSessionResult[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGameSessions = async () => {
            if (!deckId) return;
            try {
                const sessions = await getGameSessions(deckId);
                setGameSessions(sessions);
            } catch (err) {
                console.error("Failed to fetch game statistics");
            } finally {
                setLoading(false);
            }
        };

        fetchGameSessions();
    }, [deckId]);

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

    if (gameSessions.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-md w-full">
                <div className="h-1 w-full bg-gradient-to-r from-blue-400 to-indigo-400 rounded-t-xl"></div>
                <div className="p-6">
                    <h2 className="text-xl font-bold text-blue-600 flex items-center gap-2 mb-1">
                        <AiOutlineLineChart size={22} className="text-indigo-500" /> Statistics
                    </h2>
                    <p className="text-gray-500 mb-6 text-sm">Analyze your progress and performance over time.</p>

                    <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                        <FaChartLine size={48} className="text-gray-300 mb-4" />
                        <p className="text-center">No game sessions available yet.</p>
                        <p className="text-center text-sm mt-2">Complete some quizzes to see your statistics here.</p>
                    </div>
                </div>
            </div>
        );
    }

    const chartData = gameSessions
        .map(session => ({
            date: new Date(session.startTime).toLocaleDateString(),
            timestamp: new Date(session.startTime).getTime(),
            score: session.score,
            accuracy: session.accuracy,
            duration: session.duration,
            gameSessionFrn: session.gameSessionFrn,
        }))
        .sort((a, b) => a.timestamp - b.timestamp);

    const totalGames = gameSessions.length;
    const avgAccuracy = chartData.reduce((acc, s) => acc + s.accuracy, 0) / totalGames;
    const firstGame = chartData[0]?.date || "N/A";
    const lastGame = chartData[chartData.length - 1]?.date || "N/A";

    const chartOptions: EChartsOption = {
        title: {
            text: "Performance Over Time",
            left: "center",
            textStyle: {
                fontSize: 16,
                fontWeight: "bold",
                color: "#4f46e5"
            },
        },
        tooltip: {
            trigger: "axis",
            backgroundColor: "white",
            borderColor: "#818cf8",
            borderWidth: 1,
            textStyle: { color: "#333" },
            formatter: function (params: any) {
                if (params.length > 0) {
                    const data = params[0].data;
                    return `
                        <div style="padding: 8px; border-radius: 6px;">
                            <b>Click to see more details</b> <br/>
                            📅 <b>Date:</b> ${data.date}<br/>
                            🎯 <b>Accuracy:</b> ${data.accuracy.toFixed(2)}%<br/>
                            ⏳ <b>Duration:</b> ${data.duration}
                        </div>
                    `;
                }
                return "";
            },
        },
        xAxis: {
            type: "category",
            data: chartData.map((d) => d.date),
            axisLabel: { fontSize: 12, color: "#64748b" },
            name: "Game Date",
            nameLocation: "middle",
            nameTextStyle: { fontSize: 14, padding: 0, color: "#64748b" },
            nameGap: 30,
            axisLine: {
                lineStyle: {
                    color: "#e2e8f0"
                }
            },
            axisTick: {
                lineStyle: {
                    color: "#e2e8f0"
                }
            }
        },
        yAxis: {
            type: "value",
            min: 0,
            max: 100,
            axisLabel: { fontSize: 12, color: "#64748b" },
            name: "Score (%)",
            nameLocation: "middle",
            nameTextStyle: { fontSize: 14, padding: 10, color: "#64748b" },
            nameGap: 50,
            axisLine: {
                lineStyle: {
                    color: "#e2e8f0"
                }
            },
            axisTick: {
                lineStyle: {
                    color: "#e2e8f0"
                }
            },
            splitLine: {
                lineStyle: {
                    color: "#f1f5f9"
                }
            }
        },
        series: [
            {
                name: "Score",
                type: "line",
                data: chartData.map((d) => ({
                    value: d.score,
                    date: d.date,
                    accuracy: d.accuracy,
                    duration: d.duration,
                    gameSessionFrn: d.gameSessionFrn,
                })),
                encode: { x: "date", y: "value" },
                symbolSize: 10,
                symbol: "circle",
                itemStyle: {
                    color: "#818cf8",
                    borderColor: "white",
                    borderWidth: 2,
                },
                lineStyle: {
                    width: 3,
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 1,
                        y2: 0,
                        colorStops: [
                            { offset: 0, color: '#60a5fa' },
                            { offset: 1, color: '#818cf8' }
                        ]
                    }
                },
                areaStyle: {
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [
                            { offset: 0, color: 'rgba(129, 140, 248, 0.3)' },
                            { offset: 1, color: 'rgba(129, 140, 248, 0.05)' }
                        ]
                    }
                }
            },
        ],
        grid: {
            left: "10%",
            right: "10%",
            bottom: "15%",
            top: "15%",
            containLabel: true,
        },
    };

    return (
        <div className="bg-white rounded-xl shadow-md w-full">
            {/* Top gradient line */}
            <div className="h-1 w-full bg-gradient-to-r from-blue-400 to-indigo-400 rounded-t-xl"></div>

            <div className="p-6">
                <h2 className="text-xl font-bold text-blue-600 flex items-center gap-2 mb-1">
                    <AiOutlineLineChart size={22} className="text-indigo-500" /> Statistics
                </h2>
                <p className="text-gray-500 mb-4 text-sm">Analyze your progress and performance over time.</p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                    {/* Total Games Card */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-3 rounded-lg shadow-sm">
                        <div className="flex items-center justify-between mb-1">
                            <p className="text-gray-600 font-medium text-sm">Total Games</p>
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full flex items-center justify-center shadow-sm">
                                <FaTrophy className="text-white text-xs" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500">
                            {totalGames}
                        </p>
                    </div>

                    {/* Average Accuracy Card */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-3 rounded-lg shadow-sm">
                        <div className="flex items-center justify-between mb-1">
                            <p className="text-gray-600 font-medium text-sm">Avg. Accuracy</p>
                            <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-teal-400 rounded-full flex items-center justify-center shadow-sm">
                                <FaChartLine className="text-white text-xs" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-teal-500">
                            {avgAccuracy.toFixed(2)}%
                        </p>
                    </div>

                    {/* First Game Card */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-3 rounded-lg shadow-sm">
                        <div className="flex items-center justify-between mb-1">
                            <p className="text-gray-600 font-medium text-sm">First Game</p>
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full flex items-center justify-center shadow-sm">
                                <FaCalendarAlt className="text-white text-xs" />
                            </div>
                        </div>
                        <p className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500">
                            {firstGame}
                        </p>
                    </div>

                    {/* Last Game Card */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-3 rounded-lg shadow-sm">
                        <div className="flex items-center justify-between mb-1">
                            <p className="text-gray-600 font-medium text-sm">Last Game</p>
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full flex items-center justify-center shadow-sm">
                                <FaRegClock className="text-white text-xs" />
                            </div>
                        </div>
                        <p className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500">
                            {lastGame}
                        </p>
                    </div>
                </div>

                <div className="bg-white border border-gray-100 rounded-lg shadow-sm p-4">
                    <ReactECharts
                        option={chartOptions}
                        style={{ width: "100%", height: "300px" }}
                        onEvents={{
                            click: (params) => {
                                if (params.data?.gameSessionFrn) {
                                    navigate(`/decks/${deckId}/gameSession/${params.data.gameSessionFrn}`);
                                }
                            },
                        }}
                    />
                </div>

                <div className="flex justify-center mt-4">
                    <p className="text-sm text-gray-500 italic">Click on any data point to view detailed results</p>
                </div>
            </div>
        </div>
    );
};

export default StatisticsTab;