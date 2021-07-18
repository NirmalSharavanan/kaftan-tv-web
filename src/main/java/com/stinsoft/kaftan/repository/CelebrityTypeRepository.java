package com.stinsoft.kaftan.repository;

import com.stinsoft.kaftan.model.CelebrityType;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

/**
 * Created by ssu on 12/12/17.
 */
public interface CelebrityTypeRepository extends MongoRepository<CelebrityType, ObjectId> {

    @Query(value = "{ 'customer_id' : ?0 }", fields = "{ 'customer': 0 }")
    List<CelebrityType> findByCustomerId(ObjectId customer_id);

    @Query("{ 'name' : ?0 }")
    CelebrityType findByName(String name);

}
