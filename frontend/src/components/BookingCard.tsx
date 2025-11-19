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

export default function BookingCard({ booking, roomName, isAdmin, onApprove, onReject, onCancel }: Readonly<BookingCardProps>) {

    const getBookingStatusClass = (status: string) => {
        switch (status) {
            case "PENDING":
                return "text-blue-500";
            case "APPROVED":
                return "text-green-500";
            case "REJECTED":
                return "text-red-400";
            default:
                return "text-gray-300";
        }
    };

    const isCancelDisabled = !(booking.status === "APPROVED" || booking.status === "PENDING");



    return (
        <div
            className="bg-white p-4 space-y-4 cursor-pointer"
        >
            <div className="mt-3 text-center">
                <h2 className="text-xl text-gray-800 font-semibold">{roomName}</h2>
                <p className="text-gray-800 font-medium mt-2">{booking.purpose}</p>
                <p
                    className={`text-sm mt-2 ${getBookingStatusClass(booking.status)}`}
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
                {isAdmin && booking.status === "APPROVED" && (
                    <button
                        onClick={onCancel}
                        className="py-1 px-3 bg-red-500/50 border-1 border-red-500 hover:text-white hover:bg-red-500"
                    >
                        Cancel
                    </button>
                )}
                {!isAdmin && (
                    <button
                        onClick={onCancel}
                        disabled={isCancelDisabled}
                        className={`py-1 px-3
      ${isCancelDisabled
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
