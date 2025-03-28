import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getGameSessions } from "../../api/gameSession.ts";
import { GameSessionResult } from "../../interfaces/GameSession.ts";
import { AiOutlineLineChart } from "react-icons/ai";
import { FaTrophy, FaRegClock, FaCalendarAlt, FaCheckCircle, FaChartLine } from "react-icons/fa";
import ReactECharts from "echarts-for-react";
import { EChartsOption } from "echarts";
import Card from "../../components/ui/Card";
import EmptyState from "../../components/ui/EmptyState";
import StatItem from "../../components/ui/StatItem";
import { toast } from "react-toastify";
import { CallbackDataParams } from "echarts/types/dist/shared";

const StatisticsTab = () => {
    const { deckFrn } = useParams<{ deckFrn: string }>();
    const navigate = useNavigate();
    const [gameSessions, setGameSessions] = useState<GameSessionResult[]>([]);
    const chartContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchGameSessions = async () => {
            if (!deckFrn) return;
            const sessions = await getGameSessions(deckFrn);
            setGameSessions(sessions);
        };

        fetchGameSessions();
    }, [deckFrn, toast]);

    if (gameSessions.length === 0) {
        return (
            <Card
                title="Statistics"
                description="Analyze your progress and performance over time."
                icon={<AiOutlineLineChart size={22} />}
                fullHeight={true}
                className="h-full"
            >
                <EmptyState
                    icon={<FaChartLine size={48} />}
                    title="No game sessions available yet."
                    description="Complete some quizzes to see your statistics here."
                />
            </Card>
        );
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const chartData = gameSessions
        .map(session => ({
            date: formatDate(session.startTime),
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
            text: "Accuracy Over Time",
            left: "center",
            top: 3,
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
            formatter: function (params: CallbackDataParams | CallbackDataParams[]) {
                const paramsArray = Array.isArray(params) ? params : [params];

                if (paramsArray.length > 0) {
                    const point = paramsArray[0];
                    const dataPoint = point.data as {
                        date: string;
                        accuracy: number;
                        duration: string;
                    };

                    return `
                        <div style="padding: 8px; border-radius: 6px;">
                            <b>Click to see more details</b> <br/>
                            📅 <b>Date:</b> ${dataPoint.date}<br/>
                            🎯 <b>Accuracy:</b> ${dataPoint.accuracy.toFixed(2)}%<br/>
                            ⏳ <b>Duration:</b> ${dataPoint.duration}
                        </div>
                    `;
                }
                return "";
            },
        },
        xAxis: {
            type: "category",
            data: chartData.map((d) => d.date),
            axisLabel: {
                fontSize: 12,
                color: "#64748b",
                margin: 10
            },
            name: "Game Date",
            nameLocation: "middle",
            nameTextStyle: {
                fontSize: 14,
                padding: [10, 0, 0, 0],
                color: "#64748b"
            },
            nameGap: 22,
            axisLine: { lineStyle: { color: "#e2e8f0" } },
            axisTick: { lineStyle: { color: "#e2e8f0" } }
        },
        yAxis: {
            type: "value",
            min: 0,
            max: 100,
            axisLabel: { fontSize: 12, color: "#64748b" },
            name: "Accuracy (%)",
            nameLocation: "middle",
            nameTextStyle: { fontSize: 14, padding: 5, color: "#64748b" },
            nameGap: 35,
            axisLine: { lineStyle: { color: "#e2e8f0" } },
            axisTick: { lineStyle: { color: "#e2e8f0" } },
            splitLine: { lineStyle: { color: "#f1f5f9" } }
        },
        series: [
            {
                name: "Accuracy",
                type: "line",
                data: chartData.map((d) => ({
                    value: d.accuracy,
                    date: d.date,
                    accuracy: d.accuracy,
                    duration: d.duration,
                    gameSessionFrn: d.gameSessionFrn,
                })),
                encode: { x: "date", y: "value" },
                symbolSize: 12,
                symbol: "circle",
                itemStyle: {
                    color: "#818cf8",
                    borderColor: "white",
                    borderWidth: 2,
                    shadowColor: 'rgba(0, 0, 0, 0.2)',
                    shadowBlur: 5
                },
                emphasis: {
                    itemStyle: {
                        borderWidth: 3,
                        borderColor: "#fff",
                        shadowBlur: 10,
                        shadowColor: 'rgba(0, 0, 0, 0.3)'
                    },
                    scale: true
                },
                lineStyle: {
                    width: 3,
                    color: {
                        type: 'linear',
                        x: 0, y: 0, x2: 1, y2: 0,
                        colorStops: [
                            { offset: 0, color: '#60a5fa' },
                            { offset: 1, color: '#818cf8' }
                        ]
                    }
                },
                areaStyle: {
                    color: {
                        type: 'linear',
                        x: 0, y: 0, x2: 0, y2: 1,
                        colorStops: [
                            { offset: 0, color: 'rgba(129, 140, 248, 0.3)' },
                            { offset: 1, color: 'rgba(129, 140, 248, 0.05)' }
                        ]
                    }
                }
            },
        ],
        grid: {
            left: '5%',
            right: '5%',
            bottom: '20%',
            top: '15%',
            containLabel: true,
        },
    };

    const handleChartClick = (params: {
        data: {
            gameSessionFrn?: string;
            [key: string]: unknown;
        };
    }) => {
        if (params.data && params.data.gameSessionFrn) {
            navigate(`/decks/${deckFrn}/gameSession/${params.data.gameSessionFrn}`);
        }
    };

    return (
        <Card
            title="Statistics"
            description="Analyze your progress and performance over time."
            icon={<AiOutlineLineChart size={22} />}
            scrollable={true}
            fullHeight={true}
        >
            <div className="flex flex-col h-full">
                <div className="grid grid-cols-4 gap-2 mb-4 flex-shrink-0">
                    <StatItem
                        label="Total Games"
                        value={totalGames}
                        icon={<FaTrophy className="text-white text-[10px]" />}
                    />

                    <StatItem
                        label="Accuracy"
                        value={`${avgAccuracy.toFixed(2)}%`}
                        icon={<FaCheckCircle className="text-white text-[10px]" />}
                    />

                    <StatItem
                        label="First Game"
                        value={firstGame}
                        icon={<FaCalendarAlt className="text-white text-[10px]" />}
                        title={firstGame}
                    />

                    <StatItem
                        label="Last Game"
                        value={lastGame}
                        icon={<FaRegClock className="text-white text-[10px]" />}
                        title={lastGame}
                    />
                </div>

                <div
                    ref={chartContainerRef}
                    className="bg-white border border-gray-100 rounded-lg shadow-sm p-3 flex-grow flex flex-col relative"
                    style={{ display: 'flex', height: '100%', minHeight: '200px' }}
                >
                    <ReactECharts
                        option={chartOptions}
                        style={{ height: '100%', width: '100%' }}
                        opts={{ renderer: 'canvas' }}
                        onEvents={{
                            click: handleChartClick
                        }}
                    />
                    <div className="text-center text-gray-400 text-xs mt-2 italic">
                        Tap on any point to see detailed session information
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default StatisticsTab;