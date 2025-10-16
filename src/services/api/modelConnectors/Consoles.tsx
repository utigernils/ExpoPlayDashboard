import { apiClient } from "../api";

type Console = {
  id: number;
  current_expo_id: number | null;
  current_quiz_id: number | null;
  name: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
};

interface ConsoleApiResponse {
  data: any;
}

async function index(): Promise<Console[]> {
  const response = await apiClient.get<ConsoleApiResponse>("/consoles");
  return (response.data as any[]).map((c) => ({
    ...c,
    created_at: new Date(c.created_at),
    updated_at: new Date(c.updated_at),
  })) as Console[];
}

async function show(id: number): Promise<Console> {
  const response = await apiClient.get<ConsoleApiResponse>(`/consoles/${id}`);
  return {
    ...response.data,
    created_at: new Date(response.data.created_at),
    updated_at: new Date(response.data.updated_at),
  } as Console;
}

async function create(
  consoleData: Omit<Console, "id" | "created_at" | "updated_at">,
): Promise<Console> {
  const response = await apiClient.post<ConsoleApiResponse>(
    "/consoles",
    consoleData,
  );
  return {
    ...response.data,
    created_at: new Date(response.data.created_at),
    updated_at: new Date(response.data.updated_at),
  } as Console;
}

async function update(
  id: number,
  consoleData: Partial<Omit<Console, "id" | "created_at" | "updated_at">>,
): Promise<Console> {
  const response = await apiClient.put<ConsoleApiResponse>(
    `/consoles/${id}`,
    consoleData,
  );
  return {
    ...response.data,
    created_at: new Date(response.data.created_at),
    updated_at: new Date(response.data.updated_at),
  } as Console;
}

async function destroy(id: number): Promise<void> {
  await apiClient.delete<void>(`/consoles/${id}`);
}

export { index, show, create, update, destroy };
export type { Console };
