package com.stinsoft.kaftan.model.IOT;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import ss.core.helper.JsonObjectIdSerializer;
import ss.core.model.Response;

import java.util.Date;

public class iot_userDevice extends Response{

    @Id
    @JsonSerialize(using=JsonObjectIdSerializer.class)
    private ObjectId id;

    private String   name;
    private String   unique_Id;
    private boolean  status;

    @JsonSerialize(using=JsonObjectIdSerializer.class)
    private ObjectId device_id;

    @JsonSerialize(using=JsonObjectIdSerializer.class)
    private ObjectId user_id;

    @JsonSerialize(using=JsonObjectIdSerializer.class)
    private ObjectId customer_id;

    private Date     created_at;
    private Date     updated_at;

    public ObjectId getId() {
        return id;
    }

    public void setId(ObjectId id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getUnique_Id() {
        return unique_Id;
    }

    public void setUnique_Id(String unique_Id) {
        this.unique_Id = unique_Id;
    }

    public boolean isStatus() {
        return status;
    }

    public void setStatus(boolean status) {
        this.status = status;
    }

    public ObjectId getDevice_id() {
        return device_id;
    }

    public void setDevice_id(ObjectId device_id) {
        this.device_id = device_id;
    }

    public ObjectId getUser_id() {
        return user_id;
    }

    public void setUser_id(ObjectId user_id) {
        this.user_id = user_id;
    }

    public ObjectId getCustomer_id() {
        return customer_id;
    }

    public void setCustomer_id(ObjectId customer_id) {
        this.customer_id = customer_id;
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
}
