package com.stinsoft.kaftan.repository;

import com.stinsoft.kaftan.model.Subscription;
import org.bson.types.ObjectId;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface SubscriptionRepository extends MongoRepository<Subscription, ObjectId> {

    @Query("{'paymentPlan': ?0}")
    Subscription findpaymentPlanExists(String paymentPlan);

    @Query("{'is_Active': ?0}")
    List<Subscription> findActiveSubscriptionPlan(boolean is_Active, Sort sort);
}
