package com.stinsoft.kaftan.repository;

import com.stinsoft.kaftan.model.HomeBanner;
import org.bson.types.ObjectId;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface HomeBannerRepository extends MongoRepository<HomeBanner, ObjectId> {
    //do not select customer by default
    @Query(value = "{ 'customer_id' : ?0 }")
    List<HomeBanner> findByCustomerId(ObjectId customer_id,  Sort sort);

    @Query(value = "{ 'customer_id' : ?0, 'id' :  { $in : ?1 } }")
    List<HomeBanner> findMultiple(ObjectId customer_id, ObjectId[] ids, Sort sort);
}
