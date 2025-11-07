"use client";

import { useState } from "react";
import { registerUser, registerAdmin } from "@/services/authService";
import RegisterForm from "@/components/RegisterForm";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [isAdmin, setIsAdmin] = useState(false);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const newErrors: typeof errors = {};
    if (!form.email) newErrors.email = "Email is required";
    if (!form.password) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    try {
      const data = isAdmin
        ? await registerAdmin(form)
        : await registerUser(form);

      if (data) router.push("/login");
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
        <h1 className="text-2xl font-semibold text-center mb-4">
          {isAdmin ? "Admin Registration" : "User Registration"}
        </h1>

        <RegisterForm
          name={form.name}
          email={form.email}
          password={form.password}
          errors={errors}
          onChange={handleChange}
          onSubmit={handleSubmit}
        />

        <p className="text-sm text-center mt-4">
          {isAdmin ? (
            <>
              Registering as Admin.{" "}
              <button
                onClick={() => setIsAdmin(false)}
                className="text-blue-600 hover:underline"
              >
                Switch to User
              </button>
            </>
          ) : (
            <>
              Are you a facility owner?{" "}
              <button
                onClick={() => setIsAdmin(true)}
                className="text-blue-600 hover:underline"
              >
                Register as admin
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
