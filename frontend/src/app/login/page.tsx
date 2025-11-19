"use client";

import { useRouter } from "next/navigation";
import { login } from "@/services/authService";
import { useAuth } from "@/context/authContext";
import LoginForm from "@/components/LoginForm";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

export default function LoginPage() {
  const router = useRouter();
  const { setToken, setRole } = useAuth();

  const handleLogin = async (data: { email: string; password: string }) => {
    try {
      const response = await login(data);

      setToken(response.token);
      setRole(response.role);

      if (response.role === "ADMIN") {
        router.push("/dashboard/admin/bookings");
      } else {
        router.push("/dashboard/user/rooms");
      }
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>
      const message =
        axiosError.response?.data?.message || "Invalid credentials or server error";
      toast.error(message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-lg">
        <LoginForm onSubmitForm={handleLogin} />
      </div>
    </div>
  );
}
