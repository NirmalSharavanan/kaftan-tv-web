package com.stinsoft.kaftan.dto;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import ss.core.aws.AWSInfo;

import java.util.Date;
import java.util.List;

public class ContentDTO {

    //title to display in UI
    private String          title;

    //description about the content to render in UI
    private String          description;

    //Content type (video, Audio, images)
    private String          content_type;

    private boolean         is_premium;

    //Reference for episodes series, if yes the will have child contest list (contentList)
    private boolean         has_episode;

    private boolean         is_organized_by_season;

    private int             season_number;

    // Channel will have Channel
    private boolean         is_Channel;

    private String[]        categoryList;

    private String          youtube_VideoLink;

    private String          youtube_TrailerLink;

    private String          year;

    private Date            active_date;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getContent_type() {
        return content_type;
    }

    public void setContent_type(String content_type) {
        this.content_type = content_type;
    }

    public boolean isIs_premium() {
        return is_premium;
    }

    public void setIs_premium(boolean is_premium) {
        this.is_premium = is_premium;
    }

    public boolean is_premium() {
        return is_premium;
    }

    public boolean isHas_episode() {
        return has_episode;
    }

    public void setHas_episode(boolean has_episode) {
        this.has_episode = has_episode;
    }

    public boolean is_organized_by_season() {
        return is_organized_by_season;
    }

    public void setIs_organized_by_season(boolean is_organized_by_season) {
        this.is_organized_by_season = is_organized_by_season;
    }

    public int getSeason_number() {
        return season_number;
    }

    public void setSeason_number(int season_number) {
        this.season_number = season_number;
    }

    public boolean is_Channel() {
        return is_Channel;
    }

    public void setIs_Channel(boolean is_Channel) {
        this.is_Channel = is_Channel;
    }

    public String[] getCategoryList() {
        return categoryList;
    }

    public void setCategoryList(String[] categoryList) {
        this.categoryList = categoryList;
    }

    public String getYoutube_VideoLink() {
        return youtube_VideoLink;
    }

    public void setYoutube_VideoLink(String youtube_VideoLink) {
        this.youtube_VideoLink = youtube_VideoLink;
    }

    public String getYoutube_TrailerLink() {
        return youtube_TrailerLink;
    }

    public void setYoutube_TrailerLink(String youtube_TrailerLink) {
        this.youtube_TrailerLink = youtube_TrailerLink;
    }

    public Date getActive_date() {
        return active_date;
    }

    public void setActive_date(Date active_date) {
        this.active_date = active_date;
    }

    public String getYear() {
        return year;
    }

    public void setYear(String year) {
        this.year = year;
    }
}
