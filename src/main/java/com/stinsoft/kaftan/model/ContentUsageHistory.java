package com.stinsoft.kaftan.model;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import ss.core.helper.JsonObjectIdSerializer;
import ss.core.model.Response;
import ss.core.model.User;

import java.util.Date;

public class ContentUsageHistory extends Response {

    @Id
    @JsonSerialize(using=JsonObjectIdSerializer.class)
    private ObjectId id;

    @JsonSerialize(using=JsonObjectIdSerializer.class)
    private ObjectId  user_id;

    @JsonSerialize(using=JsonObjectIdSerializer.class)
    private ObjectId  content_id;

    private String  contentTitle;
    private String  email;
    private float   bytesDownloaded;
    private float   bytesUploaded;
    private String  access_url;
    private Date    accessed_datetime;
    private String  referrer;
    private boolean accessed;

    private Date    created_at;
    private Date    updated_at;
    private User    user; // used in grouping content usage history of users
    private Content content; // used in grouping content usage history of movie

    public ObjectId getId() { return id; }

    public void setId(ObjectId id) { this.id = id; }

    public ObjectId getUser_id() { return user_id; }

    public void setUser_id(ObjectId user_id) { this.user_id = user_id; }

    public ObjectId getContent_id() { return content_id; }

    public void setContent_id(ObjectId content_id) { this.content_id = content_id; }

    public String getContentTitle() { return contentTitle; }

    public void setContentTitle(String contentTitle) { this.contentTitle = contentTitle; }

    public String getEmail() { return email; }

    public void setEmail(String email) { this.email = email; }

    public float getBytesDownloaded() { return bytesDownloaded; }

    public void setBytesDownloaded(float bytesDownloaded) { this.bytesDownloaded = bytesDownloaded; }

    public float getBytesUploaded() { return bytesUploaded; }

    public void setBytesUploaded(float bytesUploaded) { this.bytesUploaded = bytesUploaded; }

    public String getAccess_url() { return access_url; }

    public void setAccess_url(String access_url) { this.access_url = access_url; }

    public Date getAccessed_datetime() { return accessed_datetime; }

    public void setAccessed_datetime(Date accessed_datetime) { this.accessed_datetime = accessed_datetime; }

    public String getReferrer() { return referrer; }

    public void setReferrer(String referrer) { this.referrer = referrer; }

    public boolean isAccessed() { return accessed; }

    public void setAccessed(boolean accessed) { this.accessed = accessed; }

    public Date getCreated_at() { return created_at; }

    public void setCreated_at(Date created_at) { this.created_at = created_at; }

    public Date getUpdated_at() { return updated_at; }

    public void setUpdated_at(Date updated_at) { this.updated_at = updated_at; }

    public User getUser() { return user; }

    public void setUser(User user) { this.user = user; }

    public Content getContent() { return content; }

    public void setContent(Content content) { this.content = content; }
}
