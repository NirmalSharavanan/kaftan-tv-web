package com.stinsoft.kaftan.repository.wallet;

import com.stinsoft.kaftan.model.wallet.WalletThresholdAlerts;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface ThresholdAlertsRepository extends MongoRepository<WalletThresholdAlerts, ObjectId> {

    @Query("{ 'operatorId' : ?0 }")
    List<WalletThresholdAlerts> findStockAlertByOperator(ObjectId operatorId);

    @Query("{ 'operatorId' : ?0, 'thresholdAmount' : ?1 }")
    WalletThresholdAlerts findStockAlertByOperatorIdAndAmount(ObjectId operatorId, double thresholdAmount);
}
