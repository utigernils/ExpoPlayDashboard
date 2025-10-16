import React, { useEffect, useState } from "react";
import { useTranslation } from "../hooks/useTranslation";
import Layout from "../components/Layout/Layout";
import Header from "../components/Layout/Header";
import DataTable from "../components/Common/DataTable";
import ConfirmDialog from "../components/Common/ConfirmDialog";
import Modal from "../components/Common/Modal";
import { Player } from "../types";
import * as PlayerConnector from "../services/api/modelConnectors/Players";
import { PlayedQuiz } from "../services/api/modelConnectors/PlayedQuizzes";
import { CheckCircle, XCircle, Eye } from "lucide-react";
import { useNotification } from "../context/NotificationContext";

const Players: React.FC = () => {
  const { notify } = useNotification();
  const { t } = useTranslation();
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingPlayer, setDeletingPlayer] = useState<Player | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isPlayedQuizzesModalOpen, setIsPlayedQuizzesModalOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [playedQuizzes, setPlayedQuizzes] = useState<PlayedQuiz[]>([]);
  const [playedQuizzesLoading, setPlayedQuizzesLoading] = useState(false);

  const fetchPlayers = async () => {
    try {
      const data = await PlayerConnector.index();
      // Map the data to match the expected Player type
      const mappedData = data.map((player) => ({
        id: player.id.toString(),
        firstName: player.first_name,
        lastName: player.last_name,
        email: player.email,
        joinLink: player.join_link,
        wantsNewsletter: player.wants_newsletter,
        playedQuizzes: player.played_quizzes,
      }));
      setPlayers(mappedData);
    } catch (error) {
      console.error("Error fetching players:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  const handleDelete = (player: Player) => {
    setDeletingPlayer(player);
    setIsDeleteDialogOpen(true);
  };

  const handleViewPlayedQuizzes = async (player: Player) => {
    setSelectedPlayer(player);
    setIsPlayedQuizzesModalOpen(true);
    setPlayedQuizzesLoading(true);
    
    try {
      const quizzes = await PlayerConnector.getPlayedQuizzes(parseInt(player.id));
      setPlayedQuizzes(quizzes);
    } catch (error) {
      console.error("Error fetching played quizzes:", error);
      handleError(error);
    } finally {
      setPlayedQuizzesLoading(false);
    }
  };

  const handleError = (_err: any) => {
    notify({
      title: t("error"),
      description: t("errorOccurred"),
      state: "error",
    });
  };

  const confirmDelete = async () => {
    if (!deletingPlayer) return;

    setDeleteLoading(true);
    try {
      await PlayerConnector.destroy(parseInt(deletingPlayer.id));
      setIsDeleteDialogOpen(false);
      setDeletingPlayer(null);
      fetchPlayers();
    } catch (error) {
      console.error("Error deleting player:", error);
      handleError(error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const columns = [
    { key: "firstName" as keyof Player, label: t("firstName"), sortable: true },
    { key: "lastName" as keyof Player, label: t("lastName"), sortable: true },
    { key: "email" as keyof Player, label: t("email"), sortable: true },
    {
      key: "wantsNewsletter" as keyof Player,
      label: t("newsletter"),
      sortable: true,
      render: (value: boolean) => (
        <div className="flex items-center">
          {value ? (
            <CheckCircle className="h-5 w-5 text-suva-positive" />
          ) : (
            <XCircle className="h-5 w-5 text-suva-negative" />
          )}
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <Header title={t("players")} description={t("managePlayers")} />

      <div className="p-6">
        <DataTable
          data={players}
          columns={columns}
          onDelete={handleDelete}
          loading={loading}
          searchPlaceholder={t("searchPlayers")}
          addButtonText={t("addPlayer")}
          customActions={(player: Player) => (
        <>
          {(player.playedQuizzes ?? 0) > 0 && (
            <button
          onClick={() => handleViewPlayedQuizzes(player)}
          className="rounded-full text-suva-blue-100 hover:text-suva-interaction-blue transition-colors duration-200"
          title={t("viewPlayedQuizzes")}
            >
          <Eye className="h-4 w-4" />
            </button>
          )}
        </>
          )}
        />
      </div>

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title={t("deletePlayer")}
        message={`${t("deletePlayerMessage")} "${deletingPlayer?.firstName} ${deletingPlayer?.lastName}"? ${t("actionCannotBeUndone")}`}
        loading={deleteLoading}
      />

      <Modal
        isOpen={isPlayedQuizzesModalOpen}
        onClose={() => {
          setIsPlayedQuizzesModalOpen(false);
          setSelectedPlayer(null);
          setPlayedQuizzes([]);
        }}
        title={`${t("playedQuizzes")} - ${selectedPlayer?.firstName} ${selectedPlayer?.lastName}`}
        size="xl"
      >
        {playedQuizzesLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-suva-blue-100"></div>
          </div>
        ) : playedQuizzes.length === 0 ? (
          <div className="text-center py-8 text-suva-grey-75">
            {t("noPlayedQuizzes")}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-suva-grey-25">
              <thead className="bg-suva-bg-grey">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-suva-grey-75 uppercase tracking-wider">
                    {t("quiz")}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-suva-grey-75 uppercase tracking-wider">
                    {t("expo")}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-suva-grey-75 uppercase tracking-wider">
                    {t("points")}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-suva-grey-75 uppercase tracking-wider">
                    {t("time")}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-suva-grey-75 uppercase tracking-wider">
                    {t("date")}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-suva-grey-25">
                {playedQuizzes.map((quiz, index) => (
                  <tr
                    key={quiz.id}
                    className={`hover:bg-suva-bg-grey transition-colors duration-200 ${
                      index % 2 === 0 ? "bg-white" : "bg-suva-grey-25/30"
                    }`}
                  >
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-suva-grey-100">
                      {quiz.quiz_name}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-suva-grey-100">
                      {quiz.expo_name}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-suva-grey-100">
                      {quiz.points} / {quiz.quiz_max_points}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-suva-grey-100">
                      {Math.round(quiz.time)}s
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-suva-grey-100">
                      {new Date(quiz.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Modal>
    </Layout>
  );
};

export default Players;
