"use client";

import { useEffect, useState } from "react";
import RoomCard from "@/components/RoomCard";
import { getAllRooms, Room } from "@/services/roomService";
import { Booking, createBooking, getBookingsForRoom } from "@/services/bookingService";
import BookingModal from "@/components/BookingModal";
import { getRules, Rule } from "@/services/availabilityService";
import { EventClickArg } from "@fullcalendar/core";
import { DateClickArg } from "@fullcalendar/interaction";
import { useForm } from "react-hook-form";
import SearchBar from "@/components/SearchBar";
import { BookingFormData } from "@/components/BookingForm";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

interface CalendarEvent {
    id: string;
    title: string;
    start: string;
    end: string;
    backgroundColor?: string;
}

export default function RoomsPage() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [filterRooms, setFilterRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [activeTab, setActiveTab] = useState<"book" | "calendar">("book");
    const [query, setQuery] = useState("");

    const {
        handleSubmit,
        setValue,
        reset,
        control,
        formState: { errors },
    } = useForm<BookingFormData>({
        defaultValues: {
            startTime: null,
            endTime: null,
            purpose: "",
        },
    });

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const data = await getAllRooms();
                setRooms(data);
                setFilterRooms(data);
            } catch (err) {
                console.error("Error fetching rooms:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchRooms();
    }, []);

    const handleClose = () => {
        setSelectedRoom(null);
        reset();
    };

    const handleBookingSubmit = async (data: BookingFormData) => {
        if (!selectedRoom) return;

        try {
            await createBooking({
                roomId: selectedRoom.id,
                startTime: data.startTime?.toISOString() || null,
                endTime: data.endTime?.toISOString() || null,
                purpose: data.purpose,
            });

            toast.success("Room booked successfully!");
            setSelectedRoom(null);
            reset();
        } catch (error) {
            console.error("Booking failed:", error);
            const axiosError = error as AxiosError<{ message: string }>;
            const message = axiosError.response?.data?.message || "Something went wrong.";
            toast.error(message);
        }
    };

    const handleDateClick = (arg: DateClickArg) => {
        console.log("Date clicked:", arg.dateStr);
        const date = new Date(arg.dateStr);
        setValue("startTime", date);
        setValue("endTime", null);
    };

    const handleEventClick = (arg: EventClickArg) => {
        console.log("Event clicked:", arg.event);
    };

    const handleCalendarClick = async () => {
        const roomId = selectedRoom?.id;
        if (!roomId) {
            setEvents([]);
            return;
        }

        try {
            const bookings = await getBookingsForRoom(roomId);
            const rules = await getRules(roomId);

            const bookingEvents = bookings.map((b: Booking) => ({
                id: b.id,
                title: "Booked",
                start: b.startTime,
                end: b.endTime,
                backgroundColor: "#f87171",
            }));

            const convertDayToNumber = (day: string) => {
                const map: Record<string, number> = {
                    MONDAY: 1,
                    TUESDAY: 2,
                    WEDNESDAY: 3,
                    THURSDAY: 4,
                    FRIDAY: 5,
                    SATURDAY: 6,
                    SUNDAY: 0,
                };
                return map[day];
            };

            const ruleEvents = rules.flatMap((rule: Rule) => {
                switch (rule.ruleType) {
                    case "HOLIDAY":
                        return [
                            {
                                title: `Holiday: ${rule.reason}`,
                                start: rule.date,
                                allDay: true,
                                backgroundColor: "#f87171",
                            },
                        ];
                    case "WEEKLY_CLOSED":
                        return [
                            {
                                title: `Closed: ${rule.reason}`,
                                daysOfWeek: [convertDayToNumber(rule.dayOfWeek!)],
                                backgroundColor: "#9ca3af",
                            },
                        ];
                    case "TIME_BLOCK":
                        return [
                            {
                                title: `Blocked: ${rule.reason}`,
                                startTime: rule.startTime,
                                endTime: rule.endTime,
                                daysOfWeek: [convertDayToNumber(rule.dayOfWeek!)],
                                backgroundColor: "#fbbf24",
                            },
                        ];
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab, selectedRoom]);

    const handleSearch = () => {
        if (query) {
            const filteredRooms = rooms.filter(room =>
                room.name.toLowerCase().includes(query.toLowerCase())
                || room.location.toLowerCase().includes(query.toLowerCase())
                || room.resources.some(value => value.toLowerCase().includes(query.toLowerCase()))
            );
            setFilterRooms(filteredRooms);
        } else {
            setFilterRooms(rooms);
        }
    };

    if (loading)
        return <svg className="size-5 animate-spin" viewBox="0 0 24 24"></svg>;

    return (
        <div className="flex-1 bg-gray-100 p-8 overflow-y-auto">
            <h1 className="text-3xl font-bold text-center mb-8">Available Rooms</h1>
            <SearchBar
                value={query}
                onChange={setQuery}
                onSearch={handleSearch}
                placeholder="Search rooms..."
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filterRooms.map((room) => (
                    <RoomCard key={room.id} onClick={() => setSelectedRoom(room)} room={room} />
                ))}
            </div>

            <BookingModal
                isOpen={!!selectedRoom}
                onClose={handleClose}
                room={selectedRoom}
                onSubmitBooking={handleBookingSubmit}
                events={events}
                onDateClick={handleDateClick}
                onEventClick={handleEventClick}
                onCalendarClick={handleCalendarClick}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                control={control}
                errors={errors}
                handleSubmit={handleSubmit}
                reset={reset}
            />
        </div>
    );
}
