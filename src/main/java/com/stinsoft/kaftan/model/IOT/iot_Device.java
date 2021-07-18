package com.stinsoft.kaftan.model.IOT;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import ss.core.aws.AWSInfo;
import ss.core.helper.JsonObjectIdSerializer;
import ss.core.model.Response;

import java.util.Date;

public class iot_Device extends Response {

    @Id
    @JsonSerialize(using=JsonObjectIdSerializer.class)
    private ObjectId id;
    private String   deviceName;
    private AWSInfo  icon_aws_info;
    private boolean  isActive;
    private int      sort_order;

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

    public String getDeviceName() {
        return deviceName;
    }

    public void setDeviceName(String deviceName) {
        this.deviceName = deviceName;
    }

    public AWSInfo getIcon_aws_info() {
        return icon_aws_info;
    }

    public void setIcon_aws_info(AWSInfo icon_aws_info) {
        this.icon_aws_info = icon_aws_info;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
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
