package com.stinsoft.kaftan.service;

import ss.core.email.Email;
import ss.core.email.EmailService;
import ss.core.email.EmailTemplate;
import ss.core.helper.ConfigHelper;
import ss.core.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by ssu on 04/12/17.
 */
@Service
public class ApplicationEmailService {

    @Autowired
    ConfigHelper configHelper;

    @Autowired
    EmailService emailService;

    public void sendSignUpSuccessEmail(User user, String activationUrl) {

        String from = configHelper.fromEmail;
        String to = user.getEmail();
        String subject = "Kaftan - Sign up success";

        EmailTemplate template = new EmailTemplate("signup-success-activation.html");

        Map<String, String> replacements = new HashMap<String, String>();
        replacements.put("user", user.getName());
        replacements.put("activationUrl", activationUrl);

        String message = template.getTemplate(replacements);

        Email email = new Email(from, to, subject, message);
        email.setHtml(true);
        emailService.send(email);
    }

    public void sendResetPasswordEmail(User user, String activationUrl) {

        String from = configHelper.fromEmail;
        String to = user.getEmail();
        String subject = "Kaftan - Reset Password";

        EmailTemplate template = new EmailTemplate("reset-password.html");

        Map<String, String> replacements = new HashMap<String, String>();
        replacements.put("user", user.getName());
        replacements.put("activationUrl", activationUrl);

        String message = template.getTemplate(replacements);

        Email email = new Email(from, to, subject, message);
        email.setHtml(true);
        emailService.send(email);
    }

    public void sendSignUpSuccessEmail_ToAdminUsers(User user, String password) {

        String from = configHelper.fromEmail;
        String to = user.getEmail();
        String subject = "Kaftan - Sign up success";

        EmailTemplate template = new EmailTemplate("signup-success-adminusers.html");

        Map<String, String> replacements = new HashMap<String, String>();
        replacements.put("username", user.getName());
        replacements.put("useremail", user.getEmail());
        replacements.put("password", password);

        String message = template.getTemplate(replacements);

        Email email = new Email(from, to, subject, message);
        email.setHtml(true);
        emailService.send(email);
    }

    public void sendHtmlMail() {


        String from = "jira@stinsoft.com";
        String to = "saravanamoorthi@stinsoft.com";
        String subject = "Java Mail with Spring Boot";

        EmailTemplate template = new EmailTemplate("hello-world.html");

        Map<String, String> replacements = new HashMap<String, String>();
        replacements.put("user", "Moorthi");
        replacements.put("today", String.valueOf(new Date()));

        String message = template.getTemplate(replacements);

        Email email = new Email(from, to, subject, message);
        email.setHtml(true);
        emailService.send(email);
    }

}
