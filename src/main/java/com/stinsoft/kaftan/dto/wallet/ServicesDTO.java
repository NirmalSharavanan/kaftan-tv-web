package com.stinsoft.kaftan.dto.wallet;
import com.stinsoft.kaftan.model.wallet.WalletThresholdAlerts;

import java.util.List;

public class ServicesDTO {

    private String id;
    private String name;
    private int serviceType;
    private int categoryId;
    private String categoryName;

    private int operatorCode;
    private String operatorName;
    private String operatorImage;
    private boolean active;
    private boolean     isUpdate;
    private WalletStockPurchaseDTO walletStockPurchaseInfo;
    private List<WalletStockPurchaseDTO> walletStocks;
    private ChargeConfigurationDTO chargeConfiguration;
    private WalletThresholdAlertsDTO thresholdAlertsInfo;

    public String getId() {
        return id;
    }

    public void setId(String id) {
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

    public int getOperatorCode() {
        return operatorCode;
    }

    public void setOperatorCode(int operatorCode) {
        this.operatorCode = operatorCode;
    }

    public boolean isActive() { return active; }

    public void setActive(boolean active) { this.active = active; }

    public boolean isUpdate() { return isUpdate; }

    public void setUpdate(boolean update) { isUpdate = update; }

    public WalletStockPurchaseDTO getWalletStockPurchaseInfo() { return walletStockPurchaseInfo; }

    public void setWalletStockPurchaseInfo(WalletStockPurchaseDTO walletStockPurchaseInfo) { this.walletStockPurchaseInfo = walletStockPurchaseInfo; }

    public List<WalletStockPurchaseDTO> getWalletStocks() { return walletStocks; }

    public void setWalletStocks(List<WalletStockPurchaseDTO> walletStocks) { this.walletStocks = walletStocks; }

    public ChargeConfigurationDTO getChargeConfiguration() { return chargeConfiguration; }

    public void setChargeConfiguration(ChargeConfigurationDTO chargeConfiguration) { this.chargeConfiguration = chargeConfiguration; }

    public WalletThresholdAlertsDTO getThresholdAlertsInfo() {return thresholdAlertsInfo; }

    public void setThresholdAlertsInfo(WalletThresholdAlertsDTO thresholdAlertsInfo) { this.thresholdAlertsInfo = thresholdAlertsInfo; }
}
