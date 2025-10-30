package com.facility.backend.dto.room;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class RoomResponse {

    private String id;

    private String name;

    private Integer capacity;

    private String location;

    private List<String> resources;
}
