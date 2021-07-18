package com.stinsoft.kaftan.repository;

import com.stinsoft.kaftan.model.UserSubscription;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.Date;
import java.util.List;

public interface UserSubscriptionRepository extends MongoRepository<UserSubscription, ObjectId> {

    @Query("{'userId': ?0}")
    List<UserSubscription> findSubscriberByUserId(ObjectId userId);

    @Query("{'userId': ?0 , 'subscriptionId': ?1}")
    UserSubscription findExistsFlexSubscriber(ObjectId userId, ObjectId subscriptionId);

    @Query("{ 'referenceNumber': ?0 }")
    UserSubscription findReferenceNumber(String referenceNo);
}
