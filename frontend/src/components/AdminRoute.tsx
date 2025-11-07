"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext";

export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAdmin, isLoggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/login");
    } else if (!isAdmin) {
      router.replace("/unauthorized");
    }
  }, [isAdmin, isLoggedIn, router]);

  if (!isLoggedIn || !isAdmin) return null;

  return <>{children}</>;
}
