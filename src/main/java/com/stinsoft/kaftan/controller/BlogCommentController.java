package com.stinsoft.kaftan.controller;

import com.stinsoft.kaftan.dto.BlogCommentDTO;
import com.stinsoft.kaftan.messages.AppMessages;
import com.stinsoft.kaftan.messages.ExceptionMessages;

import com.stinsoft.kaftan.model.Blog;
import com.stinsoft.kaftan.model.BlogComment;
import com.stinsoft.kaftan.service.BlogCommentService;

import com.stinsoft.kaftan.service.BlogService;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import ss.core.model.Response;

import ss.core.helper.CounterHelper;
import ss.core.security.service.ISessionService;

import java.util.List;

@Document
@RestController
@RequestMapping("api/")
public class BlogCommentController extends BaseController {

    @Autowired
    BlogService blogService;

    @Autowired
    BlogCommentService blogCommentService;

    @Autowired
    private ISessionService sessionService;

    @Autowired
    CounterHelper counterHelper;

    Logger logger = null;

    @RequestMapping(value = "session/blogComment/create/{blogId}/{comment}", method = RequestMethod.POST)
    public ResponseEntity<?> createBlog(@PathVariable String blogId, @PathVariable String comment) {
        try {

            BlogComment blogComment = null;
            Blog blog = blogService.find(blogId);
            if(blog != null) {
                blogComment = new BlogComment();
                blogComment.setUser_id(sessionService.getUser().getId());
                blogComment.setBlog_id(blog.getId());
                blogComment.setComment(comment);
                blogComment = blogCommentService.create(blogComment);
                if (blogComment != null) {
                    blogComment.setSuccess(true);
                    blogComment.setMessage(AppMessages.BLOG_COMMENT_CREATED);
                } else {
                    blogComment = new BlogComment();
                    blogComment.setSuccess(false);
                    blogComment.setMessage(ExceptionMessages.UNEXPECTED_MESSAGE);
                }
            } else {
                blogComment = new BlogComment();
                blogComment.setSuccess(false);
                blogComment.setMessage(ExceptionMessages.UNEXPECTED_MESSAGE);
            }

            return new ResponseEntity<>(blogComment, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = "blogComment/{blogId}", method = RequestMethod.GET)
    public ResponseEntity<?> getBlogComment(@PathVariable String blogId) {
        try {
            List<BlogCommentDTO> blogComment = blogCommentService.findBlog(new ObjectId(blogId));

            return new ResponseEntity<>(blogComment, HttpStatus.OK);

        } catch (Exception e) {
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }
}
