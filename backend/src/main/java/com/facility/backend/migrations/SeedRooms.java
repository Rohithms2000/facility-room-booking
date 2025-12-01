package com.facility.backend.migrations;

import com.facility.backend.model.Room;
import io.mongock.api.annotations.ChangeUnit;
import io.mongock.api.annotations.Execution;
import io.mongock.api.annotations.RollbackExecution;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import java.util.List;

@ChangeUnit(id = "seedRooms", order = "002", author = "rohith")
public class SeedRooms {

    @Execution
    public void execute(MongoTemplate mongo) {

        Room room1 = Room.builder()
                .name("Estate rooms")
                .capacity(100)
                .location("Alappuzha")
                .resources(List.of("Projector", "Whiteboard", "TV"))
                .createdBy("691d5a9a42ed82da27410204")
                .build();

        Room room2 = Room.builder()
                .name("Vanaprastha")
                .capacity(400)
                .location("Kozhikode")
                .resources(List.of("Wifi", "TV"))
                .createdBy("691acd2bc801df89687723bf")
                .build();

        Room room3 = Room.builder()
                .name("Al Saj Arena")
                .capacity(450)
                .location("Trivandrum")
                .resources(List.of("Wifi", "TV"))
                .createdBy("691d5a9a42ed82da27410204")
                .build();

        Room room4 = Room.builder()
                .name("S N Auditorium")
                .capacity(750)
                .location("Trivandrum")
                .resources(List.of("Projector", "Wifi"))
                .createdBy("691acd2bc801df89687723bf")
                .build();

        mongo.insertAll(List.of(room1, room2, room3, room4));
    }


    private static final String FIELD_NAME = "name";
    @RollbackExecution
    public void rollback(MongoTemplate mongo) {

        List<Criteria> rooms = List.of(
                Criteria.where(FIELD_NAME).is("Estate Rooms"),
                Criteria.where(FIELD_NAME).is("Vanaprastha"),
                Criteria.where(FIELD_NAME).is("Al Saj Arena"),
                Criteria.where(FIELD_NAME).is("S N Auditorium")
        );

        mongo.remove(
                Query.query(
                        new Criteria().orOperator(rooms)),
                Room.class
        );
    }
}

