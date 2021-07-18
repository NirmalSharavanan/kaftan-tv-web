package com.stinsoft.kaftan.controller;

import com.amazonaws.services.s3.model.PutObjectResult;
import com.stinsoft.kaftan.dto.BlogDTO;
import com.stinsoft.kaftan.dto.BlogDTOForUser;
import com.stinsoft.kaftan.messages.AppMessages;
import com.stinsoft.kaftan.messages.ExceptionMessages;
import com.stinsoft.kaftan.model.Blog;
import com.stinsoft.kaftan.service.BlogService;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ss.core.aws.AWSInfo;
import ss.core.aws.S3Service;
import ss.core.dto.ReOrderDTO;
import ss.core.helper.CounterHelper;
import ss.core.model.Response;
import ss.core.model.User;
import ss.core.security.service.ISessionService;

import java.io.InputStream;
import java.util.List;

@RestController
@RequestMapping("api/")
public class BlogController extends BaseController {

    @Autowired
    BlogService blogService;

    @Autowired
    private ISessionService sessionService;

    @Autowired
    S3Service s3Service;

    @Autowired
    CounterHelper counterHelper;

    Logger logger = null;

    @RequestMapping(value = "/admin/session/blog/create", method = RequestMethod.POST)
    public ResponseEntity<?> createBlog(@RequestBody final BlogDTO blogDTO) {
        try {

            Blog blog = blogService.findBlogByTitle(blogDTO.getTitle());
            if (blog == null) {
                blog = new Blog();
                blog.setUser_id(sessionService.getUser().getId());
                blog.setTitle(blogDTO.getTitle());
                blog.setContent(blogDTO.getContent());
                blog.setSort_order(counterHelper.getNextSequence(Blog.class.getName() + "_" + sessionService.getUser().getCustomer_id().toString()));
                blog = blogService.create(blog);
                if (blog != null) {
                    blog.setSuccess(true);
                    blog.setMessage(AppMessages.BLOG_CREATED);
                } else {
                    blog = new Blog();
                    blog.setSuccess(false);
                    blog.setMessage(ExceptionMessages.UNEXPECTED_MESSAGE);
                }
            } else {
                blog = new Blog();
                blog.setSuccess(false);
                blog.setMessage(AppMessages.BLOG_EXISTS);
            }

            return new ResponseEntity<>(blog, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = "/admin/session/blog/update/{blogId}", method = RequestMethod.PUT)
    public ResponseEntity<?> updateBlog(@PathVariable String blogId, @RequestBody final BlogDTO blogDTO) {
        try {

            Blog blog = blogService.find(blogId);
            if (blog != null) {
                blog.setUser_id(sessionService.getUser().getId());
                blog.setTitle(blogDTO.getTitle());
                blog.setContent(blogDTO.getContent());
                blog = blogService.update(new ObjectId(blogId), blog);
                if (blog != null) {
                    blog.setSuccess(true);
                    blog.setMessage(AppMessages.BLOG_UPDATED);
                } else {
                    blog = new Blog();
                    blog.setSuccess(false);
                    blog.setMessage(ExceptionMessages.UNEXPECTED_MESSAGE);
                }
            } else {
                blog = new Blog();
                blog.setSuccess(false);
                blog.setMessage(AppMessages.BLOG_NOT_EXISTS);
            }

            return new ResponseEntity<>(blog, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = "/blogs", method = RequestMethod.GET)
    public ResponseEntity<?> getAllBlogs() {
        try {

            List<BlogDTOForUser> blogs = blogService.findAll();

            return new ResponseEntity<>(blogs, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = "/session/blog/{blogId}", method = RequestMethod.GET)
    public ResponseEntity<?> getBlog(@PathVariable String blogId) {
        try {
            Blog blog = blogService.find(blogId);
            if (blog != null) {
                blog.setSuccess(true);
            } else {
                blog = new Blog();
                blog.setSuccess(false);
                blog.setMessage(AppMessages.BLOG_NOT_EXISTS);
            }
            return new ResponseEntity<>(blog, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = "/admin/session/blog/delete/{blogId}", method = RequestMethod.DELETE)
    public ResponseEntity<?> deleteBlog(@PathVariable String blogId) {
        try {
            Blog blog = blogService.find(blogId);
            if (blog != null) {
                blogService.delete(blog.getId());
                blog.setSuccess(true);
                blog.setMessage(AppMessages.BLOG_DELETED);
            } else {
                blog = new Blog();
                blog.setSuccess(false);
                blog.setMessage(AppMessages.BLOG_NOT_EXISTS);
            }
            return new ResponseEntity<>(blog, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = "admin/session/blog/re-order", method = RequestMethod.PUT)
    public ResponseEntity<?> ReOrder(@RequestBody List<ReOrderDTO> reOrderDTOList) {
        try {
            Response response = new Response();
            response.setSuccess(blogService.blogReOrder(reOrderDTOList));
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = "/admin/session/blog/uploadImage", method = RequestMethod.POST)
    public ResponseEntity<?> uploadImagePath(@RequestParam(value = "image", required = false) MultipartFile image) {
        try {

            User user = sessionService.getUser();

            AWSInfo awsInfo = new AWSInfo();
            BlogDTO blogDTO = null;
            String picture = null;

            if(image != null && user != null) {
                awsInfo = updateImage(image);
                if(awsInfo != null) {
                    picture = s3Service.getAWSUrl(awsInfo.getId(), user.getCustomer().getAws_bucket());
                    if(picture != null) {
                        blogDTO = new BlogDTO();
                        blogDTO.setPath(picture);
                    }
                }
            }
            return new ResponseEntity<>(blogDTO, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    public AWSInfo updateImage(MultipartFile image) {
        try {

                String imagePath = "";
                AWSInfo awsInfo = new AWSInfo();

                //upload the new banner image from AWS
                String uniqueImageID = s3Service.getUniqueId(image.getOriginalFilename());

                InputStream stream = image.getInputStream();

                //upload image to AWS
                PutObjectResult putObjectResult = s3Service.upload(uniqueImageID, stream);
                if (putObjectResult != null) {

                    awsInfo.setId(uniqueImageID);
                    awsInfo.seteTag(putObjectResult.getETag());

                } else {
                    logger.error(String.format("Error upload notification image for %s"));
                }

            return awsInfo;
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            return null;
        }
    }
}


