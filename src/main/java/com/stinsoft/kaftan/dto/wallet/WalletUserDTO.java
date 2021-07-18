package com.stinsoft.kaftan.dto.wallet;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.stinsoft.kaftan.dto.UserSubscriptionDTO;
import com.stinsoft.kaftan.model.wallet.WalletTransactionHistory;
import com.stinsoft.kaftan.model.wallet.WalletUser;
import org.bson.types.ObjectId;
import ss.core.dto.SecureEndUserDTO;
import ss.core.helper.JsonObjectIdSerializer;

import java.util.Date;
import java.util.List;

public class WalletUserDTO {

    @JsonSerialize(using=JsonObjectIdSerializer.class)
    private ObjectId    id;
    private String    user_id;
    private String name;
    private String email;
    private String mobileNo;
    private String role;
    private boolean is_active;
    private Date created_at;
    private Date lastLogin_at;
    private String lastLoginAt;
    private WalletUser walletInfo;
    private int totalSubscribers;
    private String subscriptionDate;
    private WalletTransactionHistory walletTransactionHistoryInfo;
    private List<WalletTransactionHistory> walletTransactionHistoryList;
    private UserSubscriptionDTO userSubscriptionInfo;

    public ObjectId getId() {
        return id;
    }

    public void setId(ObjectId id) {
        this.id = id;
    }

    public String getUser_id() {
        return user_id;
    }

    public void setUser_id(String user_id) {
        this.user_id = user_id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMobileNo() {
        return mobileNo;
    }

    public void setMobileNo(String mobileNo) {
        this.mobileNo = mobileNo;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public boolean isIs_active() {
        return is_active;
    }

    public void setIs_active(boolean is_active) {
        this.is_active = is_active;
    }

    public Date getCreated_at() {
        return created_at;
    }

    public void setCreated_at(Date created_at) {
        this.created_at = created_at;
    }

    public Date getLastLogin_at() {
        return lastLogin_at;
    }

    public void setLastLogin_at(Date lastLogin_at) {
        this.lastLogin_at = lastLogin_at;
    }

    public String getLastLoginAt() {
        return lastLoginAt;
    }

    public void setLastLoginAt(String lastLoginAt) {
        this.lastLoginAt = lastLoginAt;
    }

    public WalletUser getWalletInfo() {
        return walletInfo;
    }

    public void setWalletInfo(WalletUser walletInfo) {
        this.walletInfo = walletInfo;
    }

    public int getTotalSubscribers() {
        return totalSubscribers;
    }

    public void setTotalSubscribers(int totalSubscribers) {
        this.totalSubscribers = totalSubscribers;
    }

    public String getSubscriptionDate() {
        return subscriptionDate;
    }

    public void setSubscriptionDate(String subscriptionDate) {
        this.subscriptionDate = subscriptionDate;
    }

    public WalletTransactionHistory getWalletTransactionHistoryInfo() {
        return walletTransactionHistoryInfo;
    }

    public void setWalletTransactionHistoryInfo(WalletTransactionHistory walletTransactionHistoryInfo) {
        this.walletTransactionHistoryInfo = walletTransactionHistoryInfo;
    }

    public List<WalletTransactionHistory> getWalletTransactionHistoryList() {
        return walletTransactionHistoryList;
    }

    public void setWalletTransactionHistoryList(List<WalletTransactionHistory> walletTransactionHistoryList) {
        this.walletTransactionHistoryList = walletTransactionHistoryList;
    }

    public UserSubscriptionDTO getUserSubscriptionInfo() {
        return userSubscriptionInfo;
    }

    public void setUserSubscriptionInfo(UserSubscriptionDTO userSubscriptionInfo) {
        this.userSubscriptionInfo = userSubscriptionInfo;
    }
}
