import api from "./api";
import { LoginRequest, RegisterRequest } from "@/types/auth";

export const login = async (data: LoginRequest) => {
  const response = await api.post("/auth/login", data);
  return response.data;
};

export const registerUser = async (data: RegisterRequest) => {
  const response = await api.post("/auth/register-user", data);
  return response.data;
};

export const registerAdmin = async (data: RegisterRequest) => {
  const response = await api.post("/auth/register-admin", data);
  return response.data;
};

