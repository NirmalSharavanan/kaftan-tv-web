package com.stinsoft.kaftan.dto.chat_videocall;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.bson.types.ObjectId;
import ss.core.dto.SecureEndUserDTO;
import ss.core.helper.JsonObjectIdSerializer;
import ss.core.model.Response;

import java.util.Date;

public class ChatHistoryDTO extends Response {

    @JsonSerialize(using=JsonObjectIdSerializer.class)
    private ObjectId id;

    @JsonSerialize(using=JsonObjectIdSerializer.class)
    private  ObjectId videoCall_id;

    @JsonSerialize(using=JsonObjectIdSerializer.class)
    private  ObjectId from_user;

    @JsonSerialize(using=JsonObjectIdSerializer.class)
    private ObjectId  to_user;

    private String    text;
    private boolean   isRead;
    private boolean   isTextChat;
    private boolean   isConnected;

    private Date      call_connected_at;
    private Date      call_disconnected_at;
    private Date      created_at;
    private Date      updated_at;

    private SecureEndUserDTO publisher;
    private SecureEndUserDTO subscriber;

    public ObjectId getId() {
        return id;
    }

    public void setId(ObjectId id) {
        this.id = id;
    }

    public ObjectId getVideoCall_id() {
        return videoCall_id;
    }

    public void setVideoCall_id(ObjectId videoCall_id) {
        this.videoCall_id = videoCall_id;
    }

    public ObjectId getFrom_user() {
        return from_user;
    }

    public void setFrom_user(ObjectId from_user) {
        this.from_user = from_user;
    }

    public ObjectId getTo_user() {
        return to_user;
    }

    public void setTo_user(ObjectId to_user) {
        this.to_user = to_user;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public boolean isRead() {
        return isRead;
    }

    public void setRead(boolean read) {
        isRead = read;
    }

    public boolean isTextChat() {
        return isTextChat;
    }

    public void setTextChat(boolean textChat) {
        isTextChat = textChat;
    }

    public boolean isConnected() {
        return isConnected;
    }

    public void setConnected(boolean connected) {
        isConnected = connected;
    }

    public Date getCall_connected_at() {
        return call_connected_at;
    }

    public void setCall_connected_at(Date call_connected_at) {
        this.call_connected_at = call_connected_at;
    }

    public Date getCall_disconnected_at() {
        return call_disconnected_at;
    }

    public void setCall_disconnected_at(Date call_disconnected_at) {
        this.call_disconnected_at = call_disconnected_at;
    }

    public Date getCreated_at() {
        return created_at;
    }

    public void setCreated_at(Date created_at) {
        this.created_at = created_at;
    }

    public Date getUpdated_at() {
        return updated_at;
    }

    public void setUpdated_at(Date updated_at) {
        this.updated_at = updated_at;
    }

    public SecureEndUserDTO getPublisher() {
        return publisher;
    }

    public void setPublisher(SecureEndUserDTO publisher) {
        this.publisher = publisher;
    }

    public SecureEndUserDTO getSubscriber() {
        return subscriber;
    }

    public void setSubscriber(SecureEndUserDTO subscriber) {
        this.subscriber = subscriber;
    }
}
