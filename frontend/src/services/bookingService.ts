import api from "./api";

export interface BookingRequest {
    roomId: string | null;
    startTime: string | null;
    endTime: string | null;
    purpose: string;
}

export interface Booking {
    id: string;
    roomId: string;
    startTime: string | null;
    endTime: string | null;
    status: string;
    purpose: string;
}

export const createBooking = async (bookingData: BookingRequest) => {
    const response = await api.post("/user/bookings", bookingData);
    return response.data;
};

export const getAllBookings = async (): Promise<Booking[]> => {
    const response = await api.get("/user/bookings");
    return response.data;
};

export const getBookingsForRoom = async (roomId: string): Promise<Booking[]> => {
  try {
    const response = await api.get(`/user/rooms/${roomId}/bookings`);

    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return [];
  }
};

export const getBookingsForAdmin = async (): Promise<Booking[]> => {
  try {
    const response = await api.get(`/admin/bookings`);

    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return [];
  }
};