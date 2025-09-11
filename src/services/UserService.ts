// src/services/UserService.ts
import api from "../api/axios";

export interface UserRegisterRequest {
  username: string;
  email: string;
  password: string;
  roles: string[];
}

export interface UserResponse {
  id: number;
  username: string;
  email: string;
  roles: string[];
  enabled: boolean;
  createdAt: string;
}

export async function registerUser(user: UserRegisterRequest) {
  const { data } = await api.post("/user/register", user);
  return data;
}

export async function listarUsuarios(): Promise<UserResponse[]> {
  const { data } = await api.get<UserResponse[]>("/user/listar");
  return data;
}