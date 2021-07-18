package com.stinsoft.kaftan.model.wallet;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import ss.core.helper.JsonObjectIdSerializer;
import ss.core.model.Response;

import java.util.Date;

public class WalletFavorite extends Response {
    @Id
    @JsonSerialize(using=JsonObjectIdSerializer.class)
    private ObjectId    id;
    @JsonSerialize(using=JsonObjectIdSerializer.class)
    private ObjectId    userId;
    @JsonSerialize(using=JsonObjectIdSerializer.class)
    private ObjectId    operatorId;
    private String      mobileCode;
    private String      mobileNo;
    private String      accountId;
    private String      accountType;
    private String      receiverUserId;
    private String      bankAccountNo;
    private String      bankAccountName;
    private boolean     isActive;
    private Date        created_at;
    private Date        updated_at;

    public ObjectId getId() { return id; }

    public void setId(ObjectId id) { this.id = id; }

    public ObjectId getUserId() { return userId; }

    public void setUserId(ObjectId userId) { this.userId = userId; }

    public ObjectId getOperatorId() { return operatorId; }

    public void setOperatorId(ObjectId operatorId) { this.operatorId = operatorId; }

    public String getMobileCode() { return mobileCode; }

    public void setMobileCode(String mobileCode) { this.mobileCode = mobileCode; }

    public String getMobileNo() { return mobileNo; }

    public void setMobileNo(String mobileNo) { this.mobileNo = mobileNo; }

    public String getAccountType() { return accountType; }

    public void setAccountType(String accountType) { this.accountType = accountType; }

    public String getReceiverUserId() { return receiverUserId; }

    public void setReceiverUserId(String receiverUserId) { this.receiverUserId = receiverUserId; }

    public String getAccountId() { return accountId; }

    public void setAccountId(String accountId) { this.accountId = accountId; }

    public String getBankAccountNo() { return bankAccountNo; }

    public void setBankAccountNo(String bankAccountNo) { this.bankAccountNo = bankAccountNo; }

    public String getBankAccountName() { return bankAccountName; }

    public void setBankAccountName(String bankAccountName) { this.bankAccountName = bankAccountName; }

    public boolean isActive() { return isActive; }

    public void setActive(boolean active) { isActive = active; }

    public Date getCreated_at() { return created_at; }

    public void setCreated_at(Date created_at) { this.created_at = created_at; }

    public Date getUpdated_at() { return updated_at; }

    public void setUpdated_at(Date updated_at) { this.updated_at = updated_at; }
}
