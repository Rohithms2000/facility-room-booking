package com.facility.backend.dto.room;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

@Data
public class RoomRequest {

    @NotBlank(message = "Room name cannot be blank")
    private String name;

    @NotNull(message = "Capacity must be specified")
    @Min(value = 10, message = "Capacity must be at least 10")
    private int capacity;

    @NotBlank(message = "Location is required")
    private String location;

    @NotNull(message = "Resources list cannot be null")
    @Size(min = 2, message = "A room must have a minimum of 2 resources")
    private List<@NotBlank(message = "Resource name cannot be blank") String> resources;

}
