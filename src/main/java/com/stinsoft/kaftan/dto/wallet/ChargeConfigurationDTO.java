package com.stinsoft.kaftan.dto.wallet;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.stinsoft.kaftan.model.wallet.WalletOperators;
import org.bson.types.ObjectId;
import ss.core.helper.JsonObjectIdSerializer;

public class ChargeConfigurationDTO {

    private String id;

    @JsonSerialize(using=JsonObjectIdSerializer.class)
    private ObjectId operatorId;

    private boolean hasPercentage;

    private float chargeValue;

    public ServicesDTO operatorInfo;

    public String getId() { return id; }

    public void setId(String id) { this.id = id; }

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

    public ServicesDTO getOperatorInfo() {
        return operatorInfo;
    }

    public void setOperatorInfo(ServicesDTO operatorInfo) {
        this.operatorInfo = operatorInfo;
    }
}
