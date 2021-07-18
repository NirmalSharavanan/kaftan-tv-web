package com.stinsoft.kaftan.model;

/**
 * Created by ssu on 23/11/17.
 */
public class Rating {

    private String user_id;
    private int rating;

    public String getUser_id() {
        return user_id;
    }

    public void setUser_id(String user_id) {
        this.user_id = user_id;
    }

    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }
}
