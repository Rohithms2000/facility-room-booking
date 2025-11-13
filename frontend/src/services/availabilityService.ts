import api from "./api";

interface AvailabilityRequest {
    roomId: string;
    ruleType: string;
    date: string | null;
    dayOfWeek: string | null;
    startTime: string | null;
    endTime: string | null;
    reason: string;
}

export const addAvailabilityRule = async (availabilityRequest: AvailabilityRequest) => {
    const response = await api.post(`/availability`, availabilityRequest);
    return response.data;
};

export const getRules = async (roomId: string) => {
    const response = await api.get(`/availability/${roomId}`);
    return response.data;
};

export const deleteRule = async (ruleId: string): Promise<void> => {
  await api.delete(`/availability/${ruleId}`);
};