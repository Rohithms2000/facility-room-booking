import api from "./api";

export interface Room {
  id: string;
  name: string;
  location: string;
  capacity: number | null;
  resources: string[];
  imageUrl?:string;
}
export interface RoomRequest {
  name: string;
  location: string;
  capacity: number | null;
  resources: string[];
}

export const getAllRooms = async (): Promise<Room[]> => {
  const response = await api.get("/user/rooms");
  return response.data;
};

export const getAdminRooms = async (): Promise<Room[]> => {
  const response = await api.get("/admin/rooms");
  return response.data;
};

export const createRoom = async (roomRequest: RoomRequest) => {
  const response = await api.post("/admin/rooms", roomRequest);
  return response.data;
};

export const editRoom = async (id: string, roomData: Partial<Room>) => {
  const response = await api.put(`/admin/rooms/${id}`, roomData);
  return response.data;
};

export const deleteRoom = async (id: string): Promise<void> => {
  await api.delete(`/admin/rooms/${id}`);
};
