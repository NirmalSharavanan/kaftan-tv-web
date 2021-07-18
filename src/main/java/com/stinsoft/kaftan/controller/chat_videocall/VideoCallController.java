package com.stinsoft.kaftan.controller.chat_videocall;

import com.stinsoft.kaftan.controller.BaseController;
import com.stinsoft.kaftan.dto.chat_videocall.ChatHistoryDTO;
import com.stinsoft.kaftan.dto.chat_videocall.VideoCallDTO;
import com.stinsoft.kaftan.messages.ExceptionMessages;
import com.stinsoft.kaftan.model.chat_videocall.ChatHistory;
import com.stinsoft.kaftan.model.chat_videocall.VideoCall;
import com.stinsoft.kaftan.service.chat_videocall.ChatHistoryService;
import com.stinsoft.kaftan.service.chat_videocall.VideoCallService;
import org.apache.commons.collections4.ListUtils;
import org.bson.types.ObjectId;
import org.json.JSONObject;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ss.core.dto.SecureEndUserDTO;
import ss.core.helper.DateHelper;
import ss.core.messages.UserAppMessages;
import ss.core.model.Customer;
import ss.core.model.User;
import ss.core.model.mobile.PushRegistration;
import ss.core.security.service.ISessionService;

import com.opentok.OpenTok;
import com.opentok.MediaMode;
import com.opentok.Session;
import com.opentok.SessionProperties;
import com.opentok.TokenOptions;
import com.opentok.Role;
import ss.core.service.BasicUserService;
import ss.core.service.mobile.PushRegistrationService;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.stream.Collectors;

@RestController
@RequestMapping("api/session/")
public class VideoCallController extends BaseController {

    Logger logger = LoggerFactory.getLogger(this.getClass());

    @Autowired
    VideoCallService videoCallService;

    @Autowired
    ChatHistoryService chatHistoryService;

    @Autowired
    BasicUserService userService;

    @Autowired
    ISessionService sessionService;

    @Autowired
    PushRegistrationService pushRegistrationService;

    @Value("${videoCall.apiKey}")
    private int apiKey;

    @Value("${videoCall.apiSecret}")
    private String apiSecret;

    @Value("${notification.authkey}")
    private String authKey;

    // Create video call session for user
    @RequestMapping(value = "videocall/create/{subscriber_id}", method = RequestMethod.POST)
    public ResponseEntity<?> create(@PathVariable String subscriber_id) {
        try {

            User user = sessionService.getUser();

            VideoCall videoCall = null;
            List<VideoCall> publisherList = null;
            String sessionId = null;
            String token = null;

            if(user != null) {

                User subscriber = userService.find(new ObjectId(subscriber_id));

                if(subscriber != null) {

                    publisherList = videoCallService.findByPublisher(user.getId(), true);

                    if(publisherList != null && publisherList.size() > 0) {

                        for(VideoCall call : publisherList) {
                            call.setActive(false);
                            videoCallService.update(call.getId(), call);
                        }
                    }

                    videoCall = videoCallService.findByClientsId(user.getId(), new ObjectId(subscriber_id));

                    if(videoCall != null) {  // If publisher and subscriber already exists

                        if( (TimeUnit.MILLISECONDS.toDays(DateHelper.getCurrentDate().getTime() - videoCall.getToken_updated_at().getTime())) < 30 ) { // If token is alive
                            videoCall.setActive(false);
                            videoCall = videoCallService.update(videoCall.getId(), videoCall);

                        } else { // If token expired generate new token

                            VideoCall callDetails = null;
                            callDetails = generateToken(videoCall.getSession_id(), user);

                            if(callDetails != null) {
                                videoCall.setToken(callDetails.getToken());
                                videoCall.setActive(false);
                                videoCall.setToken_updated_at(DateHelper.getCurrentDate());
                                videoCall = videoCallService.update(videoCall.getId(), videoCall);
                            }
                        }

                        if(videoCall != null) {
                            videoCall.setSuccess(true);
                            videoCall.setMessage(UserAppMessages.VIDEOCALL_CHATROOM_UPDATED);
                            return new ResponseEntity<>(videoCall, HttpStatus.OK);
                        } else {
                            videoCall.setSuccess(false);
                            videoCall.setMessage(ExceptionMessages.UNEXPECTED_MESSAGE);
                            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
                        }

                    } else { // If publisher and subscriber not exists

                        VideoCall callDetails = null;
                        callDetails = generateToken(sessionId, user);

                        if(callDetails != null) {
                            videoCall = new VideoCall();
                            videoCall.setPublisher_id(user.getId());
                            videoCall.setSubscriber_id(new ObjectId(subscriber_id));
                            videoCall.setSession_id(callDetails.getSession_id());
                            videoCall.setToken(callDetails.getToken());
                            videoCall.setActive(false);
                            videoCall.setToken_updated_at(DateHelper.getCurrentDate());
                            videoCall = videoCallService.create(videoCall);

                            if(videoCall != null) {
                                videoCall.setSuccess(true);
                                videoCall.setMessage(UserAppMessages.VIDEOCALL_CHATROOM_CREATED);
                                return new ResponseEntity<>(videoCall, HttpStatus.OK);
                            } else {
                                videoCall.setSuccess(false);
                                videoCall.setMessage(ExceptionMessages.UNEXPECTED_MESSAGE);
                                return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
                            }

                        } else {
                            videoCall.setSuccess(false);
                            videoCall.setMessage(ExceptionMessages.UNEXPECTED_MESSAGE);
                            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
                        }
                    }

                } else {
                    videoCall.setSuccess(false);
                    videoCall.setMessage(UserAppMessages.SUBSCRIBER_NOT_FOUND);
                    return new ResponseEntity<>(UserAppMessages.SUBSCRIBER_NOT_FOUND, HttpStatus.BAD_REQUEST);
                }

            }
            return new ResponseEntity<>(videoCall, HttpStatus.OK);

        } catch (Exception e) {
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    private VideoCall generateToken(String sessionId, User user) {

        try {

            Integer videoCallApiKey = null;
            String videoCallApiSecret = null;
            VideoCall videoCall = new VideoCall();
            Customer customer = sessionService.getUser().getCustomer();
            if (customer != null && customer.getVideoCalling() != null) {
                videoCallApiKey = Integer.parseInt(customer.getVideoCalling().getApiKey());
                videoCallApiSecret = customer.getVideoCalling().getApiSecret();
            } else {
                videoCallApiKey = apiKey;
                videoCallApiSecret = apiSecret;
            }

            OpenTok opentok = new OpenTok(videoCallApiKey, videoCallApiSecret);

            String token = null;

            if (sessionId == null) {

                Session session = opentok.createSession(new SessionProperties.Builder()
                        .mediaMode(MediaMode.ROUTED)
                        .build());
                sessionId = session.getSessionId();
            }
            TokenOptions tokenOpts = new TokenOptions.Builder()
                    .role(Role.PUBLISHER)
                    .expireTime((System.currentTimeMillis() / 1000) + (30 * 24 * 60 * 60)) // in one month
                    .data("username=" + user.getName())
                    .build();

            token = opentok.generateToken(sessionId, tokenOpts);

            opentok.close();

            videoCall.setToken(token);
            videoCall.setSession_id(sessionId);
            return videoCall;

        } catch (Exception e) {
            return null;
        }
    }

    // Check Subscriber is busy with another call or not
    @RequestMapping(value = "videocall/checkAvailble/{subscriber_id}", method = RequestMethod.GET)
    public ResponseEntity<?> checkSubscriber(@PathVariable String subscriber_id) {

        try{
            User user = sessionService.getUser();

            VideoCall videoCall = null;
            VideoCall subscriberList = null;

            if(user != null) {
                subscriberList = videoCallService.findBySubscriber(new ObjectId(subscriber_id), true);

                videoCall = videoCallService.findByClientsId(user.getId(), new ObjectId(subscriber_id));

                if(subscriberList == null) {

                      if(videoCall != null) {
                          videoCall.setActive(true);
                          videoCall = videoCallService.update(videoCall.getId(), videoCall);

                          sendNotification(new ObjectId(subscriber_id), user, true);

                          if(videoCall != null) {
                              videoCall.setSuccess(true);
                              videoCall.setMessage(UserAppMessages.SUBSCRIBER_AVAILABLE);
                          }
                      }
                  } else {
                    if(videoCall != null) {

                        if (videoCall.getId().equals(subscriberList.getId())) {
                            videoCall.setActive(true);
                            videoCall = videoCallService.update(videoCall.getId(), videoCall);

                            if(videoCall != null) {
                                videoCall.setSuccess(true);
                                videoCall.setMessage(UserAppMessages.SUBSCRIBER_AVAILABLE);
                            }
                        } else {
                            videoCall = new VideoCall();
                            videoCall.setSuccess(false);
                            videoCall.setMessage(UserAppMessages.SUBSCRIBER_BUSY);
                        }
                    } else {
                        videoCall = new VideoCall();
                        videoCall.setSuccess(false);
                        videoCall.setMessage(UserAppMessages.SUBSCRIBER_BUSY);
                    }
                  }
            } else {
                videoCall = new VideoCall();
                videoCall.setSuccess(false);
                videoCall.setMessage(UserAppMessages.SUBSCRIBER_NOT_FOUND);
            }
            return new ResponseEntity<>(videoCall, HttpStatus.OK);

        } catch (Exception e) {
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    // Send notification when initiate video call
    private String sendNotification(ObjectId subscriber_id, User user, boolean call_status) {

        try {
            String androidFcmKey = null;
            if( user != null ) {
                Customer customer = sessionService.getUser().getCustomer();
                if (customer != null && customer.getCloudMessaging() != null) {
                    androidFcmKey = customer.getCloudMessaging().getAuthKey();
                } else {
                    androidFcmKey = authKey;
                }
                String title = user.getName();
                String notification_message = null;
                if(call_status) {
                    notification_message = "Incoming video call";
                } else {
                    notification_message = "Missed video call";
                }

                String androidFcmUrl="https://fcm.googleapis.com/fcm/send";

                List<String> registrationIdList = new ArrayList<>();
                List<PushRegistration> pushRegistrationList = new ArrayList<>();
                pushRegistrationList = pushRegistrationService.findByUser(subscriber_id);

                if(pushRegistrationList != null && pushRegistrationList.size() > 0) {

                    registrationIdList = pushRegistrationList.stream()
                            .filter(deviceId -> deviceId.getDeviceRegistrationId() != null && deviceId.getDeviceRegistrationId().length() > 0)
                            .map(pushRegistration -> pushRegistration.getDeviceRegistrationId())
                            .distinct()
                            .collect(Collectors.toList());
                }

                if(registrationIdList != null && registrationIdList.size() > 0) {

                    List<List<String>> registrationDeviceId = ListUtils.partition(registrationIdList, 900);

                    for(int i = 0 ; i < registrationDeviceId.size() ; i++) {

                        URL url = new URL(androidFcmUrl);
                        HttpURLConnection conn;
                        conn = (HttpURLConnection) url.openConnection();
                        conn.setUseCaches(false);
                        conn.setDoInput(true);
                        conn.setDoOutput(true);
                        conn.setRequestMethod("POST");
                        conn.setRequestProperty("Authorization","key="+androidFcmKey);
                        conn.setRequestProperty("Content-Type","application/json");

                        JSONObject body = new JSONObject();
                        body.put("registration_ids", registrationDeviceId.get(i));
                        body.put("priority", "high");
                        body.put("content_available", true);

                        JSONObject notification = new JSONObject();
                        notification.put("title", title);
                        notification.put("body", notification_message);
                        notification.put("icon", "ic_notif");
                        if(call_status) {
                            notification.put("sound", "CallTone.m4r");
                        } else {
                            notification.put("sound", "default");
                        }
                        body.put("notification", notification);

                        JSONObject data = new JSONObject();
                        data.put("title", title);
                        data.put("message", notification_message);
                        data.put("icon", "ic_notif");
                        body.put("data", data);


                        OutputStreamWriter wr = new OutputStreamWriter(conn.getOutputStream());
                        wr.write(body.toString());
                        wr.flush();
                        int status = 0;
                        if( null != conn ) {
                            status = conn.getResponseCode();
                        }
                        if( status != 0) {
                            if (status == 200) {
                                BufferedReader reader = new BufferedReader(new InputStreamReader(conn.getInputStream()));
                            }
                        }
                    }
                }
            }
            return "Success";
        } catch (Exception e) {
            return "Fail";
        }
    }

    // Check if any incoming call is received by user
    @RequestMapping(value = "videocall/incoming", method = RequestMethod.GET)
    public ResponseEntity<?> checkIncoming() {
        try {
            User user = sessionService.getUser();

            VideoCall videoCall = null;
            VideoCallDTO videoCallDTO = null;

            if(user != null) {
               videoCall = videoCallService.findBySubscriber(user.getId(), true);

               if(videoCall != null) {

                   ModelMapper modelMapper = new ModelMapper();
                   videoCallDTO   = modelMapper.map(videoCall, VideoCallDTO.class);

                   User userdetails = null;

                   if(videoCall.getPublisher_id().equals(user.getId())) {
                       userdetails = userService.find(videoCall.getSubscriber_id());
                   } else {
                       userdetails = userService.find(videoCall.getPublisher_id());
                   }

                   if(userdetails != null) {
                       modelMapper = new ModelMapper();
                       SecureEndUserDTO  secureEndUserDTO = modelMapper.map(userdetails, SecureEndUserDTO.class);
                       videoCallDTO.setSecureEndUserDTO(secureEndUserDTO);
                   }
                   videoCallDTO.setSuccess(true);
                   videoCallDTO.setMessage(UserAppMessages.INCOMING_CALL_RECEIVED);
               } else {
                   videoCallDTO = new VideoCallDTO();
                   videoCallDTO.setSuccess(false);
                   videoCallDTO.setMessage(UserAppMessages.SUBSCRIBER_NOT_FOUND);
               }

            } else {
                videoCallDTO = new VideoCallDTO();
                videoCallDTO.setSuccess(false);
                videoCallDTO.setMessage(UserAppMessages.SUBSCRIBER_NOT_FOUND);

            }
            return new ResponseEntity<>(videoCallDTO, HttpStatus.OK);

        } catch (Exception e) {
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }


    @RequestMapping(value = "videocall/endCall/{id}/{inProgress}", method = RequestMethod.PUT)
    public ResponseEntity<?> updateCallEnd(@PathVariable String id, @PathVariable boolean inProgress) {
        try {

            User user = sessionService.getUser();

            VideoCall videoCall = null;
            ObjectId subscriber_id = null;

            if(user != null) {

               videoCall = videoCallService.findById(new ObjectId(id));

               if(videoCall != null) {

                   if(!inProgress) {
                       if(videoCall.getPublisher_id().equals(user.getId())) {
                           subscriber_id = videoCall.getSubscriber_id();
                       }
                       if(videoCall.getSubscriber_id().equals(user.getId())) {
                           subscriber_id = videoCall.getPublisher_id();
                       }

                       if(subscriber_id != null) {
                           sendNotification(subscriber_id, user, false);
                       }
                   }

                   videoCall.setActive(false);
                   videoCall = videoCallService.update(videoCall.getId(), videoCall);

                   if(videoCall != null) {
                       videoCall.setSuccess(true);
                       videoCall.setMessage(UserAppMessages.VIDEOCALL_CHATROOM_UPDATED);
                   } else {
                       videoCall.setSuccess(false);
                       videoCall.setMessage(ExceptionMessages.UNEXPECTED_MESSAGE);
                       return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
                   }
               } else {
                   videoCall.setSuccess(false);
                   videoCall.setMessage(ExceptionMessages.UNEXPECTED_MESSAGE);
                   return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
               }

            } else {
                videoCall.setSuccess(false);
                videoCall.setMessage(ExceptionMessages.UNEXPECTED_MESSAGE);
                return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
            }
            return new ResponseEntity<>(videoCall, HttpStatus.OK);

        } catch (Exception e) {
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    // Video call histroy
    @RequestMapping(value = "videocall/history", method = RequestMethod.GET)
    public ResponseEntity<?> videoCallHistory() {

        try{
            User user = sessionService.getUser();

            List<VideoCallDTO> chatHistory=null;

            if(user != null) {
                chatHistory = videoCallService.findVideoCallHistory(user.getId());

                if(chatHistory.size() > 0) {
                    chatHistory = chatHistory.stream()
                            .filter( distinctByKey(p -> p.getId()) )
                            .collect( Collectors.toList() );

                }
            }
            return new ResponseEntity<>(chatHistory, HttpStatus.OK);

        } catch (Exception e) {
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    public static <T> Predicate<T> distinctByKey(Function<? super T, Object> keyExtractor) {
        Map<Object, Boolean> map = new ConcurrentHashMap<>();
        return t -> map.putIfAbsent(keyExtractor.apply(t), Boolean.TRUE) == null;
    }

    // Video Call connection status
    @RequestMapping(value = "videocall/status/{history_id}/{isConnected}", method = RequestMethod.PUT)
    public ResponseEntity<?> videoCallStatus(@PathVariable String history_id, @PathVariable boolean isConnected) {

        try {

            User user = sessionService.getUser();

            ChatHistory chat = null;

            if(user != null) {

                chat = chatHistoryService.findById(new ObjectId(history_id));

                if(chat != null) {
                    if(isConnected) {
                        chat.setConnected(true);
                        chat.setCall_connected_at(DateHelper.getCurrentDate());
                        chat = chatHistoryService.update(chat.getId(), chat);

                    } else {
                        chat.setCall_disconnected_at(DateHelper.getCurrentDate());
                        chat = chatHistoryService.update(chat.getId(), chat);
                    }
                    if(chat != null) {
                        chat.setSuccess(true);
                        chat.setMessage(UserAppMessages.CHAT_CREATED);
                    } else {
                        chat.setSuccess(false);
                        chat.setMessage(ExceptionMessages.UNEXPECTED_MESSAGE);
                        return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
                    }
                } else {
                    chat.setSuccess(false);
                    chat.setMessage(ExceptionMessages.UNEXPECTED_MESSAGE);
                    return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
                }

            } else {
                chat.setSuccess(false);
                chat.setMessage(ExceptionMessages.UNEXPECTED_MESSAGE);
                return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
            }

            return new ResponseEntity<>(chat, HttpStatus.OK);

        } catch (Exception e) {
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    // Create chat history based on users
    @RequestMapping(value = "chat/create/{videoCall_id}/{isTextChat}", method = RequestMethod.POST)
    public ResponseEntity<?> createChat(@PathVariable String videoCall_id, @PathVariable boolean isTextChat, @RequestBody ChatHistoryDTO chatHistoryDTO) {
        try{
            User user = sessionService.getUser();

            VideoCall videoCall = null;
            ChatHistory chat = null;

            if(user != null) {
                videoCall = videoCallService.findById(new ObjectId(videoCall_id));

                if(videoCall != null) {

                    chat = new ChatHistory();
                    chat.setVideoCall_id(videoCall.getId());
                    chat.setFrom_user(user.getId());
                    if(videoCall.getPublisher_id().equals(user.getId())) {
                        chat.setTo_user(videoCall.getSubscriber_id());
                    }
                    if(videoCall.getSubscriber_id().equals(user.getId())) {
                        chat.setTo_user(videoCall.getPublisher_id());
                    }
                    if(isTextChat) {  // create text chat history
                        chat.setTextChat(true);
                        chat.setText(chatHistoryDTO.getText());
                    } else {  // create call history
                        chat.setTextChat(false);
                    }

                    chat.setRead(false);

                    chat = chatHistoryService.create(chat);

                    if(chat != null) {
                        chat.setSuccess(true);
                        chat.setMessage(UserAppMessages.CHAT_CREATED);
                        return new ResponseEntity<>(chat, HttpStatus.OK);
                    } else {
                        chat.setSuccess(false);
                        chat.setMessage(ExceptionMessages.UNEXPECTED_MESSAGE);
                        return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
                    }
                }
            }
            return new ResponseEntity<>(chat, HttpStatus.OK);

        } catch (Exception e) {
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    // Fetch Chat history
    @RequestMapping(value = "chat/history/{videoCall_id}/{isTextChat}", method = RequestMethod.GET)
    public ResponseEntity<?> textChatHistory(@PathVariable String videoCall_id, @PathVariable boolean isTextChat) {
        try{
            User user = sessionService.getUser();

            List<ChatHistory> chatHistory = null;

            if(user != null) {
                chatHistory = chatHistoryService.findByUser(new ObjectId(videoCall_id), isTextChat);
            }
            return new ResponseEntity<>(chatHistory, HttpStatus.OK);

        } catch (Exception e) {
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = "chat/delete/{history_id}", method = RequestMethod.DELETE)
    public ResponseEntity<?> deleteChat(@PathVariable String history_id) {

        try {
            User user = sessionService.getUser();

            ChatHistory chatHistory = null;

            if(user != null) {
                chatHistory = chatHistoryService.findById(new ObjectId(history_id));

                if(chatHistory != null) {
                    chatHistoryService.delete(chatHistory.getId());
                    chatHistory.setSuccess(true);
                    chatHistory.setMessage(UserAppMessages.CHAT_DELETED);
                } else {
                    chatHistory = new ChatHistory();
                    chatHistory.setSuccess(false);
                    chatHistory.setMessage(UserAppMessages.CHAT_NOT_FOUND);
                }
            }
            return new ResponseEntity<>(chatHistory, HttpStatus.OK);

        } catch (Exception e) {
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }
}
