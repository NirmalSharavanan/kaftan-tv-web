package com.stinsoft.kaftan.service;

import com.stinsoft.kaftan.dto.SubscriptionDTO;
import com.stinsoft.kaftan.model.Subscription;
import com.stinsoft.kaftan.repository.SubscriptionRepository;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.stereotype.Service;
import ss.core.helper.DateHelper;

import java.util.List;

import static org.springframework.data.mongodb.core.aggregation.Aggregation.*;
import static org.springframework.data.mongodb.core.query.Criteria.where;

@Service
public class SubscriptionService implements ISubscriptionService {

    @Autowired
    SubscriptionRepository repository;

    @Autowired
    MongoOperations operations;

    @Override
    public Subscription create(Subscription subscription) {
        subscription.setCreatedAt(DateHelper.getCurrentDate());
        subscription.setUpdatedAt(DateHelper.getCurrentDate());
        return repository.save(subscription);
    }

    @Override
    public Subscription update(ObjectId id, Subscription subscription) {
        subscription.setUpdatedAt(DateHelper.getCurrentDate());
        return repository.save(subscription);
    }

    @Override
    public Subscription find(ObjectId id) {
        return repository.findOne(id);
    }

    @Override
    public List<SubscriptionDTO> findBySubscription(ObjectId id) {
        AggregationResults<SubscriptionDTO> results = operations.aggregate(
                newAggregation(Subscription.class,
                        match(where("id").is(id))
                ), SubscriptionDTO.class);
        return results.getMappedResults();
    }

    @Override
    public Subscription findpaymentPlanExists(String paymentPlan) {
        return repository.findpaymentPlanExists(paymentPlan);
    }

    @Override
    public List<Subscription> findAll() {
        return repository.findAll();
    }

    @Override
    public List<Subscription> findActiveSubscriptionPlan(boolean is_Active) {
        return repository.findActiveSubscriptionPlan(is_Active, new Sort(Sort.Direction.ASC, "id"));
    }
}
