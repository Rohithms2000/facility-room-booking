package com.facility.backend.repository;

import com.facility.backend.model.Booking;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface BookingRepository extends MongoRepository<Booking, String>, CustomBookingRepository {

    List<Booking> findByUserId(String userId);

    List<Booking> findByRoomIdIn(List<String> roomIds);

    List<Booking> findByRoomId(String roomId);

}
