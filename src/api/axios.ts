import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const access = localStorage.getItem("access_token");
  if (access) {
    config.headers.Authorization = `Bearer ${access}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error("Erro na resposta:", {
        status: error.response.status,
        data: error.response.data,
      });
      
      if (error.response.status === 401 || error.response.status === 403) {
        console.warn("Token inválido ou expirado. Redirecionando para login...");
        
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        
        if (window.location.pathname !== '/login' && window.location.pathname !== '/cadastro') {
          window.location.href = '/login';
        }
      }
    } else if (error.request) {
      console.error("Sem resposta do servidor:", error.request);
    } else {
      console.error("Erro inesperado:", error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;