package com.facility.backend.repository;

import com.facility.backend.model.Room;

import java.util.List;

public interface CustomRoomRepository {

    List<Room> searchRooms(Integer minCapacity, Integer maxCapacity, String location, List<String> resources);
}
