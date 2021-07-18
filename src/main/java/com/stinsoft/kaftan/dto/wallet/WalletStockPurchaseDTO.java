package com.stinsoft.kaftan.dto.wallet;

import org.bson.types.ObjectId;

import java.util.Date;

public class WalletStockPurchaseDTO {

    private int         serviceType;
    private String      operatorId;
    private String      walletCode;
    private double      purchaseCost;
    private double      purchaseAmount;
    private String      registerMacing;
    private ServicesDTO serviceInfo;
    private String      operatorName;
    private Date        created_at;

    public int getServiceType() { return serviceType; }

    public void setServiceType(int serviceType) { this.serviceType = serviceType; }

    public String getOperatorId() { return operatorId; }

    public void setOperatorId(String operatorId) { this.operatorId = operatorId; }

    public String getWalletCode() { return walletCode; }

    public void setWalletCode(String walletCode) { this.walletCode = walletCode; }

    public double getPurchaseCost() { return purchaseCost; }

    public void setPurchaseCost(double purchaseCost) { this.purchaseCost = purchaseCost; }

    public double getPurchaseAmount() { return purchaseAmount; }

    public void setPurchaseAmount(double purchaseAmount) { this.purchaseAmount = purchaseAmount; }

    public String getRegisterMacing() { return registerMacing; }

    public void setRegisterMacing(String registerMacing) { this.registerMacing = registerMacing; }

    public Date getCreated_at() { return created_at; }

    public void setCreated_at(Date created_at) { this.created_at = created_at; }

    public ServicesDTO getServiceInfo() { return serviceInfo; }

    public void setServiceInfo(ServicesDTO serviceInfo) { this.serviceInfo = serviceInfo; }

    public String getOperatorName() { return operatorName; }

    public void setOperatorName(String operatorName) { this.operatorName = operatorName; }
}
