// "use client";

// import { useEffect, useState } from "react";
// import Sidebar from "@/components/SideBar";
// import Calendar from "@/components/BookingCalendar";
// import { getAllRooms, Room } from "@/services/roomService";
// import { createBooking, getBookingsForRoom } from "@/services/bookingService";
// import Modal from "@/components/Modal";
// import BookingForm from "@/components/BookingForm";

// interface CalendarEvent {
//     id: string;
//     title: string;
//     start: string;
//     end: string;
//     backgroundColor?: string;
// }

// export default function BookingsCalendarPage() {
//     const [rooms, setRooms] = useState<Room[]>([]);
//     const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
//     const [events, setEvents] = useState<CalendarEvent[]>([]);
//     const [loading, setLoading] = useState(true);

//     // Modal + form states
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [form, setForm] = useState({
//         startTime: "",
//         endTime: "",
//         purpose: "",
//     });
//     const [errors, setErrors] = useState<{ [key: string]: string }>({});

//     useEffect(() => {
//         const fetchRooms = async () => {
//             try {
//                 const data = await getAllRooms();
//                 setRooms(data);
//             } catch (err) {
//                 console.error("Error fetching rooms:", err);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchRooms();
//     }, []);

//     const handleRoomChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
//         const roomId = e.target.value;
//         setSelectedRoom(roomId);

//         if (!roomId) {
//             setEvents([]);
//             return;
//         }

//         try {
//             const bookings = await getBookingsForRoom(roomId);
//             console.log("Fetched bookings result:", bookings);

//             const eventsData = bookings.map((b: any) => ({
//                 id: b.id,
//                 title: "Booked",
//                 start: b.startTime,
//                 end: b.endTime,
//                 backgroundColor:"#f87171" 
//             }));
//             setEvents(eventsData);
//         } catch (err) {
//             console.error("Error fetching bookings:", err);
//         }
//     };

//     const handleDateClick = (arg: any) => {
//         console.log("Date clicked:", arg.dateStr);
//         setForm({
//             startTime: arg.dateStr,
//             endTime: "",
//             purpose: "",
//         });
//         setIsModalOpen(true);
//     };

//     const handleEventClick = (arg: any) => {
//         console.log("Event clicked:", arg.event);
//     };

//     const handleClose = () => {
//         setIsModalOpen(false);
//         setForm({ startTime: "", endTime: "", purpose: "" });
//         setErrors({});
//     };

//     const handleChange = (field: string, value: string) => {
//         setForm((prev) => ({ ...prev, [field]: value }));
//     };

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         try {
//             await createBooking({
//                 roomId: selectedRoom ? selectedRoom : null,
//                 startTime: form.startTime,
//                 endTime: form.endTime,
//                 purpose: form.purpose
//             }
//             );
//             alert("Room booked successfully!");
//             setSelectedRoom(null);
//             setForm({
//                 startTime: "",
//                 endTime: "",
//                 purpose: "",
//             });
//         } catch (error: any) {
//             setErrors({ general: error.response?.data?.message || "Booking failed!" });
//         }
//         handleClose();
//     }


//     if (loading) return <div className="p-8">Loading...</div>;

//     return (
//         <div className="flex h-screen overflow-hidden">
//             <Sidebar />
//             <main className="flex-1 ml-60 overflow-y-auto bg-gray-100 p-8">
//                 <h1 className="text-3xl font-bold text-center mb-8">
//                     Booking Calendar
//                 </h1>

//                 {/* Room Dropdown */}
//                 <div className="flex justify-center mb-6">
//                     <select
//                         className="border border-gray-400 rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
//                         value={selectedRoom || ""}
//                         onChange={handleRoomChange}
//                     >
//                         <option value="">Select a Room</option>
//                         {rooms.map((room: any) => (
//                             <option key={room.id} value={room.id}>
//                                 {room.name}
//                             </option>
//                         ))}
//                     </select>
//                 </div>

//                 {/* Calendar */}
//                 {selectedRoom ? (
//                     <Calendar
//                         events={events}
//                         onDateClick={handleDateClick}
//                         onEventClick={handleEventClick}
//                     />
//                 ) : (
//                     <p className="text-center text-gray-600 mt-10">
//                         Please select a room to check availability.
//                     </p>
//                 )}

//                 {/* Booking Modal */}
//                 <Modal
//                     isOpen={isModalOpen}
//                     onClose={handleClose}
//                     title="Book a Room"
//                 >
//                     {selectedRoom && (
//                         <BookingForm
//                             room={rooms.find((r) => r.id === selectedRoom)!}
//                             startTime={form.startTime ? new Date(form.startTime) : null}
//                             endTime={form.endTime ? new Date(form.endTime) : null}
//                             purpose={form.purpose}
//                             errors={errors}
//                             onChange={handleChange}
//                             onSubmit={handleSubmit}
//                         />
//                     )}
//                 </Modal>

//             </main>
//         </div>
//     );
// }
