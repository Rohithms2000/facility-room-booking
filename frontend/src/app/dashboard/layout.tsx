"use client";

import Sidebar from "@/components/SideBar";
import { useAuth } from "@/context/authContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { token, role, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (loading) return;
    if (token === null) {
      router.replace("/login");
      return;
    }

    if (!role) return;

    if (pathname.startsWith("/dashboard/admin") && role !== "ADMIN") {
      router.replace("/unauthorized");
      return;
    }

    if (pathname.startsWith("/dashboard/user") && role !== "USER") {
      router.replace("/unauthorized");
      return;
    }

  }, [token, role, pathname, loading, router]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!token) return null;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      <main className="flex-1 p-6 md:ml-64 transition-all duration-300">
        {children}
      </main>
    </div>
  );
}
