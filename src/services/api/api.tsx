import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from "axios";

export interface ApiCredentials {
    baseUrl: string;
}

export const API_BASE_URL = "http://localhost:8000/api";

export const apiCredentials: ApiCredentials = {
    baseUrl: API_BASE_URL,
};

const TOKEN_KEY = "auth_token";

// Create axios instance with base configuration
const createAxiosInstance = (): AxiosInstance => {
    const instance = axios.create({
        baseURL: API_BASE_URL,
        headers: {
            "Content-Type": "application/json",
        },
    });

    // Request interceptor to add auth token
    instance.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem(TOKEN_KEY);
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    // Response interceptor to handle errors
    instance.interceptors.response.use(
        (response) => response,
        (error: AxiosError) => {
            if (axios.isAxiosError(error)) {
                const status = error.response?.status ?? "No Status";
                const statusText = error.response?.statusText ?? "Network/Unknown Error";
                const message = (error.response?.data as any)?.message || statusText;
                throw new Error(`${status}: ${message}`);
            }
            throw error;
        }
    );

    return instance;
};

const axiosInstance = createAxiosInstance();

// API Client with common CRUD operations
export class ApiClient {
    private baseUrl: string;
    private axios: AxiosInstance;

    constructor(baseUrl: string = API_BASE_URL, instance?: AxiosInstance) {
        this.baseUrl = baseUrl;
        this.axios = instance || axiosInstance;
    }

    /**
     * GET request
     */
    async get<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
        try {
            const response = await this.axios.get(`${this.baseUrl}${endpoint}`, config);
            return response.data;
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                const status = error.response?.status ?? "No Status";
                const statusText = error.response?.statusText ?? "Network/Unknown Error";
                const message = (error.response?.data as any)?.message || statusText;
                throw new Error(`Failed to fetch data: ${status} ${message}`);
            }
            throw error;
        }
    }

    /**
     * POST request
     */
    async post<T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        try {
            const response = await this.axios.post(`${this.baseUrl}${endpoint}`, data, config);
            return response.data;
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                const status = error.response?.status ?? "No Status";
                const statusText = error.response?.statusText ?? "Network/Unknown Error";
                const message = (error.response?.data as any)?.message || statusText;
                throw new Error(`Failed to create data: ${status} ${message}`);
            }
            throw error;
        }
    }

    /**
     * PUT request
     */
    async put<T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        try {
            const response = await this.axios.put(`${this.baseUrl}${endpoint}`, data, config);
            return response.data;
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                const status = error.response?.status ?? "No Status";
                const statusText = error.response?.statusText ?? "Network/Unknown Error";
                const message = (error.response?.data as any)?.message || statusText;
                throw new Error(`Failed to update data: ${status} ${message}`);
            }
            throw error;
        }
    }

    /**
     * PATCH request
     */
    async patch<T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        try {
            const response = await this.axios.patch(`${this.baseUrl}${endpoint}`, data, config);
            return response.data;
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                const status = error.response?.status ?? "No Status";
                const statusText = error.response?.statusText ?? "Network/Unknown Error";
                const message = (error.response?.data as any)?.message || statusText;
                throw new Error(`Failed to patch data: ${status} ${message}`);
            }
            throw error;
        }
    }

    /**
     * DELETE request
     */
    async delete<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
        try {
            const response = await this.axios.delete(`${this.baseUrl}${endpoint}`, config);
            return response.data;
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                const status = error.response?.status ?? "No Status";
                const statusText = error.response?.statusText ?? "Network/Unknown Error";
                const message = (error.response?.data as any)?.message || statusText;
                throw new Error(`Failed to delete data: ${status} ${message}`);
            }
            throw error;
        }
    }
}

// Export a singleton instance
export const apiClient = new ApiClient();

export default API_BASE_URL;
