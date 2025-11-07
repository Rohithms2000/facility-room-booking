import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
});
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");

    const isAuthRequest =
      config.url?.includes("/login") || config.url?.includes("/register");

    if (token && !isAuthRequest) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

export default api;
