import { apiClient } from "../api";

type Expo = {
  id: number;
  name: string;
  introduction_title: string;
  introduction_subtitle: string | null;
  location: string;
  starts_on: Date;
  ends_on: Date;
  created_at: Date;
  updated_at: Date;
};

interface ExpoApiResponse {
  data: any;
}

async function index(): Promise<Expo[]> {
  const response = await apiClient.get<ExpoApiResponse>("/expos");
  return (response.data as any[]).map((e) => ({
    ...e,
    starts_on: new Date(e.starts_on),
    ends_on: new Date(e.ends_on),
    created_at: new Date(e.created_at),
    updated_at: new Date(e.updated_at),
  })) as Expo[];
}

async function show(id: number): Promise<Expo> {
  const response = await apiClient.get<ExpoApiResponse>(`/expos/${id}`);
  return {
    ...response.data,
    starts_on: new Date(response.data.starts_on),
    ends_on: new Date(response.data.ends_on),
    created_at: new Date(response.data.created_at),
    updated_at: new Date(response.data.updated_at),
  } as Expo;
}

async function create(expoData: Omit<Expo, "id" | "created_at" | "updated_at">): Promise<Expo> {
  const response = await apiClient.post<ExpoApiResponse>("/expos", expoData);
  return {
    ...response.data,
    starts_on: new Date(response.data.starts_on),
    ends_on: new Date(response.data.ends_on),
    created_at: new Date(response.data.created_at),
    updated_at: new Date(response.data.updated_at),
  } as Expo;
}

async function update(id: number, expoData: Partial<Omit<Expo, "id" | "created_at" | "updated_at">>): Promise<Expo> {
  const response = await apiClient.put<ExpoApiResponse>(`/expos/${id}`, expoData);
  return {
    ...response.data,
    starts_on: new Date(response.data.starts_on),
    ends_on: new Date(response.data.ends_on),
    created_at: new Date(response.data.created_at),
    updated_at: new Date(response.data.updated_at),
  } as Expo;
}

async function destroy(id: number): Promise<void> {
  await apiClient.delete<void>(`/expos/${id}`);
}

export { index, show, create, update, destroy };
export type { Expo };
