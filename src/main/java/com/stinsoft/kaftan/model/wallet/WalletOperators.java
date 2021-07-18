package com.stinsoft.kaftan.model.wallet;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.stinsoft.kaftan.dto.wallet.MobileDenominationDTO;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.stereotype.Service;
import ss.core.aws.AWSInfo;
import ss.core.helper.JsonObjectIdSerializer;
import ss.core.model.Response;

import java.util.Date;
import java.util.List;

@Service
public class WalletOperators extends Response {
    @Id
    @JsonSerialize(using=JsonObjectIdSerializer.class)
    private ObjectId id;

    private String      name;
    private int         serviceType;
    private int         categoryId;
    private String      categoryName;

    private String      operatorCode;
    private String      operatorName;
    private String      operatorImage;

    public List<MobileDenominationDTO> denominations;
    private boolean     active;
    private boolean     isUpdate;

    private Date created_at;
    private Date        updated_at;

    public ObjectId getId() {
        return id;
    }

    public void setId(ObjectId id) {
        this.id = id;
    }

    public int getServiceType() {
        return serviceType;
    }

    public String getName() { return name; }

    public void setName(String name) { this.name = name; }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public String getOperatorName() {
        return operatorName;
    }

    public void setOperatorName(String operatorName) {
        this.operatorName = operatorName;
    }

    public String getOperatorImage() {
        return operatorImage;
    }

    public void setOperatorImage(String operatorImage) {
        this.operatorImage = operatorImage;
    }

    public void setServiceType(int serviceType) {
        this.serviceType = serviceType;
    }

    public int getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(int categoryId) {
        this.categoryId = categoryId;
    }

    public String getOperatorCode() {
        return operatorCode;
    }

    public void setOperatorCode(String operatorCode) {
        this.operatorCode = operatorCode;
    }

    public boolean isActive() { return active; }

    public void setActive(boolean active) { this.active = active; }

    public boolean isUpdate() {
        return isUpdate;
    }

    public void setUpdate(boolean update) {
        isUpdate = update;
    }

    public List<MobileDenominationDTO> getDenominations() {
        return denominations;
    }

    public void setDenominations(List<MobileDenominationDTO> denominations) {
        this.denominations = denominations;
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
}
