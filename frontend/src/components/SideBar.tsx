"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  ChartLine,
  CalendarDays,
  LogOut,
  CalendarCheck2,
  Menu,
  X
} from "lucide-react";
import { useAuth } from "@/context/authContext";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

export default function Sidebar({isOpen, setIsOpen}: Readonly<SidebarProps>) {
  const pathname = usePathname();
  const { role, logout } = useAuth();
  const isAdmin = role === "ADMIN";

  const theme = isAdmin
    ? {
      bg: "bg-gray-300",
      active: "bg-gray-700 text-white",
      hover: "hover:bg-gray-700/50 hover:text-white",
      text: "text-gray-700",
    }
    : {
      bg: "bg-gray-300",
      active: "bg-green-600 text-white",
      hover: "hover:bg-green-600/50 hover:text-white",
      text: "text-gray-600",
    };

  const navItems = isAdmin
    ? [
      { name: "Analytics", href: "/dashboard/admin/analytics", icon: <ChartLine className="w-5 h-5 mr-2" /> },
      { name: "Manage Rooms", href: "/dashboard/admin/rooms", icon: <Home className="w-5 h-5 mr-2" /> },
      { name: "Bookings", href: "/dashboard/admin/bookings", icon: <CalendarDays className="w-5 h-5 mr-2" /> },
    ]
    : [
      { name: "Rooms", href: "/dashboard/user/rooms", icon: <Home className="w-5 h-5 mr-2" /> },
      { name: "My Bookings", href: "/dashboard/user/bookings", icon: <CalendarCheck2 className="w-5 h-5 mr-2" /> },
    ];

  return (
    <>
      <div className="md:hidden fixed top-4 right-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-md bg-gray-800/50 text-white"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <div
        className={`fixed top-0 left-0 h-full w-60 ${theme.bg} ${theme.text} flex flex-col shadow-lg transition-transform duration-300 z-40
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div className="p-5 text-2xl font-bold border-b flex justify-between items-center">
          {isAdmin ? "Admin Panel" : "Facility Room Booker"}
         
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={`flex items-center p-2 rounded-md transition-colors ${pathname === item.href
                  ? theme.active
                  : `${theme.hover} ${theme.text}`
                }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-700">
          <button
          onClick={logout}
            className={`flex items-center w-full p-2 ${theme.hover} ${theme.text}`}
          >
            <LogOut className="w-5 h-5 mr-2" />
            Logout
          </button>
        </div>
      </div>
    </>
  );
}
