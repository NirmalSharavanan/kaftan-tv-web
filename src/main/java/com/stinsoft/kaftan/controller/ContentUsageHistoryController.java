package com.stinsoft.kaftan.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.stinsoft.kaftan.dto.AWSContentUsageDTO;
import com.stinsoft.kaftan.messages.ExceptionMessages;
import com.stinsoft.kaftan.model.ContentUsageHistory;
import com.stinsoft.kaftan.service.ContentUsageHistoryService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ss.core.aws.transcoder.Notification;
import ss.core.helper.DateHelper;
import ss.core.helper.RESTHelper;
import ss.core.security.service.ISessionService;
import ss.core.service.BasicUserService;

import javax.ws.rs.Consumes;
import javax.ws.rs.Produces;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("api/")
public class ContentUsageHistoryController extends BaseController {

    Logger logger = LoggerFactory.getLogger(this.getClass());

    @Autowired
    ContentUsageHistoryService historyService;

    @Autowired
    ISessionService sessionService;

    @Autowired
    BasicUserService userService;


    @RequestMapping(value = "aws/content/usagehistory", method = RequestMethod.POST)
    public ResponseEntity<?> addContentUsageHistory(@RequestBody AWSContentUsageDTO awsContentUsageDTO) {
        try {

            ContentUsageHistory content = null;

            if (awsContentUsageDTO != null) {

//                if (awsContentUsageDTO.getAccess_url() != null && awsContentUsageDTO.getAccess_url() != "") {
//                    content = historyService.findByAccessUrl(awsContentUsageDTO.getAccess_url());
//                }
//                if (content != null) {
//                    content = initializeContent(awsContentUsageDTO, content, false);
//                    content = historyService.update(content);
//                    content.setSuccess(true);
//                    content.setMessage("Content History Updated");
//                } else {
                content = new ContentUsageHistory();
                content = initializeContent(awsContentUsageDTO, content, true);
                content = historyService.create(content);
                content.setSuccess(true);
                content.setMessage("Content History Added");
//                }
            } else {
                content = new ContentUsageHistory();
                content.setSuccess(false);
                content.setMessage("No data available");
            }

            return new ResponseEntity<>(content, HttpStatus.OK);

        } catch (Exception e) {
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    private ContentUsageHistory initializeContent(final AWSContentUsageDTO awsContentUsageDTO, ContentUsageHistory content, boolean isCreate) {

        content.setUser_id(awsContentUsageDTO.getUser_id());
        content.setContent_id(awsContentUsageDTO.getContent_id());
        content.setEmail(awsContentUsageDTO.getEmail());
        content.setContentTitle(awsContentUsageDTO.getContentTitle());
        content.setBytesDownloaded(awsContentUsageDTO.getBytesDownloaded());
        content.setBytesUploaded(awsContentUsageDTO.getBytesUploaded());
        content.setAccess_url(awsContentUsageDTO.getAccess_url());
        content.setAccessed_datetime(DateHelper.getCurrentDate());
        content.setReferrer(awsContentUsageDTO.getReferrer());

        if (isCreate) {
            content.setCreated_at(DateHelper.getCurrentDate());
        }
        content.setUpdated_at(DateHelper.getCurrentDate());
        return content;
    }

    @RequestMapping(value = "aws/content/logUsage", method = RequestMethod.POST)
    @Consumes("text/plain")
    @Produces("text/plain")
    public ResponseEntity<?> awsCallback(@RequestBody String notificationString) {
        try {

            logger.info(notificationString);
            Notification allNotification =  new ObjectMapper().readValue(notificationString, Notification.class);

            if(allNotification.getType().toLowerCase().equals("subscriptionconfirmation")) {
                String response = RESTHelper.restRequest(allNotification.getSubscribeURL(), "GET", null, null, null);
                logger.info("subscriptionconfirmation response");
                logger.info(response);
            } else {
                AWSContentUsageDTO contentUsageDTO = new ObjectMapper().readValue(allNotification.getMessage().toString(), AWSContentUsageDTO.class);
                logger.info(contentUsageDTO.getAccess_url());
                final String url = parseAccessUrl(contentUsageDTO.getAccess_url());
                final ContentUsageHistory contentHistory = historyService.findByAccessUrl(url);
                if(contentHistory != null) {
                    contentHistory.setAccessed(true);
                    contentHistory.setBytesDownloaded(contentUsageDTO.getBytesDownloaded());
                    contentHistory.setAccessed_datetime(DateHelper.getCurrentDate());
                    historyService.update(contentHistory);
                }
            }
            return null;
        } catch (Exception e) {
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    private String parseAccessUrl(String accessUrl) {
        accessUrl = accessUrl.replace("GET /output/", "/output/");
        accessUrl = accessUrl.substring(0, accessUrl.indexOf("&X-Amz-Signature"));
        accessUrl = ".*\\Q"+accessUrl+"\\E.*";
        return accessUrl;
    }

    @RequestMapping(value = "admin/session/content_usage/by_user/{from_date}/{to_date}/{search_bydate}", method = RequestMethod.GET)
    public ResponseEntity<?> getContentUsageHistoryByUser(@PathVariable Date from_date, @PathVariable Date to_date, @PathVariable Boolean search_bydate) {
        try {

            List<AWSContentUsageDTO> awsContentUsageDTOList = historyService.findContentUsageHistoryByUsers(from_date, to_date, search_bydate);

            return new ResponseEntity<>(awsContentUsageDTOList, HttpStatus.OK);

        } catch (Exception e) {
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = "admin/session/content_usage/by_movie/{from_date}/{to_date}/{search_bydate}", method = RequestMethod.GET)
    public ResponseEntity<?> getContentUsageHistoryByMovie(@PathVariable Date from_date, @PathVariable Date to_date, @PathVariable Boolean search_bydate) {
        try {

            List<AWSContentUsageDTO> awsContentUsageDTOList = historyService.findContentUsageHistoryByMovie(from_date, to_date, search_bydate);

            return new ResponseEntity<>(awsContentUsageDTOList, HttpStatus.OK);

        } catch (Exception e) {
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = "admin/session/content_usage/total/{from_date}/{to_date}/{search_bydate}", method = RequestMethod.GET)
    public ResponseEntity<?> getContentUsageHistoryTotal(@PathVariable Date from_date, @PathVariable Date to_date, @PathVariable Boolean search_bydate) {
        try {

            List<AWSContentUsageDTO> awsContentUsageDTOList = historyService.findContentUsageHistoryByDate(from_date, to_date, search_bydate);

            return new ResponseEntity<>(awsContentUsageDTOList, HttpStatus.OK);

        } catch (Exception e) {
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }
}
