package com.facility.backend.util;

import com.facility.backend.dto.room.RoomResponse;
import com.facility.backend.model.Room;

public class RoomMapper {
    public static RoomResponse toResponse(Room room) {
        return RoomResponse.builder()
                .id(room.getId())
                .name(room.getName())
                .capacity(room.getCapacity())
                .location(room.getLocation())
                .resources(room.getResources())
                .createdBy(room.getCreatedBy())
                .build();
    }
}
