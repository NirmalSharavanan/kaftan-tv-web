package com.stinsoft.kaftan.model.wallet;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import ss.core.helper.JsonObjectIdSerializer;
import ss.core.model.Response;

import java.util.Date;

public class WalletThresholdAlerts extends Response{

    @Id
    @JsonSerialize(using=JsonObjectIdSerializer.class)
    private ObjectId id;

    @JsonSerialize(using=JsonObjectIdSerializer.class)
    private ObjectId operatorId;

    private String name;
    private String mobileNo;
    private String emailId;
    private double thresholdAmount;
    private boolean hasEmailSent;
    private Date createdAt;
    private Date updatedAt;

    public ObjectId getId() { return id; }

    public void setId(ObjectId id) { this.id = id; }

    public ObjectId getOperatorId() { return operatorId; }

    public void setOperatorId(ObjectId operatorId) { this.operatorId = operatorId; }

    public String getName() { return name; }

    public void setName(String name) { this.name = name; }

    public String getMobileNo() { return mobileNo; }

    public void setMobileNo(String mobileNo) { this.mobileNo = mobileNo; }

    public String getEmailId() { return emailId; }

    public void setEmailId(String emailId) { this.emailId = emailId; }

    public double getThresholdAmount() { return thresholdAmount; }

    public void setThresholdAmount(double thresholdAmount) { this.thresholdAmount = thresholdAmount; }

    public boolean isHasEmailSent() { return hasEmailSent; }

    public void setHasEmailSent(boolean hasEmailSent) { this.hasEmailSent = hasEmailSent; }

    public Date getCreatedAt() { return createdAt; }

    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }

    public Date getUpdatedAt() { return updatedAt; }

    public void setUpdatedAt(Date updatedAt) { this.updatedAt = updatedAt; }
}
