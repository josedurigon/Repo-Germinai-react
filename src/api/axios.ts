import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // ex.: http://localhost:8080/api
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const access = localStorage.getItem("access_token");
  if (access) config.headers.Authorization = `Bearer ${access}`;
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

      if (error.response.status === 401) {
        // Exemplo: redirecionar para login
        console.warn("Token inválido ou expirado. Redirecionando...");
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
