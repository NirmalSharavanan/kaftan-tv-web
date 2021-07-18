package com.stinsoft.kaftan.model;

/**
 * Created by ssu on 23/11/17.
 */
public class Comment {

    private String user_id;
    private String comment;

    public String getUser_id() {
        return user_id;
    }

    public void setUser_id(String user_id) {
        this.user_id = user_id;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }
}
