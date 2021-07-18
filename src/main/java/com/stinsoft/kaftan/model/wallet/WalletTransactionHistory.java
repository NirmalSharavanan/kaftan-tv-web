package com.stinsoft.kaftan.model.wallet;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import ss.core.helper.JsonObjectIdSerializer;
import ss.core.model.Response;

import java.util.Date;

/**
 * Created by sridevi on 29-10-2019.
 */
public class WalletTransactionHistory extends Response {

    @Id
    @JsonSerialize(using=JsonObjectIdSerializer.class)
    private ObjectId id;

    private String      transactionType;
    private String      txnId;

    private float       totalAmount;
    private float       chargeAmount;
    private float       paymentAmount;

    private ObjectId    operatorBillerId;

    private String      txnMobileNumber;
    private String      customerId;
    private String      billerAccountId;
    private String      moneyTransferType;
    private float         commission;

    private ObjectId    txnUserId;

    private String      moneyTransfer_accountNumber;
    private String      moneyTransfer_accountType;
    private String      moneyTransfer_bankName;
    private String      transactionStatus;

    @JsonSerialize(using=JsonObjectIdSerializer.class)
    private ObjectId    userId;

    private Date        created_at;
    private Date        updated_at;

    private boolean     isActive;

    public ObjectId getId() {
        return id;
    }

    public void setId(ObjectId id) {
        this.id = id;
    }

    public String getTransactionType() {
        return transactionType;
    }

    public void setTransactionType(String transactionType) {
        this.transactionType = transactionType;
    }

    public String getTxnId() {
        return txnId;
    }

    public void setTxnId(String txnId) {
        this.txnId = txnId;
    }

    public float getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(float totalAmount) {
        this.totalAmount = totalAmount;
    }

    public float getChargeAmount() {
        return chargeAmount;
    }

    public void setChargeAmount(float chargeAmount) {
        this.chargeAmount = chargeAmount;
    }

    public float getPaymentAmount() {
        return paymentAmount;
    }

    public void setPaymentAmount(float paymentAmount) {
        this.paymentAmount = paymentAmount;
    }

    public ObjectId getOperatorBillerId() {
        return operatorBillerId;
    }

    public void setOperatorBillerId(ObjectId operatorBillerId) {
        this.operatorBillerId = operatorBillerId;
    }

    public String getTxnMobileNumber() {
        return txnMobileNumber;
    }

    public void setTxnMobileNumber(String txnMobileNumber) {
        this.txnMobileNumber = txnMobileNumber;
    }

    public String getBillerAccountId() {
        return billerAccountId;
    }

    public void setBillerAccountId(String billerAccountId) {
        this.billerAccountId = billerAccountId;
    }

    public String getMoneyTransferType() {
        return moneyTransferType;
    }

    public void setMoneyTransferType(String moneyTransferType) {
        this.moneyTransferType = moneyTransferType;
    }

    public float getCommission() {
        return commission;
    }

    public void setCommission(float commission) {
        this.commission = commission;
    }

    public ObjectId getTxnUserId() {
        return txnUserId;
    }

    public void setTxnUserId(ObjectId txnUserId) {
        this.txnUserId = txnUserId;
    }

    public String getMoneyTransfer_accountNumber() {
        return moneyTransfer_accountNumber;
    }

    public void setMoneyTransfer_accountNumber(String moneyTransfer_accountNumber) {
        this.moneyTransfer_accountNumber = moneyTransfer_accountNumber;
    }

    public String getMoneyTransfer_accountType() {
        return moneyTransfer_accountType;
    }

    public void setMoneyTransfer_accountType(String moneyTransfer_accountType) {
        this.moneyTransfer_accountType = moneyTransfer_accountType;
    }

    public String getMoneyTransfer_bankName() {
        return moneyTransfer_bankName;
    }

    public void setMoneyTransfer_bankName(String moneyTransfer_bankName) {
        this.moneyTransfer_bankName = moneyTransfer_bankName;
    }

    public String getTransactionStatus() {
        return transactionStatus;
    }

    public void setTransactionStatus(String transactionStatus) {
        this.transactionStatus = transactionStatus;
    }

    public ObjectId getUserId() {
        return userId;
    }

    public void setUserId(ObjectId userId) {
        this.userId = userId;
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

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }

    public String getCustomerId() {
        return customerId;
    }

    public void setCustomerId(String customerId) {
        this.customerId = customerId;
    }
}
