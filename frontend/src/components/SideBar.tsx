"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  CalendarDays,
  LogOut,
  CalendarCheck2,
  Users,
  ClipboardList,
} from "lucide-react";
import { useAuth } from "@/context/authContext";

export default function Sidebar() {
  const pathname = usePathname();
  const { role } = useAuth();
  const isAdmin = role === "ADMIN"

  const theme = isAdmin
    ? {
        bg: "bg-gray-500/50",
        active: "bg-gray-700 text-white",
        hover: "hover:bg-gray-700/50 hover:text-white",
        text: "text-gray-700",
      }
    : {
        bg: "bg-green-600/20",
        active: "bg-green-600 text-white",
        hover: "hover:bg-green-600 hover:text-white",
        text: "text-gray-600",
      };

  const navItems = isAdmin
  ? [

    { name: "Dashboard", href: "/admin/dashboard", icon: <Home className="w-5 h-5 mr-2" /> },
    { name: "Manage Rooms", href: "/admin/rooms", icon: <ClipboardList className="w-5 h-5 mr-2" /> },
    { name: "Bookings", href: "/admin/bookings", icon: <CalendarDays className="w-5 h-5 mr-2" /> },
  ]:[
    { name: "Rooms", href: "/user/rooms", icon : <Home className="w-5 h-5 mr-2" /> },
    { name: "My Bookings", href: "/user/bookings", icon: <CalendarCheck2 className="w-5 h-5 mr-2" /> },
    { name: "Calendar", href: "/user/calendar", icon: <CalendarDays className="w-5 h-5 mr-2" /> },
  ];


  return (
    <div className={`h-screen w-60 ${theme.bg} ${theme.text} flex flex-col shadow-lg fixed left-0 top-0 transition-colors duration-300`}>
      <div className="p-5 text-2xl font-bold border-b">
        {isAdmin ? "Admin Panel" : "RoomBooker"}
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center p-2 transition-colors ${
              pathname === item.href
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
          className={`flex items-center w-full p-2 ${theme.hover} ${theme.text}`}
        >
          <LogOut className="w-5 h-5 mr-2" />
          Logout
        </button>
      </div>
    </div>
  );
}
