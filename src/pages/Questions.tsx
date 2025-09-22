import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import Header from "../components/Layout/Header";
import DataTable from "../components/Common/DataTable";
import Modal from "../components/Common/Modal";
import ConfirmDialog from "../components/Common/ConfirmDialog";
import { Question, Quiz } from "../types";
import { questionApi, quizApi } from "../services/api";
import { useNotification } from "../context/NotificationContext";

const Questions: React.FC = () => {
  const { notify } = useNotification();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [deletingQuestion, setDeletingQuestion] = useState<Question | null>(
    null,
  );
  const [formData, setFormData] = useState({
    Question: "",
    questionType: "",
    answerPossibilities: null as any,
    pointMultiplier: 1,
  });
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchQuizzes = async () => {
    try {
      const data = await quizApi.getAll();
      setQuizzes(data);
      if (data.length > 0 && !selectedQuizId) {
        setSelectedQuizId(data[0].id);
      }
    } catch (error) {
      console.error("Error fetching quizzes:", error);
    }
  };

  const fetchQuestions = async () => {
    if (!selectedQuizId) return;

    setLoading(true);
    try {
      const data = await questionApi.getAll(selectedQuizId);
      setQuestions(data);
    } catch (error) {
      console.error("Error fetching questions:", error);
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  useEffect(() => {
    if (selectedQuizId) {
      fetchQuestions();
    }
  }, [selectedQuizId]);

  const handleAdd = () => {
    if (!selectedQuizId) return;
    setEditingQuestion(null);
    setFormData({
      question: "",
      questionType: "",
      answerPossibilities: null,
      pointMultiplier: 1,
    });
    setIsModalOpen(true);
  };

  const handleEdit = (question: Question) => {
    setEditingQuestion(question);
    setFormData({
      question: question.question,
      questionType: question.questionType,
      answerPossibilities: question.answerPossibilities || null,
      pointMultiplier: question.pointMultiplier || 1,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (question: Question) => {
    setDeletingQuestion(question);
    setIsDeleteDialogOpen(true);
  };

  const handleError = (_err: any) => {
    notify({
      title: "Fehler",
      description: "Ein Fehler ist aufgetreten.",
      state: "error",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQuizId) return;

    setFormLoading(true);

    try {
      if (editingQuestion) {
        await questionApi.update(selectedQuizId, editingQuestion.id, formData);
      } else {
        await questionApi.create(selectedQuizId, formData);
      }
      setIsModalOpen(false);
      fetchQuestions();
    } catch (error) {
      console.error("Error saving question:", error);
      handleError(error);
    } finally {
      setFormLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deletingQuestion || !selectedQuizId) return;

    setDeleteLoading(true);
    try {
      await questionApi.delete(selectedQuizId, deletingQuestion.id);
      setIsDeleteDialogOpen(false);
      setDeletingQuestion(null);
      fetchQuestions();
    } catch (error) {
      console.error("Error deleting question:", error);
      handleError(error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const columns = [
    { key: "question" as keyof Question, label: "Question", sortable: true },
    { key: "questionType" as keyof Question, label: "Type", sortable: true },
    { key: "quizId" as keyof Question, label: "Quiz ID", sortable: true },
  ];

  const selectedQuiz = quizzes.find((quiz) => quiz.id === selectedQuizId);

  return (
    <Layout>
      <Header
        title="Questions"
        description={
          selectedQuiz
            ? `Managing questions for "${selectedQuiz.name}"`
            : "Select a quiz to manage questions"
        }
      >
        {quizzes.length > 0 && (
          <select
            value={selectedQuizId || ""}
            onChange={(e) => setSelectedQuizId(String(e.target.value))}
            className="   border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          >
            <option value="">Select a Quiz</option>
            {quizzes.map((quiz) => (
              <option key={quiz.id} value={quiz.id}>
                {quiz.name}
              </option>
            ))}
          </select>
        )}
      </Header>

      <div className="p-6">
        {!selectedQuizId ? (
          <div className="bg-white    shadow-lg border border-gray-200 p-12 text-center">
            <p className="text-gray-500">
              {quizzes.length === 0
                ? "No quizzes available. Please create a quiz first."
                : "Please select a quiz to view and manage its questions."}
            </p>
            {quizzes.length === 0 && (
              <button
                onClick={() => navigate("/quizzes")}
                className="rounded-full mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium    shadow-lg text-white bg-suva-blue-100 hover:bg-suva-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Create Quiz
              </button>
            )}
          </div>
        ) : (
          <DataTable
            data={questions}
            columns={columns}
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={handleDelete}
            loading={loading}
            searchPlaceholder="Search questions..."
            addButtonText="Add Question"
          />
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingQuestion ? "Edit Question" : "Add New Question"}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="Question"
              className="block text-sm font-medium text-gray-700"
            >
              Question
            </label>
            <textarea
              id="Question"
              required
              rows={3}
              value={formData.Question}
              onChange={(e) =>
                setFormData({ ...formData, Question: e.target.value })
              }
              className="mt-1 block w-full  -md border-gray-300 shadow-lg focus:border-blue-500 focus:ring-blue-500 sm:text-sm border px-3 py-2"
              placeholder="Enter the question"
            />
          </div>

          <div>
            <label
              htmlFor="questionType"
              className="block text-sm font-medium text-gray-700"
            >
              Question Type
            </label>
            <select
              id="questionType"
              required
              value={formData.questionType}
              onChange={(e) =>
                setFormData({ ...formData, questionType: e.target.value })
              }
              className="mt-1 block w-full  -md border-gray-300 shadow-lg focus:border-blue-500 focus:ring-blue-500 sm:text-sm border px-3 py-2"
            >
              <option value="">Select question type</option>
              <option value="multiple_choice">Multiple Choice</option>
              <option value="true_false">True/False</option>
              <option value="text">Text</option>
              <option value="number">Number</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="pointMultiplier"
              className="block text-sm font-medium text-gray-700"
            >
              Points
            </label>
            <input
              type="number"
              id="pointMultiplier"
              min="1"
              step="1"
              value={formData.pointMultiplier}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  pointMultiplier: parseInt(e.target.value) || 1,
                })
              }
              className="mt-1 block w-full  -md border-gray-300 shadow-lg focus:border-blue-500 focus:ring-blue-500 sm:text-sm border px-3 py-2"
              placeholder="Enter point multiplier"
            />
          </div>

          <div>
            <label
              htmlFor="answerPossibilities"
              className="block text-sm font-medium text-gray-700"
            >
              Answer Possibilities (JSON)
            </label>
            <textarea
              id="answerPossibilities"
              rows={6}
              value={
                formData.answerPossibilities
                  ? JSON.stringify(formData.answerPossibilities, null, 2)
                  : ""
              }
              onChange={(e) => {
                try {
                  const parsed = e.target.value
                    ? JSON.parse(e.target.value)
                    : null;
                  setFormData({ ...formData, answerPossibilities: parsed });
                } catch {}
              }}
              className="mt-1 block w-full  -md border-gray-300 shadow-lg focus:border-blue-500 focus:ring-blue-500 sm:text-sm border px-3 py-2 font-mono text-xs"
              placeholder="Enter answer possibilities as JSON"
            />
            <p className="mt-1 text-xs text-gray-500">
              Enter a valid JSON object for answer possibilities
            </p>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="rounded-full px-4 py-2 border-2 border-suva-blue-100  -md shadow-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={formLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={formLoading}
              className="rounded-full px-4 py-2 border border-transparent  -md shadow-lg text-sm font-medium text-white bg-suva-blue-100 hover:bg-suva-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {formLoading
                ? "Saving..."
                : editingQuestion
                  ? "Update"
                  : "Create"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Question"
        message={`Are you sure you want to delete this question? This action cannot be undone.`}
        loading={deleteLoading}
      />
    </Layout>
  );
};

export default Questions;
