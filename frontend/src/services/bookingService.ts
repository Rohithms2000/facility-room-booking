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
    startTime: string | Date;
    endTime: string | Date;
    status: string;
    purpose: string;
}

export interface BookingStats{
  totalBookings: number;
  approved: number;
  pending: number;
  cancelled: number;
  rejected: number;
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

export const updateBookingStatus = async (id: string, status: string) : Promise<Booking[]> => {
    const response = await api.patch(`/admin/bookings/status/${id}?status=${status}`);
    return response.data;
};

export const cancelBooking = async (id: string) : Promise<Booking[]> => {
    const response = await api.patch(`/user/bookings/cancel/${id}`);
    return response.data;
};

export const getBookingStats = async (): Promise<BookingStats> => {
    const response = await api.get("/admin/bookingStats");
    return response.data;
};