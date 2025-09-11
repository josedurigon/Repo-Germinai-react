import {api} from '../api/axios';

export type AuthUser = { username: string; roles?: string[] };


type LoginResponse = {
  access_token: string;
  refresh_token?: string;
  user?: AuthUser;
};

export async function login(username: string, password: string): Promise<AuthUser> {
  const { data } = await api.post<LoginResponse>("/auth/login", { username, password });

  console.log("login response", data);
  // guarde só o access_token; o interceptor monta o "Bearer ..." em cada request
  localStorage.setItem("access_token", data);
  if (data.refresh_token) localStorage.setItem("refresh_token", data.refresh_token);

  return data.user ?? { username };
}

export async function getMe(): Promise<AuthUser> {
  const { data } = await api.get<AuthUser>("/auth/me");
  return data;
}

export function logout() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
}