package com.stinsoft.kaftan.model;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.bson.types.ObjectId;
import ss.core.helper.JsonObjectIdSerializer;

/**
 * Created by ssu on 15/12/17.
 */
public class ContentOrder implements Comparable<ContentOrder> {

    Integer sort_order;

    @JsonSerialize(using=JsonObjectIdSerializer.class)
    private ObjectId content_id;

    public Integer getSort_order() {
        return sort_order;
    }

    public void setSort_order(Integer sort_order) {
        this.sort_order = sort_order;
    }

    @Override
    public int compareTo(ContentOrder contentOrder) {
        return contentOrder.getSort_order() - this.getSort_order();
    }

    public ObjectId getContent_id() {
        return content_id;
    }

    public void setContent_id(ObjectId content_id) {
        this.content_id = content_id;
    }
}
