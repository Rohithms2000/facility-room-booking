"use client";

import { useEffect, useState } from "react";
import Calendar from "@/components/BookingCalendar";
import { Booking, getBookingsForAdmin, updateBookingStatus } from "@/services/bookingService";
import StatusModal from "@/components/StatusModal";
import { getAllRooms, Room } from "@/services/roomService";
import { EventClickArg } from "@fullcalendar/core";
import { toast } from "react-toastify";

interface CalendarEvent {
    id: string;
    title: string;
    start: string | Date;
    end: string | Date;
    backgroundColor?: string;
    roomName: string;
    purpose: string;
    status: string;
}

export default function BookingsCalendarPage() {
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [selectedBooking, setSelectedBooking] = useState<CalendarEvent | null>(null);

    const fetchData = async () => {
        try {
            const [rooms, bookings] = await Promise.all([
                getAllRooms(),
                getBookingsForAdmin(),
            ]);
            setRooms(rooms);
            const eventsData = bookings.map((b: Booking) => {
                const room = rooms.find((r) => r.id === b.roomId);
                const getStatusColor = (status: string) => {
                    switch (status) {
                        case "APPROVED":
                            return "#1e903cff";
                        case "PENDING":
                            return "#ea9008ff";
                        case "REJECTED":
                            return "#dc2626ff";
                        case "CANCELLED":
                            return "#9ca3afff";
                        default:
                            return "#94a3b8";
                    }
                };
                return {
                    id: b.id,
                    title: b.purpose,
                    start: b.startTime,
                    end: b.endTime,
                    status: b.status,
                    purpose: b.purpose,
                    roomName: room ? room.name : "",
                    backgroundColor: getStatusColor(b.status)
                };
            });
            setEvents(eventsData);
        } catch (err) {
            console.error("Error fetching bookings:", err);
        }
    };
    
    useEffect(() => {
        fetchData();
    }, []);

    const handleEventClick = (arg: EventClickArg) => {
        const clickedEvent = events.find((event) => event.id === arg.event.id);
        if (clickedEvent) {
            setSelectedBooking(clickedEvent);
            setIsModalOpen(true);

        };
    };

    const handleClose = () => {
        setIsModalOpen(false);
        setSelectedBooking(null);
    };

    const handleStatus = async (id: string, status: string) => {
        try {
            const updated = await updateBookingStatus(id, status);
            console.log("Status updated:", updated);
            toast.success("Booking status updated successfully");
            setEvents((prevEvents) =>
                prevEvents.map((event) =>
                    event.id === id ? { ...event, status } : event
                )
            );
            setIsModalOpen(false);
            fetchData();
        } catch (error) {
            console.error("Failed to update status:", error);
        }
    };



    return (
        <div className="p-6 bg-gray-100 w-full">
            <h1 className="text-3xl font-bold text-center mb-8">
                Bookings
            </h1>
            <Calendar
                events={events}
                onEventClick={handleEventClick}
            />

            {selectedBooking && (<StatusModal
                isOpen={isModalOpen}
                onClose={handleClose}
                booking={{
                    id: selectedBooking.id,
                    roomId: selectedBooking.roomName,
                    startTime: new Date(selectedBooking.start).toLocaleTimeString(),
                    endTime: new Date(selectedBooking.end).toLocaleTimeString(),
                    purpose: selectedBooking.purpose || "",
                    status: selectedBooking.status || "Pending",
                }}
                roomName={selectedBooking.roomName || "Unknown Room"}
                isAdmin={true}
                onApprove={() => handleStatus(selectedBooking.id, "APPROVED")}
                onReject={() => handleStatus(selectedBooking.id, "REJECTED")}
            />
            )}
        </div >

    );
}
