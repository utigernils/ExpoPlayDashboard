import React, { useEffect, useState } from "react";
import { useTranslation } from "../hooks/useTranslation";
import Layout from "../components/Layout/Layout";
import Header from "../components/Layout/Header";
import DataTable from "../components/Common/DataTable";
import Modal from "../components/Common/Modal";
import ConfirmDialog from "../components/Common/ConfirmDialog";
import { Console } from "../types";
import * as ConsoleConnector from "../services/api/modelConnectors/Consoles";
import * as ExpoConnector from "../services/api/modelConnectors/Expos";
import * as QuizConnector from "../services/api/modelConnectors/Quizzes";
import { useNotification } from "../context/NotificationContext";

const Consoles: React.FC = () => {
  const { notify } = useNotification();
  const { t } = useTranslation();
  const [consoles, setConsoles] = useState<Console[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingConsole, setEditingConsole] = useState<Console | null>(null);
  const [deletingConsole, setDeletingConsole] = useState<Console | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    currentExpo: "",
    currentQuiz: "",
  });
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [expoOptions, setExpoOptions] = useState<
    { id: string; name: string }[]
  >([]);
  const [quizOptions, setQuizOptions] = useState<
    { id: string; name: string }[]
  >([]);

  const fetchConsoles = async () => {
    try {
      const [consoleData, expoData, quizData] = await Promise.all([
        ConsoleConnector.index(),
        ExpoConnector.index(),
        QuizConnector.index(),
      ]);

      const expoMap = new Map(expoData.map((e) => [e.id, e.name]));
      const quizMap = new Map(quizData.map((q) => [q.id, q.name]));

      const mappedData = consoleData.map((console) => ({
        id: console.id.toString(),
        name: console.name,
        currentExpo: console.current_expo_id?.toString() || "",
        currentQuiz: console.current_quiz_id?.toString() || "",
        expoName: console.current_expo_id
          ? expoMap.get(console.current_expo_id) || ""
          : "",
        quizName: console.current_quiz_id
          ? quizMap.get(console.current_quiz_id) || ""
          : "",
      }));

      setConsoles(mappedData as any);
    } catch (error) {
      console.error("Error fetching consoles:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsoles();
  }, []);

  useEffect(() => {
    if (isModalOpen) {
      ExpoConnector.index().then((data) => {
        setExpoOptions(
          data.map((expo) => ({ id: expo.id.toString(), name: expo.name })),
        );
      });
      QuizConnector.index().then((data) => {
        setQuizOptions(
          data.map((quiz) => ({ id: quiz.id.toString(), name: quiz.name })),
        );
      });
    }
  }, [isModalOpen]);

  const handleAdd = () => {
    setEditingConsole(null);
    setFormData({ name: "", currentExpo: "", currentQuiz: "" });
    setIsModalOpen(true);
  };

  const handleEdit = (console: Console) => {
    setEditingConsole(console);
    setFormData({
      name: console.name,
      currentExpo: console.currentExpo,
      currentQuiz: console.currentQuiz,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (console: Console) => {
    setDeletingConsole(console);
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
        name: formData.name,
        current_expo_id: formData.currentExpo
          ? parseInt(formData.currentExpo)
          : null,
        current_quiz_id: formData.currentQuiz
          ? parseInt(formData.currentQuiz)
          : null,
        is_active: true,
      };

      if (editingConsole) {
        await ConsoleConnector.update(parseInt(editingConsole.id), submitData);
      } else {
        await ConsoleConnector.create(submitData);
      }
      setIsModalOpen(false);
      fetchConsoles();
    } catch (error) {
      console.error("Error saving console:", error);
      handleError(error);
    } finally {
      setFormLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deletingConsole) return;

    setDeleteLoading(true);
    try {
      await ConsoleConnector.destroy(parseInt(deletingConsole.id));
      setIsDeleteDialogOpen(false);
      setDeletingConsole(null);
      fetchConsoles();
    } catch (error) {
      console.error("Error deleting console:", error);
      handleError(error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const columns = [
    { key: "name" as keyof Console, label: t("name"), sortable: true },
    {
      key: "expoName" as keyof Console,
      label: t("currentExpo"),
      sortable: true,
    },
    {
      key: "quizName" as keyof Console,
      label: t("currentQuiz"),
      sortable: true,
    },
  ];

  return (
    <Layout>
      <Header title={t("consoles")} description={t("manageConsoles")} />

      <div className="p-6">
        <DataTable
          data={consoles}
          columns={columns}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
          searchPlaceholder={t("searchConsoles")}
          addButtonText={t("addConsole")}
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingConsole ? t("editConsole") : t("addNewConsole")}
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
              placeholder={t("name")}
            />
          </div>

          <div>
            <label
              htmlFor="currentExpo"
              className="block text-sm font-medium text-gray-700"
            >
              {t("currentExpo")}
            </label>
            <select
              id="currentExpo"
              value={formData.currentExpo}
              onChange={(e) =>
                setFormData({ ...formData, currentExpo: e.target.value })
              }
              className="mt-1 block w-full  -md border-gray-300 shadow-lg focus:border-blue-500 focus:ring-blue-500 sm:text-sm border px-3 py-2"
              required
            >
              <option value="">{t("selectExpo")}</option>
              {expoOptions.map((expo) => (
                <option key={expo.id} value={expo.id}>
                  {expo.name} (ID: {expo.id})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="currentQuiz"
              className="block text-sm font-medium text-gray-700"
            >
              {t("currentQuiz")}
            </label>
            <select
              id="currentQuiz"
              value={formData.currentQuiz}
              onChange={(e) =>
                setFormData({ ...formData, currentQuiz: e.target.value })
              }
              className="mt-1 block w-full  -md border-gray-300 shadow-lg focus:border-blue-500 focus:ring-blue-500 sm:text-sm border px-3 py-2"
              required
            >
              <option value="">{t("selectQuiz")}</option>
              {quizOptions.map((quiz) => (
                <option key={quiz.id} value={quiz.id}>
                  {quiz.name} (ID: {quiz.id})
                </option>
              ))}
            </select>
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
              className="rounded-full px-4 py-2 border border-transparent  -md shadow-lg text-sm font-medium text-white bg-suva-blue-100 hover:bg-suva-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {formLoading
                ? t("saving")
                : editingConsole
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
        title={t("deleteConsole")}
        message={`${t("deleteConsoleMessage")} "${deletingConsole?.name}"? ${t("actionCannotBeUndone")}`}
        loading={deleteLoading}
      />
    </Layout>
  );
};

export default Consoles;
