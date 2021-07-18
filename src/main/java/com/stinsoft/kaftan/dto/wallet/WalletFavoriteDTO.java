package com.stinsoft.kaftan.dto.wallet;

public class WalletFavoriteDTO {
    private String      id;
    private String      operatorId;
    private String      mobileCode;
    private String      mobileNo;
    private String      accountId;
    private String      accountType;
    private String      receiverUserId;
    private String      bankAccountNo;
    private String      bankAccountName;
    private boolean     isActive;
    private ServicesDTO walletOperatorInfo;

    public String getId() { return id; }

    public void setId(String id) { this.id = id; }

    public String getOperatorId() { return operatorId; }

    public void setOperatorId(String operatorId) { this.operatorId = operatorId; }

    public String getMobileCode() { return mobileCode; }

    public void setMobileCode(String mobileCode) { this.mobileCode = mobileCode; }

    public String getMobileNo() { return mobileNo; }

    public void setMobileNo(String mobileNo) { this.mobileNo = mobileNo; }

    public String getAccountId() { return accountId; }

    public void setAccountId(String accountId) { this.accountId = accountId; }

    public String getReceiverUserId() { return receiverUserId; }

    public void setReceiverUserId(String receiverUserId) { this.receiverUserId = receiverUserId; }

    public String getAccountType() { return accountType; }

    public void setAccountType(String accountType) { this.accountType = accountType; }

    public String getBankAccountNo() { return bankAccountNo; }

    public void setBankAccountNo(String bankAccountNo) { this.bankAccountNo = bankAccountNo; }

    public String getBankAccountName() { return bankAccountName; }

    public void setBankAccountName(String bankAccountName) { this.bankAccountName = bankAccountName; }

    public boolean isActive() { return isActive; }

    public void setActive(boolean active) { isActive = active; }

    public ServicesDTO getWalletOperatorInfo() {
        return walletOperatorInfo;
    }

    public void setWalletOperatorInfo(ServicesDTO walletOperatorInfo) {
        this.walletOperatorInfo = walletOperatorInfo;
    }
}
