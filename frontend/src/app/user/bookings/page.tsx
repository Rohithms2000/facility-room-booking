// "use client";

// import BookingCard from "@/components/BookingCard";
// import Sidebar from "@/components/SideBar";
// import { Booking, getAllBookings } from "@/services/bookingService";
// import { getAllRooms, Room } from "@/services/roomService";
// import { useEffect, useState } from "react";

// export default function BookingsPage() {
//     const [bookings, setBookings] = useState<Booking[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [status, setStatus] = useState("");
//     const [errors, setErrors] = useState({});
//     const [rooms, setRooms] = useState<Room[]>([]);


//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const [roomData, bookingData] = await Promise.all([
//                     getAllRooms(),
//                     getAllBookings(),
//                 ]);
//                 setRooms(roomData);
//                 setBookings(bookingData);
//             } catch (err) {
//                 console.error("Error fetching data:", err);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchData();
//     }, []);


//     if (loading) return <svg className="size-5 animate-spin" viewBox="0 0 24 24">
//     </svg>;
//     return (
//         <div className="flex h-screen overflow-hidden">
//             <Sidebar />
//             <main className="flex-1 ml-60 overflow-y-auto bg-gray-100 p-8">
//                 <div className="min-h-screen bg-gray-100 py-10 px-5">
//                     <h1 className="text-3xl font-bold text-center mb-8">My Bookings</h1>

//                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//                         {bookings.length > 0 ? (
//                             bookings.map((booking) => {
//                                 const room = rooms.find((r) => r.id === booking.roomId);
//                                 return (
//                                     <BookingCard
//                                         key={booking.id}
//                                         booking={booking}
//                                         roomName={room?.name || "Unknown Room"}
//                                     />
//                                 );
//                             }
//                             )
//                         ) : (
//                             <p className="text-center text-gray-600 col-span-full">
//                                 No bookings found.
//                             </p>
//                         )}
//                     </div>
//                 </div>
//             </main>
//         </div>
//     );
// }
"use client";

import { useEffect, useState } from "react";
import Calendar from "@/components/BookingCalendar";
import { getAllBookings, Booking } from "@/services/bookingService";
import Sidebar from "@/components/SideBar";

export default function BookingsCalendarPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getAllBookings();
        setBookings(data);
      } catch (err) {
        console.error("Error loading bookings:", err);
      }
    };
    fetchBookings();
  }, []);

  const events = bookings.map((booking) => ({
    id: booking.id.toString(),
    title: booking.purpose || "Booking",
    start: booking.startTime!,
    end: booking.endTime!,
    backgroundColor: booking.status === "CANCELLED" ? "#f87171" : "#60a5fa",
  }));

  const handleEventClick = (arg: any) => {
    alert(`Booking details:\n${arg.event.title}\n${arg.event.start}`);
  };

  return (
    <div className="flex h-screen overflow-hidden">
        <Sidebar />
      <main className="flex-1 ml-60 overflow-y-auto bg-gray-100 p-8">
        <h1 className="text-3xl font-bold text-center mb-8">My Bookings Calendar</h1>
        <Calendar
          events={events}
          onEventClick={handleEventClick}
        />
      </main>
    </div>
  );
}
