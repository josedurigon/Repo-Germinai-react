import { api } from '../api/axios';

export type AuthUser = { 
  username: string; 
  roles?: string[];
  email?: string;
};

type LoginResponse = string; 

export interface UserRegisterRequest {
  username: string;
  email: string;
  password: string;
  nomeCompleto?: string;
  telefone?: string;
  tipoProdutor?: string;
  nomeFazenda?: string;
  endereco?: string;
  tamanhoPropriedade?: number;
  inicioSemana?: string;
}

export interface UserResponse {
  id: number;
  username: string;
  email: string;
  roles: string[];
  enabled: boolean;
  createdAt: string;
}

export async function login(username: string, password: string): Promise<AuthUser> {
  try {
    const { data } = await api.post<LoginResponse>("/auth/login", { 
      username, 
      password 
    });
    
    const token = typeof data === 'string' ? data.replace(/"/g, '') : data;
    localStorage.setItem("access_token", token);
    
    return { username };
    
  } catch (error: any) {
    if (error.response?.data) throw new Error(error.response.data);
    throw error;
  }
}

export async function register(userData: UserRegisterRequest): Promise<UserResponse> {
  try {
    const { data } = await api.post<UserResponse>("/user/register", userData);
    return data;
  } catch (error: any) {
    if (error.response?.data) throw new Error(error.response.data);
    throw error;
  }
}

export async function getMe(): Promise<AuthUser> {
  try {
    const { data } = await api.get<AuthUser>("/auth/me");
    return data;
  } catch (error) {
    const token = localStorage.getItem("access_token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return { 
          username: payload.sub || payload.username,
          roles: payload.roles || []
        };
      } catch {
        return { username: 'user' };
      }
    }
    throw error;
  }
}

export async function listarUsuarios(): Promise<UserResponse[]> {
  try {
    const { data } = await api.get<UserResponse[]>("/user/listar");
    return data;
  } catch (error) {
    throw error;
  }
}

export function logout(): void {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("rememberEmail");
}

export function isAuthenticated(): boolean {
  return !!localStorage.getItem("access_token");
}

export async function requestPasswordReset(email: string): Promise<void> {
  try {
    await api.post("/auth/forgot-password", { email });
  } catch (error: any) {
    if (error.response?.data) throw new Error(error.response.data);
    throw error;
  }
}

export async function resetPassword(token: string, newPassword: string): Promise<void> {
  try {
    await api.post("/auth/reset-password", { token, newPassword });
  } catch (error: any) {
    if (error.response?.data) throw new Error(error.response.data);
    throw error;
  }
}

export async function validateResetToken(token: string): Promise<boolean> {
  try {
    const { data } = await api.get(`/auth/validate-reset-token?token=${token}`);
    return data.valid;
  } catch (error) {
    return false;
  }
}

export default {
  login,
  register,
  getMe,
  logout,
  isAuthenticated,
  listarUsuarios,
  requestPasswordReset,
  resetPassword,
  validateResetToken,
};
