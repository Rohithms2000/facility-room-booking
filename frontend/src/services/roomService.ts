import api from "./api";

export interface Room {
  id: string;
  name: string;
  location: string;
  capacity: number | null;
  resources: string[];
  imageUrl?: string;
}
export interface RoomRequest {
  name: string;
  location: string;
  capacity: number | null;
  resources: string[];
}

export interface RoomFilterRequest {
  minCapacity?: number | string;
  maxCapacity?: number | string;
  location?: string;
  resources?: string[];
}

export const getRooms = async (filters: RoomFilterRequest): Promise<Room[]> => {

  const params = new URLSearchParams();
  if (filters?.minCapacity !== "" && filters?.minCapacity !== undefined) {
    params.append("minCapacity", String(filters.minCapacity));
  }
  if (filters?.maxCapacity !== "" && filters?.maxCapacity !== undefined) {
    params.append("maxCapacity", String(filters.maxCapacity));
  }
  if (filters.location) params.append("location", filters.location);

  if (Array.isArray(filters.resources) && filters.resources.length > 0) {
    for (const res of filters.resources) {
      params.append("resources", res);
    }

  }

  const response = await api.get(`/user/rooms?${params.toString()}`);
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
