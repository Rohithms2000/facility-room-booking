"use client";

import { useEffect, useState } from "react";
import RoomCard from "@/components/RoomCard";
import { getAllRooms, Room } from "@/services/roomService";
import { Booking, createBooking, getBookingsForRoom } from "@/services/bookingService";
import BookingModal from "@/components/BookingModal";
import { getRules } from "@/services/availabilityService";
import { EventClickArg } from "@fullcalendar/core";
import { DateClickArg } from "@fullcalendar/interaction";

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
    const [errors, setErrors] = useState<{ startTime?: string; endTime?: string; purpose?: string; general?: string | null }>({});
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

    const handleChange = (field: string, value: string | Date | null) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: undefined, general: null }));
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
        const { startTime, endTime, purpose } = form;
        const newErrors: typeof errors = {};

        if (!startTime) newErrors.startTime = "Start time is required";
        if (!endTime) newErrors.endTime = "End time is required";
        if (!purpose.trim()) newErrors.purpose = "Purpose is required";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        if (selectedRoom) {
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
                console.log("error: ", error)
                const errorData = error.response?.data;
                const firstErrorMessage = errorData ? Object.values(errorData)[0] as string: "Something went wrong";
                setErrors({ general: firstErrorMessage });
            }
        }

    }

    const handleDateClick = (arg: DateClickArg) => {
        console.log("Date clicked:", arg.dateStr);
        setActiveTab("book");
        setForm({
            startTime: new Date(arg.dateStr),
            endTime: null,
            purpose: "",
        });
    };

    const handleEventClick = (arg: EventClickArg) => {
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
            const rules = await getRules(roomId);
            console.log("Fetched bookings result:", bookings);
            console.log("fetched rules: ", rules)

            const bookingEvents = bookings.map((b: Booking) => ({
                id: b.id,
                title: "Booked",
                start: b.startTime,
                end: b.endTime,
                backgroundColor: "#f87171"
            }));

            const convertDayToNumber = (day: string) => {
                const map: Record<string, number> = {
                    MONDAY: 1, TUESDAY: 2, WEDNESDAY: 3,
                    THURSDAY: 4, FRIDAY: 5, SATURDAY: 6, SUNDAY: 0,
                };
                return map[day];
            };

            const ruleEvents = rules.flatMap((rule: any) => {
                switch (rule.ruleType) {
                    case "HOLIDAY":
                        return [{
                            title: `Holiday: ${rule.reason}`,
                            start: rule.date,
                            allDay: true,
                            backgroundColor: "#f87171",
                            borderColor: "#f87171",
                        }];
                    case "WEEKLY_CLOSED":
                        return [{
                            title: `Closed: ${rule.reason}`,
                            daysOfWeek: [convertDayToNumber(rule.dayOfWeek)],
                            backgroundColor: "#9ca3af",
                            borderColor: "#9ca3af",
                        }];
                    case "TIME_BLOCK":
                        return [{
                            title: `Blocked: ${rule.reason}`,
                            startTime: rule.startTime,
                            endTime: rule.endTime,
                            daysOfWeek: [convertDayToNumber(rule.dayOfWeek)],
                            backgroundColor: "#fbbf24",
                            borderColor: "#fbbf24",
                        }];
                    default:
                        return [];
                }
            });

            setEvents([...bookingEvents, ...ruleEvents]);
        } catch (err) {
            console.error("Error fetching bookings:", err);
        }
    };
    useEffect(() => {
        if (activeTab === "calendar" && selectedRoom) {
            handleCalendarClick();
        }
    }, [activeTab, selectedRoom]);

    if (loading) return <svg className="size-5 animate-spin" viewBox="0 0 24 24">
    </svg>;

    return (
        <div className="flex-1 bg-gray-100 p-8 overflow-y-auto">
            <h1 className="text-3xl font-bold text-center mb-8">Available Rooms</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {rooms.map((room) => (
                    <div key={room.id} onClick={() => setSelectedRoom(room)}>
                        <RoomCard room={room} />
                    </div>
                ))}
            </div>

            <BookingModal
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
    );

}
