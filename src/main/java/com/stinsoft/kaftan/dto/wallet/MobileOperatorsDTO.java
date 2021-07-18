package com.stinsoft.kaftan.dto.wallet;

import com.stinsoft.kaftan.dto.wallet.MobileDenominationDTO;

import java.util.List;

public class MobileOperatorsDTO {
    public String name;
    public String operatorCode;
    public String CategoryCode;
    public String image;
    public List<MobileDenominationDTO> denominations;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getOperatorCode() {
        return operatorCode;
    }

    public void setOperatorCode(String operatorCode) {
        this.operatorCode = operatorCode;
    }

    public String getCategoryCode() { return CategoryCode; }

    public void setCategoryCode(String categoryCode) { CategoryCode = categoryCode; }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public List<MobileDenominationDTO> getDenominations() {
        return denominations;
    }

    public void setDenominations(List<MobileDenominationDTO> denominations) {
        this.denominations = denominations;
    }
}
