package com.stinsoft.kaftan.service.wallet;

import com.mongodb.BasicDBObject;
import com.stinsoft.kaftan.dto.wallet.ServicesDTO;
import com.stinsoft.kaftan.model.wallet.WalletOperators;
import com.stinsoft.kaftan.repository.wallet.ServicesRepository;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.stereotype.Service;
import ss.core.helper.DateHelper;

import java.util.List;

import static org.springframework.data.mongodb.core.aggregation.Aggregation.*;
import static org.springframework.data.mongodb.core.query.Criteria.where;

@Service
public class WalletService implements IWalletService {

    @Autowired
    ServicesRepository repository;

    @Autowired
    MongoOperations operations;

    private Logger logger = LoggerFactory.getLogger(WalletService.class);

    @Override
    public WalletOperators create(WalletOperators walletOperator) {
        walletOperator.setCreated_at(DateHelper.getCurrentDate());
        walletOperator.setUpdated_at(DateHelper.getCurrentDate());
        return repository.save(walletOperator);
    }

    @Override
    public List<WalletOperators> findAll() {
        return repository.findAll();
    }

    @Override
    public List<WalletOperators> findOperatorsByService(int serviceTypeId) {
        return repository.findOperatorsByService(serviceTypeId);
    }

    @Override
    public WalletOperators find(ObjectId Id) {
        return repository.findOne(Id);
    }

    @Override
    public WalletOperators find(String Id) {
        return this.find(new ObjectId(Id));
    }

    @Override
    public WalletOperators update(ObjectId id, WalletOperators walletOperator) {
        walletOperator.setUpdated_at(DateHelper.getCurrentDate());
        return repository.save(walletOperator);
    }

    @Override
    public WalletOperators findServiceByName(String name, String operatorCode) {
        return repository.findServiceByName(name, operatorCode);
    }

    @Override
    public WalletOperators findBillerOperator(String name, Integer categoryCode, String operatorCode) {
        return repository.findBillerOperator(name, categoryCode, operatorCode);
    }

    @Override
    public List<ServicesDTO> findAllOperators() {

        AggregationResults<ServicesDTO> results = operations.aggregate(
                newAggregation(WalletOperators.class,
                        match(where("isUpdate").is(true)),

                        lookup("walletCharges", "_id", "operatorId", "chargeConfiguration"),
                        unwind("chargeConfiguration", true),
                        lookup("walletStockPurchase", "_id", "operatorId", "walletStockPurchaseInfo"),
                        unwind("walletStockPurchaseInfo", true),
                        lookup("walletThresholdAlerts", "_id", "operatorId", "thresholdAlertsInfo"),
                        unwind("thresholdAlertsInfo", true),
                        group("id")
                                .push(new BasicDBObject("serviceType", "$walletStockPurchaseInfo.serviceType")
                                        .append("operatorId", "$walletStockPurchaseInfo.operatorId")
                                        .append("walletCode", "$walletStockPurchaseInfo.walletCode")
                                        .append("purchaseCost", "$walletStockPurchaseInfo.purchaseCost")
                                        .append("purchaseAmount", "$walletStockPurchaseInfo.purchaseAmount")
                                        .append("operatorName", "$walletStockPurchaseInfo.operatorName")
                                        .append("created_at", "$walletStockPurchaseInfo.created_at")

                                ).as("walletStocks")
                                .min("id").as("id").min("name").as("name")
                                .min("serviceType").as("serviceType")
                                .min("categoryId").as("categoryId")
                                .min("categoryName").as("categoryName").min("operatorCode").as("operatorCode")
                                .min("operatorName").as("operatorName").min("operatorImage").as("operatorImage")
                                .min("active").as("active").min("isUpdate").as("isUpdate")
                                .min("created_at").as("created_at")
                                .min("walletStockPurchaseInfo").as("walletStockPurchaseInfo").min("chargeConfiguration").as("chargeConfiguration")
                                .min("thresholdAlertsInfo").as("thresholdAlertsInfo"),
                        project("id", "name", "serviceType", "categoryId", "categoryName","created_at",
                                "operatorCode", "operatorName", "operatorImage", "active", "isUpdate", "chargeConfiguration","thresholdAlertsInfo", "walletStockPurchaseInfo", "walletStocks"),
                        sort(Sort.Direction.ASC, "serviceType", "created_at")

                ), ServicesDTO.class);

        return results.getMappedResults();
    }
}
