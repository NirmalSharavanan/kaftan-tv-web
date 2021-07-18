package com.stinsoft.kaftan.dto.chat_videocall;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.bson.types.ObjectId;
import ss.core.dto.SecureEndUserDTO;
import ss.core.helper.JsonObjectIdSerializer;
import ss.core.model.Response;

import java.util.Date;

public class VideoCallDTO extends Response {

    @JsonSerialize(using=JsonObjectIdSerializer.class)
    private ObjectId  id;

    @JsonSerialize(using=JsonObjectIdSerializer.class)
    private  ObjectId publisher_id;

    @JsonSerialize(using=JsonObjectIdSerializer.class)
    private ObjectId  subscriber_id;

    private String    session_id;
    private String    token;
    private boolean   isActive;

    private Date      token_updated_at;
    private Date      created_at;
    private Date      updated_at;

    private SecureEndUserDTO secureEndUserDTO;

    private SecureEndUserDTO publisher;
    private SecureEndUserDTO subscriber;

    public ObjectId getId() {
        return id;
    }

    public void setId(ObjectId id) {
        this.id = id;
    }

    public ObjectId getPublisher_id() {
        return publisher_id;
    }

    public void setPublisher_id(ObjectId publisher_id) {
        this.publisher_id = publisher_id;
    }

    public ObjectId getSubscriber_id() {
        return subscriber_id;
    }

    public void setSubscriber_id(ObjectId subscriber_id) {
        this.subscriber_id = subscriber_id;
    }

    public String getSession_id() {
        return session_id;
    }

    public void setSession_id(String session_id) {
        this.session_id = session_id;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public SecureEndUserDTO getSecureEndUserDTO() {
        return secureEndUserDTO;
    }

    public void setSecureEndUserDTO(SecureEndUserDTO secureEndUserDTO) {
        this.secureEndUserDTO = secureEndUserDTO;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }

    public Date getToken_updated_at() {
        return token_updated_at;
    }

    public void setToken_updated_at(Date token_updated_at) {
        this.token_updated_at = token_updated_at;
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
