package com.stinsoft.kaftan.dto;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.stinsoft.kaftan.model.Comment;
import org.bson.types.ObjectId;
import ss.core.dto.UserDetailsDTO;
import ss.core.helper.JsonObjectIdSerializer;

import java.util.Date;
import java.util.List;

public class BlogDTOForUser {

    @JsonSerialize(using=JsonObjectIdSerializer.class)
    private ObjectId id;

    @JsonSerialize(using=JsonObjectIdSerializer.class)
    private ObjectId  user_id;

    private String    title;
    private String    content;

    private List<Comment> commentList;

    private int       sort_order;

    private Date      created_at;
    private Date      updated_at;

    private UserDetailsDTO userInfo;

    public ObjectId getId() {
        return id;
    }

    public void setId(ObjectId id) {
        this.id = id;
    }

    public ObjectId getUser_id() {
        return user_id;
    }

    public void setUser_id(ObjectId user_id) {
        this.user_id = user_id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public List<Comment> getCommentList() {
        return commentList;
    }

    public void setCommentList(List<Comment> commentList) {
        this.commentList = commentList;
    }

    public int getSort_order() {
        return sort_order;
    }

    public void setSort_order(int sort_order) {
        this.sort_order = sort_order;
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

    public UserDetailsDTO getUserInfo() {
        return userInfo;
    }

    public void setUserInfo(UserDetailsDTO userInfo) {
        this.userInfo = userInfo;
    }
}
