"use client";

import { useEffect, useState } from "react";
import Calendar from "@/components/BookingCalendar";
import { getAllBookings, cancelBooking, Booking } from "@/services/bookingService";
import { getAllRooms, Room } from "@/services/roomService";
import StatusModal from "@/components/StatusModal";
import { EventClickArg } from "@fullcalendar/core";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<CalendarEvent | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);

  const fetchData = async () => {
    try {
      const [rooms, bookings] = await Promise.all([
        getAllRooms(),
        getAllBookings(),
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

  const handleCancel = async (id: string) => {
    try {
      const cancelled = await cancelBooking(id);
      console.log("Status updated:", cancelled);
      alert("Booking cancelled");
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      console.error("Failed to cancel booking:", error);
    }
  };

  return (
    <div className="p-2 bg-gray-100 w-full">
      <h1 className="text-3xl font-bold text-center mb-8">My Bookings Calendar</h1>
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
        isAdmin={false}
        onCancel={() => handleCancel(selectedBooking.id)}
      />
      )}
    </div>

  );
}
