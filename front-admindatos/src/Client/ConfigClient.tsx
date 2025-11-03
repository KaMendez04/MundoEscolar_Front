import axios from "axios";

const client = axios.create({
  baseURL: "https://localhost:7206/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Interceptor de request: agrega el token si existe
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      // aseguramos que headers exista
      if (!config.headers) {
        config.headers = {};
      }
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ✅ (opcional) Interceptor de respuesta: detectar 401
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      console.warn("⚠️ Token inválido o sesión expirada");
      // aquí podrías hacer:
      // localStorage.removeItem("token");
      // window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default client;
