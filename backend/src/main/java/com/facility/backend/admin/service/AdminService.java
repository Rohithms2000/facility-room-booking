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

    /**
     * Creates a new room in the system using the details provided in the request object.
     * <p>
     * The currently authenticated admin user is automatically captured and set as the
     * creator of the room. After saving the room to the database, the saved entity is
     * mapped to a {@link RoomResponse} and returned.
     *
     * @param request The request object containing necessary room information such as
     *                name, capacity, location, and resources.
     * @return A {@link RoomResponse} representing the newly created room with its
     *         generated ID and stored details.
     * @throws IllegalArgumentException if the request object is null or contains invalid data.
     */
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

    /**
     * Updates the room with the id using the details provided in the request object.
     * <p>
     * After saving the updated room details to the database, the saved entity is
     * mapped to a {@link RoomResponse} and returned.
     * </p>
     *
     * @param request The request object containing updated room information such as
     *                name, capacity, location, and resources.
     * @param id The ID of the room being updated
     * @return A {@link RoomResponse} representing the newly created room with its
     *         generated ID and stored details.
     * @throws ResourceNotFoundException if the room with provided ID is not found.
     * @throws IllegalArgumentException if the request object is null or contains invalid data.
     */
    public RoomResponse editRoom(RoomRequest request, String id) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found"));
        room.setName(request.getName());
        room.setCapacity(request.getCapacity());
        room.setLocation(request.getLocation());
        room.setResources(request.getResources());
        return RoomMapper.toResponse(roomRepository.save(room));
    }

    /**
     * Deletes the room from the database with the matching id provided
     *
     * @param id The ID of the room to be deleted
     *
     * @throws ResourceNotFoundException if the room with the provided id is not found
     * @throws ActionNotAllowedException if there exists an active booking for this room
     */
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

    /**
     * Retrieves all non-cancelled bookings for the rooms created by the
     * currently authenticated admin user.
     *
     * @return A list of {@link BookingResponse} objects representing all active
     *         bookings linked to the admin's rooms.
     */
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

    /**
     * Retrieves all the rooms created by the currently authenticated admin user.
     * @return A list of {@link RoomResponse} objects representing all the rooms
     * created by the admin
     */
    public List<RoomResponse> getRooms() {
        User admin = currentUserService.getCurrentUser();
        List<Room> rooms = roomRepository.findByCreatedBy(admin.getId());
        return rooms.stream()
                .map(RoomMapper::toResponse)
                .toList();
    }

    /**
     * Updates the status of an existing booking after validating that the status transition
     * is allowed. If the booking is approved, this method also automatically rejects any
     * pending bookings that conflict with the approved booking's schedule.
     *
     * @param bookingId The ID of the booking whose status is being updated.
     * @param status    The new status to be applied to the booking.
     * @return A {@link BookingResponse} representing the booking after the status update.
     *
     * @throws ResourceNotFoundException if no booking exists with the given ID.
     * @throws IllegalStateException     if the status transition is invalid (e.g.,
     *                                   attempting to change {@code APPROVED} to {@code REJECTED} or vice versa).
     */
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

    /**
     * Computes and returns booking statistics for all rooms created by the currently
     * authenticated admin user. The statistics include the count of bookings grouped
     * by their status (e.g., APPROVED, PENDING, REJECTED, CANCELLED).
     *
     * @return A {@link BookingStatsResponse} containing the booking counts categorized
     *         by status and the total number of bookings for the admin's rooms.
     */

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

    /**
     * Automatically rejects all pending bookings that conflict with the time window
     * of the provided approved booking. A conflicting booking is any pending booking
     * for the same room whose time range overlaps with the approved booking.
     *
     * @param booking The approved booking for which conflicting pending bookings
     *                should be identified and rejected.
     */

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
