package com.stinsoft.kaftan.controller;

import com.stinsoft.kaftan.dto.SubscriptionDTO;
import com.stinsoft.kaftan.dto.UserSubscriptionDTO;
import com.stinsoft.kaftan.messages.AppMessages;
import com.stinsoft.kaftan.messages.ExceptionMessages;
import com.stinsoft.kaftan.model.Subscription;
import com.stinsoft.kaftan.model.UserSubscription;
import com.stinsoft.kaftan.model.wallet.WalletUser;
import com.stinsoft.kaftan.service.SubscriptionService;
import com.stinsoft.kaftan.service.UserSubscriptionService;
import com.stinsoft.kaftan.service.wallet.WalletUserService;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ss.core.messages.UserAppMessages;
import ss.core.model.User;
import ss.core.security.service.SessionService;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("api/")
public class SubscriptionController extends BaseController {

    @Autowired
    SubscriptionService subscriptionService;

    @Autowired
    UserSubscriptionService userSubscriptionService;

    @Autowired
    WalletUserService walletUserService;

    @Autowired
    SessionService sessionService;

    Logger logger = LoggerFactory.getLogger(this.getClass());

    // create Subscription Plan
    @RequestMapping(value = "admin/session/subscription/create", method = RequestMethod.POST)
    public ResponseEntity<?> create(@RequestBody SubscriptionDTO subscriptionDTO) {
        try {
            Subscription subscription = subscriptionService.findpaymentPlanExists(subscriptionDTO.getPaymentPlan());

            if (subscription == null) {
                subscription = new Subscription();
                subscription.setPaymentPlan(subscriptionDTO.getPaymentPlan());
                subscription.setFeatures(subscriptionDTO.getFeatures());
                if (subscriptionDTO.getPaymentPlan().equals("Flex")) {
                    subscription.setAmount(0);
                } else {
                    subscription.setAmount(subscriptionDTO.getAmount());
                }
                subscription.setIs_Active(subscriptionDTO.isIs_Active());

                subscription = subscriptionService.create(subscription);
                if (subscription != null) {
                    subscription.setSuccess(true);
                    subscription.setMessage(AppMessages.SUBSCRIPTION_CREATED);
                } else {
                    subscription.setSuccess(false);
                    subscription.setMessage(AppMessages.SUBSCRIPTION_FAILURE);
                }
            } else {
                subscription.setSuccess(false);
                subscription.setMessage(AppMessages.SUBSCRIPTION_EXISTS);
            }
            return new ResponseEntity<>(subscription, HttpStatus.OK);
        } catch (Exception e) {
            logger.error(ExceptionMessages.UNEXPECTED_MESSAGE, e);
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    // Update Subscription Plan
    @RequestMapping(value = "admin/session/subscription/update/{id}", method = RequestMethod.PUT)
    public ResponseEntity<?> update(@PathVariable String id,
                                    @RequestBody SubscriptionDTO subscriptionDTO) {
        try {
            Subscription subscription = subscriptionService.find(new ObjectId(id));

            if (subscription != null) {
                subscription.setPaymentPlan(subscriptionDTO.getPaymentPlan());
                subscription.setFeatures(subscriptionDTO.getFeatures());
                if (subscriptionDTO.getPaymentPlan().equals("Flex")) {
                    subscription.setAmount(0);
                } else {
                    subscription.setAmount(subscriptionDTO.getAmount());
                }
                subscription.setIs_Active(subscriptionDTO.isIs_Active());

                subscription = subscriptionService.update(new ObjectId(id), subscription);
                if (subscription != null) {
                    subscription.setSuccess(true);
                    subscription.setMessage(AppMessages.SUBSCRIPTION_UPDATED);
                } else {
                    subscription.setSuccess(false);
                    subscription.setMessage(AppMessages.SUBSCRIPTION_FAILURE);
                }
            } else {
                subscription.setSuccess(false);
                subscription.setMessage(AppMessages.SUBSCRIPTION_NOT_EXISTS);
            }
            return new ResponseEntity<>(subscription, HttpStatus.OK);
        } catch (Exception e) {
            logger.error(ExceptionMessages.UNEXPECTED_MESSAGE, e);
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    // Get Subscription Plan
    @RequestMapping(value = "/admin/session/subscription/{subscriptionId}", method = RequestMethod.GET)
    public ResponseEntity<?> getSubscription(@PathVariable String subscriptionId) {
        try {
            Subscription subscription = subscriptionService.find(new ObjectId(subscriptionId));
            if (subscription != null) {
                subscription.setSuccess(true);
            } else {
                subscription = new Subscription();
                subscription.setSuccess(false);
                subscription.setMessage(AppMessages.SUBSCRIPTION_NOT_EXISTS);
            }
            return new ResponseEntity<>(subscription, HttpStatus.OK);
        } catch (Exception e) {
            logger.error(ExceptionMessages.UNEXPECTED_MESSAGE, e);
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    // Get All Subscription Plans
    @RequestMapping(value = "/allSubscriptions", method = RequestMethod.GET)
    public ResponseEntity<?> getAllSubscriptions() {
        try {
            List<Subscription> subscriptionList = null;

            subscriptionList = subscriptionService.findAll();

            return new ResponseEntity<>(subscriptionList, HttpStatus.OK);
        } catch (Exception e) {
            logger.error(ExceptionMessages.UNEXPECTED_MESSAGE, e);
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    // Get All Subscription Plans
    @RequestMapping(value = "/subscription/SubscriptionPlan", method = RequestMethod.GET)
    public ResponseEntity<?> getActiveSubscriptionPlan() {
        try {
            List<Subscription> subscriptionList = null;

            subscriptionList = subscriptionService.findActiveSubscriptionPlan(true);

            return new ResponseEntity<>(subscriptionList, HttpStatus.OK);
        } catch (Exception e) {
            logger.error(ExceptionMessages.UNEXPECTED_MESSAGE, e);
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    // Create User Subscription
    @RequestMapping(value = "session/subscription/userSubscription/create", method = RequestMethod.POST)
    public ResponseEntity<?> createUserSubscription(@RequestBody UserSubscriptionDTO userSubscriptionDTO) {
        try {
            User user = sessionService.getUser();

            UserSubscription userSubscription = createSubscription(user,userSubscriptionDTO);
            return new ResponseEntity<>(userSubscription, HttpStatus.OK);
        } catch (Exception e) {
            logger.error(ExceptionMessages.UNEXPECTED_MESSAGE, e);
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    public UserSubscription createSubscription(User user,UserSubscriptionDTO userSubscriptionDTO) {

        LocalDate currentDate = LocalDate.now();
        LocalDate subscriberEndDate = null;
        LocalDate subscriptionStartDate = null;
        LocalDate subscriptionEndDate = null;
        Subscription subscription = null;
        UserSubscription userSubscription = null;
//        User user = sessionService.getUser();

        if (user != null) {
            subscription = subscriptionService.find(new ObjectId(userSubscriptionDTO.getSubscriptionId()));
            if (subscription != null) {
                if (subscription.getPaymentPlan().equals("Monthly")) {
                    subscriberEndDate = LocalDate.now().plusMonths(1);
                }
                if (subscription.getPaymentPlan().equals("Quarterly")) {
                    subscriberEndDate = LocalDate.now().plusMonths(3);
                }
                if (subscription.getPaymentPlan().equals("Yearly") || subscription.getPaymentPlan().equals("Silver") ||
                        subscription.getPaymentPlan().equals("Gold") || subscription.getPaymentPlan().equals("Platinum")) {
                    subscriberEndDate = LocalDate.now().plusYears(1);
                }
            }
            List<UserSubscriptionDTO> userSubscriptionList = userSubscriptionService.findSubscriberByUser(user.getId());
            List<UserSubscriptionDTO> nonFlexUserSubscriptions = userSubscriptionList.stream().filter(sub -> !sub.getSubscriptionInfo().getPaymentPlan().equals("Flex")).collect(Collectors.toList());

            if (nonFlexUserSubscriptions.size() == 0) {
                userSubscription = new UserSubscription();
                userSubscription.setUserId(user.getId());
                userSubscription.setSubscriptionId(new ObjectId(userSubscriptionDTO.getSubscriptionId()));
//                userSubscription.setPromotionId(new ObjectId(userSubscriptionDTO.getPromotionId()));
                userSubscription.setPaymentAmount(userSubscriptionDTO.getPaymentAmount());
                if (userSubscriptionList.size() > 0 && userSubscriptionList.get(0).getSubscriptionInfo().getPaymentPlan().equals("Flex")) {

                    subscriptionStartDate = userSubscriptionList.get(0).getSubscriptionEnd_at().plusDays(1);
                    if (subscription.getPaymentPlan().equals("Monthly")) {
                        subscriptionEndDate = subscriptionStartDate.plusMonths(1);
                    }
                    if (subscription.getPaymentPlan().equals("Quarterly")) {
                        subscriptionEndDate = subscriptionStartDate.plusMonths(3);
                    }
                    if (subscription.getPaymentPlan().equals("Yearly") || subscription.getPaymentPlan().equals("Silver") ||
                            subscription.getPaymentPlan().equals("Gold") || subscription.getPaymentPlan().equals("Platinum")) {
                        subscriptionEndDate = subscriptionStartDate.plusYears(1);
                    }
                    userSubscription.setSubscriptionStarted_at(subscriptionStartDate);
                    userSubscription.setSubscriptionEnd_at(subscriptionEndDate);

                } else {
                    userSubscription.setSubscriptionStarted_at(currentDate);
                    userSubscription.setSubscriptionEnd_at(subscriberEndDate);

                }

                userSubscription.setPaymentMode(userSubscriptionDTO.getPaymentMode());
                userSubscription.setTransactionId(userSubscriptionDTO.getTransactionId());
                userSubscription.setReferenceNumber(userSubscriptionDTO.getReferenceNumber());
                userSubscription.setPaymentStatus(userSubscriptionDTO.isPaymentStatus());
                userSubscription = userSubscriptionService.create(userSubscription);

            }
            if (userSubscription != null) {
                userSubscription.setSuccess(true);
                userSubscription.setMessage(UserAppMessages.USER_SUBSCRIPTION_CREATED);
            } else {
                userSubscription = new UserSubscription();
                userSubscription.setSuccess(false);
                userSubscription.setMessage(UserAppMessages.USER_SUBSCRIPTION_FAILED);
            }
        }

        return userSubscription;
    }
     
    // Get Subscrbed User
    @RequestMapping(value = "/session/subscription/subscribedUser", method = RequestMethod.GET)
    public ResponseEntity<?> getSubscribedUser() {
        try {
            User user = sessionService.getUser();
            List<UserSubscriptionDTO> userSubscriptions = null;

            if (user != null) {
                userSubscriptions = userSubscriptionService.findSubscriberByUser(user.getId());
            }
            return new ResponseEntity<>(userSubscriptions, HttpStatus.OK);
        } catch (Exception e) {
            logger.error(ExceptionMessages.UNEXPECTED_MESSAGE, e);
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    // Get All Subscription Users
    @RequestMapping(value = "/session/subscription/userSubscriptions", method = RequestMethod.GET)
    public ResponseEntity<?> getAllSubscribedUsers() {
        try {
            List<UserSubscriptionDTO> userSubscriptions = null;

            userSubscriptions = userSubscriptionService.findAllSubscribedUsers();

            return new ResponseEntity<>(userSubscriptions, HttpStatus.OK);
        } catch (Exception e) {
            logger.error(ExceptionMessages.UNEXPECTED_MESSAGE, e);
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    // Get All subscription based on user
    @RequestMapping(value = "/session/subscription/AllUserSubscriptions", method = RequestMethod.GET)
    public ResponseEntity<?> getAllSubscriptionUsers() {
        try {
            User user = sessionService.getUser();
            List<UserSubscriptionDTO> userSubscriptions = null;

            if (user != null) {
                userSubscriptions = userSubscriptionService.findAllSubscriberByUser(user.getId());
            }

            return new ResponseEntity<>(userSubscriptions, HttpStatus.OK);
        } catch (Exception e) {
            logger.error(ExceptionMessages.UNEXPECTED_MESSAGE, e);
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    // Flex users
    @RequestMapping(value = "/session/flex/subscribe", method = RequestMethod.POST)
    public ResponseEntity<?> createFlexSubscription() {
        try {
            User user = sessionService.getUser();
            UserSubscription flexSubscription = null;
            LocalDate currentDate = LocalDate.now();
            LocalDate subscriberEndDate = LocalDate.now().plusMonths(1);

            if (user != null) {
                Subscription subscription = subscriptionService.findpaymentPlanExists("Flex");
                if (subscription != null) {
                    flexSubscription = userSubscriptionService.findExistsFlexSubscriber(user.getId(), subscription.getId());
                    if (flexSubscription == null) {
                        flexSubscription = new UserSubscription();
                        flexSubscription.setUserId(user.getId());
                        flexSubscription.setSubscriptionId(subscription.getId());
                        flexSubscription.setPaymentAmount(0);
                        flexSubscription.setSubscriptionStarted_at(currentDate);
                        flexSubscription.setSubscriptionEnd_at(subscriberEndDate);
                        flexSubscription.setPaymentStatus(true);

                        flexSubscription = userSubscriptionService.create(flexSubscription);
                        if (flexSubscription != null) {
                            flexSubscription.setSuccess(true);
                            flexSubscription.setMessage(UserAppMessages.USER_SUBSCRIPTION_CREATED);
                        } else {
                            flexSubscription.setSuccess(false);
                            flexSubscription.setMessage(UserAppMessages.USER_SUBSCRIPTION_FAILED);
                        }
                    } else {
                        flexSubscription.setSuccess(false);
                        flexSubscription.setMessage(UserAppMessages.USER_SUBSCRIPTION_EXPIRED);
                    }
                }
            }
            return new ResponseEntity<>(flexSubscription, HttpStatus.OK);
        } catch (Exception e) {
            logger.error(ExceptionMessages.UNEXPECTED_MESSAGE, e);
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    // Get API for flex user
    @RequestMapping(value = "/subscription/flexUser", method = RequestMethod.GET)
    public ResponseEntity<?> getFlexUser() {
        try {
            User user = sessionService.getUser();
            List<UserSubscriptionDTO> userSubscription = null;
            if (user != null) {
                userSubscription = userSubscriptionService.findSubscriberByuserId(user.getId());
            }
            return new ResponseEntity<>(userSubscription, HttpStatus.OK);
        } catch (Exception e) {
            logger.error(ExceptionMessages.UNEXPECTED_MESSAGE, e);
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    // Enable/Disable auto subscription for kaftan wallet
    @RequestMapping(value = "/session/subscription/autoSubscription/{hasAutoSubscription}", method = RequestMethod.PUT)
    public ResponseEntity<?> updateAutoSubscription(@PathVariable boolean hasAutoSubscription) {
        try {
            WalletUser walletUser = null;
            User user = sessionService.getUser();

            if(user != null) {
                walletUser = walletUserService.findWalletByUserId(user.getId());
                if(walletUser != null) {
                    walletUser.setHasAutoSubscription(hasAutoSubscription);
                    walletUser = walletUserService.update(walletUser.getId(), walletUser);
                    if (walletUser != null) {
                        walletUser.setSuccess(true);
                        walletUser.setMessage(AppMessages.WALLET_UPDATED);
                    } else {
                        walletUser = new WalletUser();
                        walletUser.setSuccess(false);
                        walletUser.setMessage(ExceptionMessages.UNEXPECTED_MESSAGE);
                    }
                } else {
                    walletUser = new WalletUser();
                    walletUser.setSuccess(false);
                    walletUser.setMessage(AppMessages.WALLET_NOT_EXISTS);
                }
            }
            
            return new ResponseEntity<>(walletUser, HttpStatus.OK);
        } catch (Exception e) {
            logger.error(ExceptionMessages.UNEXPECTED_MESSAGE, e);
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }
}
