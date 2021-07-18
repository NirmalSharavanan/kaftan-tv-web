package com.stinsoft.kaftan.dto;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.bson.types.ObjectId;
import ss.core.helper.JsonObjectIdSerializer;

/**
 * Created by ssu on 16/01/18.
 */
public class ParentContent {

    @JsonSerialize(using=JsonObjectIdSerializer.class)
    private ObjectId id;

    private String          title;

    private String          uiPath;

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

    public String getUiPath() {
        return uiPath;
    }

    public void setUiPath(String uiPath) {
        this.uiPath = uiPath;
    }
}
