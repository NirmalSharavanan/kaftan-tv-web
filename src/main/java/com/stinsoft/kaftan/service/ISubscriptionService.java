package com.stinsoft.kaftan.service;

import com.stinsoft.kaftan.dto.SubscriptionDTO;
import com.stinsoft.kaftan.model.Subscription;
import org.bson.types.ObjectId;

import java.util.List;

public interface ISubscriptionService {

    Subscription create(Subscription subscription);

    Subscription update(ObjectId id, Subscription subscription);

    Subscription find(ObjectId id);

    List<SubscriptionDTO> findBySubscription(ObjectId id);

    Subscription findpaymentPlanExists(String paymentPlan);

    List<Subscription> findAll();

    List<Subscription> findActiveSubscriptionPlan(boolean is_Active);

}
