"use client";

import { useEffect, useState } from "react";
import { createRoom, getAdminRooms, Room } from "@/services/roomService";
import RoomCreationForm from "@/components/RoomCreationForm";
import Sidebar from "@/components/SideBar";
import RoomCard from "@/components/RoomCard";

export default function RoomCreationPage() {
    const [form, setForm] = useState<{
        name: string;
        capacity: number | null;
        location: string;
        resources: string[];
    }>({
        name: "",
        capacity: null,
        location: "",
        resources: [],
    });

    const [errors, setErrors] = useState<{ name?: string; capacity?: string; location?: string; resources?: string; general?: string }>({});
    const [rooms, setRooms] = useState<Room[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const data = await getAdminRooms();
                setRooms(data);
            } catch (err) {
                console.error("Error fetching rooms:", err);
            }
        };

        fetchRooms();
    }, []);

    const handleChange = (field: string, value: any) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleClose = () => {
        setIsModalOpen(false);
        setForm({
            name: "",
            capacity: null,
            location: "",
            resources:[]
        });
        setErrors({});
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        const newErrors: typeof errors = {};
        if (!form.name) newErrors.name = "name is required";
        if (!form.capacity) newErrors.capacity = "Capacity is required";
        if (!form.location) newErrors.location = "Location is required";
        if (!form.resources || form.resources.length < 2) newErrors.resources = "A minimum of 2 resources is required";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        if (!form.name || !form.capacity || !form.location || !form.resources) {
            setErrors({ general: "Please fill all fields" });
            return;
        }
        try {
            await createRoom({
                name: form.name,
                capacity: form.capacity,
                location: form.location,
                resources: form.resources
            }
            );
            alert("Room created successfully!");
            setForm({
                name: "",
                capacity: null,
                location: "",
                resources: []
            });
        } catch (error: any) {
            setErrors({ general: error.response?.data?.message || "Room creation failed!" });
        }

        
    };

    return(
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Sidebar fixed on the left */}
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 ml-60 overflow-y-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Available Rooms</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition"
          >
            + Create Room
          </button>
        </div>

        {/* Rooms Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.length > 0 ? (
            rooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))
          ) : (
            <p className="text-gray-500 text-center col-span-full">
              No rooms available
            </p>
          )}
        </div>

        {/* Modal form */}
        <RoomCreationForm
          isOpen={isModalOpen}
          onClose={handleClose}
          name={form.name}
          capacity={form.capacity}
          location={form.location}
          resources={form.resources}
          errors={errors}
          onInputChange={handleChange}
          onSubmit={handleSubmit}
        />
      </main>
    </div>
  );
}