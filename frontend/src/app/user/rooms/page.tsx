"use client";

import { useEffect, useState } from "react";
import RoomCard from "@/components/RoomCard";
import { getAllRooms, Room } from "@/services/roomService";
import Modal from "@/components/Modal";
import { createBooking, getBookingsForRoom } from "@/services/bookingService";
import Sidebar from "@/components/SideBar";

interface CalendarEvent {
    id: string;
    title: string;
    start: string;
    end: string;
    backgroundColor?: string;
}

export default function RoomsPage() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [form, setForm] = useState<{ startTime: Date | null, endTime: Date | null, purpose: string }>({ startTime: null, endTime: null, purpose: "" });
    const [errors, setErrors] = useState({});
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [activeTab, setActiveTab] = useState<"book" | "calendar">("book")

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const data = await getAllRooms();
                setRooms(data);
            } catch (err) {
                console.error("Error fetching rooms:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchRooms();
    }, []);

    const handleChange = (field: string, value: any) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        setErrors({ general: null });
    };

    const handleClose = () => {
        setSelectedRoom(null);
        setForm({
            startTime: null,
            endTime: null,
            purpose: "",
        });
        setErrors({ general: null });
    }
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (selectedRoom) {

            const { startTime, endTime, purpose } = form;
            if (!startTime || !endTime || !purpose) {
                setErrors({ general: "Please fill all fields" });
                return;
            }
            try {
                await createBooking({
                    roomId: selectedRoom.id,
                    startTime: startTime?.toISOString() || null,
                    endTime: endTime?.toISOString() || null,
                    purpose
                }
                );
                alert("Room booked successfully!");
                setSelectedRoom(null);
                setForm({
                    startTime: null,
                    endTime: null,
                    purpose: "",
                });
            } catch (error: any) {
                setErrors({ general: error.response?.data?.message || "Booking failed!" });
            }
        }

    }

    const handleDateClick = (arg: any) => {
        console.log("Date clicked:", arg.dateStr);
        setActiveTab("book");
        setForm({
            startTime: new Date(arg.dateStr),
            endTime: null,
            purpose: "",
        });
    };

    const handleEventClick = (arg: any) => {
        console.log("Event clicked:", arg.event);
    };

    const handleCalendarClick = async () => {
        console.log("calendar clicked")
        const roomId = selectedRoom?.id;

        if (!roomId) {
            setEvents([]);
            return;
        }

        try {
            const bookings = await getBookingsForRoom(roomId);
            console.log("Fetched bookings result:", bookings);

            const eventsData = bookings.map((b: any) => ({
                id: b.id,
                title: "Booked",
                start: b.startTime,
                end: b.endTime,
                backgroundColor: "#f87171"
            }));
            setEvents(eventsData);
        } catch (err) {
            console.error("Error fetching bookings:", err);
        }
    };
    useEffect(() => {
        if (activeTab === "calendar" && selectedRoom) {
            handleCalendarClick(); // 👈 your existing API fetch function
        }
    }, [activeTab, selectedRoom]);

    if (loading) return <svg className="size-5 animate-spin" viewBox="0 0 24 24">
    </svg>;

    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <main className="flex-1 ml-60 overflow-y-auto bg-gray-100 p-8">
                <div className="min-h-screen bg-gray-100 py-10 px-5">
                    <h1 className="text-3xl font-bold text-center mb-8">Available Rooms</h1>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {rooms.map((room) => (
                            <div key={room.id} onClick={() => setSelectedRoom(room)} >
                                <RoomCard room={room} />
                            </div>
                        ))}
                    </div>
                    <Modal
                        isOpen={!!selectedRoom}
                        onClose={handleClose}
                        room={selectedRoom}
                        form={form}
                        errors={errors}
                        onChange={handleChange}
                        onSubmit={handleSubmit}
                        events={events}
                        onDateClick={handleDateClick}
                        onEventClick={handleEventClick}
                        onCalendarClick={handleCalendarClick}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                    />


                </div>
            </main>
        </div>
    );
}
