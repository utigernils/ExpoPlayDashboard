import React, { useEffect, useState } from "react";
import { useTranslation } from "../hooks/useTranslation";
import Layout from "../components/Layout/Layout";
import Header from "../components/Layout/Header";
import DataTable from "../components/Common/DataTable";
import {
  Monitor,
  Calendar,
  Users,
  FileText,
  GamepadIcon,
  Percent,
} from "lucide-react";
import * as ConsoleConnector from "../services/api/modelConnectors/Consoles";
import * as ExpoConnector from "../services/api/modelConnectors/Expos";
import * as PlayerConnector from "../services/api/modelConnectors/Players";
import * as QuizConnector from "../services/api/modelConnectors/Quizzes";
import * as PlayedQuizConnector from "../services/api/modelConnectors/PlayedQuizzes";
import { useNotification } from "../context/NotificationContext";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { subDays, format, startOfDay, isSameDay } from "date-fns";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

// Local type for PlayedQuiz based on model connector
type PlayedQuizData = {
  id: string;
  player_id: number;
  quiz_id: number;
  expo_id: number;
  points: number;
  quiz_max_points: number;
  quiz_name: string;
  expo_name: string;
  created_at: Date;
  updated_at: Date;
  time: number;
  points_rate: number;
};

interface StatsCard {
  name: string;
  value: number;
  icon: React.ComponentType<any>;
  color: string;
  loading?: boolean;
}

const Dashboard: React.FC = () => {
  const { notify } = useNotification();
  const { t } = useTranslation();

  const [stats, setStats] = useState<StatsCard[]>([
    {
      name: t("consoles"),
      value: 0,
      icon: Monitor,
      color: "text-suva-blue-100",
      loading: true,
    },
    {
      name: t("expos"),
      value: 0,
      icon: Calendar,
      color: "text-suva-blue-75",
      loading: true,
    },
    {
      name: t("players"),
      value: 0,
      icon: Users,
      color: "text-suva-blue-50",
      loading: true,
    },
    {
      name: t("quizzes"),
      value: 0,
      icon: FileText,
      color: "text-suva-blue-100",
      loading: true,
    },
    {
      name: t("avgPointRate"),
      value: 0,
      icon: Percent,
      color: "text-suva-blue-75",
      loading: true,
    },
    {
      name: t("playedQuizzes"),
      value: 0,
      icon: GamepadIcon,
      color: "text-suva-blue-50",
      loading: true,
    },
  ]);

  const [chartData, setChartData] = useState<any>(null);
  const [pointRateChartData, setPointRateChartData] = useState<any>(null);
  const [recentQuizzes, setRecentQuizzes] = useState<PlayedQuizData[]>([]);
  const [loading, setLoading] = useState(true);

  const getLastWeekData = (playedQuizzes: PlayedQuizData[]) => {
    const today = new Date();
    const lastWeek = Array.from({ length: 7 }, (_, i) => {
      return startOfDay(subDays(today, 6 - i));
    });

    const data = lastWeek.map((date) => {
      const count = playedQuizzes.filter((quiz) => {
        const quizDate = new Date(quiz.created_at);
        return isSameDay(quizDate, date);
      }).length;

      return {
        date: format(date, "MMM dd"),
        count,
      };
    });

    return {
      labels: data.map((d) => d.date),
      datasets: [
        {
          label: t("playedQuizzes"),
          data: data.map((d) => d.count),
          borderColor: "rgb(99, 102, 241)",
          backgroundColor: "rgba(99, 102, 241, 0.1)",
          tension: 0.3,
        },
      ],
    };
  };

  const getAveragePointRateData = (playedQuizzes: PlayedQuizData[]) => {
    const today = new Date();
    const lastWeek = Array.from({ length: 7 }, (_, i) => {
      return startOfDay(subDays(today, 6 - i));
    });

    const data = lastWeek.map((date) => {
      const quizzesOnDay = playedQuizzes.filter((quiz) => {
        const quizDate = new Date(quiz.created_at);
        return isSameDay(quizDate, date);
      });

      const avgPointRate = quizzesOnDay.length > 0
        ? quizzesOnDay.reduce((acc, quiz) => acc + (quiz.points_rate ?? 0), 0) / quizzesOnDay.length
        : 0;

      return {
        date: format(date, "MMM dd"),
        avgPointRate: Number(avgPointRate.toFixed(2)),
      };
    });

    return {
      labels: data.map((d) => d.date),
      datasets: [
        {
          label: t("avgPointRate"),
          data: data.map((d) => d.avgPointRate),
          borderColor: "rgb(99, 102, 241)",
          backgroundColor: "rgba(99, 102, 241, 0.1)",
          tension: 0.3,
        },
      ],
    };
  };

  const handleError = () => {
    notify({
      title: t("error"),
      description: t("errorOccurred"),
      state: "error",
    });
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [consoles, expos, players, quizzes, playedQuizzes] =
          await Promise.all([
            ConsoleConnector.index().catch(() => []),
            ExpoConnector.index().catch(() => []),
            PlayerConnector.index().catch(() => []),
            QuizConnector.index().catch(() => []),
            PlayedQuizConnector.index().catch(() => []),
          ]);

        setStats([
          {
            name: "consoles",
            value: consoles.length,
            icon: Monitor,
            color: "text-suva-blue-100",
            loading: false,
          },
          {
            name: "expos",
            value: expos.length,
            icon: Calendar,
            color: "text-suva-blue-75",
            loading: false,
          },
          {
            name: "players",
            value: players.length,
            icon: Users,
            color: "text-suva-blue-50",
            loading: false,
          },
          {
            name: "quizzes",
            value: quizzes.length,
            icon: FileText,
            color: "text-suva-blue-100",
            loading: false,
          },
          {
            name: "avgPointRate",
            value: playedQuizzes.length
            ? Number(
                (
                  playedQuizzes.reduce((acc, q) => acc + (q.points_rate ?? 0), 0) /
                  playedQuizzes.length
                ).toFixed(2)
              )
            : 0,
            icon: Percent,
            color: "text-suva-blue-75",
            loading: false,
          },
          {
            name: "playedQuizzes",
            value: playedQuizzes.length,
            icon: GamepadIcon,
            color: "text-suva-blue-50",
            loading: false,
          },
        ]);

        setChartData(getLastWeekData(playedQuizzes as any));
        setPointRateChartData(getAveragePointRateData(playedQuizzes as any));

        const sortedQuizzes = [...playedQuizzes]
          .sort(
            (a, b) =>
              new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
          )
          .slice(0, 4)
          .map((quiz) => ({ ...quiz, id: String(quiz.id) })) as PlayedQuizData[];
        setRecentQuizzes(sortedQuizzes);
      } catch (error) {
        console.error("Error fetching stats:", error);
        handleError();
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const recentQuizzesColumns = [
    {
      key: "quiz_name" as keyof PlayedQuizData,
      label: t("quiz"),
      sortable: true,
    },
    {
      key: "expo_name" as keyof PlayedQuizData,
      label: t("expo"),
      sortable: true,
    },
    {
      key: "player_id" as keyof PlayedQuizData,
      label: t("player"),
      sortable: true,
    },
    {
      key: "points" as keyof PlayedQuizData,
      label: t("points"),
      sortable: true,
    },
    {
      key: "points_rate" as keyof PlayedQuizData,
      label: t("grading"),
      sortable: true,
      render: (value: any) => {
        const percentage = Number(value);
        return (
          <span
            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
              percentage >= 80
                ? "bg-suva-positive text-suva-grey-100"
                : percentage >= 60
                  ? "bg-suva-neutral text-suva-grey-100"
                  : "bg-suva-negative text-suva-grey-25"
            }`}
          >
            {percentage}%
          </span>
        );
      },
    },
    {
      key: "created_at" as keyof PlayedQuizData,
      label: t("date"),
      sortable: true,
      render: (value: any) => format(new Date(value), "MMM dd, HH:mm"),
    },
  ];

  return (
    <Layout>
      <Header title={t("dashboard")} description={t("welcomeToDashboard")} />

      <div className="p-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.name}
              className="bg-white overflow-hidden shadow-lg  hover:shadow-md transition-shadow duration-200"
            >
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className={` p-3`}>
                      <stat.icon className={`h-8 w-8 ${stat.color}`} />
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {t(stat.name)}
                      </dt>
                      <dd className="text-3xl font-semibold text-gray-900">
                        {stat.loading ? (
                          <div className="h-8 bg-gray-200   animate-pulse w-16"></div>
                        ) : (
                          stat.value.toLocaleString()
                        )}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Played Quizzes Chart */}
          <div className="bg-white shadow-lg">
            <div className="px-6 py-4">
              <h3 className="text-lg font-medium text-gray-900">
                {t("playedQuizzes")} - {t("last7Days")}
              </h3>
            </div>
            <div className="px-6 py-4 border-t border-suva-gray-25">
              {chartData ? (
                <div className="h-64">
                  <Line
                    data={{
                      ...chartData,
                      datasets: chartData.datasets.map((dataset: any) => ({
                        ...dataset,
                        borderColor: "#00B8CF",
                        backgroundColor: "rgba(0, 184, 207, 0.1)",
                      })),
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          display: false,
                        },
                        title: {
                          display: false,
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: {
                            stepSize: 1,
                          },
                        },
                      },
                    }}
                  />
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center">
                  <div className="animate-pulse text-gray-500">
                    {t("loadingChart")}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Average Point Rate Chart */}
          <div className="bg-white shadow-lg">
            <div className="px-6 py-4">
              <h3 className="text-lg font-medium text-gray-900">
                {t("avgPointRate")} - {t("last7Days")}
              </h3>
            </div>
            <div className="px-6 py-4 border-t border-suva-gray-25">
              {pointRateChartData ? (
                <div className="h-64">
                  <Line
                    data={{
                      ...pointRateChartData,
                      datasets: pointRateChartData.datasets.map((dataset: any) => ({
                        ...dataset,
                        borderColor: "#00B8CF",
                        backgroundColor: "rgba(0, 184, 207, 0.1)",
                      })),
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          display: false,
                        },
                        title: {
                          display: false,
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          max: 100,
                          ticks: {
                            callback: function(value) {
                              return value + '%';
                            }
                          },
                        },
                      },
                    }}
                  />
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center">
                  <div className="animate-pulse text-gray-500">
                    {t("loadingChart")}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Activity Section - Full Width */}
        <div className="mt-6">
          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              {t("recentPlayedQuizzes")}
            </h3>
          </div>
          <DataTable
            data={recentQuizzes}
            columns={recentQuizzesColumns}
            loading={loading}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
