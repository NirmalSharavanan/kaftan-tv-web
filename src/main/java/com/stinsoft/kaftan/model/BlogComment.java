package com.stinsoft.kaftan.model;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import ss.core.helper.JsonObjectIdSerializer;
import ss.core.model.Response;

import java.util.Date;

@Document
public class BlogComment extends Response {
    @Id
    @JsonSerialize(using=JsonObjectIdSerializer.class)
    private ObjectId   id;

    @JsonSerialize(using=JsonObjectIdSerializer.class)
    private ObjectId   blog_id;

    @JsonSerialize(using=JsonObjectIdSerializer.class)
    private ObjectId   user_id;

    private String     comment;
    private Date       created_at;
    private Date       updated_at;

    public ObjectId getId() {
        return id;
    }

    public void setId(ObjectId id) {
        this.id = id;
    }

    public ObjectId getBlog_id() {
        return blog_id;
    }

    public void setBlog_id(ObjectId blog_id) {
        this.blog_id = blog_id;
    }

    public ObjectId getUser_id() {
        return user_id;
    }

    public void setUser_id(ObjectId user_id) {
        this.user_id = user_id;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
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
