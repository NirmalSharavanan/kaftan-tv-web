package com.stinsoft.kaftan.service.chat_videocall;

import com.stinsoft.kaftan.dto.chat_videocall.VideoCallDTO;
import com.stinsoft.kaftan.model.chat_videocall.VideoCall;
import org.bson.types.ObjectId;

import java.util.List;

public interface IVideoCallService {

    VideoCall create(VideoCall object);
    VideoCall update(ObjectId id, VideoCall object);
    VideoCall findByClients(ObjectId publisher_id, ObjectId subscriber_id);
    VideoCall findByClientsId(ObjectId publisher_id, ObjectId subscriber_id);
    List<VideoCall> findByPublisher(ObjectId publisher_id, boolean isActive);
    VideoCall findBySubscriber(ObjectId subscriber_id, boolean isActive);
    VideoCall findById(ObjectId id);
    List<VideoCallDTO> findVideoCallHistory(ObjectId user_id);
}
