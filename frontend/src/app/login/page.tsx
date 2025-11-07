"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/services/authService";
import { useAuth } from "@/context/authContext";
import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const router = useRouter();
  const { setToken, setRole } = useAuth();

  const handleInputChange = (field: "email" | "password", value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: typeof errors = {};
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const data = await login(formData);
      setToken(data.token);
      setRole(data.role);
      if (data.role === "ADMIN") router.push("/admin/bookings");
      else router.push("/user/rooms");
    } catch (err: any) {
      const errorData = err.response?.data;
      if (errorData?.message) setErrors({ general: errorData.message });
      else if (errorData && typeof errorData === "object") setErrors(errorData);
      else setErrors({ general: "Something went wrong!" });
    }



  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-lg">
        <LoginForm
          email={formData.email}
          password={formData.password}
          errors={errors}
          onInputChange={handleInputChange}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
