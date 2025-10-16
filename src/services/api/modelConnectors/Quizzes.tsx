import { apiClient } from "../api";

type Quiz = {
  id: number;
  name: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  total_points: number;
};

interface QuizApiResponse {
  data: any;
}

async function index(): Promise<Quiz[]> {
  const response = await apiClient.get<QuizApiResponse>("/quizzes");
  return (response.data as any[]).map((q) => ({
    ...q,
    created_at: new Date(q.created_at),
    updated_at: new Date(q.updated_at),
  })) as Quiz[];
}

async function show(id: number): Promise<Quiz> {
  const response = await apiClient.get<QuizApiResponse>(`/quizzes/${id}`);
  return {
    ...response.data,
    created_at: new Date(response.data.created_at),
    updated_at: new Date(response.data.updated_at),
  } as Quiz;
}

async function create(
  quizData: Omit<Quiz, "id" | "created_at" | "updated_at" | "total_points">,
): Promise<Quiz> {
  const response = await apiClient.post<QuizApiResponse>("/quizzes", quizData);
  return {
    ...response.data,
    created_at: new Date(response.data.created_at),
    updated_at: new Date(response.data.updated_at),
  } as Quiz;
}

async function update(
  id: number,
  quizData: Partial<
    Omit<Quiz, "id" | "created_at" | "updated_at" | "total_points">
  >,
): Promise<Quiz> {
  const response = await apiClient.put<QuizApiResponse>(
    `/quizzes/${id}`,
    quizData,
  );
  return {
    ...response.data,
    created_at: new Date(response.data.created_at),
    updated_at: new Date(response.data.updated_at),
  } as Quiz;
}

async function destroy(id: number): Promise<void> {
  await apiClient.delete<void>(`/quizzes/${id}`);
}

export { index, show, create, update, destroy };
export type { Quiz };
