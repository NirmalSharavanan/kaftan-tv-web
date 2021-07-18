package com.stinsoft.kaftan.model.wallet;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import ss.core.helper.JsonObjectIdSerializer;
import ss.core.model.Response;

import java.util.Date;

public class WalletUserCardInfo extends Response{

    @Id
    @JsonSerialize(using=JsonObjectIdSerializer.class)
    private ObjectId id;
    @JsonSerialize(using=JsonObjectIdSerializer.class)
    private ObjectId userId;

    private String cardNo;
    private String expiryDate;
    private String cardHolderName;
    private boolean is_active;
    private Date created_at;
    private Date updated_at;

    public ObjectId getId() {return id; }

    public void setId(ObjectId id) { this.id = id; }

    public ObjectId getUserId() { return userId; }

    public void setUserId(ObjectId userId) { this.userId = userId; }

    public String getCardNo() { return cardNo; }

    public void setCardNo(String cardNo) { this.cardNo = cardNo; }

    public String getExpiryDate() { return expiryDate; }

    public void setExpiryDate(String expiryDate) { this.expiryDate = expiryDate; }

    public String getCardHolderName() { return cardHolderName; }

    public void setCardHolderName(String cardHolderName) { this.cardHolderName = cardHolderName; }

    public boolean isIs_active() { return is_active; }

    public void setIs_active(boolean is_active) { this.is_active = is_active; }

    public Date getCreated_at() { return created_at; }

    public void setCreated_at(Date created_at) { this.created_at = created_at; }

    public Date getUpdated_at() { return updated_at; }

    public void setUpdated_at(Date updated_at) { this.updated_at = updated_at; }
}
