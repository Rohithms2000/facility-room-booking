// app/admin/analytics/page.tsx
"use client";

import AnalyticsDashboard from "@/components/AnalyticsCard";

export default function AdminAnalyticsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="p-6 border-b border-gray-200">
        <h1 className="text-3xl font-bold text-gray-800">Admin Analytics</h1>
        <p className="text-gray-500 mt-1">Overview of bookings and rooms</p>
      </header>

      <main className="p-6">
        <AnalyticsDashboard />
      </main>
    </div>
  );
}
