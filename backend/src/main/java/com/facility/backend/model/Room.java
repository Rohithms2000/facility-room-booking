package com.facility.backend.model;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "rooms")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Room {

    @Id
    private String id;

    private String name;

    private int capacity;

    private String location;

    private List<String> resources;

    private String createdBy;
}
