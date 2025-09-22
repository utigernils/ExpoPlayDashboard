import React, { useEffect, useState } from "react";
import { useTranslation } from "../hooks/useTranslation";
import Layout from "../components/Layout/Layout";
import Header from "../components/Layout/Header";
import {
  Monitor,
  Calendar,
  Users,
  FileText,
  GamepadIcon,
  User,
} from "lucide-react";
import {
  consoleApi,
  expoApi,
  playerApi,
  quizApi,
  userApi,
  playedQuizApi,
} from "../services/api";
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
import { PlayedQuiz } from "../types";

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
      name: t("users"),
      value: 0,
      icon: User,
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
  const [recentQuizzes, setRecentQuizzes] = useState<PlayedQuiz[]>([]);

  const getLastWeekData = (playedQuizzes: PlayedQuiz[]) => {
    const today = new Date();
    const lastWeek = Array.from({ length: 7 }, (_, i) => {
      return startOfDay(subDays(today, 6 - i));
    });

    const data = lastWeek.map((date) => {
      const count = playedQuizzes.filter((quiz) => {
        const quizDate = new Date(quiz.startedOn);
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
        const [consoles, expos, players, quizzes, users, playedQuizzes] =
          await Promise.all([
            consoleApi.getAll().catch(() => []),
            expoApi.getAll().catch(() => []),
            playerApi.getAll().catch(() => []),
            quizApi.getAll().catch(() => []),
            userApi.getAll().catch(() => []),
            playedQuizApi.getAll().catch(() => []),
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
            name: "users",
            value: users.length,
            icon: User,
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

        setChartData(getLastWeekData(playedQuizzes));

        const sortedQuizzes = [...playedQuizzes]
          .sort(
            (a, b) =>
              new Date(b.startedOn).getTime() - new Date(a.startedOn).getTime(),
          )
          .slice(0, 4);
        setRecentQuizzes(sortedQuizzes);
      } catch (error) {
        console.error("Error fetching stats:", error);
        handleError();
      }
    };

    fetchStats();
  }, []);

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
          {/* Chart Section */}
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

          {/* Recent Activity Section */}
          <div className="bg-white shadow-lg   ">
            <div className="px-6 py-4 ">
              <h3 className="text-lg font-medium text-gray-900">
                {t("recentPlayedQuizzes")}
              </h3>
            </div>
            <div className="px-6 py-4 border-t border-suva-gray-25">
              {recentQuizzes.length > 0 ? (
                <div className="space-y-3">
                  {recentQuizzes.map((quiz) => (
                    <div
                      key={quiz.id}
                      className="flex items-center justify-between py-2"
                    >
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">
                          {quiz.quizName}
                        </div>
                        <div className="text-xs text-gray-500">
                          {quiz.expoName} • {t("player")}: {quiz.player}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-500">
                          {format(new Date(quiz.startedOn), "MMM dd, HH:mm")}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">
                  {t("noRecentQuizActivity")}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
