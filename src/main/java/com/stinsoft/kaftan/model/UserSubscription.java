package com.stinsoft.kaftan.model;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import ss.core.helper.JsonObjectIdSerializer;
import ss.core.model.Response;

import java.time.LocalDate;
import java.util.Date;

@Document
public class UserSubscription extends Response {

    @Id
    @JsonSerialize(using = JsonObjectIdSerializer.class)
    private ObjectId id;

    @JsonSerialize(using = JsonObjectIdSerializer.class)
    private ObjectId userId;

    @JsonSerialize(using = JsonObjectIdSerializer.class)
    private ObjectId subscriptionId;

    @JsonSerialize(using = JsonObjectIdSerializer.class)
    private ObjectId promotionId;

    private float paymentAmount;
//    LocalDate using for adding months, days,years for PaymentPlan
    private LocalDate subscriptionStarted_at;
    private LocalDate subscriptionEnd_at;
    private String paymentMode;
    private boolean paymentStatus;
    private String referenceNumber;
    private String transactionId;
    private Date created_at;
    private Date updated_at;

    public ObjectId getId() {
        return id;
    }

    public void setId(ObjectId id) {
        this.id = id;
    }

    public ObjectId getUserId() {
        return userId;
    }

    public void setUserId(ObjectId userId) {
        this.userId = userId;
    }

    public ObjectId getSubscriptionId() {
        return subscriptionId;
    }

    public void setSubscriptionId(ObjectId subscriptionId) {
        this.subscriptionId = subscriptionId;
    }

    public ObjectId getPromotionId() {
        return promotionId;
    }

    public void setPromotionId(ObjectId promotionId) {
        this.promotionId = promotionId;
    }

    public float getPaymentAmount() {
        return paymentAmount;
    }

    public void setPaymentAmount(float paymentAmount) {
        this.paymentAmount = paymentAmount;
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

    public String getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
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

    public String getReferenceNumber() {
        return referenceNumber;
    }

    public void setReferenceNumber(String referenceNumber) {
        this.referenceNumber = referenceNumber;
    }
}
