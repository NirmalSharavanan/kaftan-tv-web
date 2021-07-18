package com.stinsoft.kaftan.dto.wallet;

import org.bson.types.ObjectId;

public class WalletThresholdAlertsDTO {

    private String id;
    private String operatorId;
    private String name;
    private String mobileNo;
    private String emailId;
    private double thresholdAmount;
    private boolean hasEmailSent;

    public String getId() { return id; }

    public void setId(String id) { this.id = id; }

    public String getOperatorId() { return operatorId; }

    public void setOperatorId(String operatorId) { this.operatorId = operatorId; }

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
}
