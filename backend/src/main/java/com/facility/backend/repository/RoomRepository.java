package com.facility.backend.repository;

import com.facility.backend.model.Room;
import com.facility.backend.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface RoomRepository extends MongoRepository<Room, String> {
}
