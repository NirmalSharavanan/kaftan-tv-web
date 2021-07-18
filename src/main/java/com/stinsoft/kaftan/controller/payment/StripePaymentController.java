package com.stinsoft.kaftan.controller.payment;

import com.stinsoft.kaftan.model.Category;
import com.stinsoft.kaftan.model.Content;
import com.stinsoft.kaftan.service.CategoryService;
import com.stinsoft.kaftan.service.ContentService;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ss.core.messages.CommonErrorMessages;
import ss.core.model.Response;
import ss.core.model.User;
import ss.core.model.payments.StripeSubscriptionInfo;
import ss.core.model.payments.SubscriptionInfo;
import ss.core.payment.razorpay.entity.RazorPayTransaction;
import ss.core.payment.razorpay.entity.RazorPayUserInfoDTO;
import ss.core.payment.stripe.entity.StripePlan;
import ss.core.security.service.ISessionService;
import ss.core.service.payment.StripePayService;

@RestController
@RequestMapping("api/session/stripe-payment")
public class StripePaymentController {

    Logger logger = LoggerFactory.getLogger(RazorPaymentController.class);

    @Autowired
    private ISessionService sessionService;

    @Autowired
    private ContentService contentService;

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private StripePayService stripePayService;

    //IMPORTANT: do not pass key_secret to client
    //Get user info to populate in credit card details for Stripe with subscription_id
    @RequestMapping(value = "/getUserInfoForSubscription", method = RequestMethod.GET)
    public ResponseEntity<?> getUserInfoForSubscription() {
        try {

            RazorPayUserInfoDTO razorPayUserInfoDTO = stripePayService.getPaymentGatewayWithUserInfo();

            if (razorPayUserInfoDTO != null) {

                float planAmount = 0;

                StripePlan stripePlan = stripePayService.getSubscriptionPlan();
                if (stripePlan != null) {
                    planAmount = stripePlan.getAmount();
                }

                if (planAmount != 0) {
                    razorPayUserInfoDTO.setAmount(planAmount);
                    return new ResponseEntity<>(razorPayUserInfoDTO, HttpStatus.OK);
                }
                return new ResponseEntity<>(CommonErrorMessages.INVALID_SUBSCRIPTION, HttpStatus.BAD_REQUEST);
            }
            else {
                return new ResponseEntity<>(CommonErrorMessages.INVALID_REQUEST, HttpStatus.BAD_REQUEST);
            }
        }
        catch (Exception e) {
            logger.error(e.getMessage(), e);
            return new ResponseEntity<>(CommonErrorMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    //IMPORTANT: do not pass key_secret to client
    //create subscription
    @RequestMapping(value = "/validate/subscription", method = RequestMethod.POST)
    public ResponseEntity<?> validateSubscription(@RequestBody final StripeSubscriptionInfo subscriptionInfo) {
        try {

            String subscriptionId = "";
            Response response = new Response();

            if (subscriptionInfo != null) {

                subscriptionId = stripePayService.validateAndCompleteSubscription(subscriptionInfo);

                if (subscriptionId != "" && subscriptionId != null) {
                    response.setMessage(subscriptionId);
                    response.setSuccess(true);
                    return new ResponseEntity<>(response, HttpStatus.OK);
                }
                else {
                    return new ResponseEntity<>(CommonErrorMessages.INVALID_SUBSCRIPTION, HttpStatus.BAD_REQUEST);
                }
            } else {
                return new ResponseEntity<>(CommonErrorMessages.INVALID_REQUEST, HttpStatus.BAD_REQUEST);
            }
        }
        catch (Exception e) {
            logger.error(e.getMessage(), e);
            return new ResponseEntity<>(CommonErrorMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    //IMPORTANT: do not pass key_secret to client
    //Get user info to populate in credit card details for Stripe
    @RequestMapping(value = "/getUserInfo/{content_id}", method = RequestMethod.GET)
    public ResponseEntity<?> getUserInfoForPayPerView(@PathVariable String content_id) {
        try {

            RazorPayUserInfoDTO razorPayUserInfoDTO = null;
            float amount = 0;

            amount = getAmount(content_id);

            if (amount > 0) {
                razorPayUserInfoDTO = stripePayService.getPaymentGatewayWithUserInfo();

                if (razorPayUserInfoDTO != null) {
                    razorPayUserInfoDTO.setAmount(amount);
                    return new ResponseEntity<>(razorPayUserInfoDTO, HttpStatus.OK);
                }
            }

            return new ResponseEntity<>(CommonErrorMessages.INVALID_REQUEST, HttpStatus.BAD_REQUEST);

        }
        catch (Exception e) {
            logger.error(e.getMessage(), e);
            return new ResponseEntity<>(CommonErrorMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    //IMPORTANT: do not pass key_secret to client
    //validate the purchase with stripe
    @RequestMapping(value = "/capture", method = RequestMethod.POST)
    public ResponseEntity<?> validateAndCapture(@RequestBody final RazorPayTransaction razorPayment) {
        try {

            float amount = getAmount(razorPayment.getProduct_reference_id());
            String paymentId = "";

            //validate amount passed from client is same
            //never pass amount passed from client without validation
            if (amount == razorPayment.getAmount()) {
                paymentId = stripePayService.validateAndCompletePurchase(razorPayment);
            }

            Response response = new Response();

            if (paymentId != "" && paymentId != null) {
                response.setMessage(paymentId);
                response.setSuccess(true);
                return new ResponseEntity<>(response, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(CommonErrorMessages.INVALID_PAYMENT, HttpStatus.BAD_REQUEST);
            }

        }
        catch (Exception e) {
            logger.error(e.getMessage(), e);
            return new ResponseEntity<>(CommonErrorMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    private float getAmount(String contentId) {

        Content content = contentService.find(contentId);
        float amount = 0;

        if (content != null && content.getPayperviewCategoryId() != null) {

            Category category = categoryService.find(content.getPayperviewCategoryId());

            if (category != null) {

                User user = sessionService.getUser();

                if (user.isIs_premium()) {
                    amount = category.getPremium_price();
                }
                else {
                    amount = category.getPrice();
                }
            }
        }

        return amount * 100;
    }

}
