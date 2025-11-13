"use client";

import BookingForm from "./BookingForm";
import Calendar from "./BookingCalendar";
import { Room } from "@/services/roomService";
import { DateClickArg } from "@fullcalendar/interaction";
import { EventClickArg } from "@fullcalendar/core";

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
  form?: {
    startTime: Date | null;
    endTime: Date | null;
    purpose: string;
  };
  errors?: {startTime?: string; endTime?: string; purpose?: string; general?: string | null };
  onChange: (field: string, value: string | Date | null) => void;
  onSubmit: (e: React.FormEvent) => void;
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
}

export default function BookingModal({
  isOpen,
  onClose,
  room,
  form,
  errors,
  onChange,
  onSubmit,
  events,
  onDateClick,
  onEventClick,
  onCalendarClick,
  activeTab,
  setActiveTab,
}: ModalProps) {
  if (!room) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!max-w-2xl p-0">
        <DialogHeader>
          <DialogTitle>
          </DialogTitle>
        </DialogHeader>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mt-2">
          <button
            onClick={() => setActiveTab("book")}
            className={`flex-1 py-2 text-center font-medium ${
              activeTab === "book"
                ? "border-b-2 border-green-600 text-green-600"
                : "text-gray-500 hover:text-green-600"
            }`}
          >
            Book Room
          </button>
          <button
            onClick={() => setActiveTab("calendar")}
            className={`flex-1 py-2 text-center font-medium ${
              activeTab === "calendar"
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
              startTime={form?.startTime || null}
              endTime={form?.endTime || null}
              purpose={form?.purpose || ""}
              errors={errors}
              onChange={onChange}
              onSubmit={onSubmit}
            />
          )}

          {activeTab === "calendar" && (
            <Calendar
              events={events}
              onDateClick={onDateClick}
              onEventClick={onEventClick}
              onCalendarClick={onCalendarClick}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
