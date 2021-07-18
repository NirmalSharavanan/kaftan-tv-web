package com.stinsoft.kaftan.repository.wallet;

import com.stinsoft.kaftan.model.wallet.WalletStockPurchase;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface WalletStockPurchaseRepository  extends MongoRepository<WalletStockPurchase, ObjectId> {

}
