"use client";

import { Booking } from "@/services/bookingService";

interface BookingCardProps {
    booking: Booking;
    roomName: string;
}

export default function BookingCard({ booking, roomName }: BookingCardProps) {
    return (
        <div
            className="bg-white rounded-2xl shadow-md p-4 hover:shadow-lg transition cursor-pointer"
        >
            <div className="mt-3 text-center">
                <h2 className="text-xl text-gray-800 font-semibold">{roomName}</h2>
                <p className="text-blue-500 text-sm mt-1">{booking.status}</p>
                <p className="text-gray-800 font-medium mt-1">{booking.purpose}</p>
                <p className="text-gray-500 text-sm">{booking.startTime} to {booking.endTime}</p>
            </div>
            <div className="flex justify-center">
            <button
                className="bg-red-600 text-white hover:bg-red-700 focus:bg-red-700 focus:ring-2 focus:ring-red-400 cursor-pointer focus:cursor-progress font-medium rounded-lg py-1 px-2 mt-2"
            >
                Cancel
            </button>
            </div>
        </div>
    );
}
