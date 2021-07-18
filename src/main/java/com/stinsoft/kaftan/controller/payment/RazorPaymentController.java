package com.stinsoft.kaftan.controller.payment;

import com.stinsoft.kaftan.model.Category;
import com.stinsoft.kaftan.model.Content;
import com.stinsoft.kaftan.service.CategoryService;
import com.stinsoft.kaftan.service.ContentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ss.core.model.payments.SubscriptionInfo;
import ss.core.payment.razorpay.entity.RazorPayTransaction;
import ss.core.payment.razorpay.entity.RazorPayUserInfoDTO;
import ss.core.messages.CommonErrorMessages;
import ss.core.model.*;
import ss.core.security.service.ISessionService;
import ss.core.service.payment.RazorPayService;

/**
 * Created by ssu on 13/02/18.
 */
@RestController
@RequestMapping("api/session/razor-payment")
public class RazorPaymentController {

    Logger logger = LoggerFactory.getLogger(RazorPaymentController.class);

    @Autowired
    private ISessionService sessionService;

    @Autowired
    private ContentService contentService;

    @Autowired
    private CategoryService categoryService;

    @Autowired
    RazorPayService razorPayService;

    //IMPORTANT: do not pass key_secret to client
    //Get user info to populate in credit card details for Razor pay with subscription_id
    @RequestMapping(value = "/getUserInfoForSubscription", method = RequestMethod.GET)
    public ResponseEntity<?> getUserInfoForSubscription() {
        try {

            RazorPayUserInfoDTO razorPayUserInfoDTO = razorPayService.getPaymentGatewayWithUserInfo();

            if(razorPayUserInfoDTO != null) {

                String subscription_id = razorPayService.createNewSubscription();

                if(subscription_id != null) {
                    razorPayUserInfoDTO.setRazorpay_subscription_id(subscription_id);
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
    //Validate subscription
    @RequestMapping(value = "/validate/subscription", method = RequestMethod.POST)
    public ResponseEntity<?> validateSubscription(@RequestBody final SubscriptionInfo subscriptionInfo) {
        try {

            boolean isSubscriptionSuccessful = false;
            Response response = new Response();

            if(subscriptionInfo != null) {

                isSubscriptionSuccessful = razorPayService.validateAndCompleteSubscription(subscriptionInfo);

                if(isSubscriptionSuccessful) {

                    response.setSuccess(true);
                    return new ResponseEntity<>(response, HttpStatus.OK);
                }
                else {
                    return new ResponseEntity<>(CommonErrorMessages.INVALID_SUBSCRIPTION, HttpStatus.BAD_REQUEST);
                }
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
    //Get user info to populate in credit card details for Razor pay
    @RequestMapping(value = "/getUserInfo/{content_id}", method = RequestMethod.GET)
    public ResponseEntity<?> getUserInfoForPayPerView(@PathVariable String content_id) {
        try {

            RazorPayUserInfoDTO razorPayUserInfoDTO = null;
            float amount = 0;

            amount = getAmount(content_id);

            if(amount > 0) {
                razorPayUserInfoDTO = razorPayService.getPaymentGatewayWithUserInfo();

                if(razorPayUserInfoDTO != null) {
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
    //validate the purchase with razor pay
    @RequestMapping(value = "/capture", method = RequestMethod.POST)
    public ResponseEntity<?> validateAndCapture(@RequestBody final RazorPayTransaction razorPayment) {
        try {

            float amount = getAmount(razorPayment.getProduct_reference_id());
            //boolean isPaymentSuccessful = false;
            String paymentId = "";

            //validate amount passed from client is same
            //never pass amount passed from client without validation
            if (amount == razorPayment.getAmount()) {
                paymentId = razorPayService.validateAndCompletePurchase(razorPayment);
            }

            Response response = new Response();

            // if(isPaymentSuccessful) {

            if (paymentId != "" && paymentId != null) {
                response.setMessage(paymentId);
                response.setSuccess(true);
                return new ResponseEntity<>(response, HttpStatus.OK);
            }
            else {
                return new ResponseEntity<>(CommonErrorMessages.INVALID_PAYMENT, HttpStatus.BAD_REQUEST);
            }

        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            return new ResponseEntity<>(CommonErrorMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    private float getAmount(String contentId) {

        Content content = contentService.find(contentId);
        float amount = 0;

        if(content != null && content.getPayperviewCategoryId() != null) {

            Category category = categoryService.find(content.getPayperviewCategoryId());

            if(category != null) {

                User user = sessionService.getUser();

                if(user.isIs_premium()) {
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
