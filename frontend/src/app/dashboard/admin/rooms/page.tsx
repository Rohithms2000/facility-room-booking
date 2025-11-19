"use client";

import { useCallback, useEffect, useState } from "react";
import { getAdminRooms, createRoom, editRoom, deleteRoom, Room } from "@/services/roomService";
import RoomCard from "@/components/RoomCard";
import RoomModal from "@/components/RoomModal";
import RoomCreationForm from "@/components/RoomCreationForm";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

export default function RoomCreationPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);

  const fetchRooms = useCallback(async () => {
    try {
      const data = await getAdminRooms();
      setRooms(data);
    } catch (err) {
      console.error("Error fetching rooms:", err);
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      await fetchRooms();
    };

    load();
  }, [fetchRooms]);

  const handleOpenModal = (room?: Room) => {
    setEditingRoom(room || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingRoom(null);
  };

  const handleSubmit = async (data: {
    name: string;
    capacity: number | null;
    location: string;
    resources: string[];
  }) => {
    try {
      if (editingRoom) {
        await editRoom(editingRoom.id, data);
        toast.success("Room updated successfully!");
      } else {
        await createRoom(data);
        toast.success("Room created successfully!");
      }
      await fetchRooms();
      handleCloseModal();
    } catch (err) {
      console.error("Error saving room:", err);
      const axiosError = err as AxiosError<{ message: string }>;
      toast.error(axiosError.response?.data?.message || "Something went wrong");
    }
  };

  const handleDelete = async () => {
    if (!editingRoom) return;
    try {
      await deleteRoom(editingRoom.id);
      await fetchRooms();
      handleCloseModal();
      toast.success("Room deleted successfully!");
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
            <RoomCard key={room.id} room={room} onClick={() => handleOpenModal(room)} />
          ))
        ) : (
          <p className="text-gray-500 text-center col-span-full">No rooms available</p>
        )}
      </div>

      <RoomModal isOpen={isModalOpen} roomId={editingRoom?.id || ""} onClose={handleCloseModal}>
        <RoomCreationForm
          defaultValues={
            editingRoom
              ? {
                name: editingRoom.name,
                capacity: editingRoom.capacity,
                location: editingRoom.location,
                resources: editingRoom.resources || [],
              }
              : undefined
          }
          onSubmit={handleSubmit}
          submitText={editingRoom ? "Update" : "Create"}
          onDelete={editingRoom ? handleDelete : undefined}
        />
      </RoomModal>
    </div>
  );
}
