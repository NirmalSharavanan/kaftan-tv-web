package com.stinsoft.kaftan.controller;


import com.stinsoft.kaftan.helper.SocialShareHelper;
import com.stinsoft.kaftan.model.Blog;
import com.stinsoft.kaftan.model.Content;

import com.stinsoft.kaftan.service.BlogService;
import org.springframework.stereotype.Controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import com.stinsoft.kaftan.service.ContentService;
import ss.core.aws.S3Service;
import ss.core.model.Customer;
import ss.core.service.CustomerService;


@Controller
public class ShareController {
    @Autowired
    ContentService contentService;

    @Autowired
    BlogService blogService;

    @Autowired
    CustomerService customerService;

    @Autowired
    S3Service s3Service;

    @GetMapping("/share")
    public String socialShare(@RequestParam(name="id", required = true) String id,
                              @RequestParam(name="isContent", required = true) boolean isContent,
                              Model model){
        if(isContent) {
            share(id, model);
            return "social-share";
        } else {
            Blog blog = blogService.find(id);

            SocialShareHelper.getBlogFacebookModel(model, blog);

            return "social-share-blog";
        }
    // TODO Other social media meta data needs to be filled.

    }

    @GetMapping("/content")
    public String socialShareApp(@RequestParam(name="contentId", required = true) String contentId,
                              Model model){
            share(contentId, model);
            return "social-share";
    }

    public void share(String contentId, Model model) {
        Content content = contentService.find(contentId);
        Customer customer = customerService.find(content.getCustomer_id());
        content.getBanner_aws_info()
                .setAwsUrl(s3Service.getAWSBaseUrl(customer.getAws_bucket())
                        + content.getBanner_aws_info().getId());

        //Facebook Share
        SocialShareHelper.getFacebookModel(model, content);
    }
}
