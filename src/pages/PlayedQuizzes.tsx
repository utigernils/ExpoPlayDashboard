import React, { useEffect, useState } from "react";
import { useTranslation } from "../hooks/useTranslation";
import Layout from "../components/Layout/Layout";
import Header from "../components/Layout/Header";
import DataTable from "../components/Common/DataTable";
import ConfirmDialog from "../components/Common/ConfirmDialog";
import { PlayedQuiz } from "../types";
import { playedQuizApi } from "../services/api";
import { useNotification } from "../context/NotificationContext";

const PlayedQuizzes: React.FC = () => {
  const { notify } = useNotification();
  const { t } = useTranslation();
  const [playedQuizzes, setPlayedQuizzes] = useState<PlayedQuiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingPlayedQuiz, setDeletingPlayedQuiz] =
    useState<PlayedQuiz | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchPlayedQuizzes = async () => {
    try {
      const data = await playedQuizApi.getAll();
      setPlayedQuizzes(data);
    } catch (error) {
      console.error("Error fetching played quizzes:", error);
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayedQuizzes();
  }, []);

  const handleDelete = (playedQuiz: PlayedQuiz) => {
    setDeletingPlayedQuiz(playedQuiz);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingPlayedQuiz) return;

    setDeleteLoading(true);
    try {
      await playedQuizApi.delete(deletingPlayedQuiz.id);
      setIsDeleteDialogOpen(false);
      setDeletingPlayedQuiz(null);
      fetchPlayedQuizzes();
    } catch (error) {
      console.error("Error deleting played quiz:", error);
      handleError(error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleError = (err: any) => {
    notify({
      title: t("error"),
      description: t("errorOccurred"),
      state: "error",
    });
  };

  const columns = [
    {
      key: "playerName" as keyof PlayedQuiz,
      label: t("playerName"),
      sortable: true,
    },
    {
      key: "quizName" as keyof PlayedQuiz,
      label: t("quizName"),
      sortable: true,
    },
    {
      key: "expoName" as keyof PlayedQuiz,
      label: t("expoName"),
      sortable: true,
    },
    {
      key: "startedOn" as keyof PlayedQuiz,
      label: t("started"),
      sortable: true,
      render: (value: string) => new Date(value).toLocaleString(),
    },
    {
      key: "endedOn" as keyof PlayedQuiz,
      label: t("ended"),
      sortable: true,
      render: (value: string) =>
        value ? new Date(value).toLocaleString() : t("notFinished"),
    },
    {
      key: "correctAnswers" as keyof PlayedQuiz,
      label: t("points"),
      sortable: true,
    },
    {
      key: "totalPoints" as keyof PlayedQuiz,
      label: t("pointsPossible"),
      sortable: true,
    },
    {
      key: "scorePercentage" as any,
      label: t("grading"),
      sortable: false,
      render: (_: any, row: PlayedQuiz) => {
        const correct = row.correctAnswers;
        const total = row.totalPoints;
        if (total === 0) return 0 + "%";
        const percentage = Math.round((correct / total) * 100);
        return (
          <div className="flex items-center space-x-2">
            <span
              className={`inline-flex px-2 py-1 text-xs font-semibold  rounded-full ${
                percentage >= 80
                  ? "bg-suva-positive text-suva-grey-100"
                  : percentage >= 60
                    ? "bg-suva-neutral text-suva-grey-100"
                    : "bg-suva-negative text-suva-grey-25"
              }`}
            >
              {percentage}%
            </span>
          </div>
        );
      },
    },
    {
      key: "duration" as any,
      label: t("duration"),
      sortable: false,
      render: (_: any, row: PlayedQuiz) => {
        const startedOn = row.startedOn;
        if (!row.endedOn) return t("inProgress");

        const startTime = new Date(startedOn);
        const endTime = new Date(row.endedOn);
        const durationMs = endTime.getTime() - startTime.getTime();

        const hours = Math.floor(durationMs / (1000 * 60 * 60));
        const minutes = Math.floor(
          (durationMs % (1000 * 60 * 60)) / (1000 * 60),
        );
        const seconds = Math.floor((durationMs % (1000 * 60)) / 1000);

        if (hours > 0) {
          return `${hours}h ${minutes}m ${seconds}s`;
        } else if (minutes > 0) {
          return `${minutes}m ${seconds}s`;
        } else {
          return `${seconds}s`;
        }
      },
    },
  ];

  return (
    <Layout>
      <Header
        title={t("playedQuizzes")}
        description={t("viewQuizCompletionRecords")}
      />

      <div className="p-6">
        <DataTable
          data={playedQuizzes}
          columns={columns}
          onDelete={handleDelete}
          loading={loading}
          searchPlaceholder={t("searchPlayedQuizzes")}
        />
      </div>

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title={t("deletePlayedQuizRecord")}
        message={t("deletePlayedQuizRecordMessage")}
        loading={deleteLoading}
      />
    </Layout>
  );
};

export default PlayedQuizzes;
