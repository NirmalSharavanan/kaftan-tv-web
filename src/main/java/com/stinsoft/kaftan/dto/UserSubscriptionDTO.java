package com.stinsoft.kaftan.dto;

import com.stinsoft.kaftan.dto.wallet.WalletUserDTO;
import com.stinsoft.kaftan.model.wallet.WalletUser;
import ss.core.model.Response;

import java.time.LocalDate;
import java.util.Date;

public class UserSubscriptionDTO extends Response {

    private String userId;
    private String subscriptionId;
    private String promotionId;
    private float paymentAmount;
    private String paymentMode;
    private boolean paymentStatus;
    private String paymentId;
    private String transactionId;
    private String referenceNumber;
    private LocalDate subscriptionStarted_at;
    private LocalDate subscriptionEnd_at;
    private String subscriptionDate;
    private SubscriptionDTO subscriptionInfo;
    private WalletUser walletInfo;

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getSubscriptionId() {
        return subscriptionId;
    }

    public void setSubscriptionId(String subscriptionId) {
        this.subscriptionId = subscriptionId;
    }

    public String getPromotionId() {
        return promotionId;
    }

    public void setPromotionId(String promotionId) {
        this.promotionId = promotionId;
    }

    public float getPaymentAmount() {
        return paymentAmount;
    }

    public void setPaymentAmount(float paymentAmount) {
        this.paymentAmount = paymentAmount;
    }

    public String getPaymentMode() {
        return paymentMode;
    }

    public void setPaymentMode(String paymentMode) {
        this.paymentMode = paymentMode;
    }

    public boolean isPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(boolean paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public String getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(String paymentId) {
        this.paymentId = paymentId;
    }

    public String getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
    }

    public LocalDate getSubscriptionStarted_at() {
        return subscriptionStarted_at;
    }

    public void setSubscriptionStarted_at(LocalDate subscriptionStarted_at) {
        this.subscriptionStarted_at = subscriptionStarted_at;
    }

    public LocalDate getSubscriptionEnd_at() {
        return subscriptionEnd_at;
    }

    public void setSubscriptionEnd_at(LocalDate subscriptionEnd_at) {
        this.subscriptionEnd_at = subscriptionEnd_at;
    }

    public String getSubscriptionDate() {
        return subscriptionDate;
    }

    public void setSubscriptionDate(String subscriptionDate) {
        this.subscriptionDate = subscriptionDate;
    }

    public String getReferenceNumber() {
        return referenceNumber;
    }

    public void setReferenceNumber(String referenceNumber) {
        this.referenceNumber = referenceNumber;
    }

    public SubscriptionDTO getSubscriptionInfo() {
        return subscriptionInfo;
    }

    public void setSubscriptionInfo(SubscriptionDTO subscriptionInfo) {
        this.subscriptionInfo = subscriptionInfo;
    }

    public WalletUser getWalletInfo() {
        return walletInfo;
    }

    public void setWalletInfo(WalletUser walletInfo) {
        this.walletInfo = walletInfo;
    }
}

