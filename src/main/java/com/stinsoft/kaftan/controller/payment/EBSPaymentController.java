package com.stinsoft.kaftan.controller.payment;

import com.stinsoft.kaftan.controller.BaseController;
import com.stinsoft.kaftan.controller.SubscriptionController;
import com.stinsoft.kaftan.dto.EBSPaymentDTO;
import com.stinsoft.kaftan.dto.SubscriptionDTO;
import com.stinsoft.kaftan.dto.UserSubscriptionDTO;
import com.stinsoft.kaftan.messages.AppMessages;
import com.stinsoft.kaftan.messages.ExceptionMessages;
import com.stinsoft.kaftan.model.Subscription;
import com.stinsoft.kaftan.model.UserSubscription;
import com.stinsoft.kaftan.service.SubscriptionService;
import com.stinsoft.kaftan.service.UserSubscriptionService;
import org.apache.commons.lang3.RandomStringUtils;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.hateoas.mvc.ControllerLinkBuilder;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;
import org.springframework.web.util.UriComponentsBuilder;
import ss.core.controller.UserController;
import ss.core.model.Customer;
import ss.core.model.Response;
import ss.core.model.User;
import ss.core.security.service.ISessionService;

import javax.servlet.http.HttpSession;
import java.math.BigInteger;
import java.security.MessageDigest;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.methodOn;

/**
 * Created by sridevi on 26-12-2019.
 */

@Controller
@RequestMapping("/")
public class EBSPaymentController extends BaseController {

    Logger logger = LoggerFactory.getLogger(EBSPaymentController.class);

    @Autowired
    private ISessionService sessionService;

    @Autowired
    private UserSubscriptionService userSubscriptionService;

    @Autowired
    private SubscriptionService subscriptionService;

    @Autowired
    private HttpSession httpSession;

    @Value("spring.payment.EBS.accountId")
    private String accountId;

    @Value("spring.payment.EBS.secretKey")
    private String secretKey;

    @Value("spring.payment.EBS.mode")
    private String mode;

    @Value("BO 8, 252A Herbert Macaulay way Central Business District Abuja.")
    public String address;

    @Value("NGR")
    public String country;

    @Value("NG")
    public String state;

    @Value("Abuja")
    public String city;

    @Value("NGN")
    public String currency;

    @Value("900211")
    public String postalCode;

    @Value("${angular.ui.port:#{null}}")
    private String uiPort;

    @Autowired
    private SubscriptionController subscriptionController;

    @RequestMapping(value = "api/session/ebs-payment/generateSecureHash", method = RequestMethod.POST)
    public ResponseEntity<?> generateSecureHash(@RequestBody EBSPaymentDTO payment) {
        try {

            User user = sessionService.getUser();

            HashMap encryptedHash = new HashMap();
            String reference_number = null;

            if (user != null && payment != null) {
                reference_number = generateReferenceNumber();
                Customer customer = ebsConfig();

                ControllerLinkBuilder linkTo = ControllerLinkBuilder.linkTo(methodOn(EBSPaymentController.class)
                        .getPayment("",0,"",0,""));
                if (reference_number != null) {
                    payment.setSecretKey(secretKey);
                    payment.setAccountId(accountId);
                    payment.setAddress("Dummy Address");
                    payment.setChannel("0");
                    payment.setCity("Salem");
                    payment.setCountry("IND");
                    payment.setCurrency("INR");
                    payment.setDescription("Subscribe User");
                    payment.setUser(user);
                    payment.setPostalCode("12345678");
                    payment.setReferenceNo(reference_number);
                    payment.setMode(mode);

                    payment.setRedirect_url( linkTo.toString());
                    payment.setState("TN");
//                    payment.setAddress(address);
//                    payment.setChannel("0");
//                    payment.setCity(city);
//                    payment.setCountry(country);
//                    payment.setCurrency(currency);
//                    payment.setDescription("Subscribe User");
//                    payment.setUser(user);
//                    payment.setPostalCode(postalCode);
//                    payment.setReferenceNo(reference_number);
//                    payment.setMode(mode);
//                    payment.setRedirect_url("http://localhost:4200/api/ebs-payment/paymentResponse");
//                    payment.setState(state);
                    httpSession.setAttribute("subscriptionId", payment.getSubscriptionId());
                    httpSession.setAttribute("user", user);

                    // Sent all mandatory fields
                    String pass = payment.getSecretKey() + "|" + payment.getAccountId() + "|" + payment.getAddress() + "|" +
                            payment.getAmount() + "|" + payment.getChannel() + "|" + payment.getCity() + "|" +
                            payment.getCountry() + "|" + payment.getCurrency() + "|" + payment.getDescription() + "|" +
                            payment.getUser().getEmail() + "|" + mode + "|" + payment.getUser().getName() + "|" +
                            payment.getUser().getMobileNo() + "|" + payment.getPostalCode() + "|" + payment.getReferenceNo() + "|" +
                            payment.getRedirect_url() + "|" + payment.getState();

                    MessageDigest m = MessageDigest.getInstance("MD5");
                    byte[] data = pass.getBytes();
                    m.update(data, 0, data.length);
                    BigInteger i = new BigInteger(1, m.digest());
                    String secure_hash = String.format("%1$032X", i);
                    payment.setSecure_hash(secure_hash);
                }
            }
            return new ResponseEntity<>(payment, HttpStatus.OK);

        } catch (Exception e) {
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    private String getPath(ControllerLinkBuilder linkTo, String prefix) {
        UriComponentsBuilder builder = linkTo.toUriComponentsBuilder();
        if (uiPort != null) {
            builder.port(uiPort);
        }
        builder.replacePath(prefix + linkTo.toUri().getPath());
        logger.info("URL to attach : " + builder.toUriString());
        return builder.toUriString();
    }

    @RequestMapping(value = "api/session/ebs-payment/generateReferenceNumber", method = RequestMethod.GET)
    public ResponseEntity<?> generateReferenceNo() {

        try {
            String  referenceNo = generateReferenceNumber();
            HashMap refNo = new HashMap();
            refNo.put("referenceNo",referenceNo);
            return new ResponseEntity<>(refNo, HttpStatus.OK);
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    public String generateReferenceNumber() {
        try {
            String reference_number = null;
            for (; ; ) {
                reference_number = RandomStringUtils.randomAlphanumeric(8).toUpperCase();
                UserSubscription userSubscription = userSubscriptionService.findReferenceNumber(reference_number);
                if (userSubscription == null) {
                    break;
                }
            }
            return reference_number;
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            return null;
        }
    }

    private Customer ebsConfig() {
        try {

            Customer customer = sessionService.getUser().getCustomer();
            if (customer != null && customer.getPaymentGateWay() != null && customer.getPaymentGateWay().getEbsConfig() != null) {
                accountId = customer.getPaymentGateWay().getEbsConfig().getAccountId();
                secretKey = customer.getPaymentGateWay().getEbsConfig().getSecureKey();
                mode = customer.getPaymentGateWay().getEbsConfig().getMode();
            }
            return customer;

        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            return null;
        }
    }

    @RequestMapping(value = "api/ebs-payment/paymentResponse", method = RequestMethod.GET)
    public RedirectView getPayment(@RequestParam("PaymentID") String PaymentID,
                                   @RequestParam("Amount") float Amount,
                                   @RequestParam("TransactionID") String TransactionID,
                                   @RequestParam("ResponseCode") int ResponseCode,
                                   @RequestParam("MerchantRefNo") String MerchantRefNo) {
        try {
//            User user = sessionService.getUser();

            RedirectView redirectView = new RedirectView();
            UserSubscriptionDTO userSubscriptionDTO = new UserSubscriptionDTO();
            UserSubscription userSubscription = null;
            String subscriptionId = null;

            if (httpSession.getAttribute("user") != null && httpSession.getAttribute("subscriptionId") != null) {
                Object userInfo = httpSession.getAttribute("user");
                User user = (User) userInfo;
                subscriptionId = (String) httpSession.getAttribute("subscriptionId");
                userSubscriptionDTO.setPaymentAmount(Amount);
                userSubscriptionDTO.setTransactionId(PaymentID);
                userSubscriptionDTO.setPaymentMode("EBS");
                userSubscriptionDTO.setSubscriptionId(subscriptionId);
                userSubscriptionDTO.setReferenceNumber(MerchantRefNo);
                if (ResponseCode == 0) {
                    userSubscriptionDTO.setPaymentStatus(true);
                }else{
                    userSubscriptionDTO.setPaymentStatus(false);
                }
                userSubscription= subscriptionController.createSubscription(user, userSubscriptionDTO);

                if(ResponseCode == 0 && userSubscription !=null && userSubscription.isSuccess()){
                    List<SubscriptionDTO> subscription = subscriptionService.findBySubscription(userSubscription.getSubscriptionId());
                    userSubscriptionDTO.setSubscriptionInfo(subscription.get(0));
                    userSubscriptionDTO.setSubscriptionStarted_at(userSubscription.getSubscriptionStarted_at());
                    userSubscriptionDTO.setSubscriptionEnd_at(userSubscription.getSubscriptionEnd_at());

                    sendSubscriptionEmail(user, userSubscriptionDTO, false);
                }

            }
            // redirect to home page
            redirectView.setUrl(ControllerLinkBuilder.linkTo(methodOn(EBSPaymentController.class).redirect(userSubscription.getId().toString())).toString());
            return redirectView;

        } catch (Exception e) {
            return null;
        }
    }

    @RequestMapping(value = "session/paymentCompleted/{subscriptionId}", method = RequestMethod.POST)
    public ResponseEntity<?> redirect(@PathVariable String subscriptionId) {
        return null;
    }

    @RequestMapping(value = "api/session/payment/{subscriptionId}", method = RequestMethod.GET)
    public ResponseEntity<?> getPaymentDetails(@PathVariable String subscriptionId) {
        try {
            List<UserSubscriptionDTO> subscriptionDetails = null;
            User user = sessionService.getUser();

            if(user != null) {
                subscriptionDetails = userSubscriptionService.findSubscription(new ObjectId(subscriptionId));
            }

            return new ResponseEntity<>(subscriptionDetails, HttpStatus.OK);
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = "api/session/ebs-payment/subscription/email/{subscriptionId}", method = RequestMethod.POST)
    public ResponseEntity<?> sendSubscriptionEmailToUsers(@PathVariable String subscriptionId) {

        try {
            User user = sessionService.getUser();
            Response response = new Response();
            response.setSuccess(false);

            if (user != null) {

                List<UserSubscriptionDTO> userSubscriptionList = userSubscriptionService.findSubscriberByUser(user.getId());
                if (userSubscriptionList != null && userSubscriptionList.size() > 0) {
                    userSubscriptionList = userSubscriptionList.stream().filter(sub ->sub.getSubscriptionId().equals(subscriptionId)
                            && !sub.getSubscriptionInfo().getPaymentPlan().equals("Flex")).collect(Collectors.toList());


                    if (userSubscriptionList != null && userSubscriptionList.size() > 0) {
                        sendSubscriptionEmail(user, userSubscriptionList.get(0), false);
                        response.setSuccess(true);
                        response.setMessage("Email has been successfully sent!!");
                    }
                }
            }
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    public void sendSubscriptionEmail(User user, UserSubscriptionDTO userSubscription, boolean isAutoSubscription) {
        try {
            if (user != null && userSubscription != null) {
                userSubscriptionService.sendSubscriptionMailToUser(user, userSubscription, userSubscription.getTransactionId(), userSubscription.getReferenceNumber(),isAutoSubscription);
            }
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
        }
    }

}
