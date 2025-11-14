"use client";

import { useForm, Controller } from "react-hook-form";
import Select from "react-select";

interface RoomFormData {
  name: string;
  capacity: number | null;
  location: string;
  resources: string[];
}

interface RoomFormProps {
  defaultValues?: RoomFormData;
  onSubmit: (data: RoomFormData) => void;
  submitText: string;
  onDelete?: () => void | Promise<void>;
}

export default function RoomCreationForm({
  defaultValues,
  onSubmit,
  submitText,
  onDelete,
}: RoomFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RoomFormData>({
    defaultValues: defaultValues || {
      name: "",
      capacity: null,
      location: "",
      resources: [],
    },
  });

  const resourceOptions = [
    { value: "WiFi", label: "WiFi" },
    { value: "AC", label: "AC" },
    { value: "Projector", label: "Projector" },
    { value: "Whiteboard", label: "Whiteboard" },
    { value: "TV", label: "TV" },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Name */}
      <div>
        <label className="block font-semibold">Name</label>
        <input
          type="text"
          {...register("name", {
            required: "Room name is required",
            setValueAs: (v) => v.trim(),
          })}
          className={`input border rounded p-2 w-full mb-2 focus:outline-none ${errors.name ? "border-red-500" : "border-gray-300"
            }`}
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
      </div>

      {/* Capacity */}
      <div>
        <label className="block font-semibold">Capacity</label>
        <input
          type="number"
          {...register("capacity", {
            required: "Capacity is required",
            min: { value: 20, message: "Must be at least 20" },
          })}
          className={`input border rounded p-2 w-full mb-2 focus:outline-none ${errors.capacity ? "border-red-500" : "border-gray-300"
            }`}
        />
        {errors.capacity && <p className="text-red-500 text-sm">{errors.capacity.message}</p>}
      </div>

      {/* Location */}
      <div>
        <label className="block font-semibold">Location</label>
        <input
          type="text"
          {...register("location", {
            required: "Location is required",
            setValueAs: (v) => v.trim(),
          })}
          className={`input border rounded p-2 w-full mb-2 focus:outline-none ${errors.location ? "border-red-500" : "border-gray-300"
            }`}
        />
        {errors.location && <p className="text-red-500 text-sm">{errors.location.message}</p>}
      </div>

      {/* Resources */}
      <div>
        <label className="block font-semibold">Resources</label>
        <Controller
          control={control}
          name="resources"
          rules={{
            validate: (value) =>
              value && value.length >= 2 ? true : "Select at least two resources",
          }}
          render={({ field }) => (
            <Select
              isMulti
              options={resourceOptions}
              value={resourceOptions.filter((opt) => field.value.includes(opt.value))}
              className={`input border rounded p-2 w-full mb-2 focus:outline-none ${errors.resources ? "border-red-500" : "border-gray-300"
                }`}
              onChange={(selectedOptions) =>
                field.onChange(selectedOptions.map((opt) => opt.value))
              }
            />
          )}
        />
        {errors.resources && (
          <p className="text-red-500 text-sm">{errors.resources.message}</p>
        )}
      </div>

      {/* Buttons */}
      <div className="flex justify-end space-x-3 mt-6">
        {onDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="border-1 border-red-500 bg-red-500/40 px-4 py-2 hover:text-white hover:bg-red-500 transition duration-200"
          >
            Delete
          </button>
        )}
        <button
          type="submit"
          className="border-1 border-green-500 bg-green-500/40 px-4 py-2 hover:text-white hover:bg-green-500 transition duration-200"
        >
          {submitText}
        </button>
      </div>
    </form>
  );
}
