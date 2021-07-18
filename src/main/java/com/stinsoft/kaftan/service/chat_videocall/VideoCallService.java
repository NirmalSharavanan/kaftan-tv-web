package com.stinsoft.kaftan.service.chat_videocall;

import com.stinsoft.kaftan.dto.chat_videocall.VideoCallDTO;
import com.stinsoft.kaftan.model.chat_videocall.VideoCall;
import com.stinsoft.kaftan.repository.chat_videocall.VideoCallRepository;
import com.stinsoft.kaftan.service.CategoryService;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ss.core.helper.DateHelper;

import java.util.List;

import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.*;
import static org.springframework.data.mongodb.core.query.Criteria.where;
import org.springframework.data.mongodb.core.query.Criteria;

@Service
public class VideoCallService implements IVideoCallService {

    private final VideoCallRepository repository;

    private Logger logger = LoggerFactory.getLogger(CategoryService.class);

    @Autowired
    MongoOperations operations;

    @Autowired
    public VideoCallService(VideoCallRepository videoCallRepository) {
        this.repository = videoCallRepository;
    }

    @Override
    public VideoCall create(VideoCall videoCall) {
        videoCall.setCreated_at(DateHelper.getCurrentDate());
        videoCall.setUpdated_at(DateHelper.getCurrentDate());
        return repository.save(videoCall);
    }

    @Override
    public VideoCall update(ObjectId id, VideoCall videoCall) {
        final VideoCall saved = repository.findOne(id);

        if(saved != null) {
            videoCall.setCreated_at(saved.getCreated_at());
            videoCall.setUpdated_at(DateHelper.getCurrentDate());
        } else {
            videoCall.setCreated_at(DateHelper.getCurrentDate());
        }
        repository.save(videoCall);
        return videoCall;
    }

    @Override
    public VideoCall findByClients(ObjectId publisher_id, ObjectId subscriber_id) {
        return repository.findByClients(publisher_id, subscriber_id);
    }

    @Override
    public VideoCall findByClientsId(ObjectId publisher_id, ObjectId subscriber_id) {
        return repository.findByClientsId(publisher_id, subscriber_id);
    }

    @Override
    public List<VideoCall> findByPublisher(ObjectId publisher_id, boolean isActive) {
        return repository.findByPublisher(publisher_id, isActive);
    }

    @Override
    public VideoCall findBySubscriber(ObjectId subscriber_id, boolean isActive) {
        return repository.findBySubscriber(subscriber_id, isActive);
    }

    @Override
    public VideoCall findById(ObjectId id) {
        return repository.findOne(id);
    }

    @Override
    public List<VideoCallDTO> findVideoCallHistory(ObjectId user_id) {
        AggregationResults<VideoCallDTO> results = operations.aggregate(
                newAggregation(VideoCall.class,
                        match(new Criteria().orOperator(where("publisher_id").is(user_id), where("subscriber_id").is(user_id))),
                        lookup("chatHistory", "_id","videoCall_id","chatHistory"),
                        unwind("chatHistory"),
                        lookup("user", "publisher_id", "_id", "publisher"),
                        unwind("publisher"),
                        lookup("user", "subscriber_id", "_id", "subscriber"),
                        unwind("subscriber")
                ), VideoCallDTO.class);

        return results.getMappedResults();
    }
}
