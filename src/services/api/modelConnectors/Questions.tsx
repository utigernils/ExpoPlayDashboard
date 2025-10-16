import { apiClient } from "../api";

type Question = {
  id: number;
  quiz_id: number;
  question: string;
  question_type: number;
  answer_possibilities: any;
  points: number;
  is_hidden: boolean;
  created_at: Date;
  updated_at: Date;
};

interface QuestionApiResponse {
  data: any;
}

async function index(): Promise<Question[]> {
  const response = await apiClient.get<QuestionApiResponse>("/questions");
  return (response.data as any[]).map((q) => ({
    ...q,
    created_at: new Date(q.created_at),
    updated_at: new Date(q.updated_at),
  })) as Question[];
}

async function show(id: number): Promise<Question> {
  const response = await apiClient.get<QuestionApiResponse>(`/questions/${id}`);
  return {
    ...response.data,
    created_at: new Date(response.data.created_at),
    updated_at: new Date(response.data.updated_at),
  } as Question;
}

async function create(questionData: Omit<Question, "id" | "created_at" | "updated_at">): Promise<Question> {
  const response = await apiClient.post<QuestionApiResponse>("/questions", questionData);
  return {
    ...response.data,
    created_at: new Date(response.data.created_at),
    updated_at: new Date(response.data.updated_at),
  } as Question;
}

async function update(id: number, questionData: Partial<Omit<Question, "id" | "created_at" | "updated_at">>): Promise<Question> {
  const response = await apiClient.put<QuestionApiResponse>(`/questions/${id}`, questionData);
  return {
    ...response.data,
    created_at: new Date(response.data.created_at),
    updated_at: new Date(response.data.updated_at),
  } as Question;
}

async function destroy(id: number): Promise<void> {
  await apiClient.delete<void>(`/questions/${id}`);
}

export { index, show, create, update, destroy };
export type { Question };
