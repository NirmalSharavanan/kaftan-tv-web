package com.stinsoft.kaftan.service.chat_videocall;

import com.stinsoft.kaftan.dto.chat_videocall.ChatHistoryDTO;
import com.stinsoft.kaftan.model.chat_videocall.ChatHistory;
import com.stinsoft.kaftan.repository.chat_videocall.ChatHistoryRepository;
import com.stinsoft.kaftan.service.CategoryService;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Service;
import ss.core.helper.DateHelper;

import java.util.List;

import static org.springframework.data.mongodb.core.aggregation.Aggregation.*;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.lookup;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.unwind;
import static org.springframework.data.mongodb.core.query.Criteria.where;

@Service
public class ChatHistoryService implements IChatHistoryService {

    private final ChatHistoryRepository repository;

    private Logger logger = LoggerFactory.getLogger(CategoryService.class);

    @Autowired
    MongoOperations operations;

    @Autowired
    public ChatHistoryService(ChatHistoryRepository chatHistoryRepository) {
        this.repository = chatHistoryRepository;
    }

    @Override
    public ChatHistory create(ChatHistory chatHistory) {
        chatHistory.setCreated_at(DateHelper.getCurrentDate());
        chatHistory.setUpdated_at(DateHelper.getCurrentDate());
        return repository.save(chatHistory);
    }

    @Override
    public List<ChatHistory> findByUser(ObjectId videoCall_id, boolean isTextChat) {
        return repository.findByUser(videoCall_id, isTextChat, new Sort(Sort.Direction.ASC, "created_at"));
    }

    @Override
    public ChatHistory findById(ObjectId id) {
        return repository.findOne(id);
    }

    @Override
    public ChatHistory update(ObjectId id, ChatHistory chatHistory) {
        final ChatHistory saved = repository.findOne(id);

        if(saved != null) {
            chatHistory.setCreated_at(saved.getCreated_at());
            chatHistory.setUpdated_at(DateHelper.getCurrentDate());
        } else {
            chatHistory.setCreated_at(DateHelper.getCurrentDate());
        }
        repository.save(chatHistory);
        return chatHistory;
    }

    @Override
    public List<ChatHistoryDTO> findVideoCallHistory(ObjectId user_id) {
        AggregationResults<ChatHistoryDTO> results = operations.aggregate(
                newAggregation(ChatHistory.class,
                        match(new Criteria().orOperator(where("from_user").is(user_id), where("to_user").is(user_id))),
                        lookup("user", "from_user", "_id", "publisher"),
                        unwind("publisher"),
                        lookup("user", "to_user", "_id", "subscriber"),
                        unwind("subscriber")
                ), ChatHistoryDTO.class);

        return results.getMappedResults();
    }

    @Override
    public ObjectId delete(ObjectId id) {
        repository.delete(id);
        return id;
    }
}
