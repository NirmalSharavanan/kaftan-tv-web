package com.stinsoft.kaftan.model.wallet;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import ss.core.helper.JsonObjectIdSerializer;
import ss.core.model.Response;

import java.util.Date;

public class WalletUser extends Response {
    @Id
    @JsonSerialize(using=JsonObjectIdSerializer.class)
    private ObjectId    id;
    private String      walletCode;
    private String      rrnNo;
    private String      bankCode;
    private String      transactionPin;

    @JsonSerialize(using=JsonObjectIdSerializer.class)
    private ObjectId    user_id;

    private String      address;
    private String      idType;
    private String      idValue;

    private float       balance;

    private WalletUser walletUserInfo;

    private boolean     isActive;
    private boolean     hasAutoSubscription;

    private Date        created_at;
    private Date        updated_at;

    public ObjectId getId() {
        return id;
    }

    public void setId(ObjectId id) {
        this.id = id;
    }

    public float getBalance() {
        return balance;
    }

    public void setBalance(float balance) {
        this.balance = balance;
    }

    public String getWalletCode() {
        return walletCode;
    }

    public void setWalletCode(String walletCode) {
        this.walletCode = walletCode;
    }

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

    public ObjectId getUser_id() {
        return user_id;
    }

    public void setUser_id(ObjectId user_id) {
        this.user_id = user_id;
    }

    public String getAddress() { return address; }

    public void setAddress(String address) { this.address = address; }

    public String getIdType() { return idType; }

    public void setIdType(String idType) { this.idType = idType; }

    public String getIdValue() { return idValue; }

    public void setIdValue(String idValue) { this.idValue = idValue; }

    public WalletUser getWalletUserInfo() {
        return walletUserInfo;
    }

    public void setWalletUserInfo(WalletUser walletUserInfo) {
        this.walletUserInfo = walletUserInfo;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }

    public boolean isHasAutoSubscription() {
        return hasAutoSubscription;
    }

    public void setHasAutoSubscription(boolean hasAutoSubscription) {
        this.hasAutoSubscription = hasAutoSubscription;
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

    public String getTransactionPin() {
        return transactionPin;
    }

    public void setTransactionPin(String transactionPin) {
        this.transactionPin = transactionPin;
    }
}
