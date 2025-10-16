import React, { useEffect, useState } from "react";
import { useTranslation } from "../hooks/useTranslation";
import Layout from "../components/Layout/Layout";
import Header from "../components/Layout/Header";
import DataTable from "../components/Common/DataTable";
import Modal from "../components/Common/Modal";
import ConfirmDialog from "../components/Common/ConfirmDialog";
import { Quiz, Question } from "../types";
import * as QuizConnector from "../services/api/modelConnectors/Quizzes";
import * as QuestionConnector from "../services/api/modelConnectors/Questions";
import { useNotification } from "../context/NotificationContext";

const Quizzes: React.FC = () => {
  const { notify } = useNotification();
  const { t } = useTranslation();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  const [deletingQuiz, setDeletingQuiz] = useState<Quiz | null>(null);
  const [formData, setFormData] = useState({
    name: "",
  });
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionsLoading, setQuestionsLoading] = useState(false);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [isQuestionDeleteDialogOpen, setIsQuestionDeleteDialogOpen] =
    useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [deletingQuestion, setDeletingQuestion] = useState<Question | null>(
    null,
  );
  const [questionFormData, setQuestionFormData] = useState({
    question: "",
    questionType: "",
    pointMultiplier: 1,
    answerPossibilities: null as any,
  });
  const [questionFormLoading, setQuestionFormLoading] = useState(false);
  const [questionDeleteLoading, setQuestionDeleteLoading] = useState(false);

  const fetchQuizzes = async () => {
    try {
      const data = await QuizConnector.index();

      const mappedData = data.map((quiz) => ({
        id: quiz.id.toString(),
        name: quiz.name,
        totalPoints: quiz.total_points,
      }));
      setQuizzes(mappedData);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const handleAdd = () => {
    setEditingQuiz(null);
    setFormData({ name: "" });
    setIsModalOpen(true);
  };

  const handleEdit = (quiz: Quiz) => {
    setEditingQuiz(quiz);
    setFormData({ name: quiz.name });
    setIsModalOpen(true);
  };

  const handleDelete = (quiz: Quiz) => {
    setDeletingQuiz(quiz);
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
      if (editingQuiz) {
        await QuizConnector.update(parseInt(editingQuiz.id), formData);
      } else {
        await QuizConnector.create({ ...formData, is_active: true });
      }
      setIsModalOpen(false);
      fetchQuizzes();
    } catch (error) {
      console.error("Error saving quiz:", error);
      handleError(error);
    } finally {
      setFormLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deletingQuiz) return;

    setDeleteLoading(true);
    try {
      await QuizConnector.destroy(parseInt(deletingQuiz.id));
      setIsDeleteDialogOpen(false);
      setDeletingQuiz(null);
      fetchQuizzes();

      if (selectedQuiz && selectedQuiz.id === deletingQuiz.id) {
        setSelectedQuiz(null);
        setQuestions([]);
      }
    } catch (error) {
      console.error("Error deleting quiz:", error);
      handleError(error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const fetchQuestions = async (quizId: string) => {
    setQuestionsLoading(true);
    try {
      const data = await QuestionConnector.index();

      const filteredData = data
        .filter((q) => q.quiz_id === parseInt(quizId))
        .map((q) => ({
          id: q.id.toString(),
          quizId: q.quiz_id.toString(),
          question: q.question,
          questionType: q.question_type.toString(),
          answerPossibilities: q.answer_possibilities,
          pointMultiplier: q.points,
        }));
      setQuestions(filteredData);
    } catch (error) {
      console.error("Error fetching questions:", error);
      setQuestions([]);
    } finally {
      setQuestionsLoading(false);
    }
  };

  const handleQuizSelect = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    fetchQuestions(quiz.id);
  };

  const handleAddQuestion = () => {
    if (!selectedQuiz) return;
    setEditingQuestion(null);
    setQuestionFormData({
      question: "",
      questionType: "",
      pointMultiplier: 1,
      answerPossibilities: null,
    });
    setIsQuestionModalOpen(true);
  };

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question);

    let answerPossibilities = question.answerPossibilities;

    if (typeof answerPossibilities === "string") {
      try {
        answerPossibilities = JSON.parse(answerPossibilities);
      } catch (error) {
        console.error("Error parsing answerPossibilities:", error);
        answerPossibilities = initializeAnswerPossibilities(
          question.questionType.toString(),
        );
      }
    } else if (!answerPossibilities) {
      answerPossibilities = initializeAnswerPossibilities(
        question.questionType.toString(),
      );
    }

    setQuestionFormData({
      question: question.question,
      questionType: question.questionType.toString(),
      pointMultiplier: question.pointMultiplier || 1,
      answerPossibilities: answerPossibilities,
    });
    setIsQuestionModalOpen(true);
  };

  const handleDeleteQuestion = (question: Question) => {
    setDeletingQuestion(question);
    setIsQuestionDeleteDialogOpen(true);
  };

  const handleQuestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQuiz) return;

    setQuestionFormLoading(true);

    try {
      const submitData = {
        quiz_id: parseInt(selectedQuiz.id),
        question: questionFormData.question,
        question_type: parseInt(questionFormData.questionType),
        answer_possibilities: questionFormData.answerPossibilities
          ? JSON.stringify(questionFormData.answerPossibilities)
          : null,
        points: questionFormData.pointMultiplier,
        is_hidden: false,
      };

      if (editingQuestion) {
        await QuestionConnector.update(
          parseInt(editingQuestion.id),
          submitData,
        );
      } else {
        await QuestionConnector.create(submitData);
      }
      setIsQuestionModalOpen(false);
      fetchQuestions(selectedQuiz.id);
      fetchQuizzes();
    } catch (error) {
      console.error("Error saving question:", error);
      handleError(error);
    } finally {
      setQuestionFormLoading(false);
    }
  };

  const confirmQuestionDelete = async () => {
    if (!deletingQuestion || !selectedQuiz) return;

    setQuestionDeleteLoading(true);
    try {
      await QuestionConnector.destroy(parseInt(deletingQuestion.id));
      setIsQuestionDeleteDialogOpen(false);
      setDeletingQuestion(null);
      fetchQuestions(selectedQuiz.id);
      fetchQuizzes();
    } catch (error) {
      console.error("Error deleting question:", error);
      handleError(error);
    } finally {
      setQuestionDeleteLoading(false);
    }
  };

  const initializeAnswerPossibilities = (questionType: string) => {
    switch (questionType) {
      case "0":
        return {
          AnswerOptions: [
            { Text: "", isCorrect: false },
            { Text: "", isCorrect: false },
          ],
        };
      case "1":
        return { Answer: true };
      case "3":
        return {
          AnswerOptions: [
            { img_url: "", isCorrect: false },
            { img_url: "", isCorrect: false },
          ],
        };
      default:
        return null;
    }
  };

  const addAnswerOption = () => {
    if (!questionFormData.answerPossibilities) return;

    const newOption =
      questionFormData.questionType === "3"
        ? { img_url: "", isCorrect: false }
        : { Text: "", isCorrect: false };

    setQuestionFormData({
      ...questionFormData,
      answerPossibilities: {
        ...questionFormData.answerPossibilities,
        AnswerOptions: [
          ...questionFormData.answerPossibilities.AnswerOptions,
          newOption,
        ],
      },
    });
  };

  const removeAnswerOption = (index: number) => {
    if (
      !questionFormData.answerPossibilities ||
      questionFormData.answerPossibilities.AnswerOptions.length <= 2
    )
      return;

    const newOptions =
      questionFormData.answerPossibilities.AnswerOptions.filter(
        (_: any, i: number) => i !== index,
      );
    setQuestionFormData({
      ...questionFormData,
      answerPossibilities: {
        ...questionFormData.answerPossibilities,
        AnswerOptions: newOptions,
      },
    });
  };

  const updateAnswerOption = (index: number, field: string, value: any) => {
    if (!questionFormData.answerPossibilities) return;

    const newOptions = [...questionFormData.answerPossibilities.AnswerOptions];
    newOptions[index] = { ...newOptions[index], [field]: value };

    setQuestionFormData({
      ...questionFormData,
      answerPossibilities: {
        ...questionFormData.answerPossibilities,
        AnswerOptions: newOptions,
      },
    });
  };

  const handleQuestionTypeChange = (newType: string) => {
    setQuestionFormData({
      ...questionFormData,
      questionType: newType,
      answerPossibilities: initializeAnswerPossibilities(newType),
    });
  };

  const getQuestionTypeLabel = (questionType: number | string) => {
    const typeStr = questionType.toString();
    switch (typeStr) {
      case "0":
        return t("multipleChoiceText");
      case "1":
        return t("trueFalse");
      case "3":
        return t("multipleChoiceImages");
      default:
        return typeStr;
    }
  };

  const columns = [
    { key: "name" as keyof Quiz, label: t("name"), sortable: true },
    {
      key: "totalPoints" as keyof Quiz,
      label: t("totalPoints"),
      sortable: true,
    },
  ];

  const questionColumns = [
    { key: "question" as keyof Question, label: t("question"), sortable: true },
    {
      key: "questionType" as keyof Question,
      label: t("type"),
      sortable: true,
      render: (value: any) => getQuestionTypeLabel(value),
    },
    {
      key: "pointMultiplier" as keyof Question,
      label: t("points"),
      sortable: true,
    },
  ];

  return (
    <Layout>
      <Header title={t("quizzes")} description={t("manageQuizzes")} />

      <div className="p-6">
        <DataTable
          data={quizzes}
          columns={columns}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
          searchPlaceholder={t("searchQuizzes")}
          addButtonText={t("addQuiz")}
        />

        {/* Quiz Selection Section */}
        {quizzes.length > 0 && (
          <div className="mt-8 border-t border-gray-200 pt-8">
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {t("manageQuestions")}
              </h3>
              <div className="flex items-center space-x-4">
                <label
                  htmlFor="quiz-select"
                  className="block text-sm font-medium text-gray-700"
                >
                  {t("selectQuizToManageQuestions")}:
                </label>
                <select
                  id="quiz-select"
                  value={selectedQuiz?.id || ""}
                  onChange={(e) => {
                    const quiz = quizzes.find((q) => q.id === e.target.value);
                    if (quiz) {
                      handleQuizSelect(quiz);
                    } else {
                      setSelectedQuiz(null);
                      setQuestions([]);
                    }
                  }}
                  className="   border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                >
                  <option value="">{t("selectAQuiz")}</option>
                  {quizzes.map((quiz) => (
                    <option key={quiz.id} value={quiz.id}>
                      {quiz.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {selectedQuiz && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h4 className="text-md font-medium text-gray-900">
                      {t("questionsFor")} "{selectedQuiz.name}"
                    </h4>
                    <p className="mt-1 text-sm text-gray-600">
                      {t("manageQuestionsForThisQuiz")}
                    </p>
                  </div>
                </div>

                <DataTable
                  data={questions}
                  columns={questionColumns}
                  onAdd={handleAddQuestion}
                  onEdit={handleEditQuestion}
                  onDelete={handleDeleteQuestion}
                  loading={questionsLoading}
                  searchPlaceholder={t("searchQuestions")}
                  addButtonText={t("addQuestion")}
                />
              </div>
            )}
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingQuiz ? t("editQuiz") : t("addNewQuiz")}
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
              placeholder={t("enterQuizName")}
            />
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
                : editingQuiz
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
        title={t("deleteQuiz")}
        message={`${t("deleteQuizMessage")} "${deletingQuiz?.name}"? ${t("actionCannotBeUndone")}`}
        loading={deleteLoading}
      />

      {/* Question Modal */}
      <Modal
        isOpen={isQuestionModalOpen}
        onClose={() => setIsQuestionModalOpen(false)}
        title={editingQuestion ? t("editQuestion") : t("addNewQuestion")}
        size="lg"
      >
        <form onSubmit={handleQuestionSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="question"
              className="block text-sm font-medium text-gray-700"
            >
              {t("question")}
            </label>
            <textarea
              id="question"
              required
              rows={3}
              value={questionFormData.question}
              onChange={(e) =>
                setQuestionFormData({
                  ...questionFormData,
                  question: e.target.value,
                })
              }
              className="mt-1 block w-full  -md border-gray-300 shadow-lg focus:border-blue-500 focus:ring-blue-500 sm:text-sm border px-3 py-2"
              placeholder={t("enterTheQuestion")}
            />
          </div>

          <div>
            <label
              htmlFor="questionType"
              className="block text-sm font-medium text-gray-700"
            >
              {t("questionType")}
            </label>
            <select
              id="questionType"
              required
              value={questionFormData.questionType}
              onChange={(e) => handleQuestionTypeChange(e.target.value)}
              className="mt-1 block w-full  -md border-gray-300 shadow-lg focus:border-blue-500 focus:ring-blue-500 sm:text-sm border px-3 py-2"
            >
              <option value="">{t("selectQuestionType")}</option>
              <option value="0">{t("multipleChoiceText")}</option>
              <option value="1">{t("trueFalse")}</option>
              <option value="3">{t("multipleChoiceImages")}</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="pointMultiplier"
              className="block text-sm font-medium text-gray-700"
            >
              {t("points")}
            </label>
            <input
              type="number"
              id="pointMultiplier"
              min="0"
              step="0.1"
              value={questionFormData.pointMultiplier}
              onChange={(e) =>
                setQuestionFormData({
                  ...questionFormData,
                  pointMultiplier: parseFloat(e.target.value) || 1,
                })
              }
              className="mt-1 block w-full  -md border-gray-300 shadow-lg focus:border-blue-500 focus:ring-blue-500 sm:text-sm border px-3 py-2"
              placeholder="1.0"
            />
          </div>

          {/* Answer Possibilities based on question type */}
          {questionFormData.questionType === "0" &&
            questionFormData.answerPossibilities && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    {t("answerOptionsText")}
                  </label>
                  <button
                    type="button"
                    onClick={addAnswerOption}
                    className="rounded-full text-sm text-blue-600 hover:text-blue-800"
                  >
                    {t("addOption")}
                  </button>
                </div>
                <div className="space-y-3">
                  {questionFormData.answerPossibilities.AnswerOptions.map(
                    (option: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center space-x-3 p-3 border border-gray-200   "
                      >
                        <input
                          type="text"
                          value={option.Text}
                          onChange={(e) =>
                            updateAnswerOption(index, "Text", e.target.value)
                          }
                          placeholder={`${t("option")} ${index + 1}`}
                          className="flex-1  -md border-gray-300 shadow-lg focus:border-blue-500 focus:ring-blue-500 sm:text-sm border px-3 py-2"
                        />
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={option.isCorrect}
                            onChange={(e) =>
                              updateAnswerOption(
                                index,
                                "isCorrect",
                                e.target.checked,
                              )
                            }
                            className="  border-gray-300 text-blue-600 shadow-lg focus:border-blue-500 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            Correct
                          </span>
                        </label>
                        {questionFormData.answerPossibilities.AnswerOptions
                          .length > 2 && (
                          <button
                            type="button"
                            onClick={() => removeAnswerOption(index)}
                            className="rounded-full text-red-600 hover:text-red-800"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}

          {questionFormData.questionType === "1" &&
            questionFormData.answerPossibilities && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  {t("correctAnswer")}
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="trueFalseAnswer"
                      checked={
                        questionFormData.answerPossibilities.Answer === true
                      }
                      onChange={() =>
                        setQuestionFormData({
                          ...questionFormData,
                          answerPossibilities: { Answer: true },
                        })
                      }
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      {t("true")}
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="trueFalseAnswer"
                      checked={
                        questionFormData.answerPossibilities.Answer === false
                      }
                      onChange={() =>
                        setQuestionFormData({
                          ...questionFormData,
                          answerPossibilities: { Answer: false },
                        })
                      }
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      {t("false")}
                    </span>
                  </label>
                </div>
              </div>
            )}

          {questionFormData.questionType === "3" &&
            questionFormData.answerPossibilities && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    {t("answerOptionsImages")}
                  </label>
                  <button
                    type="button"
                    onClick={addAnswerOption}
                    className="rounded-full text-sm text-blue-600 hover:text-blue-800"
                  >
                    {t("addOption")}
                  </button>
                </div>
                <div className="space-y-3">
                  {questionFormData.answerPossibilities.AnswerOptions.map(
                    (option: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center space-x-3 p-3 border border-gray-200   "
                      >
                        <input
                          type="url"
                          value={option.img_url}
                          onChange={(e) =>
                            updateAnswerOption(index, "img_url", e.target.value)
                          }
                          placeholder={`${t("imageURL")} ${index + 1}`}
                          className="flex-1  -md border-gray-300 shadow-lg focus:border-blue-500 focus:ring-blue-500 sm:text-sm border px-3 py-2"
                        />
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={option.isCorrect}
                            onChange={(e) =>
                              updateAnswerOption(
                                index,
                                "isCorrect",
                                e.target.checked,
                              )
                            }
                            className="  border-gray-300 text-blue-600 shadow-lg focus:border-blue-500 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            Correct
                          </span>
                        </label>
                        {questionFormData.answerPossibilities.AnswerOptions
                          .length > 2 && (
                          <button
                            type="button"
                            onClick={() => removeAnswerOption(index)}
                            className="rounded-full text-red-600 hover:text-red-800"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsQuestionModalOpen(false)}
              className="rounded-full px-4 py-2 border-2 border-suva-blue-100  -md shadow-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={questionFormLoading}
            >
              {t("cancel")}
            </button>
            <button
              type="submit"
              disabled={questionFormLoading}
              className="rounded-full px-4 py-2 border border-transparent  -md shadow-lg text-sm font-medium text-white bg-suva-blue-100 hover:bg-suva-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {questionFormLoading
                ? t("saving")
                : editingQuestion
                  ? t("update")
                  : t("create")}
            </button>
          </div>
        </form>
      </Modal>

      {/* Question Delete Dialog */}
      <ConfirmDialog
        isOpen={isQuestionDeleteDialogOpen}
        onClose={() => setIsQuestionDeleteDialogOpen(false)}
        onConfirm={confirmQuestionDelete}
        title={t("deleteQuestion")}
        message={t("deleteQuestionMessage")}
        loading={questionDeleteLoading}
      />
    </Layout>
  );
};

export default Quizzes;
