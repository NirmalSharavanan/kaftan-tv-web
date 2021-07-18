package com.stinsoft.kaftan.dto;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import ss.core.dto.VideoPlayWrapper;
import ss.core.helper.JsonObjectIdListSerializer;
import ss.core.helper.JsonObjectIdSerializer;

import java.util.List;

/**
 * Created by ssu on 09/02/18.
 */
public class ContentThumbnailDTO {

    @JsonSerialize(using=JsonObjectIdSerializer.class)
    private ObjectId id;

    //title to display in UI
    private String          title;

    //description about the content to render in UI
    private String          description;

    private boolean         is_premium;

    private int             sort_order;

    private boolean         isContentUploded;

    private boolean         has_episode;

    @JsonSerialize(using=JsonObjectIdSerializer.class)
    private ObjectId        payperviewCategoryId;

    @JsonSerialize(using=JsonObjectIdListSerializer.class)
    private List<ObjectId> categoryList;

    private String          year;
    private String          content_type;

    private VideoPlayWrapper videoPlayWrappers;

    public ObjectId getId() {
        return id;
    }

    public void setId(ObjectId id) {
        this.id = id;
    }

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

    public boolean isIs_premium() {
        return is_premium;
    }

    public void setIs_premium(boolean is_premium) {
        this.is_premium = is_premium;
    }

    public int getSort_order() {
        return sort_order;
    }

    public void setSort_order(int sort_order) {
        this.sort_order = sort_order;
    }

    public boolean isContentUploded() {
        return isContentUploded;
    }

    public void setIsContentUploded(boolean isContentUploded) {
        this.isContentUploded = isContentUploded;
    }

    public boolean isHas_episode() {
        return has_episode;
    }

    public void setHas_episode(boolean has_episode) {
        this.has_episode = has_episode;
    }

    public ObjectId getPayperviewCategoryId() {
        return payperviewCategoryId;
    }

    public void setPayperviewCategoryId(ObjectId payperviewCategoryId) {
        this.payperviewCategoryId = payperviewCategoryId;
    }

    public List<ObjectId> getCategoryList() {
        return categoryList;
    }

    public void setCategoryList(List<ObjectId> categoryList) {
        this.categoryList = categoryList;
    }

    public String getYear() {
        return year;
    }

    public void setYear(String year) {
        this.year = year;
    }

    public String getContent_type() {
        return content_type;
    }

    public void setContent_type(String content_type) {
        this.content_type = content_type;
    }

    public VideoPlayWrapper getVideoPlayWrappers() {
        return videoPlayWrappers;
    }

    public void setVideoPlayWrappers(VideoPlayWrapper videoPlayWrappers) {
        this.videoPlayWrappers = videoPlayWrappers;
    }
}
