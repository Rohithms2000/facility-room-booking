"use client";

import { Controller, Control, FieldErrors, UseFormHandleSubmit } from "react-hook-form";
import { Room } from "@/services/roomService";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export interface BookingFormData {
  startTime: Date | null;
  endTime: Date | null;
  purpose: string;
}

interface BookingFormProps {
  room: Room;
  control: Control<BookingFormData>;
  errors: FieldErrors<BookingFormData>;
  handleSubmit: UseFormHandleSubmit<BookingFormData>;
  onSubmitBooking: (data: BookingFormData) => void;
}

export default function BookingForm({
  room,
  control,
  errors,
  handleSubmit,
  onSubmitBooking,
}: Readonly<BookingFormProps>) {
  return (
    <form onSubmit={handleSubmit(onSubmitBooking)} className="space-y-4">
      <input
        type="text"
        value={room.name}
        readOnly
        className="border border-gray-300 bg-gray-100 rounded p-2 w-full mb-4 focus:outline-none"
      />

      {/* Start Time */}
      <label htmlFor="startTime" className="block font-semibold">Start Time</label>
      <Controller
        name="startTime"
        control={control}
        rules={{ required: "Start time is required" }}
        render={({ field }) => (
          <DatePicker
            id="startTime"
            selected={field.value}
            onChange={field.onChange}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={30}
            dateFormat="yyyy-MM-dd HH:mm"
            placeholderText="Select start time"
            className="border p-2 rounded w-full"
          />
        )}
      />
      {errors.startTime && <p className="text-red-500 text-sm">{errors.startTime.message}</p>}

      {/* End Time */}
      <label htmlFor="endTime" className="block font-semibold">End Time</label>
      <Controller
        name="endTime"
        control={control}
        rules={{
          required: "End time is required",
          validate: (value, formValues) =>
            !formValues.startTime || !value || value > formValues.startTime
              ? true
              : "End time must be after start time",
        }}
        render={({ field }) => (
          <DatePicker
            id="endTime"
            selected={field.value}
            onChange={field.onChange}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={30}
            dateFormat="yyyy-MM-dd HH:mm"
            placeholderText="Select end time"
            className={`input border rounded p-2 w-full mb-2 focus:outline-none ${errors.endTime ? "border-red-500" : "border-gray-300"
              }`}
          />
        )}
      />
      {errors.endTime && <p className="text-red-500 text-sm">{errors.endTime.message}</p>}

      {/* Purpose */}
      <input
        type="text"
        placeholder="Purpose"
        {...control.register("purpose", {
          required: "Purpose is required",
          minLength: { value: 5, message: "Purpose must be a minimum of 5  characters" },
        })}
        className={`input border rounded p-2 w-full mb-2 focus:outline-none ${errors.purpose ? "border-red-500" : "border-gray-300"
          }`}
      />
      {errors.purpose && <p className="text-red-500 text-sm">{errors.purpose.message}</p>}

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
