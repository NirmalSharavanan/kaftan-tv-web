package com.stinsoft.kaftan.service;

import com.stinsoft.kaftan.dto.UserSubscriptionDTO;
import com.stinsoft.kaftan.model.Subscription;
import com.stinsoft.kaftan.model.UserSubscription;
import com.stinsoft.kaftan.repository.UserSubscriptionRepository;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.hateoas.Link;
import org.springframework.stereotype.Service;
import ss.core.aws.S3Service;
import ss.core.dto.SecureEndUserDTO;
import ss.core.email.Email;
import ss.core.email.EmailService;
import ss.core.email.EmailTemplate;
import ss.core.helper.ConfigHelper;
import ss.core.helper.DateHelper;
import ss.core.model.Customer;
import ss.core.model.User;
import ss.core.security.service.SessionService;
import ss.core.service.CustomerService;

import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.springframework.data.mongodb.core.aggregation.Aggregation.*;
import static org.springframework.data.mongodb.core.query.Criteria.where;

@Service
public class UserSubscriptionService implements IUserSubscriptionService {

    @Autowired
    UserSubscriptionRepository repository;

    @Autowired
    MongoOperations operations;

    @Autowired
    ConfigHelper configHelper;

    @Autowired
    SessionService sessionService;

    @Autowired
    CustomerService customerService;

    @Autowired
    EmailService emailService;

    @Autowired
    S3Service s3Service;

    Logger logger = LoggerFactory.getLogger(UserSubscriptionService.class);

    @Override
    public UserSubscription create(UserSubscription userSubscription) {
        userSubscription.setCreated_at(DateHelper.getCurrentDate());
        userSubscription.setUpdated_at(DateHelper.getCurrentDate());
        return repository.save(userSubscription);
    }

    @Override
    public List<UserSubscriptionDTO> findSubscriberByUser(ObjectId userId) {
        AggregationResults<UserSubscriptionDTO> results = operations.aggregate(
                newAggregation(UserSubscription.class,
                        match(where("userId").is(userId)),
                        match(where("subscriptionEnd_at").gte(DateHelper.getCurrentDate())),
                        match(where("paymentStatus").is(true)),
                        sort(Sort.Direction.ASC, "subscriptionEnd_at"),
                        lookup("subscription", "subscriptionId", "_id", "subscriptionInfo"),
                        unwind("subscriptionInfo"),
                        lookup("walletUser", "userId", "user_id", "walletInfo"),
                        unwind("walletInfo", true)
                ), UserSubscriptionDTO.class);
        return results.getMappedResults();
    }

    @Override
    public List<UserSubscriptionDTO> findAllSubscriberByUser(ObjectId userId) {
        AggregationResults<UserSubscriptionDTO> results = operations.aggregate(
                newAggregation(UserSubscription.class,
                        match(where("userId").is(userId)),
                        match(where("paymentStatus").is(true)),
                        sort(Sort.Direction.DESC, "subscriptionEnd_at"),
                        lookup("subscription", "subscriptionId", "_id", "subscriptionInfo"),
                        unwind("subscriptionInfo"),
                        lookup("walletUser", "userId", "user_id", "walletInfo"),
                        unwind("walletInfo", true)
                ), UserSubscriptionDTO.class);
        return results.getMappedResults();
    }

    @Override
    public List<UserSubscriptionDTO> findSubscription(ObjectId id) {
        AggregationResults<UserSubscriptionDTO> results = operations.aggregate(
                newAggregation(UserSubscription.class,
                        match(where("id").is(id)),
                        sort(Sort.Direction.ASC, "subscriptionEnd_at"),
                        lookup("subscription", "subscriptionId", "_id", "subscriptionInfo"),
                        unwind("subscriptionInfo"),
                        lookup("walletUser", "userId", "user_id", "walletInfo"),
                        unwind("walletInfo", true)
                ), UserSubscriptionDTO.class);
        return results.getMappedResults();
    }

    @Override
    public List<UserSubscriptionDTO> findSubscriberByuserId(ObjectId userId) {
        AggregationResults<UserSubscriptionDTO> results = operations.aggregate(
                newAggregation(UserSubscription.class,
                        match(where("userId").is(userId)),
                        project()
                                .andExpression("dateToString('%Y-%m-%d',subscriptionEnd_at)").as("subscriptionDate"), // convert datetime to date

                        sort(Sort.Direction.DESC, "subscriptionDate")
                ), UserSubscriptionDTO.class);
        return results.getMappedResults();
    }

    @Override
    public List<UserSubscriptionDTO> findAllSubscribedUsers() {
        AggregationResults<UserSubscriptionDTO> results = operations.aggregate(
                newAggregation(UserSubscription.class,
                        lookup("subscription", "subscriptionId", "_id", "subscriptionInfo"),
                        unwind("subscriptionInfo")
                ), UserSubscriptionDTO.class);
        return results.getMappedResults();
    }

    @Override
    public UserSubscription findExistsFlexSubscriber(ObjectId userId, ObjectId subscriptionId) {
        return repository.findExistsFlexSubscriber(userId, subscriptionId);
    }

    @Override
    public UserSubscription findReferenceNumber(String referenceNo) {
        return repository.findReferenceNumber(referenceNo);
    }

    public void sendWalletInsufficientAmtAlertMail(SecureEndUserDTO user) {

        try {
            String from = configHelper.fromEmail;
            String to = user.getEmail();
            String subject = "Wallet Insufficient fund";
            String emailHeader = "";
            Customer customer = null;

            EmailTemplate template = new EmailTemplate("subscription-failure-email-touser.html");

            Map<String, String> replacements = new HashMap<String, String>();
            replacements.put("user", user.getName());

            replacements.put("message", "Your auto subscription was cancelled due to insufficient amount in your wallet. " +
                    "You can't able to access any features until you subscribed. Please subscribe for some plans to access all features further.");

            List<Customer> customerInfo = customerService.findAll();

            if (customerInfo != null && customerInfo.size() > 0) {
                customer = customerInfo.get(0);

                replacements.put("customerName", customer.getName());
                replacements.put("socialLinks", socialMediaLinks(customer));
                emailHeader = getEmailHeader(customer);
                replacements.put("emailHeader", emailHeader);

                String message = template.getTemplate(replacements);

                Email email = new Email(from, to, subject, message);
                email.setHtml(true);
                emailService.sendThresholdEmail(email, customer);
            }

        } catch (Exception e) {
            logger.error(e.getMessage(), e);
        }
    }


    public void sendSubscriptionMailToUser(User user, UserSubscriptionDTO userSubscription, String paymentID, String merchantRefNo, boolean isAutoSubscription) {

        try {
            String from = configHelper.fromEmail;
            String to = user.getEmail();
            String subject = "Subscription Success";
            String emailHeader = "";
            String planName = "";
            Customer customer = null;

            if (userSubscription.getSubscriptionInfo() != null && userSubscription.getSubscriptionInfo().getPaymentPlan() != null) {

                String plan = userSubscription.getSubscriptionInfo().getPaymentPlan();
                if (plan.equals("Monthly")) {
                    planName = "Month";
                }
                if (plan.equals("Quarterly")) {
                    planName = "Month";

                }
                if (plan.equals("Yearly") || plan.equals("Silver") || plan.equals("Gold") || plan.equals("Platinum")) {
                    planName = "Month";
                }
            }

            EmailTemplate template = new EmailTemplate("subscription-email-tousers.html");

            Map<String, String> replacements = new HashMap<String, String>();
            replacements.put("user", user.getName());
            if (isAutoSubscription) {
                List<Customer> customerInfo = customerService.findAll();

                if (customerInfo != null && customerInfo.size() > 0) {
                    customer = customerInfo.get(0);
                }
                replacements.put("message", "Your auto subscription for <span style='color:#626161;font-weight: 600'>" + userSubscription.getSubscriptionInfo().getPaymentPlan() +
                        " Plan</span> and a payment of <span style='color:#626161;font-weight: 600'> NGN " + userSubscription.getPaymentAmount() + "</span>  has been activated for next " + planName + ".");

            } else {
                customer = getCustomer();
                replacements.put("message", "You have been successfully subscribed for <span style='color:#626161;font-weight: 600'>" + userSubscription.getSubscriptionInfo().getPaymentPlan() +
                        " Plan</span> and a payment of <span style='color:#626161;font-weight: 600'> NGN " + userSubscription.getPaymentAmount() + "</span> has been made.");

            }

//            replacements.put("planName", userSubscription.getSubscriptionInfo().getPaymentPlan());
//            if(userSubscription.getPaymentMode().equals("Kaftan Wallet")){
//                replacements.put("paymentType", "Wallet Code");
//
//            }else{
            replacements.put("paymentType", "Payment Id");
//            }
            replacements.put("amount", String.valueOf(userSubscription.getPaymentAmount()));
            replacements.put("merchantRefNo", merchantRefNo);
            replacements.put("paymentID", paymentID);
            String startDate = userSubscription.getSubscriptionStarted_at().format(DateTimeFormatter.ofPattern("dd-MMM-yyyy"));
            String endDate = userSubscription.getSubscriptionEnd_at().format(DateTimeFormatter.ofPattern("dd-MMM-yyyy"));

            replacements.put("paymentDuration", startDate + " to " + endDate);


            if (customer != null) {
                replacements.put("customerName", customer.getName());
                replacements.put("socialLinks", socialMediaLinks(customer));
                emailHeader = getEmailHeader(customer);
                replacements.put("emailHeader", emailHeader);
            }

            String message = template.getTemplate(replacements);

            Email email = new Email(from, to, subject, message);
            email.setHtml(true);

            if (isAutoSubscription) {
                emailService.sendThresholdEmail(email, customer);
            } else {
                emailService.send(email);
            }

        } catch (Exception e) {
            logger.error(e.getMessage(), e);
        }
    }

    private Customer getCustomer(){
        try{
            Customer customer = null;
            if (sessionService.getUser() != null) {
                customer = sessionService.getUser().getCustomer();
            } else {
                customer = customerService.findByHost(sessionService.getHost());
            }
            return customer;
        }
        catch (Exception e){
        }
        return null;
    }

    public String socialMediaLinks(Customer customer) {

        String social_links = "";

        if (customer != null) {
            if (customer.getFacebook_link() != null && customer.getFacebook_link() != "") {
                social_links += "<a href='" + customer.getFacebook_link() + "' target='_blank' style='text-decoration: none;'>"
                        + "<img src='http://stinsoft.com/kavasam_mail/facebook.png' alt='facebook' border='0' style='padding-right:10px;' />"
                        + "</a>";
            }
            if (customer.getTwitter_link() != null && customer.getTwitter_link() != "") {
                social_links += "<a href='" + customer.getTwitter_link() + "' target='_blank' style='text-decoration: none;'>"
                        + "<img src='http://stinsoft.com/kavasam_mail/twitter.png' alt='twitter' border='0' style='padding-right:10px;' />"
                        + "</a>";
            }
            if (customer.getGoogleplus_link() != null && customer.getGoogleplus_link() != "") {
                social_links += "<a href='" + customer.getGoogleplus_link() + "' target='_blank' style='text-decoration: none;'>"
                        + "<img src='http://stinsoft.com/kavasam_mail/googleplus.png' alt='google plus' border='0' style='padding-right:10px;' />"
                        + "</a>";
            }
            if (customer.getInstagram_link() != null && customer.getInstagram_link() != "") {
                social_links += "<a href='" + customer.getInstagram_link() + "' target='_blank' style='text-decoration: none;'>"
                        + "<img src='http://stinsoft.com/kavasam_mail/instagram.png' alt='instagram' border='0' style='padding-right:10px;' />"
                        + "</a>";
            }
            if (customer.getYoutube_link() != null && customer.getYoutube_link() != "") {
                social_links += "<a href='" + customer.getYoutube_link() + "' target='_blank' style='text-decoration: none;'>"
                        + "<img src='http://stinsoft.com/kavasam_mail/youtube.png' alt='youtube' border='0' style='padding-right:10px;' />"
                        + "</a>";
            }
            if (customer.getIos_link() != null && customer.getIos_link() != "") {
                social_links += "<a href='" + customer.getIos_link() + "' target='_blank' style='text-decoration: none;'>"
                        + "<img src='http://stinsoft.com/kavasam_mail/ios.png' alt='ios' border='0' style='padding-right:10px;' />"
                        + "</a>";
            }
            if (customer.getAndroid_link() != null && customer.getAndroid_link() != "") {
                social_links += "<a href='" + customer.getAndroid_link() + "' target='_blank' style='text-decoration: none;'>"
                        + "<img src='http://stinsoft.com/kavasam_mail/android.png' alt='android' border='0' style='padding-right:10px;' />"
                        + "</a>";
            }
        }

        return social_links;
    }

    public String getEmailHeader(Customer customer) {
        String emailHeader = "";

        if (customer.getEmailHeaderImage_aws_info() != null) {
            String imageURL = new Link(s3Service.getAWSUrl(customer.getEmailHeaderImage_aws_info().getId(), customer.getAws_bucket()), "awsEmailHeaderUrl").getHref();
            emailHeader = "<table border='0' cellpadding='0' cellspacing='0' width='100%'";
            emailHeader += "style='border-spacing: 0;color: #333333;'>";
            emailHeader += "<tr>";
            emailHeader += "<td><a href='#'><img src='" + imageURL + "' alt=''";
            emailHeader += "style='border-width:0;display:block; max-width: 100%; height: auto;'/></a></td>";
            emailHeader += "</tr>";
            emailHeader += "</table>";
        } else {
            emailHeader = "<table border='0' cellpadding='0' cellspacing='0' width='100%'";
            emailHeader += "style='border-spacing: 0;color: #333333;'>";
            emailHeader += "<tr>";
            emailHeader += "<td><a href='#'><img src='' alt=''";
            emailHeader += "style='border-width:0;display:block; max-width: 100%; height: auto;'/></a></td>";
            emailHeader += "</tr>";
            emailHeader += "</table>";
        }
        return emailHeader;
    }
}
