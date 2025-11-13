"use client";

import Sidebar from "@/components/SideBar";
import { useAuth } from "@/context/authContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { token, role } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (token === null || role === null) return;

    if (!token) {
      router.replace("/login");
    } else if (pathname.startsWith("/dashboard/admin") && role !== "ADMIN") {
      router.replace("/unauthorized");
    } else if (pathname.startsWith("/dashboard/user") && role !== "USER") {
      router.replace("/unauthorized");
    }
  }, [token, role, pathname, router]);

  if (!token) return null;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      <main
        className="flex-1 p-6 md:ml-64 transition-all duration-300"
      >
        {children}
      </main>
    </div>
  );
}
