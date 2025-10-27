// src/services/api.ts
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  login: async (email: string, password: string) => {
    const res = await apiClient.post("/auth/login", { email, password });
    return res.data;
  },
  register: async (email: string, username: string, password: string) => {
    const res = await apiClient.post("/auth/register", { email, username, password });
    return res.data;
  },
  verifyToken: async () => {
    const res = await apiClient.get("/auth/verify");
    return res.data;
  },
  // ADDED: Endpoint to request a password reset email
  forgotPassword: async (email: string) => {
    const res = await apiClient.post("/auth/forgot-password", { email });
    return res.data; 
  },
  // ADDED: Endpoint to actually reset the password using the token
  resetPassword: async (token: string, newPassword: string) => {
    const res = await apiClient.post("/auth/reset-password", { token, newPassword });
    return res.data;
  }
};

export const conversationAPI = {
  getAll: async () => {
    const res = await apiClient.get("/conversations");
    return res.data;
  },
  getById: async (id: number) => {
    const res = await apiClient.get(`/conversations/${id}`);
    return res.data;
  },
  create: async (title?: string) => {
    const res = await apiClient.post("/conversations", { title });
    return res.data;
  },
  updateTitle: async (id: number, title: string) => {
    const res = await apiClient.patch(`/conversations/${id}`, { title });
    return res.data;
  },
  delete: async (id: number) => {
    const res = await apiClient.delete(`/conversations/${id}`);
    return res.data;
  },
};

export const chatAPI = {
  sendMessage: async (message: string, conversationId?: number) => {
    const res = await apiClient.post("/chat/message", { message, conversationId });
    return res.data;
  },
};

export default apiClient;