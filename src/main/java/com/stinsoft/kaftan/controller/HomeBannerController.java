package com.stinsoft.kaftan.controller;

import com.stinsoft.kaftan.dto.ReOrderDTO;
import com.stinsoft.kaftan.messages.AppMessages;
import com.stinsoft.kaftan.messages.ExceptionMessages;
import com.stinsoft.kaftan.model.HomeBanner;
import com.stinsoft.kaftan.service.ApplicationEmailService;
import com.stinsoft.kaftan.service.HomeBannerService;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import ss.core.model.Response;
import ss.core.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ss.core.aws.S3Service;
import ss.core.model.Customer;
import ss.core.security.service.ISessionService;

import java.util.ArrayList;
import java.util.List;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;

/**
 * Created by ssu on 17/01/18.
 */
@RestController
@RequestMapping("api/")
public class HomeBannerController extends BaseController {

    @Autowired
    private ISessionService sessionService;

    @Autowired
    CustomerService customerService;

    @Autowired
    private HomeBannerService homeBannerService;

    @Autowired
    S3Service s3Service;

    @Autowired
    ApplicationEmailService applicationEmailService;

    Logger logger = LoggerFactory.getLogger(HomeBannerController.class);

    @RequestMapping(value = "admin/session/home-banner/create", method = RequestMethod.POST)
    public ResponseEntity<?> create(@RequestParam(value = "bannerImage", required = true) MultipartFile bannerImage,
                                    @RequestParam(value = "redirectUrl", required = true) String redirectUrl,
                                    @RequestParam(value = "bannerText", required = false) String bannerText,
                                    @RequestParam(value = "bannerDescription", required = false) String bannerDescription,
                                    @RequestParam(value = "isCompress", required = false, defaultValue = "true") boolean isCompress) {
        try {

            HomeBanner homeBanner = new HomeBanner();
            homeBanner.setText(bannerText);
            homeBanner.setDescription(bannerDescription);
            homeBanner.setRedirectUrl(redirectUrl);

            homeBanner = homeBannerService.create(homeBanner, bannerImage, isCompress);

            if (homeBanner != null) {
                homeBanner.setSuccess(true);
                homeBanner.setMessage(AppMessages.CATEGORY_HOME_BANNER);
            } else {
                homeBanner = new HomeBanner();
                homeBanner.setSuccess(false);
                homeBanner.setMessage(ExceptionMessages.CATEGORY_CREATE_ERROR);
            }

            return new ResponseEntity<>(homeBanner, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = "admin/session/home-banner/delete/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<?> delete(@PathVariable String id) {
        try {

            HomeBanner homeBanner=homeBannerService.find(id);
            if(homeBanner!=null){
                homeBannerService.delete(new ObjectId(id));
                homeBanner=new HomeBanner();
                homeBanner.setSuccess(true);
                homeBanner.setMessage(AppMessages.HOME_BANNER_DELETED);
            }
            else{
                homeBanner=new HomeBanner();
                homeBanner.setSuccess(false);
                homeBanner.setMessage(AppMessages.HOME_BANNER_NOT_EXISTS);
            }

            return new ResponseEntity<>(homeBanner, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = "home-banner", method = RequestMethod.GET)
    public ResponseEntity<?> getHomeBannerList() {
        try {

            List<Resource<HomeBanner>> resources = new ArrayList<Resource<HomeBanner>>();

            Customer customer = customerService.findByHost(sessionService.getHost());

           for (HomeBanner homeBanner : homeBannerService.findByCustomerId(customer.getId())) {
                resources.add(getHomeBannerResource(homeBanner, customer.getAws_bucket()));
            }

            return new ResponseEntity<>(resources, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = "testemail", method = RequestMethod.GET)
    public ResponseEntity<?> testEmail() {
        try {

            applicationEmailService.sendHtmlMail();

            return new ResponseEntity<>("success", HttpStatus.OK);
        } catch (Exception e) {
            logger.error(e.getMessage(),e);
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    private Resource<HomeBanner> getHomeBannerResource(HomeBanner homeBanner, String awsBucket) {

        Resource<HomeBanner> resource = new Resource<HomeBanner>(homeBanner);
        resource.add(new Link(s3Service.getAWSUrl(homeBanner.getBanner_aws_info().getId(), awsBucket), "awsBannerUrl"));
        return resource;
    }

    @RequestMapping(value = "admin/session/home-banner/re-order", method = RequestMethod.PUT)
    public ResponseEntity<?> reOrder(@RequestBody List<ReOrderDTO> reOrderDTOList) {
        try {

            Response response = new Response();
            response.setSuccess(homeBannerService.reOrder(reOrderDTOList));
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }
}
