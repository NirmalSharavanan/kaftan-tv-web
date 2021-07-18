package com.stinsoft.kaftan.dto;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.bson.types.ObjectId;
import ss.core.dto.SecureEndUserDTO;
import ss.core.helper.JsonObjectIdSerializer;

public class BlogCommentDTO {

    @JsonSerialize(using=JsonObjectIdSerializer.class)
    private ObjectId blog_id;

    private String comment;

    private SecureEndUserDTO userInfo;

    public ObjectId getBlog_id() {
        return blog_id;
    }

    public void setBlog_id(ObjectId blog_id) {
        this.blog_id = blog_id;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public SecureEndUserDTO getUserInfo() {
        return userInfo;
    }

    public void setUserInfo(SecureEndUserDTO userInfo) {
        this.userInfo = userInfo;
    }

}
