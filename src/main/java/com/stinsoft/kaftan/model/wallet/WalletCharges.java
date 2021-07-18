package com.stinsoft.kaftan.model.wallet;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import ss.core.helper.JsonObjectIdSerializer;
import ss.core.model.Response;

import java.util.Date;

@Document
public class WalletCharges extends Response{

    @Id
    @JsonSerialize(using=JsonObjectIdSerializer.class)
    private ObjectId id;

    @JsonSerialize(using=JsonObjectIdSerializer.class)
    private ObjectId operatorId;
    private boolean hasPercentage;
    private float chargeValue;
    private Date createdAt;
    private Date updatedAt;

    public ObjectId getId() {
        return id;
    }

    public void setId(ObjectId id) {
        this.id = id;
    }

    public ObjectId getOperatorId() {
        return operatorId;
    }

    public void setOperatorId(ObjectId operatorId) {
        this.operatorId = operatorId;
    }

    public boolean isHasPercentage() {
        return hasPercentage;
    }

    public void setHasPercentage(boolean hasPercentage) {
        this.hasPercentage = hasPercentage;
    }

    public float getChargeValue() {
        return chargeValue;
    }

    public void setChargeValue(float chargeValue) {
        this.chargeValue = chargeValue;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Date getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Date updatedAt) {
        this.updatedAt = updatedAt;
    }
}
