package com.stinsoft.kaftan.dto.wallet;

public class EncryptDataDTO {
    private String walletCode;
    private String rrnNo ;
    private String bankCode;
    private String idType;
    private String idValue;
    private String mobileNo;
    private double amount;

    public String getWalletCode() {
        return walletCode;
    }

    public void setWalletCode(String walletCode) {
        this.walletCode = walletCode;
    }

    public String getRrnNo() {
        return rrnNo;
    }

    public void setRrnNo(String rrnNo) {
        this.rrnNo = rrnNo;
    }

    public String getBankCode() {
        return bankCode;
    }

    public void setBankCode(String bankCode) {
        this.bankCode = bankCode;
    }

    public String getIdType() {
        return idType;
    }

    public void setIdType(String idType) {
        this.idType = idType;
    }

    public String getIdValue() {
        return idValue;
    }

    public void setIdValue(String idValue) {
        this.idValue = idValue;
    }

    public String getMobileNo() {
        return mobileNo;
    }

    public void setMobileNo(String mobileNo) {
        this.mobileNo = mobileNo;
    }

    public double getAmount() { return amount; }

    public void setAmount(double amount) { this.amount = amount; }
}
