"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin, {DateClickArg} from "@fullcalendar/interaction";
import { EventClickArg } from "@fullcalendar/core";

interface CalendarProps {
  events: {
    id: string;
    title: string;
    start: string;
    end: string;
    backgroundColor?: string;
  }[];
  onDateClick?: (arg: DateClickArg) => void;
  onEventClick?: (arg: EventClickArg) => void;
  onCalendarClick?: () => void;
}

export default function Calendar({ events, onDateClick, onEventClick }: CalendarProps) {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
        initialView="dayGridMonth"
        selectable={true}
        editable={false}
        height="70vh"
        events={events}
        dateClick={onDateClick}
        eventClick={onEventClick}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
        }}
      />
    </div>
  );
}
