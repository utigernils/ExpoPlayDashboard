import React, { useEffect, useState } from "react";
import { useTranslation } from "../hooks/useTranslation";
import Layout from "../components/Layout/Layout";
import Header from "../components/Layout/Header";
import DataTable from "../components/Common/DataTable";
import ConfirmDialog from "../components/Common/ConfirmDialog";
import {
  PlayedQuiz,
  index,
  destroy,
} from "../services/api/modelConnectors/PlayedQuizzes";
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
      const data = await index();
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
      await destroy(deletingPlayedQuiz.id);
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
      key: "player_name" as keyof PlayedQuiz,
      label: t("playerName"),
      sortable: true,
    },
    {
      key: "quiz_name" as keyof PlayedQuiz,
      label: t("quizName"),
      sortable: true,
    },
    {
      key: "expo_name" as keyof PlayedQuiz,
      label: t("expoName"),
      sortable: true,
    },
    {
      key: "time" as keyof PlayedQuiz,
      label: t("duration"),
      sortable: true,
      render: (value: any) => {
        if (value == null) return t("notDone");
        const totalSeconds = Number(value);
        if (Number.isNaN(totalSeconds)) return t("notDone");
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = Math.floor(totalSeconds % 60);
        const pad = (n: number) => String(n).padStart(2, 0);
        return `${pad(minutes)}m ${pad(seconds)}s`;
      },
    },
    {
      key: "points" as keyof PlayedQuiz,
      label: t("points"),
      sortable: true,
    },
    {
      key: "quiz_max_points" as keyof PlayedQuiz,
      label: t("pointsPossible"),
      sortable: true,
    },
    {
      key: "points_rate" as keyof PlayedQuiz,
      label: t("grading"),
      sortable: true,
      render: (_: any, row: PlayedQuiz) => {
        const percentage = row.points_rate;
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
