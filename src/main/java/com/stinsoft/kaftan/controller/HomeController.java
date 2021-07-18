package com.stinsoft.kaftan.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.View;
import org.springframework.web.servlet.view.InternalResourceView;

import java.security.Principal;

/**
 * Created by ssu on 26/01/18.
 */
@RestController
public class HomeController {

	@RequestMapping({ "/", 
		"/session{path:[^\\.]*}", 
		"/session/{path:[^\\.]*}", 
		"/session/**/{path:[^\\.]*}",
		"/admin{path:[^\\.]*}", 
		"/admin/{path:[^\\.]*}", 
		"/admin/**/{path:[^\\.]*}" })
	public View redirectSession() {
		return new InternalResourceView("/index.html");
	}
}
