import React, { useEffect, useState } from "react";
import { useTranslation } from "../hooks/useTranslation";
import Layout from "../components/Layout/Layout";
import Header from "../components/Layout/Header";
import DataTable from "../components/Common/DataTable";
import Modal from "../components/Common/Modal";
import ConfirmDialog from "../components/Common/ConfirmDialog";
import { Expo } from "../types";
import { expoApi } from "../services/api";
import { CheckCircle, XCircle } from "lucide-react";
import { useNotification } from "../context/NotificationContext";

const Expos: React.FC = () => {
  const { notify } = useNotification();
  const { t } = useTranslation();
  const [expos, setExpos] = useState<Expo[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingExpo, setEditingExpo] = useState<Expo | null>(null);
  const [deletingExpo, setDeletingExpo] = useState<Expo | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    startsOn: "",
    endsOn: "",
    location: "",
    isActive: false,
    welcomeTitle: "",
    welcomeSubtitle: "",
  });
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchExpos = async () => {
    try {
      const data = await expoApi.getAll();
      setExpos(data);
    } catch (error) {
      console.error("Error fetching expos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpos();
  }, []);

  const handleAdd = () => {
    setEditingExpo(null);
    setFormData({
      name: "",
      startsOn: "",
      endsOn: "",
      location: "",
      isActive: false,
      welcomeTitle: "",
      welcomeSubtitle: "",
    });
    setIsModalOpen(true);
  };

  const handleEdit = (expo: Expo) => {
    setEditingExpo(expo);
    setFormData({
      name: expo.name,
      startsOn: expo.startsOn.split("T")[0],
      endsOn: expo.endsOn.split("T")[0],
      location: expo.location,
      isActive: expo.isActive,
      welcomeTitle: expo.welcomeTitle,
      welcomeSubtitle: expo.welcomeSubtitle,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (expo: Expo) => {
    setDeletingExpo(expo);
    setIsDeleteDialogOpen(true);
  };

  const handleError = (_err: any) => {
    notify({
      title: t("error"),
      description: t("errorOccurred"),
      state: "error",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      const submitData = {
        ...formData,
        startsOn: formData.startsOn + " 00:00:00",
        endsOn: formData.endsOn + " 23:59:59",
      };

      if (editingExpo) {
        await expoApi.update(editingExpo.id, submitData);
      } else {
        await expoApi.create(submitData);
      }
      setIsModalOpen(false);
      fetchExpos();
    } catch (error) {
      console.error("Error saving expo:", error);
      handleError(error);
    } finally {
      setFormLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deletingExpo) return;

    setDeleteLoading(true);
    try {
      await expoApi.delete(deletingExpo.id);
      setIsDeleteDialogOpen(false);
      setDeletingExpo(null);
      fetchExpos();
    } catch (error) {
      console.error("Error deleting expo:", error);
      handleError(error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const columns = [
    { key: "name" as keyof Expo, label: t("name"), sortable: true },
    {
      key: "startsOn" as keyof Expo,
      label: t("startsOn"),
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
    {
      key: "endsOn" as keyof Expo,
      label: t("endsOn"),
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
    { key: "location" as keyof Expo, label: t("location"), sortable: true },
    {
      key: "isActive" as keyof Expo,
      label: t("active"),
      sortable: true,
      render: (value: boolean) => (
        <div className="flex items-center">
          {value ? (
            <CheckCircle className="h-5 w-5 text-suva-positive" />
          ) : (
            <XCircle className="h-5 w-5 text-red-500" />
          )}
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <Header title={t("expos")} description={t("manageExpos")} />

      <div className="p-6">
        <DataTable
          data={expos}
          columns={columns}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
          searchPlaceholder={t("searchExpos")}
          addButtonText={t("addExpo")}
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingExpo ? t("editExpo") : t("addNewExpo")}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              {t("name")}
            </label>
            <input
              type="text"
              id="name"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="mt-1 block w-full  -md border-gray-300 shadow-lg focus:border-blue-500 focus:ring-blue-500 sm:text-sm border px-3 py-2"
              placeholder={t("enterExpoName")}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="startsOn"
                className="block text-sm font-medium text-gray-700"
              >
                {t("startDate")}
              </label>
              <input
                type="date"
                id="startsOn"
                required
                value={formData.startsOn}
                onChange={(e) =>
                  setFormData({ ...formData, startsOn: e.target.value })
                }
                className="mt-1 block w-full  -md border-gray-300 shadow-lg focus:border-blue-500 focus:ring-blue-500 sm:text-sm border px-3 py-2"
              />
            </div>

            <div>
              <label
                htmlFor="endsOn"
                className="block text-sm font-medium text-gray-700"
              >
                {t("endDate")}
              </label>
              <input
                type="date"
                id="endsOn"
                required
                value={formData.endsOn}
                onChange={(e) =>
                  setFormData({ ...formData, endsOn: e.target.value })
                }
                className="mt-1 block w-full  -md border-gray-300 shadow-lg focus:border-blue-500 focus:ring-blue-500 sm:text-sm border px-3 py-2"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-700"
            >
              {t("location")}
            </label>
            <input
              type="text"
              id="location"
              required
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              className="mt-1 block w-full  -md border-gray-300 shadow-lg focus:border-blue-500 focus:ring-blue-500 sm:text-sm border px-3 py-2"
              placeholder={t("enterExpoLocation")}
            />
          </div>

          <div>
            <label
              htmlFor="welcomeTitle"
              className="block text-sm font-medium text-gray-700"
            >
              {t("welcomeTitle")}
            </label>
            <input
              type="text"
              id="welcomeTitle"
              value={formData.welcomeTitle}
              onChange={(e) =>
                setFormData({ ...formData, welcomeTitle: e.target.value })
              }
              className="mt-1 block w-full  -md border-gray-300 shadow-lg focus:border-blue-500 focus:ring-blue-500 sm:text-sm border px-3 py-2"
              placeholder={t("enterWelcomeTitle")}
            />
          </div>

          <div>
            <label
              htmlFor="welcomeSubtitle"
              className="block text-sm font-medium text-gray-700"
            >
              {t("welcomeSubtitle")}
            </label>
            <textarea
              id="welcomeSubtitle"
              rows={3}
              value={formData.welcomeSubtitle}
              onChange={(e) =>
                setFormData({ ...formData, welcomeSubtitle: e.target.value })
              }
              className="mt-1 block w-full  -md border-gray-300 shadow-lg focus:border-blue-500 focus:ring-blue-500 sm:text-sm border px-3 py-2"
              placeholder={t("enterWelcomeSubtitle")}
            />
          </div>

          <div className="flex items-center">
            <input
              id="isActive"
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) =>
                setFormData({ ...formData, isActive: e.target.checked })
              }
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300  "
            />
            <label
              htmlFor="isActive"
              className="ml-2 block text-sm text-gray-900"
            >
              {t("expoIsActive")}
            </label>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="rounded-full px-4 py-2 border-2 border-suva-blue-100  -md shadow-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={formLoading}
            >
              {t("cancel")}
            </button>
            <button
              type="submit"
              disabled={formLoading}
              className="rounded-full px-4 py-2 border border-transparent  -md shadow-lg text-sm font-medium text-white bg-suva-blue-100 hover:bg-suva-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {formLoading
                ? t("saving")
                : editingExpo
                  ? t("update")
                  : t("create")}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title={t("deleteExpo")}
        message={`${t("deleteExpoMessage")} "${deletingExpo?.name}"? ${t("actionCannotBeUndone")}`}
        loading={deleteLoading}
      />
    </Layout>
  );
};

export default Expos;
