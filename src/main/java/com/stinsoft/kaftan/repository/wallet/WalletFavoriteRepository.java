package com.stinsoft.kaftan.repository.wallet;

import com.stinsoft.kaftan.model.wallet.WalletFavorite;
import org.bson.types.ObjectId;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface WalletFavoriteRepository extends MongoRepository<WalletFavorite, ObjectId> {

    @Query("{'userId':?0, 'operatorId':?1, 'mobileNo':?2, }")
    WalletFavorite findFavoriteByMobileRecharge(ObjectId userId, ObjectId operatorId, String mobileNo);

    @Query("{'userId':?0, 'operatorId':?1, 'accountId':?2}")
    WalletFavorite findFavoriteByBillPayment(ObjectId userId,ObjectId operatorId, String accountId);

    @Query("{'userId':?0, 'bankAccountNo':?1, 'bankAccountName':?2}")
    WalletFavorite findFavoriteByBankAc(ObjectId userId, String bankAccountNo, String bankAccountName);

    @Query("{'userId':?0, 'receiverUserId':?1 }")
    WalletFavorite findFavoriteByReceiverId(ObjectId userId, String receiverUserId);
}
