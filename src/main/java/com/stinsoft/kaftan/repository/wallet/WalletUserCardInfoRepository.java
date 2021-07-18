package com.stinsoft.kaftan.repository.wallet;

import com.stinsoft.kaftan.model.wallet.WalletUserCardInfo;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface WalletUserCardInfoRepository  extends MongoRepository<WalletUserCardInfo, ObjectId> {

    @Query("{ 'userId' : ?0, 'cardNo' : ?1 }")
    WalletUserCardInfo findcardNoByUserIdandCard(ObjectId userId, String cardNo);

    @Query("{ 'userId' : ?0}")
    List<WalletUserCardInfo> findcardNoByUserid(ObjectId userId);
}
