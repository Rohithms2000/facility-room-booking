"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext";
import LoginPage from "./login/page";

export default function Page() {
  const router = useRouter();
  const { token, role } = useAuth();

  useEffect(() => {
    if (token) {
      if (role === "ADMIN") {
        router.replace("/dashboard/admin/bookings");
      }
      else {
        router.replace("/dashboard/user/rooms");
      }
    }
  }, [token, role, router]);

  if (!token) return <LoginPage />;

  return <p className="text-center mt-10">Redirecting...</p>;
}
