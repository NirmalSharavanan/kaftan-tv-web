package com.stinsoft.kaftan.repository.wallet;

import com.stinsoft.kaftan.model.wallet.WalletOperators;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;


public interface ServicesRepository extends MongoRepository<WalletOperators, ObjectId> {

    @Query("{ 'name' : ?0 , 'operatorCode' : ?1}")
    WalletOperators findServiceByName(String name, String operatorCode);

    @Query("{ 'name' : ?0 , 'categoryId' : ?1, 'operatorCode' : ?2}")
    WalletOperators findBillerOperator(String name, Integer categoryCode, String operatorCode);

    @Query("{ 'serviceType' : ?0 }")
    List<WalletOperators> findOperatorsByService(int serviceTypeId);

}
