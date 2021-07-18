package com.stinsoft.kaftan.model;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import ss.core.helper.JsonObjectIdSerializer;
import ss.core.model.Response;

import java.util.Date;

public class ContentWatchHistory extends Response {

    @Id
    @JsonSerialize(using=JsonObjectIdSerializer.class)
    private ObjectId id;

    @JsonSerialize(using=JsonObjectIdSerializer.class)
    private ObjectId   user_id;

    @JsonSerialize(using=JsonObjectIdSerializer.class)
    private ObjectId   content_id;

    private String     currentTime;
    private String     totalTime;
    private boolean    inProgress;
    private Date       created_at;
    private Date       updated_at;

    public String getCurrentTime() { return currentTime; }

    public void setCurrentTime(String currentTime) { this.currentTime = currentTime; }

    public String getTotalTime() { return totalTime; }

    public void setTotalTime(String totalTime) { this.totalTime = totalTime; }

    public ObjectId getUser_id() {
        return user_id;
    }

    public void setUser_id(ObjectId user_id) {
        this.user_id = user_id;
    }

    public ObjectId getContent_id() {
        return content_id;
    }

    public void setContent_id(ObjectId content_id) {
        this.content_id = content_id;
    }

    public boolean isInProgress() {
        return inProgress;
    }

    public void setInProgress(boolean inProgress) {
        this.inProgress = inProgress;
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
}
