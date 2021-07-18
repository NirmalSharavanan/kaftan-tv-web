package com.stinsoft.kaftan.model.wallet;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.stereotype.Service;
import ss.core.helper.JsonObjectIdSerializer;
import ss.core.model.Response;

import java.util.Date;

@Service
public class WalletStockPurchase extends Response {

    @Id
    @JsonSerialize(using=JsonObjectIdSerializer.class)
    private ObjectId id;

    private int         serviceType;

    @JsonSerialize(using=JsonObjectIdSerializer.class)
    private ObjectId    operatorId;
    private String      walletCode;
    private double      purchaseCost;
    private double      purchaseAmount;
    private Date        created_at;

    public ObjectId getId() { return id; }

    public void setId(ObjectId id) { this.id = id; }

    public int getServiceType() { return serviceType; }

    public void setServiceType(int serviceType) { this.serviceType = serviceType; }

    public ObjectId getOperatorId() {
        return operatorId;
    }

    public void setOperatorId(ObjectId operatorId) {
        this.operatorId = operatorId;
    }

    public String getWalletCode() { return walletCode; }

    public void setWalletCode(String walletCode) { this.walletCode = walletCode; }

    public double getPurchaseCost() { return purchaseCost; }

    public void setPurchaseCost(double purchaseCost) { this.purchaseCost = purchaseCost; }

    public double getPurchaseAmount() { return purchaseAmount; }

    public void setPurchaseAmount(double purchaseAmount) { this.purchaseAmount = purchaseAmount; }

    public Date getCreated_at() { return created_at; }

    public void setCreated_at(Date created_at) { this.created_at = created_at; }
}
