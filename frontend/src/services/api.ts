import axios from "axios";
import { toast } from "react-toastify";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 8000,
});

api.interceptors.request.use((config) => {
  if (globalThis.window !== undefined) {
    const token = localStorage.getItem("token");

    const authEndpoints = ["/auth/login", "/auth/register"];
    const isAuthRequest = authEndpoints.some((url) =>
      config.url?.includes(url)
    );

    if (token && !isAuthRequest) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,

  (error) => {
    toast.dismiss();

    if (error.code === "ECONNABORTED") {
      toast.info("⏳ Server is waking up... Please wait a few seconds.");
      return Promise.reject(error);
    }

    if (error.message === "Network Error") {
      toast.warning("⚠️ Cannot reach server. It may be starting up...");
      return Promise.reject(error);
    }

    if ([502, 503, 504].includes(error?.response?.status)) {
      toast.info("Server is starting... Try again shortly.");
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default api;
