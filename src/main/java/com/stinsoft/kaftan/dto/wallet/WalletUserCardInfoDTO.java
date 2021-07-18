package com.stinsoft.kaftan.dto.wallet;

public class WalletUserCardInfoDTO {

    private String userId;
    private String cardNo;
    private String expiryDate;
    private String cardHolderName;
    private boolean is_active;

    public String getUserId() { return userId; }

    public void setUserId(String userId) { this.userId = userId; }

    public String getCardNo() { return cardNo; }

    public void setCardNo(String cardNo) { this.cardNo = cardNo; }

    public String getExpiryDate() { return expiryDate; }

    public void setExpiryDate(String expiryDate) { this.expiryDate = expiryDate; }

    public String getCardHolderName() { return cardHolderName; }

    public void setCardHolderName(String cardHolderName) { this.cardHolderName = cardHolderName; }

    public boolean isIs_active() { return is_active; }

    public void setIs_active(boolean is_active) { this.is_active = is_active; }
}
