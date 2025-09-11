// src/services/UserService.ts
import api from "../api/axios";

export interface UserRegisterRequest {
  username: string;
  email: string;
  password: string;
  roles: string[];
}

export async function registerUser(user: UserRegisterRequest) {
  const { data } = await api.post("/user/register", user);
  return data;
}
