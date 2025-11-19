"use client";

import { useForm } from "react-hook-form";
import Link from "next/link";

interface LoginFormProps {
  onSubmitForm: (data: { email: string; password: string }) => void;
}

export default function LoginForm({ onSubmitForm }: Readonly<LoginFormProps>) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    clearErrors,
  } = useForm<{ email: string; password: string }>({
    mode: "onBlur",
  });

  const onSubmit = (data: { email: string; password: string }) => {
    onSubmitForm(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" autoComplete="off">
      <h2 className="text-2xl mb-4 font-bold text-center">Login</h2>

      {/* Email Field */}
      <input
        type="email"
        placeholder="Email"
        className={`input border rounded p-2 w-full mb-2 focus:outline-none ${
          errors.email ? "border-red-500" : "border-gray-300"
        }`}
        {...register("email", {
          required: "Email is required",
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "Invalid email format",
          },
          onChange: () => clearErrors("email"),
        })}
      />
      {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

      {/* Password Field */}
      <input
        type="password"
        placeholder="Password"
        className={`input border rounded p-2 w-full mb-2 focus:outline-none ${
          errors.password ? "border-red-500" : "border-gray-300"
        }`}
        {...register("password", {
          required: "Password is required",
          minLength: {
            value: 6,
            message: "Password must be at least 6 characters",
          },
          onChange: () => clearErrors("password"),
        })}
      />
      {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={`bg-blue-600 text-white w-full hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 font-medium rounded-lg px-4 py-2 mt-2 ${
          isSubmitting ? "opacity-60 cursor-not-allowed" : ""
        }`}
      >
        {isSubmitting ? "Logging in..." : "Login"}
      </button>

      {/* Register Link */}
      <p className="text-center text-gray-600 mt-2 text-sm">
        New User?{" "}
        <Link href="/register" className="text-blue-600 hover:underline">
          Register here
        </Link>
      </p>
    </form>
  );
}
