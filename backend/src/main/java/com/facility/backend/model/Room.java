package com.facility.backend.model;


import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "rooms")
@Data
public class Room {

    @Id
    private String id;

    private String name;

    private Integer capacity;

    private String location;

    private List<String> resources;
}
