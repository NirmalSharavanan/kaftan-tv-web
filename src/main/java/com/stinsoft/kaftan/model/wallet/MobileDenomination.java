package com.stinsoft.kaftan.model.wallet;

import ss.core.model.Response;

public class MobileDenomination extends Response {
    public String amount;
    public String commission;

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
}
