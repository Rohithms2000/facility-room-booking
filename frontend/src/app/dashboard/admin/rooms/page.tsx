"use client";

import { useEffect, useState } from "react";
import { getAdminRooms, createRoom, editRoom, deleteRoom, Room } from "@/services/roomService";
import RoomCard from "@/components/RoomCard";
import RoomModal from "@/components/RoomCreationModal";
import RoomCreationForm from "@/components/RoomCreationForm";

export default function RoomCreationPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [formData, setFormData] = useState<{
    id?: string;
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
  const [errors, setErrors] = useState<{ name?: string; capacity?: string; location?: string; resources?: string; general?: string | null }>({});

  const fetchRooms = async () => {
    try {
      const data = await getAdminRooms();
      setRooms(data);
    } catch (err) {
      console.error("Error fetching rooms:", err);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleOpenModal = (room?: Room) => {
    if (room) {
      setEditingRoom(room);
      setFormData({
        name: room.name,
        capacity: room.capacity,
        location: room.location,
        resources: room.resources || [],
      });
    } else {
      setEditingRoom(null);
      setFormData({ name: "", capacity: null, location: "", resources: [] });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingRoom(null);
    setFormData({ name: "", capacity: null, location: "", resources: [] });
    setErrors({});
  };

  const handleInputChange = (field: string, value: string | number | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined, general: null }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, capacity, location, resources } = formData;
    const newErrors: typeof errors = {};

    if (!name) newErrors.name = "Name is required";
    if (!capacity) newErrors.capacity = "Capacity is required";
    if (!location) newErrors.location = "Location is required";
    if (!resources || resources.length < 2) {
      newErrors.resources = "Select at least two resources";
    }



    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    try {
      if (editingRoom) {
        await editRoom(editingRoom.id, formData);
        alert("Room updated successfully!");
      } else {
        await createRoom(formData);
        alert("Room created successfully!");
      }
      await fetchRooms();
      handleCloseModal();
    } catch (err: any) {
      console.error("Error saving room:", err);
      const errorData = err.response?.data;
      const firstErrorMessage = errorData ? Object.values(errorData)[0] as string : "Something went wrong";
      setErrors({ general: firstErrorMessage });

    }
  };

  const handleDelete = async () => {
    if (!editingRoom) return;
    try {
      await deleteRoom(editingRoom.id);
      await fetchRooms();
      handleCloseModal();
      alert("Room deleted successfully!");
    } catch (err) {
      console.error("Error deleting room:", err);
    }
  };

  return (
    <div className="flex-1 bg-gray-100 p-8 overflow-y-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Rooms</h1>
        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2 bg-gray-700 text-white font-semibold rounded-lg shadow hover:bg-gray-800 transition"
        >
          + Create Room
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.length > 0 ? (
          rooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              onClick={() => handleOpenModal(room)}
            />
          ))
        ) : (
          <p className="text-gray-500 text-center col-span-full">
            No rooms available
          </p>
        )}
      </div>

      <RoomModal isOpen={isModalOpen} roomId={editingRoom?.id || ""} onClose={handleCloseModal}>
        <RoomCreationForm
          name={formData.name}
          capacity={formData.capacity}
          location={formData.location}
          resources={formData.resources}
          errors={errors}
          onInputChange={handleInputChange}
          onSubmit={handleSubmit}
          title={editingRoom ? "Edit Room" : "Create Room"}
          submitText={editingRoom ? "Update" : "Create"}
          onDelete={editingRoom ? handleDelete : undefined}
        />
      </RoomModal>
    </div>
  );
}
