package com.facility.backend.admin.service;

import com.facility.backend.dto.booking.BookingResponse;
import com.facility.backend.dto.room.RoomRequest;
import com.facility.backend.dto.room.RoomResponse;
import com.facility.backend.dto.stats.BookingStatsResponse;
import com.facility.backend.exception.ActionNotAllowedException;
import com.facility.backend.exception.ResourceNotFoundException;
import com.facility.backend.util.BookingMapper;
import com.facility.backend.util.RoomMapper;
import com.facility.backend.model.Booking;
import com.facility.backend.model.Room;
import com.facility.backend.model.User;
import com.facility.backend.repository.BookingRepository;
import com.facility.backend.repository.RoomRepository;
import com.facility.backend.util.CurrentUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final RoomRepository roomRepository;
    private final BookingRepository bookingRepository;
    private  final CurrentUserService currentUserService;

    //    create a room
    public RoomResponse createRoom(RoomRequest request) {
        User admin = currentUserService.getCurrentUser();
        Room room = Room.builder()
                .name(request.getName())
                .capacity(request.getCapacity())
                .location(request.getLocation())
                .resources(request.getResources())
                .createdBy(admin.getId())
                .build();
        Room saved = roomRepository.save(room);
        return RoomMapper.toResponse(saved);
    }

    //    update a room by id
    public RoomResponse editRoom(RoomRequest request, String id) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found"));
        room.setName(request.getName());
        room.setCapacity(request.getCapacity());
        room.setLocation(request.getLocation());
        room.setResources(request.getResources());
        return RoomMapper.toResponse(roomRepository.save(room));
    }

    //   delete a room by id
    public void deleteRoom(String id) {
        if (!roomRepository.existsById(id)) {
            throw new ResourceNotFoundException("Room not found");
        }
        List<Booking> bookingsForRoom = bookingRepository.findByRoomId(id);
        if (!bookingsForRoom.isEmpty()) {
            throw new ActionNotAllowedException("Booking exists for this room");
        }
        roomRepository.deleteById(id);
    }

    //    get all bookings
    public List<BookingResponse> getBookingsForAdmin() {
        User admin = currentUserService.getCurrentUser();
        List<Room> rooms = roomRepository.findByCreatedBy(admin.getId());
        List<String> roomIds = rooms.stream()
                .map(Room::getId)
                .toList();
        List<Booking> bookings = bookingRepository.findByRoomIdIn(roomIds);
        return bookings
                .stream()
                .filter(b -> b.getStatus() != Booking.Status.CANCELLED)
                .map(BookingMapper::toResponse)
                .toList();
    }

    //    list rooms of admin
    public List<RoomResponse> getRooms() {
        User admin = currentUserService.getCurrentUser();
        List<Room> rooms = roomRepository.findByCreatedBy(admin.getId());
        return rooms.stream()
                .map(RoomMapper::toResponse)
                .toList();
    }

    //    update status of a booking
    public BookingResponse updateBookingStatus(String bookingId, Booking.Status status) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

//        invalid transition logic
        if (booking.getStatus() == Booking.Status.APPROVED && status == Booking.Status.REJECTED
                || booking.getStatus() == Booking.Status.REJECTED && status == Booking.Status.APPROVED) {
            throw new IllegalStateException("Invalid transition from " + booking.getStatus() + " to " + status);
        }
        booking.setStatus(status);
        Booking updatedBooking = bookingRepository.save(booking);

        if (status == Booking.Status.APPROVED) {
            autoRejectConflicts(booking);
        }
        return BookingMapper.toResponse(updatedBooking);
    }

    //    get booking stats
    public BookingStatsResponse getBookingStatsForAdmin() {
        User admin = currentUserService.getCurrentUser();
        List<Room> rooms = roomRepository.findByCreatedBy(admin.getId());
        List<String> roomIds = rooms.stream()
                .map(Room::getId)
                .toList();

        List<Booking> bookings = bookingRepository.findByRoomIdIn(roomIds);

        Map<Booking.Status, Long> statusCount = countByStatus(bookings);

        return buildStatsResponse(statusCount, bookings.size());
    }

//    HELPER METHODS
//    auto-reject logic
    private void autoRejectConflicts(Booking booking) {
        List<Booking> pendingConflicts = bookingRepository.findPendingConflicts(
                booking.getRoomId(),
                booking.getStartTime(),
                booking.getEndTime()
        );

        for (Booking conflict : pendingConflicts) {
            conflict.setStatus(Booking.Status.REJECTED);
            bookingRepository.save(conflict);
        }
    }

//    taking count of bookings by status
    private Map<Booking.Status, Long> countByStatus(List<Booking> bookings) {
        return bookings.stream()
                .collect(Collectors.groupingBy(
                        Booking::getStatus,
                        Collectors.counting()
                ));
    }

    private BookingStatsResponse buildStatsResponse(
            Map<Booking.Status, Long> counts,
            long total
    ) {
        BookingStatsResponse response = new BookingStatsResponse();

        response.setPending(counts.getOrDefault(Booking.Status.PENDING, 0L));
        response.setApproved(counts.getOrDefault(Booking.Status.APPROVED, 0L));
        response.setCancelled(counts.getOrDefault(Booking.Status.CANCELLED, 0L));
        response.setRejected(counts.getOrDefault(Booking.Status.REJECTED, 0L));
        response.setTotalBookings(total);

        return response;
    }


}
