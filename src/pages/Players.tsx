import React, { useEffect, useState } from "react";
import { useTranslation } from "../hooks/useTranslation";
import Layout from "../components/Layout/Layout";
import Header from "../components/Layout/Header";
import DataTable from "../components/Common/DataTable";
import ConfirmDialog from "../components/Common/ConfirmDialog";
import { Player } from "../types";
import * as PlayerConnector from "../services/api/modelConnectors/Players";
import { CheckCircle, XCircle } from "lucide-react";
import { useNotification } from "../context/NotificationContext";

const Players: React.FC = () => {
  const { notify } = useNotification();
  const { t } = useTranslation();
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingPlayer, setDeletingPlayer] = useState<Player | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

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
    </Layout>
  );
};

export default Players;
