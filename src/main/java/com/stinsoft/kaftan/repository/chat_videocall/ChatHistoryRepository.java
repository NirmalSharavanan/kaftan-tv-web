package com.stinsoft.kaftan.repository.chat_videocall;

import com.stinsoft.kaftan.model.chat_videocall.ChatHistory;
import org.bson.types.ObjectId;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface ChatHistoryRepository extends MongoRepository<ChatHistory, ObjectId> {

    @Query("{ 'videoCall_id' : ?0, 'isTextChat' : ?1 }")
    List<ChatHistory> findByUser(ObjectId videoCall_id, boolean isTextChat, Sort sort);
}
