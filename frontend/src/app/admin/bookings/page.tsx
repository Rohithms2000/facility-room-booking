"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/SideBar";
import Calendar from "@/components/BookingCalendar";
import { getBookingsForAdmin } from "@/services/bookingService";

interface CalendarEvent {
    id: string;
    title: string;
    start: string;
    end: string;
    backgroundColor?: string;
}

export default function BookingsCalendarPage() {
    const [events, setEvents] = useState<CalendarEvent[]>([]);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const bookings = await getBookingsForAdmin();
                console.log("Fetched bookings result:", bookings);

                const eventsData = bookings.map((b: any) => ({
                    id: b.id,
                    title: b.purpose,
                    start: b.startTime,
                    end: b.endTime,
                    backgroundColor: "#24ac48ff"
                }));
                setEvents(eventsData);
            } catch (err) {
                console.error("Error fetching bookings:", err);
            }
        };
        fetchBookings();
    }, []);



    const handleDateClick = (arg: any) => {
        console.log("Date clicked:", arg.dateStr);
    };

    const handleEventClick = (arg: any) => {
        console.log("Event clicked:", arg.event);
    };


    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <main className="flex-1 ml-60 overflow-y-auto bg-gray-100 p-8">
                <h1 className="text-3xl font-bold text-center mb-8">
                    Bookings
                </h1>
                <Calendar
                    events={events}
                    onDateClick={handleDateClick}
                    onEventClick={handleEventClick}
                />

            </main>
        </div>
    );
}
