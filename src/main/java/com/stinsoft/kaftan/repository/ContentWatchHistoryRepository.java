package com.stinsoft.kaftan.repository;


import com.stinsoft.kaftan.model.ContentWatchHistory;
import org.bson.types.ObjectId;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface ContentWatchHistoryRepository extends MongoRepository<ContentWatchHistory, ObjectId> {

    @Query("{ 'user_id' : ?0, 'content_id' : ?1  }")
    ContentWatchHistory findByUserId(ObjectId userId, ObjectId contentId);

    @Query("{ 'user_id' : ?0, 'inProgress' : ?1  }")
    List<ContentWatchHistory> findAllByUserId(ObjectId userId, boolean inProgress, Pageable pageable);

}
