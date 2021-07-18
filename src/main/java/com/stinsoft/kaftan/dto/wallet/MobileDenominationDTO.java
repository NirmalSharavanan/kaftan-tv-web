package com.stinsoft.kaftan.dto.wallet;

public class MobileDenominationDTO {
    public String amount;
    public String commission;
    public String planid;

    public String getAmount() {
        return amount;
    }

    public void setAmount(String amount) {
        this.amount = amount;
    }

    public String getCommission() {
        return commission;
    }

    public void setCommission(String commission) {
        this.commission = commission;
    }

    public String getPlanid() { return planid; }

    public void setPlanid(String planid) { this.planid = planid; }
}
