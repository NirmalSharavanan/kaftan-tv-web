package com.stinsoft.kaftan.repository.wallet;

import com.stinsoft.kaftan.model.wallet.WalletCharges;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

public interface ChargeConfigurationRepository extends MongoRepository<WalletCharges, ObjectId> {

    @Query("{ 'operatorId' : ?0 }")
    WalletCharges findChargeConfigurationByOperator(ObjectId operatorId);
}
