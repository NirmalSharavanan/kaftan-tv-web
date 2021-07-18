package com.stinsoft.kaftan.model;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import ss.core.helper.JsonObjectIdSerializer;
import ss.core.model.Customer;
import ss.core.model.Response;

import java.util.List;

/**
 * Created by ssu on 04/12/17.
 */
@Document
public class PageMetadata  extends Response {
    @Id
    private ObjectId          id;
    private String          page_type; //has dynamic content
    private String          page_name; //has dynamic content
    private String          title;
    private String          description;
    private List<String> keywords;

    @JsonSerialize(using=JsonObjectIdSerializer.class)
    private ObjectId customer_id;

    public ObjectId getId() {
        return id;
    }

    public void setId(ObjectId id) {
        this.id = id;
    }

    public String getPage_type() {
        return page_type;
    }

    public void setPage_type(String page_type) {
        this.page_type = page_type;
    }

    public String getPage_name() {
        return page_name;
    }

    public void setPage_name(String page_name) {
        this.page_name = page_name;
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

    public List<String> getKeywords() {
        return keywords;
    }

    public void setKeywords(List<String> keywords) {
        this.keywords = keywords;
    }

    public ObjectId getCustomer_id() {
        return customer_id;
    }

    public void setCustomer_id(ObjectId customer_id) {
        this.customer_id = customer_id;
    }
}
