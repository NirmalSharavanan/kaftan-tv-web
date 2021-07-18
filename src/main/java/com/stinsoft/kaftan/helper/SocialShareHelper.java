package com.stinsoft.kaftan.helper;

import com.stinsoft.kaftan.model.Blog;
import org.springframework.ui.Model;
import com.stinsoft.kaftan.model.Content;

public class SocialShareHelper {

    private static final int BANNER_WIDTH=643;
    private static final int BANNER_HEIGHT=189;

    public static Model getFacebookModel(Model model, Content content){
        model.addAttribute("ogImage", content.getBanner_aws_info().getAwsUrl());
        model.addAttribute("ogTitle", content.getTitle());
        model.addAttribute("ogDescription", content.getDescription());
        int width = content.getBanner_aws_info().getWidth();
        model.addAttribute("ogImageWidth", width > 0 ? width : BANNER_WIDTH);
        long height = content.getBanner_aws_info().getHeight();
        model.addAttribute("ogImageHeight", height > 0 ? height : BANNER_HEIGHT);
        model.addAttribute("contentId", content.getId());
        return model;
    }

    // Share blogs
    public static Model getBlogFacebookModel(Model model, Blog blog){
        model.addAttribute("ogImage", "/assets/kaftan/img/kaftan-logo.png");
        model.addAttribute("ogTitle", blog.getTitle());
        model.addAttribute("ogImageWidth", BANNER_WIDTH);
        model.addAttribute("ogImageHeight", BANNER_HEIGHT);
        model.addAttribute("blogId", blog.getId());
        return model;
    }
}
