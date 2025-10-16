import { apiClient } from "../api";

type PlayedQuiz = {
  id: number;
  player_id: number;
  quiz_id: number;
  expo_id: number;
  points: number;
  quiz_max_points: number;
  quiz_name: string;
  expo_name: string;
  created_at: Date;
  updated_at: Date;
  time: number;
  points_rate: number;
  player_name: string;
};

interface PlayedQuizApiResponse {
  data: any;
}

async function index(): Promise<PlayedQuiz[]> {
  const response =
    await apiClient.get<PlayedQuizApiResponse>("/played-quizzes");
  return (response.data as any[]).map((pq) => ({
    ...pq,
    created_at: new Date(pq.created_at),
    updated_at: new Date(pq.updated_at),
  })) as PlayedQuiz[];
}

async function show(id: number): Promise<PlayedQuiz> {
  const response = await apiClient.get<PlayedQuizApiResponse>(
    `/played-quizzes/${id}`,
  );
  return {
    ...response.data,
    created_at: new Date(response.data.created_at),
    updated_at: new Date(response.data.updated_at),
  } as PlayedQuiz;
}

async function destroy(id: number): Promise<void> {
  await apiClient.delete<void>(`/played-quizzes/${id}`);
}

export { index, show, destroy };
export type { PlayedQuiz };
