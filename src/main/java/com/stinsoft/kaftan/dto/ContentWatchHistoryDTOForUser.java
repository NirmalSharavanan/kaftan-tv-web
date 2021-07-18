package com.stinsoft.kaftan.dto;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.bson.types.ObjectId;
import org.springframework.hateoas.Resource;
import ss.core.helper.JsonObjectIdSerializer;

import java.util.Date;

public class ContentWatchHistoryDTOForUser {

    @JsonSerialize(using=JsonObjectIdSerializer.class)
    private ObjectId   user_id;

    @JsonSerialize(using=JsonObjectIdSerializer.class)
    private ObjectId   content_id;

    private String     currentTime;
    private String     totalTime;
    private boolean    inProgress;
    private Date       accessed_datetime;

    private Resource<ContentThumbnailDTO> content;

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

    public Date getAccessed_datetime() {
        return accessed_datetime;
    }

    public void setAccessed_datetime(Date accessed_datetime) {
        this.accessed_datetime = accessed_datetime;
    }

    public Resource<ContentThumbnailDTO> getContent() {
        return content;
    }

    public void setContent(Resource<ContentThumbnailDTO> content) {
        this.content = content;
    }
}
