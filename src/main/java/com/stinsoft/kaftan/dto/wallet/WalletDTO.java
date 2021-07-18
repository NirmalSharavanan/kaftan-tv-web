package com.stinsoft.kaftan.dto.wallet;

import com.stinsoft.kaftan.dto.SubscriptionDTO;
import com.stinsoft.kaftan.dto.UserSubscriptionDTO;
import ss.core.dto.SecureEndUserDTO;

public class WalletDTO {
    private String id;
    private String walletCode;
    private String rrnNo;
    private String bankCode;
    private String transactionPin;
    private String user_id;
    private String address;
    private String idType;
    private String idValue;
    private boolean isActive;
    private float balance;
    private boolean success;
    private boolean hasAutoSubscription;
    private String tranId;
    private SecureEndUserDTO userInfo;
    private UserSubscriptionDTO userSubscriptionInfo;
    private SubscriptionDTO subscription;

    public String getWalletCode() {
        return walletCode;
    }

    public void setWalletCode(String walletCode) { this.walletCode = walletCode; }

    public String getRrnNo() {
        return rrnNo;
    }

    public void setRrnNo(String rrnNo) {
        this.rrnNo = rrnNo;
    }

    public String getBankCode() {
        return bankCode;
    }

    public void setBankCode(String bankCode) {
        this.bankCode = bankCode;
    }

    public String getTransactionPin() {
        return transactionPin;
    }

    public void setTransactionPin(String transactionPin) {
        this.transactionPin = transactionPin;
    }

    public String getUser_id() { return user_id; }

    public void setUser_id(String user_id) { this.user_id = user_id; }

    public String getAddress() { return address; }

    public void setAddress(String address) { this.address = address; }

    public String getIdType() { return idType; }

    public void setIdType(String idType) { this.idType = idType; }

    public String getIdValue() { return idValue; }

    public void setIdValue(String idValue) { this.idValue = idValue; }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }

    public float getBalance() {
        return balance;
    }

    public void setBalance(float balance) {
        this.balance = balance;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public SecureEndUserDTO getUserInfo() {
        return userInfo;
    }

    public void setUserInfo(SecureEndUserDTO userInfo) {
        this.userInfo = userInfo;
    }

    public boolean isHasAutoSubscription() {
        return hasAutoSubscription;
    }

    public void setHasAutoSubscription(boolean hasAutoSubscription) {
        this.hasAutoSubscription = hasAutoSubscription;
    }

    public UserSubscriptionDTO getUserSubscriptionInfo() { return userSubscriptionInfo; }

    public void setUserSubscriptionInfo(UserSubscriptionDTO userSubscriptionInfo) { this.userSubscriptionInfo = userSubscriptionInfo; }

    public SubscriptionDTO getSubscription() { return subscription; }

    public void setSubscription(SubscriptionDTO subscription) { this.subscription = subscription; }

    public String getTranId() {
        return tranId;
    }

    public void setTranId(String tranId) {
        this.tranId = tranId;
    }
}
