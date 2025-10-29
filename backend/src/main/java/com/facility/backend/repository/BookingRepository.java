package com.facility.backend.repository;

import com.facility.backend.model.Booking;
import com.facility.backend.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface BookingRepository extends MongoRepository<Booking, String> {
}
