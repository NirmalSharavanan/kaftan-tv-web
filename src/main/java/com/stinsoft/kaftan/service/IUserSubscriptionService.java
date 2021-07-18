package com.stinsoft.kaftan.service;

import com.stinsoft.kaftan.dto.UserSubscriptionDTO;
import com.stinsoft.kaftan.model.UserSubscription;
import org.bson.types.ObjectId;

import java.util.Date;
import java.util.List;

public interface IUserSubscriptionService {

    UserSubscription create(UserSubscription userSubscription);

    List<UserSubscriptionDTO> findSubscriberByUser(ObjectId userId);

    List<UserSubscriptionDTO> findAllSubscribedUsers();

    UserSubscription findExistsFlexSubscriber(ObjectId userId, ObjectId subscriptionId);

    List<UserSubscriptionDTO> findSubscriberByuserId(ObjectId userId);

    List<UserSubscriptionDTO> findAllSubscriberByUser(ObjectId userId);

    UserSubscription findReferenceNumber(String referenceNo);

    List<UserSubscriptionDTO> findSubscription(ObjectId userId);
}
