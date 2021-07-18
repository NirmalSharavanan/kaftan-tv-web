package com.stinsoft.kaftan.dto;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.stinsoft.kaftan.model.Content;
import org.bson.types.ObjectId;
import ss.core.dto.SecureEndUserDTO;
import ss.core.helper.JsonObjectIdSerializer;

import java.util.Date;

public class AWSContentUsageDTO {

    @JsonSerialize(using = JsonObjectIdSerializer.class)
    private ObjectId user_id;

    @JsonSerialize(using = JsonObjectIdSerializer.class)
    private ObjectId  content_id;

    private String  email;
    private String  contentTitle;
    private float   bytesDownloaded;
    private float   bytesUploaded;
    private String  access_url;
    private Date    accessed_datetime;
    private String  referrer;
    private long    totalBytesDownloaded;
    private long    totalBytesUploaded;
    private String  accessedDate; // used in grouping content usage history by date without time
    private SecureEndUserDTO userInfo;
    private Content content;

    public ObjectId getUser_id() { return user_id; }

    public void setUser_id(ObjectId user_id) { this.user_id = user_id; }

    public ObjectId getContent_id() { return content_id; }

    public void setContent_id(ObjectId content_id) { this.content_id = content_id; }

    public String getEmail() { return email; }

    public void setEmail(String email) { this.email = email; }

    public String getContentTitle() { return contentTitle; }

    public void setContentTitle(String contentTitle) { this.contentTitle = contentTitle; }

    public float getBytesDownloaded() {
        return bytesDownloaded;
    }

    public void setBytesDownloaded(float bytesDownloaded) {
        this.bytesDownloaded = bytesDownloaded;
    }

    public float getBytesUploaded() {
        return bytesUploaded;
    }

    public void setBytesUploaded(float bytesUploaded) {
        this.bytesUploaded = bytesUploaded;
    }

    public String getAccess_url() {
        return access_url;
    }

    public void setAccess_url(String access_url) {
        this.access_url = access_url;
    }

    public Date getAccessed_datetime() {
        return accessed_datetime;
    }

    public void setAccessed_datetime(Date accessed_datetime) {
        this.accessed_datetime = accessed_datetime;
    }

    public String getReferrer() {
        return referrer;
    }

    public void setReferrer(String referrer) {
        this.referrer = referrer;
    }

    public long getTotalBytesDownloaded() {
        return totalBytesDownloaded;
    }

    public void setTotalBytesDownloaded(long totalBytesDownloaded) {
        this.totalBytesDownloaded = totalBytesDownloaded;
    }

    public long getTotalBytesUploaded() {
        return totalBytesUploaded;
    }

    public void setTotalBytesUploaded(long totalBytesUploaded) {
        this.totalBytesUploaded = totalBytesUploaded;
    }

    public String getAccessedDate() {
        return accessedDate;
    }

    public void setAccessedDate(String accessedDate) {
        this.accessedDate = accessedDate;
    }

    public SecureEndUserDTO getUserInfo() { return userInfo; }

    public void setUserInfo(SecureEndUserDTO userInfo) { this.userInfo = userInfo; }

    public Content getContent() {
        return content;
    }

    public void setContent(Content content) {
        this.content = content;
    }
}
