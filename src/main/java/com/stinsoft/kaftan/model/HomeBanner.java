package com.stinsoft.kaftan.model;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import ss.core.aws.AWSInfo;
import ss.core.helper.JsonObjectIdSerializer;
import ss.core.model.Response;

/**
 * Created by ssu on 17/01/18.
 */
public class HomeBanner extends Response {

    @Id
    @JsonSerialize(using=JsonObjectIdSerializer.class)
    private ObjectId id;

    private String redirectUrl;

    private String text;

    private String description;

    private int  sort_order;

    @JsonSerialize(using=JsonObjectIdSerializer.class)
    private ObjectId customer_id;

    private AWSInfo banner_aws_info;


    public ObjectId getId() {
        return id;
    }

    public void setId(ObjectId id) {
        this.id = id;
    }

    public String getRedirectUrl() {
        return redirectUrl;
    }

    public void setRedirectUrl(String redirectUrl) {
        this.redirectUrl = redirectUrl;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getSort_order() {
        return sort_order;
    }

    public void setSort_order(int sort_order) {
        this.sort_order = sort_order;
    }

    public ObjectId getCustomer_id() {
        return customer_id;
    }

    public void setCustomer_id(ObjectId customer_id) {
        this.customer_id = customer_id;
    }

    public AWSInfo getBanner_aws_info() {
        return banner_aws_info;
    }

    public void setBanner_aws_info(AWSInfo banner_aws_info) {
        this.banner_aws_info = banner_aws_info;
    }
}
