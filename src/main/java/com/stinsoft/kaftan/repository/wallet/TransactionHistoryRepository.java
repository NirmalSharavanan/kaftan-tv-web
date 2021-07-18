package com.stinsoft.kaftan.repository.wallet;

import com.stinsoft.kaftan.model.wallet.WalletTransactionHistory;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

/**
 * Created by sridevi on 29-10-2019.
 */
public interface TransactionHistoryRepository extends MongoRepository<WalletTransactionHistory, ObjectId> {

    @Query("{'userId':?0}")
    List<WalletTransactionHistory> findAllHistoryByUser(ObjectId userId);

}
