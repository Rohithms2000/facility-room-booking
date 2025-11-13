"use client";

import { Room } from "@/services/roomService";
import DatePicker from "react-datepicker";

interface BookingFormProps {
    room: Room;
    startTime: Date | null;
    endTime: Date | null;
    purpose: string;
    errors?: { startTime?: string; endTime?: string; purpose?: string; general?: string | null };
    onChange: (field: string, value: string | Date | null) => void;
    onSubmit: (e: React.FormEvent) => void;
}

export default function BookingForm({
    room,
    startTime,
    endTime,
    purpose,
    errors,
    onChange,
    onSubmit,
}: BookingFormProps) {
    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <input
                type="text"
                name="roomName"
                value={room.name}
                readOnly
                className="border border-gray-300 bg-gray-100 rounded p-2 w-full mb-4 focus:outline-none"
            />

            <label className="block">
                <span className="font-semibold mr-4">Start Time</span>
            </label>
            <DatePicker
                selected={startTime}
                onChange={(date) => onChange("startTime", date)}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={30}
                dateFormat="yyyy-MM-dd HH:mm"
                placeholderText="Select start time"
                className="border p-2 rounded w-100"
            />
            <p className="text-red-500 text-sm">{errors?.startTime}</p>
            <label className="block">
                <span className="font-semibold mr-4">End Time</span>
            </label>
            <DatePicker
                selected={endTime}
                onChange={(date) => onChange("endTime", date)}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={30}
                dateFormat="yyyy-MM-dd HH:mm"
                placeholderText="Select end time"
                className="border p-2 rounded w-100"
                minDate={startTime || undefined}
            />
            <p className="text-red-500 text-sm">{errors?.endTime}</p>

            <input
                type="text"
                name="purpose"
                value={purpose}
                onChange={(e) => onChange("purpose", e.target.value)}
                placeholder="Purpose"
                className="border border-gray-300 rounded p-2 w-full mb-2 focus:outline-none focus:border-gray-500"
            />
            <p className="text-red-500 text-sm">{errors?.purpose}</p>
            <p className="text-red-500 text-sm">{errors?.general}</p>

            <div className="flex justify-end">
                <button
                    type="submit"
                    className="text-white bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-green-300 cursor-pointer font-medium rounded-lg px-4 py-2 mt-2"
                >
                    Book Room
                </button>
            </div>

        </form>
    );
}
