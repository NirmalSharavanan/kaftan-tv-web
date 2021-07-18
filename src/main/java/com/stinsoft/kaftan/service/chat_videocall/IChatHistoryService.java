package com.stinsoft.kaftan.service.chat_videocall;

import com.stinsoft.kaftan.dto.chat_videocall.ChatHistoryDTO;
import com.stinsoft.kaftan.model.chat_videocall.ChatHistory;
import org.bson.types.ObjectId;

import java.util.List;

public interface IChatHistoryService {

    ChatHistory create(ChatHistory object);
    ChatHistory update(ObjectId id, ChatHistory object);
    ChatHistory findById(ObjectId id);
    List<ChatHistory> findByUser(ObjectId videoCall_id, boolean isTextChat);
    List<ChatHistoryDTO> findVideoCallHistory(ObjectId user_id);
    ObjectId delete(ObjectId id);

}
