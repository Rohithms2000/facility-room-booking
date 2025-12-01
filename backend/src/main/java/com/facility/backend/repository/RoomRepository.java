package com.facility.backend.repository;

import com.facility.backend.model.Room;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface RoomRepository extends MongoRepository<Room, String>, CustomRoomRepository {
    List<Room> findByCreatedBy(String adminId);
}