package com.stinsoft.kaftan.service.wallet;

import com.mongodb.BasicDBObject;
import com.stinsoft.kaftan.dto.wallet.*;
import com.stinsoft.kaftan.model.wallet.*;
import com.stinsoft.kaftan.repository.wallet.*;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.stereotype.Service;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoOperations;
import ss.core.email.Email;
import ss.core.email.EmailService;
import ss.core.email.EmailTemplate;
import ss.core.helper.ConfigHelper;
import ss.core.helper.DateHelper;
import ss.core.model.Customer;
import ss.core.model.User;
import ss.core.security.service.ISessionService;
import ss.core.service.CustomerService;
import ss.core.service.UserEmailService;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.*;

import static org.springframework.data.mongodb.core.aggregation.Aggregation.*;
import static org.springframework.data.mongodb.core.query.Criteria.where;

@Service
public class WalletUserService implements IWalletUserService {
    @Autowired
    WalletRepository repository;

    @Autowired
    ChargeConfigurationRepository chargeRepository;

    @Autowired
    WalletFavoriteRepository favoritesRepository;

    @Autowired
    TransactionHistoryRepository transactionHistoryRepository;

    @Autowired
    WalletStockPurchaseRepository stockPurchaseRepository;

    @Autowired
    ThresholdAlertsRepository thresholdAlertsRepository;

    @Autowired
    WalletUserCardInfoRepository cardInfoRepository;

    @Autowired
    MongoOperations operations;

    @Autowired
    ConfigHelper configHelper;

    @Autowired
    EmailService emailService;

    @Autowired
    UserEmailService userEmailService;

    @Autowired
    private ISessionService sessionService;

    @Autowired
    CustomerService customerService;

    private Logger logger = LoggerFactory.getLogger(WalletUserService.class);

//    public WalletUserService() {
//        super();
//    }

    @Override
    public WalletUser create(WalletUser walletUser) {
        walletUser.setCreated_at(DateHelper.getCurrentDate());
        walletUser.setUpdated_at(DateHelper.getCurrentDate());
        return repository.save(walletUser);
    }

    @Override
    public WalletUser find(ObjectId id) {
        return repository.findOne(id);
    }

    @Override
    public WalletUser find(String id) {
        return repository.findOne(new ObjectId(id));
    }

    @Override
    public WalletUser update(ObjectId id, WalletUser walletUser) {
        walletUser.setUpdated_at(DateHelper.getCurrentDate());
        return repository.save(walletUser);
    }

    @Override
    public ObjectId delete(ObjectId id) {
        repository.delete(id);
        return id;
    }

    @Override
    public WalletUser findByWalletCode(ObjectId userId) {
        return repository.findByWalletCode(userId);
    }

    @Override
    public WalletUser findWalletByUserId(ObjectId userId) {
        return repository.findWalletByUser(userId);
    }

    @Override
    public List<WalletDTO> findWalletByUser(ObjectId userId) {
        AggregationResults<WalletDTO> results = operations.aggregate(
                newAggregation(WalletUser.class,
                        match(where("user_id").is(userId)),
                        lookup("user", "user_id", "_id", "userInfo"),
                        unwind("userInfo")
                ), WalletDTO.class);
        return results.getMappedResults();
    }

    @Override
    public WalletUser findWalletByMobileNo(String mobileNo) {
        AggregationResults <WalletUser> result = null;

        result = operations.aggregate(
                newAggregation(User.class,
                        match(where("mobileNo").is(mobileNo)),
                        lookup("walletUser", "_id", "user_id", "walletUserInfo"),
                        unwind("walletUserInfo")
                ), WalletUser.class);

        return result.getMappedResults().get(0).getWalletUserInfo();
    }

    @Override
    public List<WalletUser> findAll() {
        return repository.findAll();
    }

    @Override
    public WalletFavorite createFavorite(WalletFavorite favorite) {
        favorite.setCreated_at(DateHelper.getCurrentDate());
        favorite.setUpdated_at(DateHelper.getCurrentDate());
        return favoritesRepository.save(favorite);
    }

    @Override
    public WalletFavorite findFavorite(ObjectId id) {
        return favoritesRepository.findOne(id);
    }

    @Override
    public WalletFavorite findFavorite(String id) {
        return favoritesRepository.findOne(new ObjectId(id));
    }

    @Override
    public WalletFavorite updateFavorite(ObjectId id, WalletFavorite favorite) {
        favorite.setUpdated_at(DateHelper.getCurrentDate());
        return favoritesRepository.save(favorite);
    }

    @Override
    public WalletFavorite findFavoriteByMobileRecharge(ObjectId userId, ObjectId operatorId, String mobileNo) {
        return favoritesRepository.findFavoriteByMobileRecharge(userId, operatorId, mobileNo);
    }

    @Override
    public WalletFavorite findFavoriteByBillPayment(ObjectId userId, ObjectId operatorId, String accountId) {
        return favoritesRepository.findFavoriteByBillPayment(userId,operatorId, accountId);
    }

    @Override
    public WalletFavorite findFavoriteByBankAc(ObjectId userId, String bankAccountNo, String bankAccountName) {
        return favoritesRepository.findFavoriteByBankAc(userId, bankAccountNo, bankAccountName);
    }

    @Override
    public WalletFavorite findFavoriteByReceiverId(ObjectId userId, String receiverUserId) {
        return favoritesRepository.findFavoriteByReceiverId(userId, receiverUserId);
    }

    @Override
    public List<WalletFavoriteDTO> findAllFavoritesByUser(ObjectId userId) {
        AggregationResults<WalletFavoriteDTO> results = operations.aggregate(
                newAggregation(WalletFavorite.class,
                        match(where("userId").is(userId)),
                        lookup("walletOperators", "operatorId", "_id", "walletOperatorInfo"),
                        unwind("walletOperatorInfo"),
                        sort(Sort.Direction.DESC, "created_at")
                ), WalletFavoriteDTO.class);
        return results.getMappedResults();
    }

    @Override
    public ObjectId deleteFavorite(ObjectId id) {
        favoritesRepository.delete(id);
        return id;
    }

    @Override
    public WalletTransactionHistory createHistory(WalletTransactionHistory walletTransactionHistory) {
        walletTransactionHistory.setCreated_at(DateHelper.getCurrentDate());
        walletTransactionHistory.setUpdated_at(DateHelper.getCurrentDate());
        return transactionHistoryRepository.save(walletTransactionHistory);
    }

    @Override
    public List<WalletTransactionHistoryDTO> findAllHistoryByUser(ObjectId userId, Date from_date, Date to_date) {
        AggregationResults<WalletTransactionHistoryDTO> results = operations.aggregate(
                newAggregation(WalletTransactionHistory.class,
                        match(where("userId").is(userId)),
                        match(where("created_at").gte(from_date)),
                        match(where("created_at").lte(to_date)),
                        lookup("user", "userId", "_id", "userInfo"),
                        unwind("userInfo"),
                        lookup("walletOperators", "operatorBillerId", "_id", "serviceInfo"),
                        unwind("serviceInfo", true),
                        lookup("user", "txnUserId", "_id", "txnUserInfo"),
                        unwind("txnUserInfo", true),
                        sort(Sort.Direction.DESC, "created_at")
                ), WalletTransactionHistoryDTO.class);
        return results.getMappedResults();
    }

    @Override
    public List<WalletTransactionHistoryDTO> findTransactionHistory(ObjectId historyId) {
        AggregationResults<WalletTransactionHistoryDTO> results = operations.aggregate(
                newAggregation(WalletTransactionHistory.class,
                        match(where("id").is(historyId)),
                        lookup("user", "userId", "_id", "userInfo"),
                        unwind("userInfo"),
                        lookup("walletOperators", "operatorBillerId", "_id", "serviceInfo"),
                        unwind("serviceInfo"),
                        lookup("user", "txnUserId", "_id", "txnUserInfo"),
                        unwind("txnUserInfo", true),
                        sort(Sort.Direction.DESC, "created_at")
                ), WalletTransactionHistoryDTO.class);
        return results.getMappedResults();
    }

    @Override
    public WalletStockPurchase createWalletStock(WalletStockPurchase stockPurchase) {
        stockPurchase.setCreated_at(DateHelper.getCurrentDate());
        return stockPurchaseRepository.save(stockPurchase);
    }

    @Override
    public List<WalletStockPurchaseDTO> findWalletStockByOperator(ObjectId operatorId) {

        AggregationResults<WalletStockPurchaseDTO> results = operations.aggregate(
                newAggregation(WalletStockPurchase.class,
                        match(where("operatorId").is(operatorId)),
                        lookup("walletOperators", "operatorId", "_id", "serviceInfo"),
                        unwind("serviceInfo"),
                        sort(Sort.Direction.DESC, "created_at")
                ), WalletStockPurchaseDTO.class);
        return results.getMappedResults();
    }

    @Override
    public List<WalletStockPurchaseDTO> findAllPurchasedStocks(String operatorId, Date from_date, Date to_date) {
        AggregationResults<WalletStockPurchaseDTO> results = null;

        if (operatorId.equals("All")) {
            results = operations.aggregate(
                    newAggregation(WalletStockPurchase.class,
                            match(where("created_at").gte(from_date)),
                            match(where("created_at").lte(to_date)),
                            lookup("walletOperators", "operatorId", "_id", "serviceInfo"),
                            unwind("serviceInfo"),
                            sort(Sort.Direction.DESC, "created_at")
                    ), WalletStockPurchaseDTO.class);

        } else {
            results = operations.aggregate(
                    newAggregation(WalletStockPurchase.class,
                            match(where("operatorId").is(new ObjectId(operatorId))),
                            match(where("created_at").gte(from_date)),
                            match(where("created_at").lte(to_date)),
                            lookup("walletOperators", "operatorId", "_id", "serviceInfo"),
                            unwind("serviceInfo"),
                            sort(Sort.Direction.DESC, "created_at")
                    ), WalletStockPurchaseDTO.class);
        }
        return results.getMappedResults();

    }

    @Override
    public List<WalletUserDTO> findUserByMobileNumber(ObjectId userId) {
        AggregationResults<WalletUserDTO> results = null;
        results = operations.aggregate(
                newAggregation(User.class,
                        match(where("id").is(userId)),
                        lookup("walletUser", "_id", "user_id", "walletInfo"),
                        unwind("walletInfo"),
                        lookup("walletTransactionHistory", "_id", "userId", "walletTransactionHistoryInfo"),
                        unwind("walletTransactionHistoryInfo", true),
                        lookup("userSubscription", "_id", "userId", "userSubscriptionInfo"),
                        unwind("userSubscriptionInfo", true),
                        group("walletInfo.user_id")
                                .min("name").as("name").min("email").as("email")
                                .min("role").as("role")
                                .min("mobileNo").as("mobileNo").min("is_active").as("is_active")
                                .min("created_at").as("created_at").min("lastLogin_at").as("lastLogin_at")
                                .min("walletInfo").as("walletInfo").min("walletTransactionHistoryInfo").as("walletTransactionHistoryInfo")
                                .min("userSubscriptionInfo").as("userSubscriptionInfo"),
                        project("name", "email", "mobileNo", "role", "created_at", "is_active",
                                "walletInfo", "walletTransactionHistoryInfo", "userSubscriptionInfo")
                                .andExpression("dateToString('%Y/%m/%d',lastLogin_at)").as("lastLoginAt")
                                .andExpression("dateToString('%Y/%m/%d',userSubscriptionInfo.subscriptionEnd_at)").as("subscriptionDate")
                ), WalletUserDTO.class);

        return results.getMappedResults();
    }

    @Override
    public List<WalletUserDTO> findAllSubscribers() {
        AggregationResults<WalletUserDTO> results = null;
        results = operations.aggregate(
                newAggregation(User.class,

                        lookup("walletUser", "_id", "user_id", "walletInfo"),
                        unwind("walletInfo"),
                        lookup("walletTransactionHistory", "_id", "userId", "walletTransactionHistoryInfo"),
                        unwind("walletTransactionHistoryInfo", true),
                        lookup("userSubscription", "_id", "userId", "userSubscriptionInfo"),
                        unwind("userSubscriptionInfo", true),
                        sort(Sort.Direction.ASC, "walletTransactionHistoryInfo.created_at"),

                        group("walletInfo.user_id")
                                .push(new BasicDBObject("transactionType", "$walletTransactionHistoryInfo.transactionType")
                                        .append("created_at", "$walletTransactionHistoryInfo.created_at")
                                        .append("updated_at", "$walletTransactionHistoryInfo.updated_at")

                                ).as("walletTransactionHistoryList")
                                .min("name").as("name").min("email").as("email")
                                .min("role").as("role")
                                .min("mobileNo").as("mobileNo").min("is_active").as("is_active")
                                .min("created_at").as("created_at").min("lastLogin_at").as("lastLogin_at")
                                .min("walletInfo").as("walletInfo").min("walletTransactionHistoryInfo").as("walletTransactionHistoryInfo")
                                .min("userSubscriptionInfo").as("userSubscriptionInfo"),
                        project("name", "email", "mobileNo", "role", "created_at", "is_active",
                                "walletInfo", "walletTransactionHistoryInfo", "walletTransactionHistoryList", "userSubscriptionInfo")
                                .andExpression("dateToString('%Y/%m/%d',lastLogin_at)").as("lastLoginAt")
                                .andExpression("dateToString('%Y/%m/%d',userSubscriptionInfo.subscriptionEnd_at)").as("subscriptionDate")
                ), WalletUserDTO.class);

        return results.getMappedResults();
    }

    @Override
    public WalletThresholdAlerts createThresholdAlert(WalletThresholdAlerts thresholdAlerts) {
        thresholdAlerts.setCreatedAt(DateHelper.getCurrentDate());
        thresholdAlerts.setUpdatedAt(DateHelper.getCurrentDate());
        return thresholdAlertsRepository.save(thresholdAlerts);
    }

    @Override
    public WalletThresholdAlerts updateThresholdAlert(ObjectId id, WalletThresholdAlerts thresholdAlerts) {
        thresholdAlerts.setUpdatedAt(DateHelper.getCurrentDate());
        return thresholdAlertsRepository.save(thresholdAlerts);
    }

    @Override
    public List<WalletThresholdAlerts> findStockAlertByOperator(ObjectId operatorId) {
        return thresholdAlertsRepository.findStockAlertByOperator(operatorId);
    }

    @Override
    public WalletThresholdAlerts findStockAlertId(ObjectId id) {
        return thresholdAlertsRepository.findOne(id);
    }

    @Override
    public WalletThresholdAlerts findStockAlertByOperatorIdAndAmount(ObjectId operatorId, double thresholdAmount) {
        return thresholdAlertsRepository.findStockAlertByOperatorIdAndAmount(operatorId, thresholdAmount);
    }

    public boolean sendThresholdAlertsMailToUser(String operatorName, WalletThresholdAlerts alert,double currentbalance, Customer customer){
        try {
            String from = configHelper.fromEmail;
            String to = alert.getEmailId();
            String subject = "[NowNow] Balance Threshold Alert";

            EmailTemplate template = new EmailTemplate("threshold-alerts-email-tousers.html");

            Map<String, String> replacements = new HashMap<String, String>();
            replacements.put("user", alert.getName());
            replacements.put("operatorName", operatorName);
            replacements.put("balance", String.valueOf(currentbalance) + " NGN");
            replacements.put("thresholdAmount", String.valueOf(alert.getThresholdAmount()) + " NGN");

            if (customer != null) {
                replacements.put("customerName", customer.getName());
                replacements.put("socialLinks", userEmailService.socialMediaLinks(customer));
            }

            String message = template.getTemplate(replacements);

            Email email = new Email(from, to, subject, message);
            email.setHtml(true);
            emailService.sendThresholdEmail(email, customer);
            return true;

        } catch (Exception e){
            logger.error(e.getMessage());
            return false;
        }
    }

    @Override
    public List<WalletTransactionHistoryDTO> findTransactionHistoryByOperator(String type, String operatorId, Date from_date, Date to_date) {
        AggregationResults<WalletTransactionHistoryDTO> results = null;
        if (type.equals("All") && operatorId.equals("All")) {
            results = operations.aggregate(
                    newAggregation(WalletTransactionHistory.class,
                            match(where("created_at").gte(from_date)),
                            match(where("created_at").lte(to_date)),
                            lookup("user", "userId", "_id", "userInfo"),
                            unwind("userInfo"),
                            lookup("walletOperators", "operatorBillerId", "_id", "serviceInfo"),
                            unwind("serviceInfo"),
                            sort(Sort.Direction.DESC, "created_at")
                    ), WalletTransactionHistoryDTO.class);
        }  else if (operatorId.equals("All")) {
            results = operations.aggregate(
                    newAggregation(WalletTransactionHistory.class,
                            match(where("transactionType").in(type)),
                            match(where("created_at").gte(from_date)),
                            match(where("created_at").lte(to_date)),
                            lookup("user", "userId", "_id", "userInfo"),
                            unwind("userInfo"),
                            lookup("walletOperators", "operatorBillerId", "_id", "serviceInfo"),
                            unwind("serviceInfo"),
                            sort(Sort.Direction.DESC, "created_at")
                    ), WalletTransactionHistoryDTO.class);
        }
        else {
            ObjectId  operatorid = new ObjectId(operatorId) ;
            results = operations.aggregate(
                    newAggregation(WalletTransactionHistory.class,
                            match(where("transactionType").in(type)),
                            match(where("operatorBillerId").is(operatorid)),
                            match(where("created_at").gte(from_date)),
                            match(where("created_at").lte(to_date)),
                            lookup("user", "userId", "_id", "userInfo"),
                            unwind("userInfo"),
                            lookup("walletOperators", "operatorBillerId", "_id", "serviceInfo"),
                            unwind("serviceInfo"),
                            sort(Sort.Direction.DESC, "created_at")
                    ), WalletTransactionHistoryDTO.class);
        }
        return results.getMappedResults();
    }

    @Override
    public List<WalletTransactionHistoryDTO> findTransactionSummary(Date from_date, Date to_date) {
        AggregationResults<WalletTransactionHistoryDTO> results = operations.aggregate(
                newAggregation(WalletTransactionHistory.class,
                        match(where("created_at").gte(from_date)),
                        match(where("created_at").lte(to_date)),
                        project("transactionType", "totalAmount", "chargeAmount", "commission")
                                .andExpression("dateToString('%Y-%m-%d',created_at)").as("transactionDate"),
                        group("transactionType", "transactionDate")
                                .sum("totalAmount").as("totalAmount")
                                .sum("chargeAmount").as("chargeAmount")
                                .sum("commission").as("commission")
                                .min("transactionType").as("transactionType"),
                        group("transactionDate")
                                .push(new BasicDBObject("transactionType", "$transactionType")
                                        .append("transactionType", "$transactionType")
                                        .append("totalAmount", "$totalAmount")
                                        .append("chargeAmount", "$chargeAmount")
                                        .append("commission", "$commission")
                                ).as("walletTransactionHistoryList")
                                .min("totalAmount").as("totalAmount")
                                .min("chargeAmount").as("chargeAmount")
                                .min("commission").as("commission")
                                .min("transactionType").as("transactionType")
                                .min("transactionDate").as("transactionDate")
                                .sum("chargeAmount").as("totalCommission"),

                        project("walletTransactionHistoryList", "transactionDate", "totalCommission"),
                        sort(Sort.Direction.DESC, "transactionDate")
                ), WalletTransactionHistoryDTO.class);
        return results.getMappedResults();
    }
    
    @Override
    public WalletUserCardInfo createCardInfo(WalletUserCardInfo cardInfo) {
        cardInfo.setCreated_at(DateHelper.getCurrentDate());
        cardInfo.setUpdated_at(DateHelper.getCurrentDate());
        return cardInfoRepository.save(cardInfo);
    }

    @Override
    public WalletUserCardInfo findcardNoByUserIdandCard(ObjectId userId, String cardNo) {
        return cardInfoRepository.findcardNoByUserIdandCard(userId, cardNo);
    }

    @Override
    public List<WalletUserCardInfo> findcardNoByUserid(ObjectId userId) {
        return cardInfoRepository.findcardNoByUserid(userId);
    }

    @Override
    public WalletCharges createCharge(WalletCharges walletCharges ) {
        walletCharges.setCreatedAt(DateHelper.getCurrentDate());
        walletCharges.setUpdatedAt(DateHelper.getCurrentDate());
        return chargeRepository.save(walletCharges);
    }

    @Override
    public WalletCharges updateCharge(ObjectId id, WalletCharges walletCharges) {
        walletCharges.setUpdatedAt(DateHelper.getCurrentDate());
        return chargeRepository.save(walletCharges);
    }

    @Override
    public WalletCharges findCharge(String id) {
        return chargeRepository.findOne(new ObjectId(id));
    }

    @Override
    public WalletCharges findCharge(ObjectId id) {
        return chargeRepository.findOne(id);
    }

    @Override
    public WalletCharges findChargeConfigurationByOperator(ObjectId operatorId) {
        return chargeRepository.findChargeConfigurationByOperator(operatorId);
    }

    @Override
    public List<ChargeConfigurationDTO> findAllCharges() {

        AggregationResults<ChargeConfigurationDTO> results = operations.aggregate(
                newAggregation(WalletCharges.class,
                        lookup("walletOperators", "operatorId", "_id", "operatorInfo"),
                        unwind("operatorInfo")
                ), ChargeConfigurationDTO.class);

        return results.getMappedResults();
    }

    @Override
    public List<ChargeConfigurationDTO> findWalletChargesByOperator(ObjectId operatorId) {

        AggregationResults<ChargeConfigurationDTO> results = operations.aggregate(
                newAggregation(WalletCharges.class,
                        match(where("operatorId").in(operatorId)),
                        lookup("walletOperators", "operatorId", "_id", "operatorInfo"),
                        unwind("operatorInfo")
                ), ChargeConfigurationDTO.class);

        return results.getMappedResults();
    }

    @Override
    public List<WalletTransactionHistoryDTO> findTransactionReportbyType() {
        AggregationResults<WalletTransactionHistoryDTO> results = operations.aggregate(
                newAggregation(WalletTransactionHistory.class,
                        project("transactionType", "totalAmount"),
                        group("transactionType")
                                .push(new BasicDBObject("transactionType", "$transactionType")
                                        .append("totalAmount", "$totalAmount")
                                ).as("walletTransactionHistoryList")
                                .sum("totalAmount").as("totalAmount")
                                .min("transactionType").as("transactionType"),
                        project("walletTransactionHistoryList", "transactionType","totalAmount")
                ), WalletTransactionHistoryDTO.class);

        return results.getMappedResults();
    }

    public List<WalletTransactionHistory> findAllTransactionHistory() {
        return transactionHistoryRepository.findAll();
    }

    @Override
    public List<WalletUserDTO> findAllSubscribersbyMonth(LocalDate startDate, LocalDate endDate) {

        AggregationResults<WalletUserDTO> results = operations.aggregate(
                newAggregation(WalletUser.class,
                        match(where("created_at").gte(startDate)),
                        match(where("created_at").lte(endDate)),
                        project()
                                .andExpression("dateToString('%Y-%m',created_at)").as("subscriptionDate"),
                        group("subscriptionDate").count().as("totalSubscribers"),
//                        .sum("subscriptionDate").as(""),
                        project("totalSubscribers").and("subscriptionDate").previousOperation()
                ), WalletUserDTO.class);

        return results.getMappedResults();
    }


    @Override
    public List<WalletDTO> findAllActiveWalletUsers() {
        AggregationResults <WalletDTO> result = operations.aggregate(
                newAggregation(WalletUser.class,
                        match(where("hasAutoSubscription").in(true)),
                        lookup("user", "user_id", "_id", "userInfo"),
                        unwind("userInfo"),
                        lookup("userSubscription", "user_id", "userId", "userSubscriptionInfo"),
                        unwind("userSubscriptionInfo"),
                        match(where("userSubscriptionInfo.paymentStatus").is(true)),
                        lookup("subscription", "userSubscriptionInfo.subscriptionId", "_id", "subscription"),
                        unwind("subscription"),
                        match(where("subscription.paymentPlan").nin("Flex")),
                        sort(Sort.Direction.DESC, "userSubscriptionInfo.subscriptionEnd_at"),
                        group("walletCode").first("userSubscriptionInfo").as("userSubscriptionInfo")
                                .min("transactionPin").as("transactionPin")
                                .min("user_id").as("user_id")
                                .min("walletCode").as("walletCode")
                                .min("rrnNo").as("rrnNo")
                                .min("bankCode").as("bankCode")
                                .min("balance").as("balance")

                                .min("userInfo").as("userInfo")
                        .min("subscription").as("subscription"),

                        project("user_id","walletCode","rrnNo","bankCode","transactionPin","balance","userInfo","subscription","userSubscriptionInfo"),
                        match(where("userSubscriptionInfo.subscriptionEnd_at").lte(DateHelper.getCurrentDate()))

                ), WalletDTO.class);

        return result.getMappedResults();
    }
}