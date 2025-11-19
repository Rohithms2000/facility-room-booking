"use client";

import BookingForm, { BookingFormData } from "./BookingForm";
import Calendar from "./BookingCalendar";
import { Room } from "@/services/roomService";
import { DateClickArg } from "@fullcalendar/interaction";
import { EventClickArg } from "@fullcalendar/core";
import { Control, FieldErrors, UseFormHandleSubmit, UseFormReset } from "react-hook-form";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  room?: Room | null;
  onSubmitBooking: (data: BookingFormData) => void;
  events: {
    id: string;
    title: string;
    start: string;
    end: string;
    backgroundColor?: string;
    embedded?: boolean;
  }[];
  onDateClick?: (arg: DateClickArg) => void;
  onEventClick?: (arg: EventClickArg) => void;
  onCalendarClick?: () => void;
  activeTab: "book" | "calendar";
  setActiveTab: React.Dispatch<React.SetStateAction<"book" | "calendar">>;
  control: Control<BookingFormData>;
  errors: FieldErrors<BookingFormData>;
  handleSubmit: UseFormHandleSubmit<BookingFormData>;
  reset: UseFormReset<BookingFormData>;
}

export default function BookingModal({
  isOpen,
  onClose,
  room,
  onSubmitBooking,
  events,
  onDateClick,
  onEventClick,
  onCalendarClick,
  activeTab,
  setActiveTab,
  control,
  errors,
  handleSubmit,
}: Readonly<ModalProps>) {

  if (!room) return null;

  const handleDateClickInternal = (arg: DateClickArg) => {
    if (onDateClick) onDateClick(arg);
    setActiveTab("book");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!max-w-2xl p-0">
        <DialogHeader>
          <DialogTitle></DialogTitle>
        </DialogHeader>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mt-2">
          <button
            onClick={() => setActiveTab("book")}
            className={`flex-1 py-2 text-center font-medium ${activeTab === "book"
              ? "border-b-2 border-green-600 text-green-600"
              : "text-gray-500 hover:text-green-600"
              }`}
          >
            Book Room
          </button>
          <button
            onClick={() => setActiveTab("calendar")}
            className={`flex-1 py-2 text-center font-medium ${activeTab === "calendar"
              ? "border-b-2 border-green-600 text-green-600"
              : "text-gray-500 hover:text-green-600"
              }`}
          >
            Calendar
          </button>
        </div>

        <div className="p-6">
          {activeTab === "book" && (
            <BookingForm
              room={room}
              control={control}
              errors={errors}
              handleSubmit={handleSubmit}
              onSubmitBooking={(data) => {
                onSubmitBooking(data);
              }}
            />
          )}

          {activeTab === "calendar" && (
            <Calendar
              events={events}
              onDateClick={handleDateClickInternal}
              onEventClick={onEventClick}
              onCalendarClick={onCalendarClick}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
