package com.facility.backend.repository;

import com.facility.backend.model.Room;
import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
@RequiredArgsConstructor
public class CustomRoomRepositoryImpl implements  CustomRoomRepository{

    private final MongoTemplate mongoTemplate;

    @Override
    public List<Room> searchRooms(Integer minCapacity, Integer maxCapacity, String location, List<String> resources) {

        List<Criteria> andCriteria = new ArrayList<>();

        if (minCapacity != null && maxCapacity != null) {
            andCriteria.add(Criteria.where("capacity").gte(minCapacity).lte(maxCapacity));
        }

        if (location != null && !location.isEmpty()) {
            andCriteria.add(Criteria.where("location").is(location));
        }

        if (resources != null && !resources.isEmpty()) {
            andCriteria.add(Criteria.where("resources").all(resources));
        }

        Query query = new Query();
        if (!andCriteria.isEmpty()) {
            query.addCriteria(new Criteria().andOperator(andCriteria.toArray(new Criteria[0])));
        }

        return mongoTemplate.find(query, Room.class);
    }
}
