"use client";

import { useState } from "react";
import BookingForm from "./BookingForm";
import Calendar from "./BookingCalendar";
import { Room } from "@/services/roomService";
import { DateClickArg } from "@fullcalendar/interaction";
import { EventClickArg } from "@fullcalendar/core";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  room?: Room | null;
  form?: {
    startTime: Date | null;
    endTime: Date | null;
    purpose: string;
  };
  errors?: any;
  onChange: (field: string, value: any) => void;
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


export default function Modal({
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
  setActiveTab
}: ModalProps) {


  if (!isOpen || !room) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-xs z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-900"
        >
          ✕
        </button>

        <div className="flex border-b border-gray-200 mb-4">
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

        <div>
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
      </div>
    </div>
  );
}
