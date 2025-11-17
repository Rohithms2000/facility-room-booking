"use client";

import { Booking } from "@/services/bookingService";

interface BookingCardProps {
    booking: Booking;
    roomName: string;
    isAdmin: boolean;
    onApprove?: () => void;
    onReject?: () => void;
    onCancel?: () => void;
}

export default function BookingCard({ booking, roomName, isAdmin, onApprove, onReject, onCancel }: BookingCardProps) {
    return (
        <div
            className="bg-white p-4 space-y-4 cursor-pointer"
        >
            <div className="mt-3 text-center">
                <h2 className="text-xl text-gray-800 font-semibold">{roomName}</h2>
                <p className="text-gray-800 font-medium mt-2">{booking.purpose}</p>
                <p
                    className={`text-sm mt-2 ${booking.status === "PENDING"
                        ? "text-blue-500"
                        : booking.status === "APPROVED"
                            ? "text-green-500"
                            : booking.status === "REJECTED"
                                ? "text-red-400"
                                : "text-gray-300"
                        }`}
                >
                    {booking.status}
                </p>

                <p className="text-gray-500 text-sm">{String(booking.startTime)} - {String(booking.endTime)}</p>
            </div>
            <div className="flex justify-center gap-2 mt-4">
                {isAdmin && booking.status === "PENDING" && (
                    <>
                        <button
                            onClick={onApprove}
                            className="py-1 px-3 bg-blue-500/50 border-1 border-blue-500 hover:text-white hover:bg-blue-500"
                        >
                            Approve
                        </button>

                        <button
                            onClick={onReject}
                            className="py-1 px-3 bg-red-500/50 border-1 border-red-500 hover:text-white hover:bg-red-500"
                        >
                            Reject
                        </button>
                    </>
                )}
                {!isAdmin && (
                    <button
                        onClick={onCancel}
                        disabled={!(booking.status === "APPROVED" || booking.status === "PENDING")}
                        className={`py-1 px-3
      ${!(booking.status === "APPROVED" || booking.status === "PENDING")
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-red-500/50 border-1 border-red-500 hover:text-white hover:bg-red-500"
                            }`}>
                        Cancel
                    </button>
                )}
            </div>
        </div>
    );
}
