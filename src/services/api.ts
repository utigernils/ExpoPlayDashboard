import axios from "axios";
import {
  User,
  Console,
  Expo,
  Player,
  Quiz,
  Question,
  PlayedQuiz,
} from "../types";

const API_BASE_URL = "https://api.expoplay.ch";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const authApi = {
  login: async (email: string, password: string) => {
    const response = await api.post("/login", { email, password });
    return response.data;
  },

  logout: async () => {
    const response = await api.get("/logout");
    return response.data;
  },

  checkAuth: async () => {
    const response = await api.get("/login");
    return response.data;
  },
};

const createCrudApi = <T>(endpoint: string) => ({
  getAll: async (orderBy?: string, desc?: boolean): Promise<T[]> => {
    const params = new URLSearchParams();
    if (orderBy) params.append("orderBy", orderBy);
    if (desc) params.append("desc", desc.toString());

    const response = await api.get(
      `/${endpoint}${params.toString() ? "?" + params.toString() : ""}`,
    );
    return response.data;
  },

  getById: async (id: string): Promise<T> => {
    const response = await api.get(`/${endpoint}/${id}`);
    return response.data;
  },

  create: async (data: Partial<T>): Promise<any> => {
    const response = await api.post(`/${endpoint}`, data);
    return response.data;
  },

  update: async (id: string, data: Partial<T>): Promise<any> => {
    const response = await api.put(`/${endpoint}/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<any> => {
    const response = await api.delete(`/${endpoint}/${id}`);
    return response.data;
  },
});

export const consoleApi = createCrudApi<Console>("console");
export const expoApi = createCrudApi<Expo>("expo");
export const playerApi = createCrudApi<Player>("player");
export const quizApi = createCrudApi<Quiz>("quiz");
export const userApi = createCrudApi<User>("user");
export const playedQuizApi = {
  ...createCrudApi<PlayedQuiz>("played-quiz"),

  create: undefined,
  update: undefined,
};

export const questionApi = {
  getAll: async (
    quizId: string,
    orderBy?: string,
    desc?: boolean,
  ): Promise<Question[]> => {
    const params = new URLSearchParams();
    if (orderBy) params.append("orderBy", orderBy);
    if (desc) params.append("desc", desc.toString());

    const response = await api.get(
      `/question/${quizId}${params.toString() ? "?" + params.toString() : ""}`,
    );
    return response.data;
  },

  getById: async (quizId: string, questionId: string): Promise<Question> => {
    const response = await api.get(`/question/${quizId}/${questionId}`);
    return response.data;
  },

  create: async (quizId: string, data: Partial<Question>): Promise<any> => {
    const response = await api.post(`/question/${quizId}`, data);
    return response.data;
  },

  update: async (
    quizId: string,
    questionId: string,
    data: Partial<Question>,
  ): Promise<any> => {
    const response = await api.put(`/question/${quizId}/${questionId}`, data);
    return response.data;
  },

  delete: async (quizId: string, questionId: string): Promise<any> => {
    const response = await api.delete(`/question/${quizId}/${questionId}`);
    return response.data;
  },
};

export default api;
