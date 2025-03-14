import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getGameSessions } from "../api/gameSession.ts";
import { GameSessionResult } from "../interfaces/GameSession.ts";
import { motion } from "framer-motion";
import { AiOutlineLineChart } from "react-icons/ai";
import ReactECharts from "echarts-for-react";
import { EChartsOption } from "echarts";

const StatisticsTab = () => {
    const { deckId } = useParams<{ deckId: string }>();
    const navigate = useNavigate();

    const [gameSessions, setGameSessions] = useState<GameSessionResult[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchGameSessions = async () => {
            if (!deckId) return;
            try {
                const sessions = await getGameSessions(deckId);
                setGameSessions(sessions);
            } catch (err) {
                setError("Failed to fetch game statistics.");
            } finally {
                setLoading(false);
            }
        };

        fetchGameSessions();
    }, [deckId]);

    if (loading) return <p className="text-center mt-6">Loading statistics...</p>;
    if (error) return <p className="text-center mt-6 text-red-500">{error}</p>;
    if (gameSessions.length === 0) return <p className="text-center text-gray-500">No game sessions available.</p>;

    const chartData = gameSessions.map(session => ({
        date: new Date(session.startTime).toLocaleDateString(),
        score: session.score,
        accuracy: session.accuracy,
        duration: session.duration,
        gameSessionFrn: session.gameSessionFrn,
    }));

    const totalGames = gameSessions.length;
    const avgAccuracy = chartData.reduce((acc, s) => acc + s.accuracy, 0) / totalGames;
    const firstGame = chartData[0]?.date || "N/A";
    const lastGame = chartData[chartData.length - 1]?.date || "N/A";

    const chartOptions: EChartsOption = {
        title: {
            text: "Performance Over Time",
            left: "center",
            textStyle: { fontSize: 16, fontWeight: "bold" },
        },
        tooltip: {
            trigger: "axis",
            backgroundColor: "white",
            borderColor: "#2563EB",
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
            axisLabel: { fontSize: 12},
            name: "Game Date",
            nameLocation: "middle",
            nameTextStyle: { fontSize: 14, padding: 0 },
            nameGap: 30,
        },
        yAxis: {
            type: "value",
            min: 0,
            max: 100,
            axisLabel: { fontSize: 12 },
            name: "Score (%)",
            nameLocation: "middle",
            nameTextStyle: { fontSize: 14, padding: 10 },
            nameGap: 50,
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
                symbolSize: 13,
                symbol: "circle",
                itemStyle: {
                    color: "#2563EB",
                    borderColor: "white",
                    borderWidth: 2,
                },
                lineStyle: {
                    width: 3,
                },
            },
        ],
        grid: {
            left: "10%",
            right: "10%",
            bottom: "10%",
            containLabel: true,
        },
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 bg-gray-100 rounded-lg shadow w-full">
            <h2 className="text-xl font-semibold flex items-center gap-2">
                <AiOutlineLineChart size={22} /> Statistics
            </h2>
            <p className="text-gray-500 mt-2">Analyze your progress and performance over time.</p>

            {/* 🔹 Podsumowanie statystyk */}
            <div className="grid grid-cols-4 gap-4 mt-4 text-center">
                <div className="bg-white p-4 shadow-md rounded-lg">
                    <p className="text-gray-500">Total Games</p>
                    <p className="text-xl font-bold">{totalGames}</p>
                </div>
                <div className="bg-white p-4 shadow-md rounded-lg">
                    <p className="text-gray-500">Average Accuracy</p>
                    <p className="text-xl font-bold">{avgAccuracy.toFixed(2)}%</p>
                </div>
                <div className="bg-white p-4 shadow-md rounded-lg">
                    <p className="text-gray-500">First Game</p>
                    <p className="text-xl font-bold">{firstGame}</p>
                </div>
                <div className="bg-white p-4 shadow-md rounded-lg">
                    <p className="text-gray-500">Last Game</p>
                    <p className="text-xl font-bold">{lastGame}</p>
                </div>
            </div>

            {/* 🔹 Wykres interaktywny */}
            <div className="bg-white p-6 rounded-lg shadow-md mt-6">
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
        </motion.div>
    );
};

export default StatisticsTab;
