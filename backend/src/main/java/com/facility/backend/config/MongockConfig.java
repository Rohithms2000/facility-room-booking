package com.facility.backend.config;

import io.mongock.runner.springboot.MongockSpringboot;
import io.mongock.runner.springboot.base.MongockInitializingBeanRunner;
import org.springframework.context.ApplicationContext;
import io.mongock.driver.mongodb.springdata.v4.SpringDataMongoV4Driver;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.MongoTemplate;

@Configuration
public class MongockConfig {

    @Bean
    public SpringDataMongoV4Driver mongoDbDriver(MongoTemplate mongoTemplate) {
        return SpringDataMongoV4Driver.withDefaultLock(mongoTemplate);
    }

    @Bean
    public MongockInitializingBeanRunner mongockRunner(SpringDataMongoV4Driver driver, ApplicationContext applicationContext) {

        return MongockSpringboot.builder()
                .setDriver(driver)
                .addMigrationScanPackage("com.facility.backend.migrations")
                .setSpringContext(applicationContext)
                .buildInitializingBeanRunner();
    }
}
