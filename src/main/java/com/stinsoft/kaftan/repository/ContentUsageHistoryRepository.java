package com.stinsoft.kaftan.repository;

import com.stinsoft.kaftan.model.ContentUsageHistory;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

public interface ContentUsageHistoryRepository extends MongoRepository<ContentUsageHistory, ObjectId> {

    @Query("{ 'access_url' : {$regex : ?0 }  }")
    ContentUsageHistory findByAccessUrl(String accessUrl);
}
