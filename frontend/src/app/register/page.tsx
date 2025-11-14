"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser, registerAdmin } from "@/services/authService";
import RegisterForm from "@/components/RegisterForm";
import { toast } from "react-toastify";

export default function RegisterPage() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);

  const handleSubmitForm = async (data: { name: string; email: string; password: string }) => {
    try {
      const response = isAdmin
        ? await registerAdmin(data)
        : await registerUser(data);

      if (response) {
        router.push("/login");
      }
    } catch (err: any) {
      const errorData = err.response?.data;
      let message = "Something went wrong!";
      if (errorData?.message) message = errorData.message;
      toast.error(message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-lg">
        <h1 className="text-2xl font-semibold text-center mb-4">
          {isAdmin ? "Admin Registration" : "User Registration"}
        </h1>

        <RegisterForm onSubmitForm={handleSubmitForm} />

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
                Register as Admin
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
