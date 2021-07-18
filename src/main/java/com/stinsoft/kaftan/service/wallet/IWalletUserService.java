package com.stinsoft.kaftan.service.wallet;

import com.stinsoft.kaftan.dto.wallet.*;
import com.stinsoft.kaftan.model.wallet.*;
import org.bson.types.ObjectId;

import java.util.Date;
import java.util.List;

public interface IWalletUserService {
    WalletUser create(WalletUser walletUser);
    WalletUser find(ObjectId id);
    WalletUser find(String id);
    WalletUser update(ObjectId id, WalletUser walletUser);
    ObjectId delete(ObjectId id);
    WalletUser findByWalletCode(ObjectId userId);
    WalletUser findWalletByUserId(ObjectId userId);
    WalletUser findWalletByMobileNo(String mobileNo);
    List<WalletUser> findAll();
    List<WalletDTO> findWalletByUser(ObjectId userId);

    WalletFavorite createFavorite(WalletFavorite walletUser);
    WalletFavorite findFavorite(ObjectId id);
    WalletFavorite findFavorite(String id);
    WalletFavorite updateFavorite(ObjectId id, WalletFavorite walletUser);
    List<WalletFavoriteDTO> findAllFavoritesByUser(ObjectId userId);
    ObjectId deleteFavorite(ObjectId id);
    WalletFavorite findFavoriteByMobileRecharge(ObjectId userId, ObjectId operatorId, String mobileNo);
    WalletFavorite findFavoriteByBillPayment(ObjectId userId, ObjectId operatorId, String accountId);
    WalletFavorite findFavoriteByBankAc(ObjectId userId, String bankAccountNo, String bankAccountName);
    WalletFavorite findFavoriteByReceiverId(ObjectId userId, String receiverUserId);

    WalletTransactionHistory createHistory(WalletTransactionHistory walletTransactionHistory);
    List<WalletTransactionHistoryDTO> findAllHistoryByUser(ObjectId userId, Date from_date, Date to_date);
    List<WalletTransactionHistoryDTO> findTransactionHistory(ObjectId historyId);

    WalletStockPurchase createWalletStock(WalletStockPurchase stockPurchase);
    List<WalletStockPurchaseDTO> findWalletStockByOperator(ObjectId operatorId);
    List<WalletStockPurchaseDTO> findAllPurchasedStocks(String operatorId, Date from_date, Date to_date);
    List<WalletUserDTO> findUserByMobileNumber(ObjectId userId);
    List<WalletTransactionHistoryDTO> findTransactionHistoryByOperator(String type, String operatorId,Date fromDate, Date toDate);
    List<WalletUserDTO> findAllSubscribers();

    WalletThresholdAlerts createThresholdAlert(WalletThresholdAlerts thresholdAlerts);
    WalletThresholdAlerts updateThresholdAlert(ObjectId id, WalletThresholdAlerts thresholdAlerts);
    List<WalletThresholdAlerts> findStockAlertByOperator(ObjectId operatorId);
    WalletThresholdAlerts findStockAlertId(ObjectId id);
    WalletThresholdAlerts findStockAlertByOperatorIdAndAmount(ObjectId operatorId, double thresholdAmount);
    List<WalletTransactionHistoryDTO> findTransactionSummary(Date from_date, Date to_date);

    WalletUserCardInfo createCardInfo(WalletUserCardInfo cardInfo);
    WalletUserCardInfo findcardNoByUserIdandCard(ObjectId userId, String cardNo);
    List<WalletUserCardInfo> findcardNoByUserid(ObjectId userId);

    WalletCharges createCharge(WalletCharges walletCharges);

    WalletCharges updateCharge(ObjectId id, WalletCharges walletCharges);

    WalletCharges findCharge(String id);

    WalletCharges findCharge(ObjectId id);

    WalletCharges findChargeConfigurationByOperator(ObjectId operatorId);

    List<ChargeConfigurationDTO> findAllCharges();

    List<ChargeConfigurationDTO> findWalletChargesByOperator(ObjectId operatorId);

    List<WalletTransactionHistoryDTO> findTransactionReportbyType();

    List<WalletTransactionHistory> findAllTransactionHistory();

    List<WalletUserDTO> findAllSubscribersbyMonth(java.time.LocalDate startDate, java.time.LocalDate endDate);
    List<WalletDTO> findAllActiveWalletUsers();
}
