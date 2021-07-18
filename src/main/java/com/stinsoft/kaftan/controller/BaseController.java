package com.stinsoft.kaftan.controller;

import ss.core.model.User;
import ss.core.model.UserAuthentication;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

/**
 * Created by ssu on 19/11/17.
 * Base for all REST controllers,
 * all REST controllers implemented should be extended from Base controller
 */
@RestController
public class BaseController {

    //Ger User object from session
    protected User getUserDetails(Principal principal) {

        if(principal != null)
            return ((UserAuthentication) principal).getUser();
        else
            return null;
    }

}
