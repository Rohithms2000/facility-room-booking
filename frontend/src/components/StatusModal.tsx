"use client";

import { Booking } from "@/services/bookingService";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import BookingCard from "./BookingCard";

interface StatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking;
  roomName: string;
  isAdmin: boolean;
  onApprove?: () => void;
  onReject?: () => void;
  onCancel?: () => void;
}

export default function BookingModal({
  isOpen,
  onClose,
  booking,
  roomName,
  isAdmin,
  onApprove,
  onReject,
  onCancel,
}: StatusModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold pt-2 border-b text-center text-gray-900">
            Booking Details
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 pb-6">
          <BookingCard
            booking={booking}
            roomName={roomName}
            isAdmin={isAdmin}
            onApprove={onApprove}
            onReject={onReject}
            onCancel={onCancel}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
