import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");

    const authEndpoints = ["/auth/login", "/auth/register"];
    const isAuthRequest = authEndpoints.some((url) => config.url?.includes(url));

    if (token && !isAuthRequest) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

export default api;
