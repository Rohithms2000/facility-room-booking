package com.facility.backend.migrations;

import com.facility.backend.model.User;
import io.mongock.api.annotations.ChangeUnit;
import io.mongock.api.annotations.Execution;
import io.mongock.api.annotations.RollbackExecution;
import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;


@RequiredArgsConstructor
@ChangeUnit(id = "seedUsers", order = "001", author = "rohith")
public class SeedUsers {
    private final PasswordEncoder passwordEncoder;

    @Execution
    public void execute(MongoTemplate mongoTemplate) {
        User user1 = User.builder()
                .name("Ram")
                .email("ram@abc.com")
                .role(User.Role.USER)
                .password(passwordEncoder.encode("ram@123"))
                .build();

        User user2 = User.builder()
                .name("Hari")
                .email("hari@abc.com")
                .role(User.Role.ADMIN)
                .password(passwordEncoder.encode("hari@123"))
                .build();

        User user3 = User.builder()
                .name("Jake")
                .email("jake@abc.com")
                .role(User.Role.USER)
                .password(passwordEncoder.encode("jake@123"))
                .build();

        User user4 = User.builder()
                .name("Priya")
                .email("priya@abc.com")
                .role(User.Role.ADMIN)
                .password(passwordEncoder.encode("priya@123"))
                .build();

        mongoTemplate.insertAll(List.of(user1, user2, user3, user4));
    }


    private static final String FIELD_EMAIL = "email";
    private static final String FIELD_NAME = "name";

    @RollbackExecution
    public void rollback(MongoTemplate mongo) {

        List<Criteria> users = List.of(
                Criteria.where(FIELD_NAME).is("Ram").and(FIELD_EMAIL).is("ram@abc.com"),
                Criteria.where(FIELD_NAME).is("Hari").and(FIELD_EMAIL).is("hari@abc.com"),
                Criteria.where(FIELD_NAME).is("Jake").and(FIELD_EMAIL).is("jake@abc.com"),
                Criteria.where(FIELD_NAME).is("Priya").and(FIELD_EMAIL).is("priya@abc.com")
        );

        mongo.remove(
                Query.query(new Criteria().orOperator(users)),
                User.class
        );
    }

}



