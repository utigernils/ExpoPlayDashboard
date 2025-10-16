import { apiClient } from "../api";

type User = {
  id: number;
  name: string;
  email: string;
  created_at: Date;
  updated_at: Date;
};

interface UserApiResponse {
  data: any;
}

async function index(): Promise<User[]> {
  const response = await apiClient.get<UserApiResponse>("/users");
  return (response.data as any[]).map((u) => ({
    ...u,
    created_at: new Date(u.created_at),
    updated_at: new Date(u.updated_at),
  })) as User[];
}

async function show(id: number): Promise<User> {
  const response = await apiClient.get<UserApiResponse>(`/users/${id}`);
  return {
    ...response.data,
    created_at: new Date(response.data.created_at),
    updated_at: new Date(response.data.updated_at),
  } as User;
}

async function create(userData: Omit<User, "id" | "created_at" | "updated_at"> & { password: string; password_confirmation?: string }): Promise<User> {
  const response = await apiClient.post<UserApiResponse>("/register", userData);
  return {
    ...response.data,
    created_at: new Date(response.data.created_at),
    updated_at: new Date(response.data.updated_at),
  } as User;
}

async function update(id: number, userData: Partial<Omit<User, "id" | "created_at" | "updated_at">> & { password?: string; password_confirmation?: string }): Promise<User> {
  const response = await apiClient.put<UserApiResponse>(`/users/${id}`, userData);
  return {
    ...response.data,
    created_at: new Date(response.data.created_at),
    updated_at: new Date(response.data.updated_at),
  } as User;
}

async function destroy(id: number): Promise<void> {
  await apiClient.delete<void>(`/users/${id}`);
}

export { index, show, create, update, destroy };
export type { User };
