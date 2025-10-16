import { apiClient } from "../api";

type Player = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  wants_newsletter: boolean;
  join_link: string;
  created_at: Date;
  updated_at: Date;
  played_quizzes: number;
};

interface PlayerApiResponse {
  data: any;
}

async function index(): Promise<Player[]> {
  const response = await apiClient.get<PlayerApiResponse>("/players");
  return (response.data as any[]).map((p) => ({
    ...p,
    created_at: new Date(p.created_at),
    updated_at: new Date(p.updated_at),
  })) as Player[];
}

async function show(id: number): Promise<Player> {
  const response = await apiClient.get<PlayerApiResponse>(`/players/${id}`);
  return {
    ...response.data,
    created_at: new Date(response.data.created_at),
    updated_at: new Date(response.data.updated_at),
  } as Player;
}

async function destroy(id: number): Promise<void> {
  await apiClient.delete<void>(`/players/${id}`);
}

export { index, show, destroy };
export type { Player };
