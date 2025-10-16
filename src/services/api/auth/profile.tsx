import { apiClient } from "../api";

export interface UpdateProfileData {
  name?: string;
  password?: string;
  password_confirmation?: string;
}

export interface UserResponse {
  data: {
    id: number;
    name: string;
    email: string;
    is_admin: boolean;
    created_at: string;
    updated_at: string;
  };
}

export const profileApi = {
  async updateProfile(data: UpdateProfileData): Promise<UserResponse> {
    return await apiClient.put<UserResponse>("/user", data);
  },
};
