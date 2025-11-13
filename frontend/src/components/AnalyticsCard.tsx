"use client";

import { getBookingStats } from "@/services/bookingService";
import { useEffect, useState } from "react";
import { BookOpen, CheckCircle, Clock, XCircle, Ban } from "lucide-react";

export default function AnalyticsDashboard() {
  const [loading, setLoading] = useState(true);
  const [bookingStats, setBookingStats] = useState({
    totalBookings: 0,
    approved: 0,
    pending: 0,
    cancelled: 0,
    rejected: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const bookings = await getBookingStats();
        setBookingStats(bookings);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="p-6 text-gray-500">Loading analytics...</div>;

  return (
    <div className="p-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <div className="bg-white shadow rounded p-4 text-center flex flex-col items-center">
        <BookOpen className="w-8 h-8 text-blue-500 mb-2" />
        <h3 className="text-gray-500">Total Bookings</h3>
        <p className="text-2xl font-bold">{bookingStats.totalBookings}</p>
      </div>
      <div className="bg-white shadow rounded p-4 text-center flex flex-col items-center">
        <CheckCircle className="w-8 h-8 text-green-500 mb-2" />
        <h3 className="text-gray-500">Approved</h3>
        <p className="text-2xl font-bold">{bookingStats.approved}</p>
      </div>
      <div className="bg-white shadow rounded p-4 text-center flex flex-col items-center">
        <Clock className="w-8 h-8 text-yellow-500 mb-2" />
        <h3 className="text-gray-500">Pending</h3>
        <p className="text-2xl font-bold">{bookingStats.pending}</p>
      </div>
      <div className="bg-white shadow rounded p-4 text-center flex flex-col items-center">
        <XCircle className="w-8 h-8 text-gray-500 mb-2" />
        <h3 className="text-gray-500">Cancelled</h3>
        <p className="text-2xl font-bold">{bookingStats.cancelled}</p>
      </div>
      <div className="bg-white shadow rounded p-4 text-center flex flex-col items-center">
        <Ban className="w-8 h-8 text-red-500 mb-2" />
        <h3 className="text-gray-500">Rejected</h3>
        <p className="text-2xl font-bold">{bookingStats.rejected}</p>
      </div>
    </div>
  );
}
