package com.stinsoft.kaftan.repository.chat_videocall;

import com.stinsoft.kaftan.model.chat_videocall.VideoCall;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface VideoCallRepository extends MongoRepository<VideoCall, ObjectId> {

    @Query("{ 'publisher_id' : ?0, 'subscriber_id' : ?1 }")
    VideoCall findByClients(ObjectId publisher_id, ObjectId subscriber_id);

    @Query("{ $or:[{'publisher_id' : ?0, 'subscriber_id' : ?1}, {'publisher_id' : ?1, 'subscriber_id' : ?0}] }")
    VideoCall findByClientsId(ObjectId publisher_id, ObjectId subscriber_id);

    @Query("{ 'publisher_id' : ?0, 'isActive' : ?1 }")
    List<VideoCall> findByPublisher(ObjectId publisher_id, boolean isActive);

    @Query("{ $or:[{'publisher_id' : ?0}, {'subscriber_id': ?0}], 'isActive' : ?1 }")
    VideoCall findBySubscriber(ObjectId subscriber_id, boolean isActive);

}
