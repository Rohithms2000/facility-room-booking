"use client";

import { Booking } from "@/services/bookingService";
import { useState } from "react";

interface BookingCardProps {
    booking: Booking;
    roomName: string;
    isAdmin: boolean;
    onApprove?: () => void;
    onReject?: () => void;
    onCancel?: () => void;
}

export default function BookingCard({ booking, roomName, isAdmin, onApprove, onReject, onCancel }: Readonly<BookingCardProps>) {

    const [isCancellation, setIsCancellation] = useState(false);

    const getBookingStatusClass = (status: string) => {
        switch (status) {
            case "PENDING":
                return "text-yellow-500";
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
            className="bg-white p-4 space-y-4"
        >
            {isCancellation? (
                <div>
                    <p className="text-center">Are you sure you want to cancel the booking?</p>
                    <div className="flex justify-center mt-4">
                    <button
                        onClick={onCancel}
                        className="py-1 px-3 mr-2 bg-red-500/50 border-1 border-red-500 hover:text-white hover:bg-red-500 cursor-pointer"
                    >
                        Yes, Cancel
                    </button>
                    <button
                        onClick={()=> setIsCancellation(false)}
                        className="py-1 px-3 bg-gray-500/50 border-1 border-gray-500 hover:text-white hover:bg-gray-500 cursor-pointer"
                    >
                        Go back
                    </button>
                    </div>
                </div>
            ):(
                <div>
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
                            className="py-1 px-3 bg-green-500/50 border-1 border-green-500 hover:text-white hover:bg-green-500 cursor-pointer"
                        >
                            Approve
                        </button>

                        <button
                            onClick={onReject}
                            className="py-1 px-3 bg-red-500/50 border-1 border-red-500 hover:text-white hover:bg-red-500 cursor-pointer"
                        >
                            Reject
                        </button>
                    </>
                )}
                {isAdmin && booking.status === "APPROVED" && (
                    <button
                        onClick={()=> setIsCancellation(true)}
                        className="py-1 px-3 bg-red-500/50 border-1 border-red-500 hover:text-white hover:bg-red-500 cursor-pointer"
                    >
                        Cancel
                    </button>
                )}
                {!isAdmin && !isCancelDisabled && (
                    <button
                        onClick={()=> setIsCancellation(true)}
                        className="py-1 px-3 bg-red-500/50 border-1 border-red-500 hover:text-white hover:bg-red-500 cursor-pointer"
                    >
                        Cancel
                    </button>
                )}
            </div>
            </div>
            )}
        </div>
    );
}
