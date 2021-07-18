package com.stinsoft.kaftan.dto.wallet;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.bson.types.ObjectId;
import ss.core.dto.SecureEndUserDTO;
import ss.core.helper.JsonObjectIdSerializer;

import java.util.Date;
import java.util.List;

/**
 * Created by sridevi on 29-10-2019.
 */
public class WalletTransactionHistoryDTO {

    private String      transactionType;
    private String      txnId;

    private float       totalAmount;
    private float       chargeAmount;
    private float       paymentAmount;

    private String      operatorBillerId;

    private String      txnMobileNumber;
    private String      customerId;
    private String      billerAccountId;
    private String      moneyTransferType;

    private String      txnUserId;
    private float       commission;
    private String      moneyTransfer_accountNumber;
    private String      moneyTransfer_accountType;
    private String      moneyTransfer_bankName;
    private String      transactionStatus;
    private String      transactionDate;
    private float       totalCommission;

    @JsonSerialize(using=JsonObjectIdSerializer.class)
    private ObjectId    userId;

    private Date        created_at;
    private Date        updated_at;

    private boolean     isActive;

    private SecureEndUserDTO userInfo;
    private SecureEndUserDTO txnUserInfo;
    private ServicesDTO serviceInfo;
    private List walletTransactionHistoryList;

    public List getWalletTransactionHistoryList() {
        return walletTransactionHistoryList;
    }

    public void setWalletTransactionHistoryList(List walletTransactionHistoryList) {
        this.walletTransactionHistoryList = walletTransactionHistoryList;
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

    public String getOperatorBillerId() {
        return operatorBillerId;
    }

    public void setOperatorBillerId(String operatorBillerId) {
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

    public String getTxnUserId() {
        return txnUserId;
    }

    public void setTxnUserId(String txnUserId) {
        this.txnUserId = txnUserId;
    }

    public float getCommission() {
        return commission;
    }

    public void setCommission(float commission) {
        this.commission = commission;
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

    public String getTransactionDate() {
        return transactionDate;
    }

    public void setTransactionDate(String transactionDate) {
        this.transactionDate = transactionDate;
    }

    public float getTotalCommission() {
        return totalCommission;
    }

    public void setTotalCommission(float totalCommission) {
        this.totalCommission = totalCommission;
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

    public SecureEndUserDTO getUserInfo() {
        return userInfo;
    }

    public void setUserInfo(SecureEndUserDTO userInfo) {
        this.userInfo = userInfo;
    }

    public SecureEndUserDTO getTxnUserInfo() {
        return txnUserInfo;
    }

    public void setTxnUserInfo(SecureEndUserDTO txnUserInfo) {
        this.txnUserInfo = txnUserInfo;
    }

    public ServicesDTO getServiceInfo() {
        return serviceInfo;
    }

    public void setServiceInfo(ServicesDTO serviceInfo) {
        this.serviceInfo = serviceInfo;
    }

    public String getCustomerId() {
        return customerId;
    }

    public void setCustomerId(String customerId) {
        this.customerId = customerId;
    }
}
