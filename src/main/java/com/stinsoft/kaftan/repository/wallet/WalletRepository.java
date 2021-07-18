package com.stinsoft.kaftan.repository.wallet;

import com.stinsoft.kaftan.model.wallet.WalletUser;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

public interface WalletRepository extends MongoRepository<WalletUser, ObjectId> {
    @Query("{'user_id' : ?0 }")
    WalletUser findByWalletCode(ObjectId userId);

    @Query("{'user_id':?0}")
    WalletUser findWalletByUser(ObjectId userId);

    @Query("{'mobileNo':?0}")
    WalletUser findWalletByMobileNo(String mobileNo);
}
