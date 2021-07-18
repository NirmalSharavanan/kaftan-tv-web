package com.stinsoft.kaftan.controller;

import com.stinsoft.kaftan.dto.ContentWatchHistoryDTO;
import com.stinsoft.kaftan.messages.ExceptionMessages;
import com.stinsoft.kaftan.model.ContentWatchHistory;
import com.stinsoft.kaftan.service.ContentService;
import com.stinsoft.kaftan.service.ContentWatchHistoryService;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import ss.core.model.User;
import ss.core.security.service.ISessionService;


@RestController
@RequestMapping("api/")
public class ContentWatchHistoryController extends BaseController {

    Logger logger = LoggerFactory.getLogger(this.getClass());

    @Autowired
    ContentWatchHistoryService service;

    @Autowired
    ContentService contentService;

    @Autowired
    ISessionService sessionService;

    @RequestMapping(value = "session/user/create/content_watch_history", method = RequestMethod.POST)
    public ResponseEntity<?> updateContentWatchHistory(@RequestBody ContentWatchHistoryDTO watchHistoryDTO) {
        try {

            User user = sessionService.getUser();
            ContentWatchHistory watchHistory = null;

            if (user != null) {

                if (watchHistoryDTO != null) {

                    watchHistory = service.findByUserId(user.getId(), new ObjectId(watchHistoryDTO.getContent_id()));
                    if (watchHistory != null) {

                        watchHistory = initializeContent(true, watchHistoryDTO, watchHistory);
                        watchHistory = service.update(watchHistory);
                        watchHistory.setSuccess(true);
                        watchHistory.setMessage("Content watch history updated!");
                    }
                    else {
                        watchHistory = new ContentWatchHistory();
                        watchHistory = initializeContent(false, watchHistoryDTO, watchHistory);
                        watchHistory = service.create(watchHistory);
                        watchHistory.setSuccess(true);
                        watchHistory.setMessage("Content watch history added!");
                    }
                }
                else {
                    watchHistory = new ContentWatchHistory();
                    watchHistory.setSuccess(false);
                    watchHistory.setMessage("Error in add content watch history!");
                }
            }
            return new ResponseEntity<>(watchHistory, HttpStatus.OK);

        } catch (Exception e) {
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    private ContentWatchHistory initializeContent(boolean isUpdate, final ContentWatchHistoryDTO watchHistoryDTO, ContentWatchHistory watchHistory) {
        if(isUpdate) {
            watchHistory.setCurrentTime(watchHistoryDTO.getCurrentTime());
            watchHistory.setInProgress(watchHistoryDTO.isInProgress());
        }
        else {
            watchHistory.setUser_id(sessionService.getUser().getId());
            watchHistory.setContent_id(new ObjectId(watchHistoryDTO.getContent_id()));
            watchHistory.setCurrentTime(watchHistoryDTO.getCurrentTime());
            watchHistory.setTotalTime(watchHistoryDTO.getTotalTime());
            watchHistory.setInProgress(watchHistoryDTO.isInProgress());
        }
        return watchHistory;
    }


}
