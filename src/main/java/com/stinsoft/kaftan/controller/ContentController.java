package com.stinsoft.kaftan.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.stinsoft.kaftan.service.*;
import com.stinsoft.kaftan.dto.*;
import com.stinsoft.kaftan.messages.AppMessages;
import com.stinsoft.kaftan.messages.ExceptionMessages;
import com.stinsoft.kaftan.model.*;
import com.stinsoft.kaftan.model.ContentDTO;

import org.apache.commons.collections.map.HashedMap;
import org.apache.commons.lang3.StringUtils;
import org.modelmapper.ModelMapper;
import org.springframework.mobile.device.Device;
import ss.core.aws.transcoder.JobStatusNotification;
import ss.core.aws.transcoder.Notification;
import ss.core.dto.VideoPlayInfo;
import ss.core.dto.VideoPlayWrapper;
import ss.core.helper.*;
import ss.core.model.PlayList;
import ss.core.model.payments.PaymentCompleted;
import ss.core.service.BasicUserService;
import ss.core.service.CustomerService;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ss.core.aws.AWSInfo;
import ss.core.aws.S3Service;
import ss.core.model.Customer;
import ss.core.model.Response;
import ss.core.model.User;
import ss.core.security.service.ISessionService;

import javax.ws.rs.Consumes;
import javax.ws.rs.Produces;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("api/")
public class ContentController extends BaseController {

    @Autowired
    ContentService contentService;

    @Autowired
    CustomerService customerService;

    @Autowired
    ISessionService sessionService;

    @Autowired
    CategoryService categoryService;

    @Autowired
    BlogService blogService;

    @Autowired
    ContentWatchHistoryService watchHistoryService;

    @Autowired
    CounterHelper counterHelper;

    @Autowired
    S3Service s3Service;

    @Autowired
    ConfigHelper configHelper;

    @Autowired
    BasicUserService userService;

    @Autowired
    ContentUsageHistoryService historyService;

    @Autowired
    UserSubscriptionService userSubscriptionService;

    @Value("${aws.cloudfront.certificateId}")
	private String certificateId;

	@Value("${aws.cloudfront.distributionDomain}")
	private String distributionDomain;

    Logger logger = LoggerFactory.getLogger(this.getClass());

    /****************************************************
     * ADMIN API START
     **************************************************** */


    @RequestMapping(value = "admin/session/content/create", method = RequestMethod.POST)
    public ResponseEntity<?> create(@RequestBody final ContentDTO contentDTO) {
        try {

            Content content = new Content();
            content = initializeContent(contentDTO, content, true);
            content.setSort_order(counterHelper.getNextSequence(Content.class.getName() + "_" + sessionService.getUser().getCustomer_id().toString()));
            content = contentService.create(content);

            if (content != null) {
                if (contentDTO.getCategoryList() != null && contentDTO.getCategoryList().length > 0) {
                    content = addCategoryToContent(content, contentDTO.getCategoryList());
                }
                content.setSuccess(true);
                content.setMessage(AppMessages.CONTENT_CREATED);
            } else {
                content = new Content();
                content.setSuccess(false);
                content.setMessage(ExceptionMessages.CONTENT_CREATE_ERROR);
            }
            return new ResponseEntity<>(content, HttpStatus.OK);

        } catch (Exception e) {
            logger.error(ExceptionMessages.UNEXPECTED_MESSAGE, e);
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = "admin/session/content/banner/{contentId}", method = RequestMethod.PUT)
    public ResponseEntity<?> updateBanner(@PathVariable String contentId,
                                          @RequestParam("bannerImage") MultipartFile bannerImage,
                                          @RequestParam(value = "isCompress", required = false, defaultValue = "true") boolean isCompress) {
        try {
            Content content = contentService.find(contentId);
            if (content != null) {
                content = contentService.updateBannerImage(content.getId(), bannerImage, isCompress);
                content.setSuccess(true);
                content.setMessage(AppMessages.CONTENT_UPDATED);
            } else {
                content = new Content();
                content.setSuccess(false);
                content.setMessage(AppMessages.CONTENT_NOT_EXISTS);
            }
            return new ResponseEntity<>(content, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = "admin/session/content/thumbnail/{contentId}", method = RequestMethod.PUT)
    public ResponseEntity<?> updateThumbnail(@PathVariable String contentId,
                                             @RequestParam("thumbnailImage") MultipartFile thumbnailImage,
                                             @RequestParam(value = "isCompress", required = false, defaultValue = "true") boolean isCompress) {
        try {
            Content content = contentService.find(contentId);
            if (content != null) {
                content = contentService.updateThumbnailImage(content.getId(), thumbnailImage, isCompress);
                content.setSuccess(true);
                content.setMessage(AppMessages.CONTENT_UPDATED);
            } else {
                content = new Content();
                content.setSuccess(false);
                content.setMessage(AppMessages.CONTENT_NOT_EXISTS);
            }
            return new ResponseEntity<>(content, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = "admin/session/content/web/{contentId}", method = RequestMethod.PUT)
    public ResponseEntity<?> updateWebVideoAudio(@PathVariable String contentId, @RequestParam("thumbnailImage") MultipartFile multipartFile) {
        try {
            Content content = contentService.find(contentId);
            if (content != null) {
                content = contentService.updateWebVideoAudio(content.getId(), multipartFile);
                content.setSuccess(true);
                content.setMessage(AppMessages.CONTENT_UPDATED);
            } else {
                content = new Content();
                content.setSuccess(false);
                content.setMessage(AppMessages.CONTENT_NOT_EXISTS);
            }
            return new ResponseEntity<>(content, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = "admin/session/content/trailer/{contentId}", method = RequestMethod.PUT)
    public ResponseEntity<?> updatTrailerVideoAudio(@PathVariable String contentId, @RequestParam("thumbnailImage") MultipartFile multipartFile) {
        try {
            Content content = contentService.find(contentId);
            if (content != null) {
                content = contentService.updateTrailerVideoAudio(content.getId(), multipartFile);
                content.setSuccess(true);
                content.setMessage(AppMessages.CONTENT_UPDATED);
            } else {
                content = new Content();
                content.setSuccess(false);
                content.setMessage(AppMessages.CONTENT_NOT_EXISTS);
            }
            return new ResponseEntity<>(content, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    /*
    Get content with all parent content details, category, genre, celebrity etc
     */
    @RequestMapping(value = "admin/session/content/{contentId}",method = RequestMethod.GET)
    public ResponseEntity<?> getContentForAdmin(@PathVariable String contentId){
        try{
            Content content = contentService.find(contentId);
            if (content != null) {

                Resource<Content> resource = null;

                Customer customer = null;
                boolean isSecure = false;

                if (sessionService.getUser() != null) {
                    //isSecure = true; //Is Sescure to play has seperate API
                    customer = sessionService.getUser().getCustomer();
                } else {
                    customer = customerService.find(content.getCustomer_id());
                }

                //if there is parent content attach them
                if (content.getParent_content_id() != null) {
                    attachParentContent(content);
                }

                //Handled this id browser itself to get from cache

//                if(content.getCategoryList() != null && content.getCategoryList().size() > 0) {
//
//                    List<Category> categoryList = categoryService.findMultiple(content.getCustomer_id(), content.getCategoryList());
//                    List<CategoryDTO> categoryDTOList = new ArrayList<>();
//                    CategoryDTO categoryDTO = new CategoryDTO();
//
//                    if(categoryList != null) {
//
//                        for(Category category: categoryList) {
//                            categoryDTO = new CategoryDTO();
//                            categoryDTO.setName(category.getName());
//                            categoryDTO.setUrl(getUICategoryPath(category.getId().toString()));
//                            categoryDTOList.add(categoryDTO);
//                        }
//
//                        content.setCategoryDTOList(categoryDTOList);
//
//                    }
//                }

                resource = getContentResource(content, customer, isSecure);
                appendAWSPlayInfo(resource, content, customer.getAws_bucket(), true);
                return new ResponseEntity<>(resource, HttpStatus.OK);
            }
            else{
                content = new Content();
                content.setSuccess(false);
                content.setMessage(AppMessages.CONTENT_NOT_EXISTS);
                logger.info(String.format("content not exists %s", content.getTitle()));
            }
            return new ResponseEntity<>(content, HttpStatus.OK);
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = "content/{contentId}",method = RequestMethod.GET)
    public ResponseEntity<?> getContent(@PathVariable String contentId){
        try{
            Content content = contentService.findByActiveDate(contentId, new Date());
            if (content != null) {

                Resource<Content> resource = null;
                Customer customer = null;
                boolean isSecure = false;

                if (sessionService.getUser() != null) {
                    //isSecure = true; //Is Sescure to play has seperate API
                    customer = sessionService.getUser().getCustomer();
                } else {
                    customer = customerService.find(content.getCustomer_id());
                }

                //if there is parent content attach them
                if (content.getParent_content_id() != null) {
                    attachParentContent(content);
                }

                //Handled this id browser itself to get from cache

//                if(content.getCategoryList() != null && content.getCategoryList().size() > 0) {
//
//                    List<Category> categoryList = categoryService.findMultiple(content.getCustomer_id(), content.getCategoryList());
//                    List<CategoryDTO> categoryDTOList = new ArrayList<>();
//                    CategoryDTO categoryDTO = new CategoryDTO();
//
//                    if(categoryList != null) {
//
//                        for(Category category: categoryList) {
//                            categoryDTO = new CategoryDTO();
//                            categoryDTO.setName(category.getName());
//                            categoryDTO.setUrl(getUICategoryPath(category.getId().toString()));
//                            categoryDTOList.add(categoryDTO);
//                        }
//
//                        content.setCategoryDTOList(categoryDTOList);
//
//                    }
//                }

                resource = getContentResource(content, customer, isSecure);
                appendAWSPlayInfo(resource, content, customer.getAws_bucket(), true);
                return new ResponseEntity<>(resource, HttpStatus.OK);
            }
            else{
                content = new Content();
                content.setSuccess(false);
                content.setMessage(AppMessages.CONTENT_NOT_EXISTS);
                logger.info(String.format("content not exists %s", content.getTitle()));
            }
            return new ResponseEntity<>(content, HttpStatus.OK);
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    //TODO: need to validate for pay per view
    //return multiple formats (720, 480 and 360)
    @RequestMapping(value = "session/content/watch/{contentId}/{generate}",method = RequestMethod.GET)
    public ResponseEntity<?> getContentAWSUrl(Device device, @PathVariable String contentId, @PathVariable boolean generate){
        try{
            Content content = contentService.findByActiveDate(contentId, new Date());

            VideoPlayWrapper videoPlayWrapper = new VideoPlayWrapper();;
            boolean addVideoUrl = false;

            //Condition to play
            // 1. Youtube link play directly
            // 2. if paid content, the if free for premium user, play
            // 3. if paid content, validate if user paid
            // 4. if premium customer and premium content allow play
            if (content != null) {

                User user = sessionService.getUser();
                List<UserSubscriptionDTO> userSubscriptions = null;
                String feature = "";
                boolean isPaid = false;
                if(content.getContent_type().equals("audio")) {
                    feature = "Audio On Demand";
                } else {
                    feature = "Video On Demand";
                }
                if (user != null) {
                    userSubscriptions = userSubscriptionService.findSubscriberByUser(user.getId());
                    if(userSubscriptions != null && userSubscriptions.size() > 0) {
                        if(userSubscriptions.get(0).getSubscriptionInfo().getFeatures().contains(feature)) {
                            isPaid = true;
                        } else {
                            isPaid = false;
                        }
                    } else {
                        isPaid = false;
                    }
                }
                if(content.is_premium() && (user.isIs_premium() || isPaid)) {
                    addVideoUrl = true;
                } else if (content.getPayperviewCategoryId() != null) {
                    Category category = categoryService.find(content.getPayperviewCategoryId());
                    if(category != null) {
                        if(user.isIs_premium() && category.getPremium_price() <= 0 ) {
                            addVideoUrl = true;
                        } else {
                            List<PaymentCompleted> paymentCompletedList = null;
                            if(user.getPaymentInfo() != null)
                                paymentCompletedList = user.getPaymentInfo().getPaymentCompletedList();
                            if(paymentCompletedList != null && paymentCompletedList.size() > 0) {
                                if(paymentCompletedList.stream().filter(o -> o.getProduct_reference_id().equals(content.getId().toString())).findFirst().isPresent()) {
                                    addVideoUrl = true;
                                }
                            }
                        }
                    }
                } else if(!content.is_premium()) {
                    addVideoUrl = true;
                }
//                else if(content.is_premium() && user.isIs_premium()) {
//                    addVideoUrl = true;
//                }
                else {
                    videoPlayWrapper = new VideoPlayWrapper();
                    videoPlayWrapper.setSuccess(false);
                    videoPlayWrapper.setMessage(AppMessages.NOT_PREMIUM_CUSTOMER);
                }

                if(addVideoUrl) {
                    boolean isSecure = true;
                    if(generate) {
                        videoPlayWrapper.setVideoPlayInfoList(getVideoPlayUrls(device, contentId, content, user));
                    }
                    videoPlayWrapper.setSuccess(true);
                }
            } else{
                videoPlayWrapper = new VideoPlayWrapper();
                videoPlayWrapper.setSuccess(false);
                videoPlayWrapper.setMessage(ExceptionMessages.INVALID_REQUEST);
                logger.info(String.format("content not exists %s", content.getTitle()));
            }

            return new ResponseEntity<>(videoPlayWrapper, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    private List<VideoPlayInfo> getVideoPlayUrls(Device device, String contentId, Content content, User user)
            throws Exception {
        List<VideoPlayInfo> videoPlayInfoList = new ArrayList<>();

        if(content.getContent_type().equals("audio")) {

            if(content.isHas_episode()) {
                List<Content> contentList = contentService.findChildContentByActiveDate(contentId, new Date());


                String bannerUrl = s3Service.getAWSUrl(content.getBanner_aws_info().getId(),user.getCustomer().getAws_bucket());
                String thumbnailUrl = s3Service.getAWSUrl(content.getThumbnail_aws_info().getId(),user.getCustomer().getAws_bucket());

                if(contentList != null){
                    contentList.forEach(con -> {
                        try {
                            VideoPlayInfo videoPlayInfo = getVideoUrl(device, con, user.getCustomer().getAws_bucket(), user);
                            videoPlayInfo.setAudioBanner(bannerUrl);
                            videoPlayInfo.setAudioThumbnail(thumbnailUrl);
                            videoPlayInfo.setTitle(con.getTitle());
                            videoPlayInfoList.add(videoPlayInfo);
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                    });
                }
            } else {

                Content parentContent = contentService.findByActiveDate(content.getParent_content_id().toString(), new Date());

                String bannerUrl = null;
                String thumbnailUrl = null;

                if(parentContent != null) {
                    bannerUrl = s3Service.getAWSUrl(parentContent.getBanner_aws_info().getId(),user.getCustomer().getAws_bucket());
                    thumbnailUrl = s3Service.getAWSUrl(parentContent.getThumbnail_aws_info().getId(),user.getCustomer().getAws_bucket());
                }

                VideoPlayInfo videoPlayInfo = getVideoUrl(device, content, user.getCustomer().getAws_bucket(), user);
                videoPlayInfo.setAudioBanner(bannerUrl);
                videoPlayInfo.setAudioThumbnail(thumbnailUrl);
                videoPlayInfo.setTitle(content.getTitle());
                videoPlayInfoList.add(videoPlayInfo);
            }

        } else {
            videoPlayInfoList.add(getVideoUrl(device, content, user.getCustomer().getAws_bucket(), user));
        }
        return videoPlayInfoList;
    }

    //Update will be common for all content parent content, episode and for all child content too
    @RequestMapping(value = "admin/session/content/update/{contentId}", method = RequestMethod.PUT)
    public ResponseEntity<?> update(@PathVariable String contentId, @RequestBody ContentDTO contentDTO) {
        try {
            Content content = contentService.find(contentId);
            if (content != null) {

                content = initializeContent(contentDTO, content, false);

                //remove content in all categories
                if (content.getCategoryList() != null && content.getCategoryList().size() > 0) {

                    List<ObjectId> contentCategoryList = content.getCategoryList();

                    ObjectId[] categoryIds = content.getCategoryList().toArray(new ObjectId[0]);
                    List<Category> categoryList = categoryService.findMany(sessionService.getUser().getCustomer_id(), categoryIds);
                    if (categoryList != null) {

                        //loop through and remove content to all the category
                        categoryList.forEach(category -> {

                            List<ContentOrder> contentOrderList = category.getContentOrderList();

                            //List to be removed from document
                            List<ContentOrder> contentOrderListToRemove = new ArrayList<>();

                            for (ContentOrder contentOrder : contentOrderList) {
                                if (contentOrder.getContent_id().equals(new ObjectId(contentId))) {
                                    contentOrderListToRemove.add(contentOrder);
                                }
                            }

                            contentOrderList.removeAll(contentOrderListToRemove);
                            category.setContentOrderList(contentOrderList);
                            category.setUpdated_at(DateHelper.getCurrentDate());
                            categoryService.update(category.getId(), category);

                            contentCategoryList.remove(category.getId());

                        });
                    }

                    //remove category in content
                    content.setCategoryList(contentCategoryList);
                }

                content = contentService.update(content);

                //update categories to content
                if (contentDTO.getCategoryList() != null && contentDTO.getCategoryList().length > 0) {
                    content = addCategoryToContent(content, contentDTO.getCategoryList());
                }

                Resource<Content> resource = null;
                Customer customer = sessionService.getUser().getCustomer();
                boolean isSecure = false;

                resource = getContentResource(content, customer, isSecure);
                appendAWSPlayInfo(resource, content, customer.getAws_bucket(), true);

                content.setSuccess(true);
                content.setMessage(AppMessages.CONTENT_UPDATED);
                return new ResponseEntity<>(resource, HttpStatus.OK);
            } else {
                content = new Content();
                content.setSuccess(false);
                content.setMessage(AppMessages.CONTENT_NOT_EXISTS);
                logger.info(String.format("content not exists %s", contentDTO.getTitle()));
            }
            return new ResponseEntity<>(content, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = "admin/session/content/delete/{contentId}", method = RequestMethod.DELETE)
    public ResponseEntity<?> delete(@PathVariable String contentId) {
        try {
            Content content = contentService.find(contentId);
            if (content != null) {
                contentService.delete(content.getId());
                content.setSuccess(true);
                content.setMessage(AppMessages.CONTENT_DELETED);
            } else {
                content = new Content();
                content.setSuccess(false);
                content.setMessage(AppMessages.CONTENT_NOT_EXISTS);
                logger.info(String.format("content not exists %s", content.getTitle()));
            }
            return new ResponseEntity<>(content, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    /*
    Get all episodes for a content
    */
    @RequestMapping(value = "admin/session/content/child/create/{contentId}", method = RequestMethod.POST)
    public ResponseEntity<?> createEpisode(@PathVariable String contentId, @RequestBody ContentDTO contentDTO) {
        try {
            Content content = contentService.find(contentId);
            Content episode = null;
            if (content != null) {

                if (!content.is_episode()) {
                    content.setHas_episode(true);
                    contentService.update(content);
                }

                episode = new Content();
                episode = initializeContent(contentDTO, episode, true);
                String sortOrder = Content.class.getName() + "_child_" + content.getId().toString();
                episode.setSort_order(counterHelper.getNextSequence(sortOrder));
                episode.setParent_content_id(content.getId()); //parent content id

                content = contentService.create(episode);

                episode.setSuccess(true);
                episode.setMessage(AppMessages.EPISODE_CREATED);

            } else {
                episode = new Content();
                episode.setSuccess(false);
                episode.setMessage(AppMessages.CONTENT_NOT_EXISTS);
                logger.info(String.format("content not exists %s", contentDTO.getTitle()));
            }
            return new ResponseEntity<>(episode, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = "admin/session/content/{contentId}/episode-re-order", method = RequestMethod.PUT)
    public ResponseEntity<?> episodeReOrder(@PathVariable String contentId, @RequestBody List<ReOrderDTO> reOrderDTOList) {
        try {
            Response response = new Response();
            response.setSuccess(contentService.episodeReOrder(reOrderDTOList, new ObjectId(contentId)));
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    //Update Episode is same as update content

    @RequestMapping(value = "admin/session/content/child/{contentId}", method = RequestMethod.GET)
    public ResponseEntity<?> getChildContentsForAdmin(@PathVariable String contentId){
        try {

            List<Resource<Content>> resources =  getChildContentsByParent(contentId, true);

            return new ResponseEntity<>(resources, HttpStatus.OK);

        }
        catch (Exception e) {
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = "content/child/{contentId}", method = RequestMethod.GET)
    public ResponseEntity<?> getChildContents(@PathVariable String contentId){
        try {

            List<Resource<Content>> resources =  getChildContentsByParent(contentId, false);

            return new ResponseEntity<>(resources, HttpStatus.OK);
        }
        catch (Exception e) {
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    private List<Resource<Content>> getChildContentsByParent(String contentId, boolean isForAdmin){
        try {

            List<Resource<Content>> resources = new ArrayList<Resource<Content>>();

            Content parentContent = contentService.find(contentId);

            if(parentContent != null) {

                List<Content> contentList = new ArrayList<>();

                if(isForAdmin){
                    contentList = contentService.findChildContent(contentId);
                }
                else{
                    contentList = contentService.findChildContentByActiveDate(contentId, new Date());
                }

                Customer customer = null;

                if(sessionService.getUser() != null) {
                    customer = sessionService.getUser().getCustomer();
                }
                else {
                    customer = customerService.find(parentContent.getCustomer_id());
                }

                for (Content content : contentList) {
                    if(isForAdmin){
                        Resource<Content> contentResource = getContentResource(content, customer, false);
                        appendAWSPlayInfo(contentResource, content, customer.getAws_bucket(), true);
                        resources.add(contentResource);
                    }
                    else {
                        resources.add(getContentResource(content, customer, false));
                    }
                }

                return resources;
            }
            else  {
                return resources;
            }
        }
        catch (Exception e) {
            logger.error(e.getMessage(), e);
            return null;
        }
    }
    /*
    Add content to category
     */
    @RequestMapping(value = "admin/session/content/add/{categoryId}", method = RequestMethod.PUT)
    public ResponseEntity<?> addContentToCategory(@PathVariable String categoryId, @RequestBody String[] contentIdList) {
        try {

            List<Content> contentList = contentService.findMany(contentIdList);
            final Category category = categoryService.find(categoryId);

            //New content order list to be added
            List<ContentOrder> contentOrderListToAdd = new ArrayList<>();

            Response response = new Response();

            if (contentList != null && category != null) {

                //add category in content
                //loop through and add category from all the content

                contentList.forEach(content -> {

                            if (category.getCategory_type() == CategoryType.PAYPERVIEW.getValue()) {
                                content.setPayperviewCategoryId(category.getId());
                            }
                            else {

                                List<ObjectId> categoryList = content.getCategoryList();

                                if (categoryList == null) {
                                    categoryList = new ArrayList<>();
                                }

                                if (!categoryList.contains(category.getId())) {

                                    categoryList.add(category.getId());

                                    content.setCategoryList(categoryList);


//                                logger.info("contentId list ");//
//                                ObjectMapper objectMapper = new ObjectMapper();
//                                objectMapper.writeValueAsString(content);

                                    //logger.info(JSON.serialize(objectMapper.writeValueAsString(content)) );


                                }
                            }

                            content.setUpdated_by(sessionService.getCustomer().getId());
                            content.setUpdated_at(DateHelper.getCurrentDate());
                            content = contentService.update(content);

                            ContentOrder contentOrder = new ContentOrder();

                            String uniqueName = Category.class.getName() + "_" + category.getId();

                            contentOrder.setSort_order(counterHelper.getNextSequence(uniqueName));
                            contentOrder.setContent_id(content.getId());

                            contentOrderListToAdd.add(contentOrder);

                            //logger.info( String.valueOf(category.getContentOrderList().size())  );


                        }
                );

                //add content to category
                List<ContentOrder> contentOrderList = category.getContentOrderList();

                if (contentOrderList == null) {
                    contentOrderList = new ArrayList<>();
                }

                contentOrderList.addAll(contentOrderListToAdd);
                category.setContentOrderList(contentOrderList);
                category.setUpdated_at(DateHelper.getCurrentDate());
                categoryService.update(category.getId(), category);


                response.setSuccess(true);
                response.setMessage(AppMessages.CONTENT_UPDATED);
            } else {
                response = new Content();
                response.setSuccess(false);
                response.setMessage(AppMessages.CONTENT_NOT_EXISTS);
                logger.info(String.format("content not exists %s"));
            }
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    /*
    remove content to category
     */
    @RequestMapping(value = "admin/session/content/remove/{categoryId}", method = RequestMethod.PUT)
    public ResponseEntity<?> removeContentToCategory(@PathVariable String categoryId, @RequestBody String[] contentIdList) {
        try {

            List<Content> contentList = contentService.findMany(contentIdList);
            final Category category = categoryService.find(categoryId);

            Response response = new Response();

            if (contentList != null && category != null) {

                //remove category in content
                //loop through and removed category from all the content
                contentList.forEach(content -> {

                            if (category.getCategory_type() == CategoryType.PAYPERVIEW.getValue()) {
                                content.setPayperviewCategoryId(null);
                            }
                            else {
                                List<ObjectId> categoryList = content.getCategoryList();

                                if (categoryList == null) {
                                    categoryList = new ArrayList<>();
                                }

                                if (categoryList.contains(category.getId())) {

                                    categoryList.remove(category.getId());
                                    content.setCategoryList(categoryList);
                                }
                            }
                            content.setUpdated_by(sessionService.getCustomer().getId());
                            content.setUpdated_at(DateHelper.getCurrentDate());
                            content = contentService.update(content);
                        }
                );

                //remove content in category
                List<ContentOrder> contentOrderList = category.getContentOrderList();

                if (contentOrderList == null) {
                    contentOrderList = new ArrayList<>();
                }

                //List to be removed from document
                List<ContentOrder> contentOrderListToRemove = new ArrayList<>();

                for(Content content : contentList) {
                    for(ContentOrder contentOrder : contentOrderList) {
                        if(contentOrder.getContent_id().equals(content.getId())) {
                            contentOrderListToRemove.add(contentOrder);
                        }
                    }
                }

                contentOrderList.removeAll(contentOrderListToRemove);
                category.setContentOrderList(contentOrderList);
                category.setUpdated_at(DateHelper.getCurrentDate());
                categoryService.update(category.getId(), category);

                //logger.info( String.valueOf(category.getContentOrderList().size())  );

                response.setSuccess(true);
                response.setMessage(AppMessages.CONTENT_UPDATED);
            } else {
                response = new Content();
                response.setSuccess(false);
                response.setMessage(AppMessages.CONTENT_NOT_EXISTS);
                logger.info(String.format("content not exists %s"));
            }
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = "admin/session/content-with-multiplecategory/{contentId}/{categoryId}", method = RequestMethod.PUT)
    public ResponseEntity<?> createContentWithMultipleCategory(@PathVariable String contentId, @PathVariable String[] categoryId) {
        try {
            Content content = contentService.find(contentId);

            logger.info("contentId: " + contentId);
            logger.info("categoryId: " + categoryId);

            if (content != null) {

                //delete all category for corresponding content
                List<ObjectId> checkCategory = content.getCategoryList();
                if (checkCategory != null) {
                    checkCategory.clear();
                }

                //delete all content associated with category
                List<Category> checkContent = categoryService.findContentByContentId(content.getId());
                if (checkContent != null && checkContent.size() > 0) {
                    for (Category category : checkContent) {
                        if (category.getContentOrderList() != null) {
                            for (int k = 0; k < category.getContentOrderList().size(); k++) {
                                logger.info("contentId: " + category.getContentOrderList().get(k).getContent_id());
                                if (category.getContentOrderList().get(k).getContent_id().equals(contentId)) {
                                    category.getContentOrderList().remove(k);
                                    category = categoryService.update(category.getId(), category);
                                }
                            }
                        }
                    }
                }

                for (int i = 0; i < categoryId.length; i++) {

                    String category_Id = categoryId[i];

                    Category category = categoryService.find(category_Id);
                    if (category != null) {

                        //add category to content
                        List<ObjectId> categoryList = content.getCategoryList();
                        if (categoryList == null) {
                            categoryList = new ArrayList<>();
                        }
                        categoryList.add(category.getId());

                        content.setCategoryList(categoryList);
                        content.setUpdated_by(sessionService.getCustomer().getId());
                        content.setUpdated_at(DateHelper.getCurrentDate());
                        content = contentService.update(content);

                        //add content to category
                        List<ContentOrder> contentOrderList = category.getContentOrderList();
                        if (contentOrderList == null) {
                            contentOrderList = new ArrayList<>();
                        }
                        ContentOrder contentOrder = new ContentOrder();
                        contentOrder.setContent_id(content.getId());
                        String uniqueName = Category.class.getName() + "_" + category.getId();
                        contentOrder.setSort_order(counterHelper.getNextSequence(uniqueName));
                        contentOrderList.add(contentOrder);

                        category.setContentOrderList(contentOrderList);
                        category.setUpdated_at(DateHelper.getCurrentDate());
                        category = categoryService.update(category.getId(), category);
                    }
                }

                content.setSuccess(true);
                content.setMessage(AppMessages.CONTENT_UPDATED);
            } else {
                content = new Content();
                content.setSuccess(false);
                content.setMessage(AppMessages.CONTENT_NOT_EXISTS);
                logger.info(String.format("content not exists %s"));
            }
            return new ResponseEntity<>(content, HttpStatus.OK);

        } catch (Exception e) {
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = "admin/session/content/remove/{contentId}/{categoryId}", method = RequestMethod.DELETE)
    public ResponseEntity<?> removeContentWithMultipleCategory(@PathVariable String contentId, @PathVariable String[] categoryId) {
        try {
            Content content = contentService.find(contentId);
            if (content != null) {

                for (int i = 0; i < categoryId.length; i++) {

                    //delete all category for corresponding content
                    List<ObjectId> categoryList = content.getCategoryList();
                    if (categoryList != null && categoryList.size() > 0) {
                        for (int j = 0; j < categoryList.size(); j++) {
                            logger.info("categoryId: " + categoryList.get(j));
                            if (categoryList.get(j).equals(categoryId[i])) {
                                categoryList.remove(j);
                                content = contentService.update(content);
                            }
                        }
                    }

                    //delete all content associated with category
                    ObjectId conId = new ObjectId(contentId);
                    ObjectId catId = new ObjectId(categoryId[i]);
                    Category category = categoryService.findContentBy_ContentId_CategoryId(conId, catId);
                    if (category != null) {
                        if (category.getContentOrderList() != null && category.getContentOrderList().size() > 0) {
                            for (int k = 0; k < category.getContentOrderList().size(); k++) {
                                logger.info("contentId: " + category.getContentOrderList().get(k).getContent_id());
                                if (category.getContentOrderList().get(k).getContent_id().equals(contentId)) {
                                    category.getContentOrderList().remove(k);
                                    category = categoryService.update(category.getId(), category);
                                }
                            }
                        }
                    }
                }

                content.setSuccess(true);
                content.setMessage(AppMessages.CONTENT_UPDATED);
            } else {
                content = new Content();
                content.setSuccess(false);
                content.setMessage(AppMessages.CONTENT_NOT_EXISTS);
                logger.info(String.format("content not exists %s"));
            }
            return new ResponseEntity<>(content, HttpStatus.OK);
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = "admin/session/all/{contentType}", method = RequestMethod.GET)
    public ResponseEntity<?> getAllUnassignedContents(@PathVariable String contentType) {
        try {

            Customer customer = null;

            List<Resource<Content>> resources = new ArrayList<Resource<Content>>();

            if(sessionService.getUser() != null) {
                customer = sessionService.getUser().getCustomer();
            }
            else {
                customer = customerService.findByHost(sessionService.getHost());
            }

            List<Content> contentList = contentService.getAllContentsByContentType(customer.getId(), contentType);

            if(contentList != null) {
                for (Content content : contentList) {

                    Resource<Content> contentResource = getContentResource(content, customer, true);
                    appendAWSPlayInfo(contentResource, content, customer.getAws_bucket(), true);

                    resources.add(contentResource);
                }
            }

            return new ResponseEntity<>(resources, HttpStatus.OK);

        } catch (Exception e) {
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = "admin/session/content/upload/status/{contentId}", method = RequestMethod.PUT)
    public ResponseEntity<?> uploadStatusUpdate(@PathVariable String contentId, @RequestBody AWSUploadStatusDTO awsUploadStatusDTO) {
        try {

            Content content = null;

            if(awsUploadStatusDTO != null) {
                content = contentService.find(contentId);

                if (content != null) {
                    logger.info("AWSUploadVideo");
                    logger.info(awsUploadStatusDTO.getKey());

                    if(awsUploadStatusDTO.getQualityType().equals(AWSContentQualityType.ORIGINAL) ) {
                        content.setOriginal_file_id(awsUploadStatusDTO.getKey());
                        content.setTranscodeInProgress(true);
                        content.setUseEncoding(true);
                    }
                    else {
                        AWSInfo awsInfo = new AWSInfo();
                        awsInfo.setId(awsUploadStatusDTO.getKey());

                        if(awsUploadStatusDTO.getQualityType().equals(AWSContentQualityType.P_480)) {
                            this.deleteOldVideo(content.getAws_info_480p());
                            content.setAws_info_480p(awsInfo);
                        }
                        else  if(awsUploadStatusDTO.getQualityType().equals(AWSContentQualityType.P_360)) {
                            this.deleteOldVideo(content.getAws_info_360p());
                            content.setAws_info_360p(awsInfo);
                        }
                        else  if(awsUploadStatusDTO.getQualityType().equals(AWSContentQualityType.P_720)) {
                            this.deleteOldVideo(content.getAws_info_720p());
                            content.setAws_info_720p(awsInfo);
                        }
                        else  if(awsUploadStatusDTO.getQualityType().equals(AWSContentQualityType.P_1080)) {
                            this.deleteOldVideo(content.getAws_info_1080p());
                            content.setAws_info_1080p(awsInfo);
                        }

                        content.setUseEncoding(false);
                    }

                    content = contentService.update(content);
                    content.setSuccess(true);
                    content.setMessage(AppMessages.CONTENT_UPDATED);

                }
                else {
                    content = new Content();
                    content.setSuccess(false);
                    content.setMessage(AppMessages.CONTENT_NOT_EXISTS);
                }
            }
            else {
                content = new Content();
                content.setSuccess(false);
                content.setMessage(AppMessages.CONTENT_NOT_EXISTS);
            }


            return new ResponseEntity<>(content, HttpStatus.OK);

        } catch (Exception e) {
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }


    /****************************************************
     * ADMIN API END
     **************************************************** */

    /****************************************************
     * NON SECURE API and SESSION -- START
     **************************************************** */

    @RequestMapping(value = "aws/callback", method = RequestMethod.POST)
    @Consumes("text/plain")
    @Produces("text/plain")
    public ResponseEntity<?> awsCallback(@RequestBody String notificationString) {
        try {

            logger.info("notificationString");
            logger.info(notificationString);

            Notification allNotification =  new ObjectMapper().readValue(notificationString, Notification.class);

            if(allNotification != null) {

                if(allNotification.getType().toLowerCase().equals("notification")) {

                    Notification<JobStatusNotification> notification =  new ObjectMapper().readValue(notificationString, new TypeReference<Notification<JobStatusNotification>>() {});

                    JobStatusNotification jobStatusNotification =  notification.getMessage();

                    if(jobStatusNotification != null && jobStatusNotification.getState() == JobStatusNotification.JobState.COMPLETED) {
                        String content_original_file_id = jobStatusNotification.getInput().getKey();

                        Content content = contentService.findByOriginalFileId(content_original_file_id);

                        if(content != null) {
                            List<JobStatusNotification.JobOutput> jobOutputList = jobStatusNotification.getOutputs();

                            if(jobOutputList != null && jobOutputList.size() > 0) {
                                for (JobStatusNotification.JobOutput jobOutput : jobOutputList) {
                                    if(jobOutput.getStatus().toLowerCase().equals("complete")) {

                                        AWSInfo awsInfo = new AWSInfo();

                                        awsInfo.setId(jobStatusNotification.getOutputKeyPrefix() + jobOutput.getKey());
                                        awsInfo.setDuration(jobOutput.getDuration());
                                        awsInfo.setHeight(jobOutput.getHeight());
                                        awsInfo.setWidth(jobOutput.getWidth());

                                        if(jobOutput.getPresetId().equals(configHelper.video480p_presetId)) {
                                            this.deleteOldVideo(content.getAws_info_480p());
                                            content.setAws_info_480p(awsInfo);
                                        }
                                        else if(jobOutput.getPresetId().equals(configHelper.video360p_presetId)) {
                                            this.deleteOldVideo(content.getAws_info_360p());
                                            content.setAws_info_360p(awsInfo);
                                        }
                                        else if(jobOutput.getPresetId().equals(configHelper.video720p_presetId)){
                                            this.deleteOldVideo(content.getAws_info_720p());
                                            content.setAws_info_720p(awsInfo);
                                        }
                                        else if(jobOutput.getPresetId().equals(configHelper.video1080p_presetId)){ // 1351620000001-000001
                                            this.deleteOldVideo(content.getAws_info_1080p());
                                            content.setAws_info_1080p(awsInfo);
                                        }

//                                        if(jobOutput.getHeight() == 480) {
//                                            this.deleteOldVideo(content.getAws_info_480p());
//                                            content.setAws_info_480p(awsInfo);
//                                        }
//                                        else if(jobOutput.getHeight() == 360) {
//                                            this.deleteOldVideo(content.getAws_info_360p());
//                                            content.setAws_info_360p(awsInfo);
//                                        }
//                                        else if(jobOutput.getHeight() == 720){
//                                            this.deleteOldVideo(content.getAws_info_720p());
//                                            content.setAws_info_720p(awsInfo);
//                                        }
//                                        else {
//                                            this.deleteOldVideo(content.getAws_info_1080p());
//                                            content.setAws_info_1080p(awsInfo);
//                                        }
                                        content.setTranscodeInProgress(false);
                                    }
                                }
                            }

                            contentService.update(content);
                        }
                    }
                }
                else if(allNotification.getType().toLowerCase().equals("subscriptionconfirmation")) {
                    String response = RESTHelper.restRequest(allNotification.getSubscribeURL(), "GET", null, null, null);
                    logger.info("subscriptionconfirmation response");
                    logger.info(response);
                }


            }

            return new ResponseEntity<>(AppMessages.CONTENT_UPDATED, HttpStatus.OK);

        } catch (Exception e) {
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    //Delete old video in AWS
    private void deleteOldVideo(AWSInfo awsInfo) {
        if (awsInfo != null) {
            s3Service.delete(awsInfo.getId());
        }
    }
    @RequestMapping(value = "category/STB/all", method = RequestMethod.GET)
    public ResponseEntity<?> getAllSTBCategoryList(Device device) {
        try {

            List homeCategory = new ArrayList();
            List<Resource<Category>> resources = new ArrayList<Resource<Category>>();

            Customer customer = customerService.findByHost(sessionService.getHost()); // getUserDetails(principal).getCustomer();
            List<Category> category = categoryService.findCategoryByCustomerId(customer.getId(), 4);
            category.stream().forEach(response -> {
                if(response.isShowInHome()) {
//                    resources.add(getCategoryResource(response, customer));
                    List<Resource<ContentThumbnailDTO>> contentResources = getContentAssignedByCategory(response.getId().toString(), false);

                    if(contentResources.size() > 0) {
                        contentResources.stream().forEach(element -> {
                            VideoPlayWrapper videoPlayWrapper = getHomeContentAWSUrl(device, element.getContent().getId().toString(), true, customer);
                            if(videoPlayWrapper != null) {
                                element.getContent().setVideoPlayWrappers(videoPlayWrapper);
                            }
                        });
                        HashedMap categoryResource = new HashedMap();
                        categoryResource.put("id",response.getId().toString());
                        categoryResource.put("title",response.getName());
                        categoryResource.put("contentInfo",contentResources);
                        homeCategory.add(categoryResource);
                    }
                }
            });


            return new ResponseEntity<>(homeCategory, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = "category/home/all", method = RequestMethod.GET)
    public ResponseEntity<?> getAllHomeCategoryList(Device device) {
        try {

            List homeCategory = new ArrayList();
            List<Resource<Category>> resources = new ArrayList<Resource<Category>>();

            Customer customer = customerService.findByHost(sessionService.getHost()); // getUserDetails(principal).getCustomer();
            List<Category> category = categoryService.findCategoryByCustomerId(customer.getId(), 4);
            category.stream().forEach(response -> {
                if(response.isShowInHome()) {
//                    resources.add(getCategoryResource(response, customer));
                    List<Resource<ContentThumbnailDTO>> contentResources = getContentByCategory(response.getId().toString(), false);

                    if(contentResources.size() > 0) {
                        contentResources.stream().forEach(element -> {
                            VideoPlayWrapper videoPlayWrapper = getHomeContentAWSUrl(device, element.getContent().getId().toString(), true, customer);
                            if(videoPlayWrapper != null) {
                                element.getContent().setVideoPlayWrappers(videoPlayWrapper);
                            }
                        });
                        HashedMap categoryResource = new HashedMap();
                        categoryResource.put("id",response.getId().toString());
                        categoryResource.put("title",response.getName());
                        categoryResource.put("contentInfo",contentResources);
                        homeCategory.add(categoryResource);
                    }
                }
            });


            return new ResponseEntity<>(homeCategory, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    private List<Resource<ContentThumbnailDTO>> getContentByCategory(String categoryId, boolean isForAdmin) {

        List<Resource<ContentThumbnailDTO>> resources = new ArrayList<Resource<ContentThumbnailDTO>>();


        Category category = categoryService.find(categoryId);

        if (category != null) {

            if (category.getContentOrderList() != null && category.getContentOrderList().size() > 0) {

                boolean isSecure = false;
                Customer customer = null;

                if(sessionService.getUser() != null) {
                    isSecure = true;
                    customer = sessionService.getUser().getCustomer();
                }
                else {
                    customer = customerService.find(category.getCustomer_id());
                }

                List<ContentOrder> contentOrderList = category.getContentOrderList();

                if(contentOrderList != null && contentOrderList.size() > 0) {

                    List<ObjectId> contentIdList = contentOrderList.stream().map(Content -> Content.getContent_id()).collect(Collectors.toList());

                    List<Content>  contentList = null;

                    if(isForAdmin)
                        contentList = contentService.findManyOnlyActiveForAdmin(contentIdList.toArray(new ObjectId[contentIdList.size()]));
                    else
                        contentList = contentService.findManyOnlyActive(contentIdList.toArray(new ObjectId[contentIdList.size()]), new Date());

                    ModelMapper modelMapper = new ModelMapper();

                    for (ContentOrder contentOrder : contentOrderList) {
                        for (Content content : contentList) {
                            if(content.getId().equals(contentOrder.getContent_id()) && (content.getYoutube_VideoLink() == null || content.getYoutube_VideoLink().length() == 0)) {
                                content.setSort_order(contentOrder.getSort_order()); //set the sort order to content

                                ContentThumbnailDTO contentThumbnailDTO = modelMapper.map(content, ContentThumbnailDTO.class);
                                if (content.getParent_content_id() != null && content.getContent_type().equals("audio")) {

                                    Resource<ContentThumbnailDTO> resource = new Resource<ContentThumbnailDTO>(contentThumbnailDTO);

                                    resource.add(new Link(getUIContentPath(content.getId().toString()), "UIHref"));

                                    Content parentContent = contentService.find(content.getParent_content_id());
                                    if (parentContent != null) {
                                        appendThumbnailAWSInfo(resource, parentContent, customer.getAws_bucket(), isSecure);
                                        appendBannerAWSInfo(resource, parentContent, customer.getAws_bucket(), isSecure);
                                    }
                                    resources.add(resource);
                                }
                                else {
                                    resources.add(getContentResource(contentThumbnailDTO, content, customer, isSecure));
                                }
                                break;
                            }
                        }
                    }
                }
            }
        }

        return resources;
    }

    public VideoPlayWrapper getHomeContentAWSUrl(Device device, @PathVariable String contentId, @PathVariable boolean generate, Customer customer) {
        try{
            Content content = contentService.findByActiveDate(contentId, new Date());

            VideoPlayWrapper videoPlayWrapper = new VideoPlayWrapper();;
            boolean addVideoUrl = true;

            //Condition to play
            // 1. Youtube link play directly
            // 2. if paid content, the if free for premium user, play
            // 3. if paid content, validate if user paid
            // 4. if premium customer and premium content allow play
            if (content != null) {

                if(addVideoUrl) {
                    boolean isSecure = true;
                    if(generate) {
                        videoPlayWrapper.setVideoPlayInfoList(getHomeContentVideoPlayUrls(device, contentId, content, customer));
                    }
                    videoPlayWrapper.setSuccess(true);
                }
            } else{
                videoPlayWrapper = new VideoPlayWrapper();
                videoPlayWrapper.setSuccess(false);
                videoPlayWrapper.setMessage(ExceptionMessages.INVALID_REQUEST);
                logger.info(String.format("content not exists %s", content.getTitle()));
            }

            return videoPlayWrapper;
        } catch (Exception e) {
            return null;
        }
    }

    private List<VideoPlayInfo> getHomeContentVideoPlayUrls(Device device, String contentId, Content content, Customer customer)
            throws Exception {
        List<VideoPlayInfo> videoPlayInfoList = new ArrayList<>();

        if(content.getContent_type().equals("audio")) {

            if(content.isHas_episode()) {
                List<Content> contentList = contentService.findChildContentByActiveDate(contentId, new Date());


                String bannerUrl = s3Service.getAWSUrl(content.getBanner_aws_info().getId(),customer.getAws_bucket());
                String thumbnailUrl = s3Service.getAWSUrl(content.getThumbnail_aws_info().getId(),customer.getAws_bucket());

                if(contentList != null){
                    contentList.forEach(con -> {
                        try {
                            VideoPlayInfo videoPlayInfo = getHomeContentVideoUrl(device, con, customer.getAws_bucket(), customer);
                            videoPlayInfo.setAudioBanner(bannerUrl);
                            videoPlayInfo.setAudioThumbnail(thumbnailUrl);
                            videoPlayInfo.setTitle(con.getTitle());
                            videoPlayInfoList.add(videoPlayInfo);
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                    });
                }
            } else {

                Content parentContent = contentService.findByActiveDate(content.getParent_content_id().toString(), new Date());

                String bannerUrl = null;
                String thumbnailUrl = null;

                if(parentContent != null) {
                    bannerUrl = s3Service.getAWSUrl(parentContent.getBanner_aws_info().getId(),customer.getAws_bucket());
                    thumbnailUrl = s3Service.getAWSUrl(parentContent.getThumbnail_aws_info().getId(),customer.getAws_bucket());
                }

                VideoPlayInfo videoPlayInfo = getHomeContentVideoUrl(device, content,customer.getAws_bucket(), customer);
                videoPlayInfo.setAudioBanner(bannerUrl);
                videoPlayInfo.setAudioThumbnail(thumbnailUrl);
                videoPlayInfo.setTitle(content.getTitle());
                videoPlayInfoList.add(videoPlayInfo);
            }

        } else {
            videoPlayInfoList.add(getHomeContentVideoUrl(device, content, customer.getAws_bucket(), customer));
        }
        return videoPlayInfoList;
    }

    private VideoPlayInfo getHomeContentVideoUrl(Device device, Content content, String awsBucket, Customer customer) throws Exception {
        //List<VideoPlayInfo> videoPlayInfoList = new ArrayList<>();
        VideoPlayInfo videoPlayInfo = new VideoPlayInfo();
        if(StringUtils.isNotBlank(content.getYoutube_VideoLink())) {
            videoPlayInfo.setIsIsYouTubeUrl(true);
            videoPlayInfo.setSdVideoUrl(content.getYoutube_VideoLink());
            //videoPlayInfoList.add(videoPlayInfo);
        }
        else {
            AWSInfo awsInfo = null;
            if(device.isMobile()) {
                awsInfo = content.getAws_info_360p();
                if(awsInfo != null) {
//                    videoPlayInfo.setSdVideoUrl(s3Service.getSignedVideoUrl(awsInfo.getId(), user.getEmail()));
                    videoPlayInfo.setSdVideoUrl(s3Service.getSignUrlCanned(distributionDomain, certificateId, awsInfo.getId()));
                    //videoPlayInfoList.add(videoPlayInfo);
                }
            } else if(device.isTablet()) {
                awsInfo = content.getAws_info_480p();
                if(awsInfo != null) {
                    videoPlayInfo.setSdVideoUrl(s3Service.getSignUrlCanned(distributionDomain, certificateId, awsInfo.getId()));
                    //videoPlayInfoList.add(videoPlayInfo);
                }
            } else {
                awsInfo = content.getAws_info_480p();
                if(awsInfo != null) {
                    if(content.getContent_type().equals("audio")){
                        videoPlayInfo.setSdVideoUrl(s3Service.getAWSUrl(awsInfo.getId(), awsBucket));
                    }
                    else {
                        videoPlayInfo.setSdVideoUrl(s3Service.getSignUrlCanned(distributionDomain, certificateId, awsInfo.getId()));
                    }
                }
                awsInfo = content.getAws_info_720p();
                if (awsInfo != null) {
                    videoPlayInfo.setHdVideoUrl(s3Service.getSignUrlCanned(distributionDomain, certificateId, awsInfo.getId()));
                }
            }
//            if(videoPlayInfo!=null){
//                createAccessLog(videoPlayInfo.getSdVideoUrl(), user, content);
//            }

        }

        return videoPlayInfo;
    }

    @RequestMapping(value = "assigned_content/{categoryId}", method = RequestMethod.GET)
    public ResponseEntity<?> getAllAssignedContentsByCategory(@PathVariable String categoryId) {
        try {

            List<Resource<ContentThumbnailDTO>> resources = getContentAssignedByCategory(categoryId, false);


            return new ResponseEntity<>(resources, HttpStatus.OK);

        } catch (Exception e) {
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }


    @RequestMapping(value = "admin/assigned_content/{categoryId}", method = RequestMethod.GET)
    public ResponseEntity<?> getAllAdminAssignedContentsByCategory(@PathVariable String categoryId) {
        try {

            List<Resource<ContentThumbnailDTO>> resources = getContentAssignedByCategory(categoryId, true);


            return new ResponseEntity<>(resources, HttpStatus.OK);

        } catch (Exception e) {
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    private List<Resource<ContentThumbnailDTO>> getContentAssignedByCategory(String categoryId, boolean isForAdmin) {

        List<Resource<ContentThumbnailDTO>> resources = new ArrayList<Resource<ContentThumbnailDTO>>();


        Category category = categoryService.find(categoryId);

        if (category != null) {

            if (category.getContentOrderList() != null && category.getContentOrderList().size() > 0) {

                boolean isSecure = false;
                Customer customer = null;

                if(sessionService.getUser() != null) {
                    isSecure = true;
                    customer = sessionService.getUser().getCustomer();
                }
                else {
                    customer = customerService.find(category.getCustomer_id());
                }

                List<ContentOrder> contentOrderList = category.getContentOrderList();

                if(contentOrderList != null && contentOrderList.size() > 0) {

                    List<ObjectId> contentIdList = contentOrderList.stream().map(Content -> Content.getContent_id()).collect(Collectors.toList());

                    List<Content>  contentList = null;

                    if(isForAdmin)
                        contentList = contentService.findManyOnlyActiveForAdmin(contentIdList.toArray(new ObjectId[contentIdList.size()]));
                    else
                        contentList = contentService.findManyOnlyActive(contentIdList.toArray(new ObjectId[contentIdList.size()]), new Date());

                    ModelMapper modelMapper = new ModelMapper();

                    for (ContentOrder contentOrder : contentOrderList) {
                        for (Content content : contentList) {
                            if(content.getId().equals(contentOrder.getContent_id())) {
                                content.setSort_order(contentOrder.getSort_order()); //set the sort order to content

                                ContentThumbnailDTO contentThumbnailDTO = modelMapper.map(content, ContentThumbnailDTO.class);
                                if (content.getParent_content_id() != null && content.getContent_type().equals("audio")) {

                                    Resource<ContentThumbnailDTO> resource = new Resource<ContentThumbnailDTO>(contentThumbnailDTO);

                                    resource.add(new Link(getUIContentPath(content.getId().toString()), "UIHref"));

                                    Content parentContent = contentService.find(content.getParent_content_id());
                                    if (parentContent != null) {
                                        appendThumbnailAWSInfo(resource, parentContent, customer.getAws_bucket(), isSecure);
                                        appendBannerAWSInfo(resource, parentContent, customer.getAws_bucket(), isSecure);
                                    }
                                    resources.add(resource);
                                }
                                else {
                                    resources.add(getContentResource(contentThumbnailDTO, content, customer, isSecure));
                                }
                                break;
                            }
                        }
                    }
                }
            }
        }

        return resources;
    }

    @RequestMapping(value = "content/all-content-with-child", method = RequestMethod.GET)
    public ResponseEntity<?> getAllContentsWithChild() {
        try {
            Customer customer = null;

            if (sessionService.getUser() != null) {
                customer = sessionService.getUser().getCustomer();
            } else {
                customer = customerService.findByHost(sessionService.getHost());
            }

            List<Content> contentList = contentService.findAllContentWithEpisodes(customer.getId());
            List<ContentThumbnailDTO> contentThumbnailDTOList = null;

            if (contentList != null) {

                Map<ObjectId, String> contentMap = contentList.stream().collect(Collectors.toMap(x -> x.getId(), x -> x.getTitle()));

                contentThumbnailDTOList = new ArrayList<>();
                ModelMapper modelMapper = new ModelMapper();

                for (Content content : contentList) {
                    if (content.getParent_content_id() != null) {
                        String parentName = contentMap.get(content.getParent_content_id());
                        content.setTitle(parentName + " - " + content.getTitle());
                    }

                    contentThumbnailDTOList.add(modelMapper.map(content, ContentThumbnailDTO.class));
                }
            }

            return new ResponseEntity<>(contentThumbnailDTOList, HttpStatus.OK);

        } catch (Exception e) {
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    //   1) If category has no parent category(i.e. category type 1 -> categories), all contents without episode will be unassigned contents
//   2) If featured category has no parent category(i.e. home featured), all contents of the audio & video will be unassigned contents
//   3) If featured category has parent category but not radio or channel(i.e. MOVIES, TV ), the assigned content of parent will be unassigned contents
//   4) If featured category has parent category with radio, the audio contents with episodes will be unassigned contents
    @RequestMapping(value = "admin/unassigned_content/{categoryId}", method = RequestMethod.GET)
    public ResponseEntity<?> getAllUnassignedContentsByCategory(@PathVariable String categoryId) {
        try {

            List<Content> contentList = new ArrayList<>();
            List<Resource<ContentThumbnailDTO>> resources = new ArrayList<Resource<ContentThumbnailDTO>>();

            Category category = categoryService.find(categoryId);
            if (category != null) {
                //If category has parent_category_id(i.e for featured category), get unassigned contents from parent category assigned contents
                //If parent_category has channel (or) radio, we have to get all contents
                if(category.getHome_category_id()==null && category.getParent_category_id()!=null) {
                    Category parentCategory = categoryService.find(category.getParent_category_id());
                    if (parentCategory != null && parentCategory.getCategory_type()== CategoryType.CATEGORY.getValue()) {

                        ObjectId[] contentIds;

                        if (category.getContentOrderList() != null && category.getContentOrderList().size() > 0) {

                            List<ContentOrder> contentOrderList = category.getContentOrderList();
                            List<ContentOrder> unassigned = new ArrayList<>();

                            for (ContentOrder contentOrder : parentCategory.getContentOrderList()) {
                                if (!contentOrderList.stream().filter(o -> o.getContent_id().equals(contentOrder.getContent_id())).findFirst().isPresent()) {
                                    unassigned.add(contentOrder);
                                }
                            }

                            List<ObjectId> contentIdList = unassigned.stream().map(Content -> Content.getContent_id()).collect(Collectors.toList());
                            contentIds = contentIdList.toArray(new ObjectId[contentIdList.size()]);
                        } else {
                            List<ObjectId> contentIdList = parentCategory.getContentOrderList().stream().map(Content -> Content.getContent_id()).collect(Collectors.toList());
                            contentIds = contentIdList.toArray(new ObjectId[contentIdList.size()]);
                        }

                        contentList = contentService.findManyOnlyActiveForAdmin(contentIds);
                    }
                    else {
                        contentList = unAssignedContentsByCategory(category, true);
                    }
                }
                else {
                    contentList =  unAssignedContentsByCategory(category,true);
                }
                if(contentList != null) {

                    boolean isSecure = false;
                    Customer customer = null;

                    if(sessionService.getUser() != null) {
                        isSecure = true;
                        customer = sessionService.getUser().getCustomer();
                    }
                    else {
                        customer = customerService.find(category.getCustomer_id());
                    }

                    ModelMapper modelMapper = new ModelMapper();
                    Map<ObjectId, Content> contentMap = contentList.stream().collect(Collectors.toMap(x -> x.getId(), x->x));

                    for (Content content : contentList) {
                        ContentThumbnailDTO contentThumbnailDTO = modelMapper.map(content, ContentThumbnailDTO.class);
                        if (content.getParent_content_id() != null && content.getContent_type().equals("audio")) {

                            Resource<ContentThumbnailDTO> resource = new Resource<ContentThumbnailDTO>(contentThumbnailDTO);

                            resource.add(new Link(getUIContentPath(content.getId().toString()), "UIHref"));

                            Content parentContent = contentMap.get(content.getParent_content_id());
                            if(parentContent!=null) {
                                appendThumbnailAWSInfo(resource, parentContent, customer.getAws_bucket(), isSecure);
                                appendBannerAWSInfo(resource, parentContent, customer.getAws_bucket(), isSecure);
                            }
                            resources.add(resource);
                        }
                        else {
                            resources.add(getContentResource(contentThumbnailDTO, content, customer, isSecure));
                        }
                    }
                }
            }

            return new ResponseEntity<>(resources, HttpStatus.OK);

        } catch (Exception e) {
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    private List<Content> unAssignedContentsByCategory(Category category, boolean showEpisode){
        try{
            List<Content> contentList = new ArrayList<>();
            if (category.getContentOrderList() != null && category.getContentOrderList().size() > 0) {
                List<ContentOrder> contentOrderList = category.getContentOrderList();
                List<ObjectId> contentIdList = contentOrderList.stream().map(Content -> Content.getContent_id()).collect(Collectors.toList());

                ObjectId[] contentIds = contentIdList.toArray(new ObjectId[contentIdList.size()]);

                if (category.getCategory_type() == CategoryType.HOME_FEATURED.getValue() && showEpisode) {
                    contentList = contentService.findUnAssignedContentWithEpisodesForCategoryId(category.getCustomer_id(), contentIds);
                } else {
                    contentList = contentService.findUnAssignedContentForCategoryId(category.getCustomer_id(), contentIds);
                }
            } else {
                if (category.getCategory_type() == CategoryType.HOME_FEATURED.getValue() && showEpisode) {
                    contentList = contentService.findAllContentWithEpisodes(category.getCustomer_id());
                } else {
                    contentList = contentService.getAllContents(category.getCustomer_id());
                }
            }

            return contentList;
        }
        catch (Exception e){
            return null;
        }
    }

    //user end search
    @RequestMapping(value = "content/STB/search", method = RequestMethod.POST)
    public ResponseEntity<?> getAllSTBContentsBySearch(@RequestBody searchDTO searchDTO) {

        try {

            List<Content> contentList = new ArrayList<>();
            List<Resource<ContentThumbnailDTO>> resources = new ArrayList<Resource<ContentThumbnailDTO>>();

            Customer customer = null;

            if (sessionService.getUser() != null) {
                customer = sessionService.getUser().getCustomer();
            } else {
                customer = customerService.findByHost(sessionService.getHost());
            }

            if (customer != null) {
                contentList = contentService.findAllByTitleForUserSearch(customer.getId(), searchDTO.getTitle(), new Date());
            }

            ModelMapper modelMapper = new ModelMapper();

            if (contentList != null && contentList.size() > 0) {

                ContentThumbnailDTO contentThumbnailDTO = null;

                for (Content content : contentList) {
                    contentThumbnailDTO = modelMapper.map(content, ContentThumbnailDTO.class);
                    resources.add(getContentResource(contentThumbnailDTO, content, customer, false));
                }
            }

            return new ResponseEntity<>(resources, HttpStatus.OK);

        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    //user end search
    @RequestMapping(value = "content/search", method = RequestMethod.POST)
    public ResponseEntity<?> getAllContentsBySearch(@RequestBody searchDTO searchDTO) {

        try {

            List<Content> contentList = new ArrayList<>();
            List<Category> categoryList = new ArrayList<>();
            List<Blog> blogList = new ArrayList<>();

            List<Resource<ContentThumbnailDTO>> video_resources = new ArrayList<Resource<ContentThumbnailDTO>>();
            List<Resource<ContentThumbnailDTO>> audio_resources = new ArrayList<Resource<ContentThumbnailDTO>>();
            List<Resource<Category>> radio_resources = new ArrayList<Resource<Category>>();
            List<Resource<Category>> channel_resources = new ArrayList<Resource<Category>>();

            List search_results = new ArrayList();

            Customer customer = null;

            if (sessionService.getUser() != null) {
                customer = sessionService.getUser().getCustomer();
            } else {
                customer = customerService.findByHost(sessionService.getHost());
            }

            if (customer != null) {
                contentList = contentService.findAllByTitleForUserSearch(customer.getId(), searchDTO.getTitle(), new Date());
                categoryList = categoryService.findAllByTitleForUserSearch(customer.getId(), searchDTO.getTitle());
                blogList = blogService.findAllByTitleForUserSearch(searchDTO.getTitle());
            }

            ModelMapper modelMapper = new ModelMapper();

            if (contentList != null && contentList.size() > 0) {

                ContentThumbnailDTO contentThumbnailDTO = null;

                for (Content content : contentList) {
                    contentThumbnailDTO = modelMapper.map(content, ContentThumbnailDTO.class);
                    if(content.getContent_type().equalsIgnoreCase("video")) {
                        video_resources.add(getContentResource(contentThumbnailDTO, content, customer, false));
                    }
                    if(content.getContent_type().equalsIgnoreCase("audio")) {
                        audio_resources.add(getContentResource(contentThumbnailDTO, content, customer, false));
                    }
                }
            }

            if (categoryList != null && categoryList.size() > 0) {

                for (Category category : categoryList) {
                    if(category.getCategory_type() == 6) { // Channel Category
                        if(category.isShowActive()) {
                            channel_resources.add(getCategoryResource(category, customer));
                        }
                    }
                    if(category.getCategory_type() == 7) { // Radio Category
                        if(category.isShowActive()) {
                            radio_resources.add(getCategoryResource(category, customer));
                        }
                    }
                }
            }

            search_results.add(video_resources);
            search_results.add(audio_resources);
            search_results.add(radio_resources);
            search_results.add(blogList);
            search_results.add(channel_resources);

            return new ResponseEntity<>(search_results, HttpStatus.OK);

        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    //admin search
    //parameters pass as query params, we have to use GET, not POST
    //example content/search?searchTitle=test&searchDate=testdate
    @RequestMapping(value = "admin/content/search/{contentType}", method = RequestMethod.GET)
    public ResponseEntity<?> getAllContentsBySearch(@PathVariable String contentType,
                                                    @RequestParam(value = "searchTitle", required = false) String searchTitle,
                                                    @RequestParam(value = "searchDate", required = false) String searchDate) {
        try {

            List<Content> contentList = new ArrayList<>();
            List<Resource<ContentThumbnailDTO>> resources = new ArrayList<Resource<ContentThumbnailDTO>>();

            Customer customer = null;

            if (sessionService.getUser() != null) {
                customer = sessionService.getUser().getCustomer();
            } else {
                customer = customerService.findByHost(sessionService.getHost());
            }

            if (customer != null) {

                //Search by title
                if (searchTitle != "" && searchTitle != null && searchDate == "" || searchDate == null) {

                    contentList = contentService.findAllByTitleForAdminSearch(customer.getId(), searchTitle, contentType);
                }

                //Search by date
                else if (searchDate != "" && searchDate != null && searchTitle == "" || searchTitle == null) {

                    contentList = getAllContentsByCurrent_Week_Month_Year(customer, searchDate, contentType);
                }

                //Search by both title and date
                else if (searchTitle != "" && searchTitle != null && searchDate != "" && searchDate != null) {

                    contentList = getAllContentsByCurrent_Week_Month_Year(customer, searchDate, contentType);
                    if (contentList != null && contentList.size() > 0) {

                        //Find content title from filtered content list
                        // contentList=contentList.stream().filter(content -> content.getTitle().contains(searchTitle)).collect(Collectors.toList());
                        List<ObjectId> contentIdList= contentList.stream().map(content -> content.getId()).collect(Collectors.toList());
                        contentList = contentService.findAllByTitleFromContentList(customer.getId(), contentIdList, searchTitle, contentType);

                    } else {
                        contentList = contentService.findAllByTitleForAdminSearch(customer.getId(), searchTitle, contentType);
                    }
                }

                ModelMapper modelMapper = new ModelMapper();

                if (contentList != null && contentList.size() > 0) {

                    ContentThumbnailDTO contentThumbnailDTO = null;

                    for (Content content : contentList) {
                        contentThumbnailDTO = modelMapper.map(content, ContentThumbnailDTO.class);
                        resources.add(getContentResource(contentThumbnailDTO, content, customer, false));
                    }
                }

            }

            return new ResponseEntity<>(resources, HttpStatus.OK);

        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }


    @RequestMapping(value = "session/user/myFavoriteList", method = RequestMethod.GET)
    public ResponseEntity<?> getMyFavoriteList() {
        try {

            Customer customer = null;

            if (sessionService.getUser() != null) {
                customer = sessionService.getUser().getCustomer();
            } else {
                customer = customerService.findByHost(sessionService.getHost());
            }

            List<Content> contentList = new ArrayList<>();
            List<Resource<ContentThumbnailDTO>> resources = new ArrayList<Resource<ContentThumbnailDTO>>();

            User user = sessionService.getUser();

            if (user != null) {
                if (user.getFavorites() != null && user.getFavorites().size() > 0) {

                    contentList = contentService.findMany(user.getFavorites().toArray(new ObjectId[user.getFavorites().size()]));

                    ModelMapper modelMapper = new ModelMapper();

                    ContentThumbnailDTO contentThumbnailDTO = null;

                    for (Content content : contentList) {
                        contentThumbnailDTO = modelMapper.map(content, ContentThumbnailDTO.class);
                        resources.add(getContentResource(contentThumbnailDTO, content, customer, false));
                    }
                }
            }
            else {
                user = new User();
                user.setSuccess(false);
                user.setMessage("user not exists %s");
                logger.info(String.format("user not exists %s"));
            }

            return new ResponseEntity<>(resources, HttpStatus.OK);

        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = "session/user/content_watch_history", method = RequestMethod.GET)
    public ResponseEntity<?> getContentWatchHistory() {
        try {

            Customer customer = null;

            if (sessionService.getUser() != null) {
                customer = sessionService.getUser().getCustomer();
            } else {
                customer = customerService.findByHost(sessionService.getHost());
            }

            User user = sessionService.getUser();

            List<ContentWatchHistoryDTOForUser> contentWatchHistoryList = new ArrayList<>();

            if (user != null) {
                List<ContentWatchHistory> watchHistoryList = watchHistoryService.findAllByUserId(user.getId(), true);

                if (watchHistoryList != null && watchHistoryList.size() > 0) {

                    for (ContentWatchHistory watchHistory : watchHistoryList) {

                        ModelMapper modelMapper = new ModelMapper();
                        ContentWatchHistoryDTOForUser watchHistoryDTOForUser = modelMapper.map(watchHistory, ContentWatchHistoryDTOForUser.class);

                        Content content = contentService.findByActiveDate(watchHistory.getContent_id().toString(), new Date());
                        if (content != null) {
                            modelMapper = new ModelMapper();

                            ContentThumbnailDTO contentThumbnailDTO = modelMapper.map(content, ContentThumbnailDTO.class);
                            Resource<ContentThumbnailDTO> contentResource = getContentResource(contentThumbnailDTO, content, customer, false);

                            watchHistoryDTOForUser.setContent(contentResource);
                        }
                        if (watchHistoryDTOForUser != null) {
                            contentWatchHistoryList.add(watchHistoryDTOForUser);
                        }
                    }
                }
            } else {
                user = new User();
                user.setSuccess(false);
                user.setMessage("user not exists %s");
                logger.info(String.format("user not exists %s"));
            }

            return new ResponseEntity<>(contentWatchHistoryList, HttpStatus.OK);

        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = "session/user/addtoplaylist/{playListId}/{contentId}", method = RequestMethod.PUT)
    public ResponseEntity<?> addContentToPlayList(@PathVariable String playListId, @PathVariable String contentId) {
        try {
            Response response = new Response();
            User user = sessionService.getUser();
            if (user != null) {

                List<PlayList> myPlayList = user.getPlayList();

                if (myPlayList != null && myPlayList.size() > 0) {

                    for (PlayList list : myPlayList) {

                        if (list.getId().equals(new ObjectId(playListId))) {

                            Content content = contentService.find(contentId);
                            if (content != null) {
                                if (content.isHas_episode()) {

                                    List<Content> childContentList = contentService.findChildContentByActiveDate(contentId, new Date());

                                    if (childContentList != null && childContentList.size() > 0) {

                                        List<ObjectId> contentList = list.getContentList();
                                        if (contentList == null) {
                                            contentList = new ArrayList<>();
                                        }

                                        for (Content child : childContentList) {
                                            if (!contentList.contains(child.getId())) {
                                                contentList.add(child.getId());
                                            }
                                        }

                                        list.setContentList(contentList);
                                        user = userService.update(user.getId(), user);
                                        if (user != null) {
                                            response.setSuccess(true);
                                            response.setMessage(AppMessages.ADDED_TO_PLAYLIST);
                                        }
                                    }
                                }
                                else {

                                    List<ObjectId> contentList = list.getContentList();
                                    if (contentList == null) {
                                        contentList = new ArrayList<>();
                                    }
                                    if (contentList.contains(new ObjectId(contentId))) {
                                        response.setSuccess(false);
                                        response.setMessage(AppMessages.PLAYLIST_CONTENT_EXISTS);
                                        break;
                                    } else {
                                        contentList.add(new ObjectId(contentId));
                                        list.setContentList(contentList);
                                        user = userService.update(user.getId(), user);
                                        if (user != null) {
                                            response.setSuccess(true);
                                            response.setMessage(AppMessages.ADDED_TO_PLAYLIST);
                                        }
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
            } else {
                response.setSuccess(false);
                response.setMessage("user not found!");
            }
            return new ResponseEntity<>(response, HttpStatus.OK);

        } catch (Exception e) {
            logger.error(ExceptionMessages.UNEXPECTED_MESSAGE, e.getMessage());
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = "session/user/myPlayList/{playListId}", method = RequestMethod.GET)
    public ResponseEntity<?> getMyPlayList(@PathVariable String playListId) {
        try {

            Customer customer = null;

            if (sessionService.getUser() != null) {
                customer = sessionService.getUser().getCustomer();
            } else {
                customer = customerService.findByHost(sessionService.getHost());
            }

            List<Content> contentList = new ArrayList<>();
            List<Resource<ContentThumbnailDTO>> resources = new ArrayList<Resource<ContentThumbnailDTO>>();

            User user = sessionService.getUser();

            if (user != null) {
                List<UserSubscriptionDTO> userSubscriptions = null;
                String feature = "";
                boolean isPaid = false;
                feature = "Audio On Demand";

                if (user != null) {
                    userSubscriptions = userSubscriptionService.findSubscriberByUser(user.getId());
                    if(userSubscriptions != null && userSubscriptions.size() > 0) {
                        if(userSubscriptions.get(0).getSubscriptionInfo().getFeatures().contains(feature)) {
                            isPaid = true;
                        } else {
                            isPaid = false;
                        }
                    } else {
                        isPaid = false;
                    }
                }
                if (user.getPlayList() != null && user.getPlayList().size() > 0) {

                    List<PlayList> playList = user.getPlayList().stream().filter(list -> list.getId().equals(new ObjectId(playListId))).collect(Collectors.toList());
                    if (playList != null && playList.size() > 0) {

                        if (playList.get(0).getContentList() != null && playList.get(0).getContentList().size() > 0) {

                            contentList = contentService.findManyOnlyActive(playList.get(0).getContentList().toArray(new ObjectId[playList.get(0).getContentList().size()]), new Date());

                            ModelMapper modelMapper = new ModelMapper();

                            ContentThumbnailDTO contentThumbnailDTO = null;

                            for (Content content : contentList) {

                                if (content.getParent_content_id() != null) {

                                    Content parent_content = contentService.findByActiveDate(content.getParent_content_id().toString(), new Date());

                                    if (parent_content.is_premium() && (user.isIs_premium() || !isPaid)) {
                                        content.setIs_premium(true);
                                    } else {
                                        content.setIs_premium(false);
                                    }
                                }
                                contentThumbnailDTO = modelMapper.map(content, ContentThumbnailDTO.class);
                                resources.add(getContentResource(contentThumbnailDTO, content, customer, false));
                            }
                        }
                    }
                }
            } else {
                user = new User();
                user.setSuccess(false);
                user.setMessage("user not exists %s");
                logger.info(String.format("user not exists %s"));
            }

            return new ResponseEntity<>(resources, HttpStatus.OK);

        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = "session/user/myplaylist/playallsongs/{playListId}", method = RequestMethod.GET)
    public ResponseEntity<?> playAllSongs(@PathVariable String playListId) {
        try {

            VideoPlayWrapper videoPlayWrapper = new VideoPlayWrapper();
            List<VideoPlayInfo> videoPlayInfoList = new ArrayList<>();

            User user = sessionService.getUser();

            if (user != null) {
                List<UserSubscriptionDTO> userSubscriptions = null;
                String feature = "";
                boolean isPaid = false;
                feature = "Audio On Demand";

                if (user != null) {
                    userSubscriptions = userSubscriptionService.findSubscriberByUser(user.getId());
                    if(userSubscriptions != null && userSubscriptions.size() > 0) {
                            if(userSubscriptions.get(0).getSubscriptionInfo().getFeatures().contains(feature)) {
                                    isPaid = true;
                                } else {
                                    isPaid = false;
                                }
                        } else {
                            isPaid = false;
                        }
                }

                if (user.getPlayList() != null && user.getPlayList().size() > 0) {

                    List<PlayList> playList = user.getPlayList().stream().filter(list -> list.getId().equals(new ObjectId(playListId))).collect(Collectors.toList());
                    if (playList != null && playList.size() > 0) {

                        if (playList.get(0).getContentList() != null && playList.get(0).getContentList().size() > 0) {

                            List<Content> contentList = contentService.findManyOnlyActive(playList.get(0).getContentList().toArray(new ObjectId[playList.get(0).getContentList().size()]), new Date());

                            for (Content content : contentList) {
                                try {
                                    String bannerUrl = "";
                                    String thumbnailUrl = "";
                                    boolean addVideoUrl = false;

                                    if (content.getParent_content_id() != null) {

                                        Content parent_content = contentService.findByActiveDate(content.getParent_content_id().toString(), new Date());

                                        if (parent_content != null) {
                                            bannerUrl = s3Service.getAWSUrl(parent_content.getBanner_aws_info().getId(), user.getCustomer().getAws_bucket());
                                            thumbnailUrl = s3Service.getAWSUrl(parent_content.getThumbnail_aws_info().getId(), user.getCustomer().getAws_bucket());
                                        }

                                        if (parent_content.is_premium() && (user.isIs_premium() || isPaid)) {
                                            addVideoUrl = true;
                                        }
                                        else if (parent_content.getPayperviewCategoryId() != null) {

                                            Category category = categoryService.find(parent_content.getPayperviewCategoryId());

                                            if (category != null) {

                                                if ((isPaid || user.isIs_premium()) && category.getPremium_price() <= 0) {
                                                    addVideoUrl = true;
                                                }
                                                else {

                                                    List<PaymentCompleted> paymentCompletedList = null;

                                                    if (user.getPaymentInfo() != null)
                                                        paymentCompletedList = user.getPaymentInfo().getPaymentCompletedList();

                                                    if (paymentCompletedList != null && paymentCompletedList.size() > 0) {
                                                        if (paymentCompletedList.stream().filter(o -> o.getProduct_reference_id().equals(parent_content.getId().toString())).findFirst().isPresent()) {
                                                            addVideoUrl = true;
                                                        }
                                                    }
                                                }
                                            }

                                        }
                                        else if (!parent_content.is_premium()) {
                                            addVideoUrl = true;
                                        }
                                    }

                                    if (addVideoUrl) {
                                        boolean isSecure = true;
                                        VideoPlayInfo videoPlayInfo = getAudioPlayUrls(content, user.getCustomer().getAws_bucket(), user.getEmail());
                                        videoPlayInfo.setAudioBanner(bannerUrl);
                                        videoPlayInfo.setAudioThumbnail(thumbnailUrl);
                                        videoPlayInfo.setTitle(content.getTitle());
                                        videoPlayInfoList.add(videoPlayInfo);

                                    }

                                } catch (Exception e) {
                                    e.printStackTrace();
                                }
                            }

                            if (videoPlayInfoList != null && videoPlayInfoList.size() > 0) {
                                videoPlayWrapper.setVideoPlayInfoList(videoPlayInfoList);
                                videoPlayWrapper.setSuccess(true);
                            } else {
                                videoPlayWrapper.setSuccess(false);
                            }
                        }
                    }
                }

            } else {
                user = new User();
                user.setSuccess(false);
                user.setMessage("user not exists %s");
                logger.info(String.format("user not exists %s"));
            }

            return new ResponseEntity<>(videoPlayWrapper, HttpStatus.OK);

        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    private VideoPlayInfo getAudioPlayUrls(Content content, String awsBucket, String email) throws Exception {

        VideoPlayInfo videoPlayInfo = new VideoPlayInfo();

        AWSInfo awsInfo = content.getAws_info_480p();

        if (awsInfo != null) {
            videoPlayInfo.setSdVideoUrl(s3Service.getAWSUrl(awsInfo.getId(), awsBucket));
            // videoPlayInfo.setSdVideoUrl(s3Service.getSignedVideoUrl(awsInfo.getId(), email));
        }

        return videoPlayInfo;
    }

    /****************************************************
     * NON SECURE API -- END
     **************************************************** */

    private void attachParentContent(Content content) {
        ParentContent parentContent = null;

        if(content != null && content.getParent_content_id() != null) {

            Content parContent = contentService.find(content.getParent_content_id());

            if(parContent != null) {
                parentContent = new ParentContent();
                parentContent.setId(parContent.getId());
                parentContent.setTitle(parContent.getTitle());
                parentContent.setUiPath(getUIContentPath(parContent.getId().toString()));
                content.setParentContent(parentContent);

                //if child does not bave banner the get the banner form the parent
                if(content.getBanner_aws_info() == null && parContent.getBanner_aws_info() != null) {
                    content.setBanner_aws_info(parContent.getBanner_aws_info());
                }

                if(parContent.getParent_content_id() != null) {
                    attachParentContent(parContent);
                }
            }

        }
    }


    private Content initializeContent(final ContentDTO contentDTO, Content content, boolean isCreate) {

        content.setTitle(contentDTO.getTitle());
        content.setDescription(contentDTO.getDescription());
        content.setContent_type(contentDTO.getContent_type());
        content.setIs_premium(contentDTO.isIs_premium());
        content.setHas_episode(contentDTO.isHas_episode());
        content.setIs_Channel(contentDTO.is_Channel());
        content.setIs_organized_by_season(contentDTO.is_organized_by_season());
        content.setSeason_number(contentDTO.getSeason_number());
        content.setYoutube_VideoLink(contentDTO.getYoutube_VideoLink());
        content.setYoutube_TrailerLink(contentDTO.getYoutube_TrailerLink());
        content.setYear(contentDTO.getYear());
        content.setActive_date(contentDTO.getActive_date());

        if(isCreate) {
            content.setCustomer_id(sessionService.getUser().getCustomer_id());
            content.setCreated_by(sessionService.getUser().getId());
            content.setCreated_at(DateHelper.getCurrentDate());
        }

        content.setUpdated_by(sessionService.getUser().getId());
        content.setUpdated_at(DateHelper.getCurrentDate());

        return content;
    }

    private Content addCategoryToContent(Content content, String[] categoryIdList) {
        try {

            final Content updateContent = content;
            List<ObjectId> categoryListToAdd = new ArrayList<>();

            List<Category> categoryList = categoryService.findMany(sessionService.getUser().getCustomer_id(), ArrayHelper.convertStringToObjectId(categoryIdList));
            if (categoryList != null) {

                //add content in category
                //loop through and add content to all the category
                categoryList.forEach(category -> {

                    if (category.getCategory_type() == CategoryType.PAYPERVIEW.getValue()) {
                        updateContent.setPayperviewCategoryId(category.getId());
                    } else {
                        categoryListToAdd.add(category.getId());
                    }

                    //New content order list to be added
                    List<ContentOrder> contentOrderListToAdd = category.getContentOrderList();

                    if (contentOrderListToAdd == null) {
                        contentOrderListToAdd = new ArrayList<>();
                    }

                    // if (!contentOrderListToAdd.contains(updateContent.getId())) {

                    ContentOrder contentOrder = new ContentOrder();
                    String uniqueName = Category.class.getName() + "_" + category.getId();
                    contentOrder.setSort_order(counterHelper.getNextSequence(uniqueName));
                    contentOrder.setContent_id(updateContent.getId());
                    contentOrderListToAdd.add(contentOrder);

                    category.setContentOrderList(contentOrderListToAdd);
                    category.setUpdated_at(DateHelper.getCurrentDate());
                    categoryService.update(category.getId(), category);
                    // }
                });

                //add category in content
                List<ObjectId> contentCategoryList = updateContent.getCategoryList();
                if (contentCategoryList == null) {
                    contentCategoryList = new ArrayList<>();
                }

                contentCategoryList.addAll(categoryListToAdd);
                if (contentCategoryList != null && contentCategoryList.size() > 0) {
                    updateContent.setCategoryList(contentCategoryList);
                }
                content = contentService.update(updateContent);
            }
            return content;
        } catch (Exception e) {
            logger.error(ExceptionMessages.UNEXPECTED_MESSAGE, e);
            return null;
        }
    }

    private Resource<Content> getContentResource(Content content, Customer customer, boolean isSecure) {

        Resource<Content> resource = new Resource<Content>(content);

        resource.add(new Link(getUIContentPath(content.getId().toString()), "UIHref"));

        appendAWSInfo(resource,content,customer.getAws_bucket(), isSecure);

        return resource;
    }

    private Resource<ContentThumbnailDTO> getContentResource(ContentThumbnailDTO contentThumbnailDTO, Content content, Customer customer, boolean isSecure) {

        Resource<ContentThumbnailDTO> resource = new Resource<ContentThumbnailDTO>(contentThumbnailDTO);

        resource.add(new Link(getUIContentPath(content.getId().toString()), "UIHref"));

        appendThumbnailAWSInfo(resource, content, customer.getAws_bucket(), isSecure);
        appendBannerAWSInfo(resource, content, customer.getAws_bucket(), isSecure);

        return resource;
    }

    private Resource<Category> getCategoryResource(Category category, Customer customer) {

        Resource<Category> resource = new Resource<Category>(category);

        resource.add(new Link(getUICategoryPath(category.getId().toString()), "UIHref"));
        if(category.getBanner_aws_info() != null)
            resource.add(new Link(s3Service.getAWSUrl(category.getBanner_aws_info().getId(), customer.getAws_bucket()), "awsBannerUrl"));
        if(category.getThumbnail_aws_info() != null)
            resource.add(new Link(s3Service.getAWSUrl(category.getThumbnail_aws_info().getId(), customer.getAws_bucket()), "awsThumbnailUrl"));

        return resource;
    }

    private Resource<Content> getContentPlayResource(Content content, Customer customer, boolean isSecure) {

        Resource<Content> resource = new Resource<Content>(content);

        resource.add(new Link(getUIContentPath(content.getId().toString()), "UIHref"));

        appendAWSPlayInfo(resource, content, customer.getAws_bucket(), isSecure);

        return resource;
    }

    //
    private Resource<Content> getContentResource(String parentContentId, Content episodeContent, Customer customer, boolean isSecure) {

        Resource<Content> resource = new Resource<Content>(episodeContent);

        resource.add(new Link(getUIEpisodeContentPath(parentContentId, episodeContent.getId().toString()), "UIHref"));

        appendAWSInfo(resource, episodeContent,customer.getAws_bucket(), isSecure);

        return resource;
    }


    private void appendAWSInfo(Resource<Content> resource, Content content, String awsBucket, boolean isSecure) {

        if(content.getBanner_aws_info() != null)
            resource.add(new Link(s3Service.getAWSUrl(content.getBanner_aws_info().getId(),awsBucket), "awsBannerUrl"));

        if(content.getThumbnail_aws_info() != null)
            resource.add(new Link(s3Service.getAWSUrl(content.getThumbnail_aws_info().getId(), awsBucket), "awsThumbnailUrl"));

        if(content.getTrailer_aws_info() != null)
            resource.add(new Link(s3Service.getAWSUrl(content.getTrailer_aws_info().getId(), awsBucket), "awsTrailerUrl"));
    }

    private void appendThumbnailAWSInfo(Resource<ContentThumbnailDTO> resource, Content content, String awsBucket, boolean isSecure) {

        if(content.getThumbnail_aws_info() != null)
            resource.add(new Link(s3Service.getAWSUrl(content.getThumbnail_aws_info().getId(), awsBucket), "awsThumbnailUrl"));
    }

    private void appendBannerAWSInfo(Resource<ContentThumbnailDTO> resource, Content content, String awsBucket, boolean isSecure) {

        if(content.getBanner_aws_info() != null)
            resource.add(new Link(s3Service.getAWSUrl(content.getBanner_aws_info().getId(), awsBucket), "awsBannerUrl"));
    }

    private void appendAWSPlayInfo(Resource<Content> resource, Content content, String awsBucket, boolean isSecure) {

        if(content.getAws_info_360p() != null)
            resource.add(new Link(s3Service.getAWSUrl(content.getAws_info_360p().getId(), awsBucket), "aws360VideoUrl"));

        if(content.getAws_info_480p() != null)
            resource.add(new Link(s3Service.getAWSUrl(content.getAws_info_480p().getId(), awsBucket), "awsContentUrl"));

        if(content.getAws_info_720p() != null)
            resource.add(new Link(s3Service.getAWSUrl(content.getAws_info_720p().getId(), awsBucket), "aws720VideoUrl"));

        if(content.getAws_info_1080p() != null)
            resource.add(new Link(s3Service.getAWSUrl(content.getAws_info_1080p().getId(), awsBucket), "aws1080VideoUrl"));
    }

    private AWSInfo appendAWSPlayInfo(Content content, String awsBucket, boolean isSecure) {

        AWSInfo awsInfo = content.getAws_info_480p();

        if(awsInfo != null) {
            awsInfo.setAwsUrl(s3Service.getAWSUrl(awsInfo.getId(), awsBucket));
            return awsInfo;
        }
        else
            return null;
    }

    private VideoPlayInfo getVideoUrl(Device device, Content content, String awsBucket, User user) throws Exception {
        //List<VideoPlayInfo> videoPlayInfoList = new ArrayList<>();
        VideoPlayInfo videoPlayInfo = new VideoPlayInfo();
        if(StringUtils.isNotBlank(content.getYoutube_VideoLink())) {
            videoPlayInfo.setIsIsYouTubeUrl(true);
            videoPlayInfo.setSdVideoUrl(content.getYoutube_VideoLink());
            //videoPlayInfoList.add(videoPlayInfo);
        }
        else {
            AWSInfo awsInfo = null;
            if(device.isMobile()) {
                awsInfo = content.getAws_info_360p();
                if(awsInfo != null) {
//                    videoPlayInfo.setSdVideoUrl(s3Service.getSignedVideoUrl(awsInfo.getId(), user.getEmail()));
                    videoPlayInfo.setSdVideoUrl(s3Service.getSignUrlCanned(distributionDomain, certificateId, awsInfo.getId()));
                    //videoPlayInfoList.add(videoPlayInfo);
                }
            } else if(device.isTablet()) {
                awsInfo = content.getAws_info_480p();
                if(awsInfo != null) {
                    videoPlayInfo.setSdVideoUrl(s3Service.getSignUrlCanned(distributionDomain, certificateId, awsInfo.getId()));
                    //videoPlayInfoList.add(videoPlayInfo);
                }
            } else {
                awsInfo = content.getAws_info_480p();
                if(awsInfo != null) {
                    if(content.getContent_type().equals("audio")){
                        videoPlayInfo.setSdVideoUrl(s3Service.getAWSUrl(awsInfo.getId(), awsBucket));
                    }
                    else {
                        videoPlayInfo.setSdVideoUrl(s3Service.getSignUrlCanned(distributionDomain, certificateId, awsInfo.getId()));
                    }
                }
                awsInfo = content.getAws_info_720p();
                if (awsInfo != null) {
                    videoPlayInfo.setHdVideoUrl(s3Service.getSignUrlCanned(distributionDomain, certificateId, awsInfo.getId()));
                }
            }
            if(videoPlayInfo!=null){
                createAccessLog(videoPlayInfo.getSdVideoUrl(), user, content);
            }

        }

        return videoPlayInfo;
    }

    private void createAccessLog(String signedVideoUrl, User user, Content content) throws Exception {
        try{
            if( signedVideoUrl != null ) {
                ContentUsageHistory usageHistory = new ContentUsageHistory();
                usageHistory.setAccess_url(signedVideoUrl);
                usageHistory.setUser_id(user.getId());
                usageHistory.setEmail(user.getEmail());
                usageHistory.setContent_id(content.getId());
                usageHistory.setContentTitle(content.getTitle());
                historyService.create(usageHistory);
            }

        }catch (Exception e) {
            logger.error(e.getMessage(), e);
        }

    }

    private String getUIContentPath(String contentId) {
        return "/session/content/" + contentId;
    }

    private String getUICategoryPath(String categoryId) {
        return "/session/category/" + categoryId;
    }

    private String getUIEpisodeContentPath(String contentId, String episodeId) {
        return "/session/content/" + contentId + "/" + episodeId;
    }

    private List<Content> getAllContentsByCurrent_Week_Month_Year(Customer customer, String searchDate, String contentType) {
        try {

            List<Content> contentList = new ArrayList<>();

            Date currentDate = DateHelper.getCurrentDate();
            LocalDateTime localDateTime = LocalDateTime.now();

            //This week
            if (searchDate.equals("1")) {

                localDateTime = localDateTime.minusDays(7).withHour(00).withMinute(00).withSecond(00);
                Instant instant = localDateTime.atZone(ZoneId.systemDefault()).toInstant();
                Date fromDate = Date.from(instant);

                contentList = contentService.findAllByCurrent_Week_Month_Year_Uploaded(customer.getId(), fromDate, currentDate, contentType);
            }
            //This month
            else if (searchDate.equals("2")) {

                localDateTime = localDateTime.withDayOfMonth(1).withHour(00).withMinute(00).withSecond(00);
                Instant instant = localDateTime.atZone(ZoneId.systemDefault()).toInstant();
                Date fromDate = Date.from(instant);

                contentList = contentService.findAllByCurrent_Week_Month_Year_Uploaded(customer.getId(), fromDate, currentDate, contentType);
            }
            //This year
            else if (searchDate.equals("3")) {
                localDateTime = localDateTime.withDayOfYear(1).withDayOfMonth(1).withHour(00).withMinute(00).withSecond(00);
                Instant instant = localDateTime.atZone(ZoneId.systemDefault()).toInstant();
                Date fromDate = Date.from(instant);

                contentList = contentService.findAllByCurrent_Week_Month_Year_Uploaded(customer.getId(), fromDate, currentDate, contentType);
            }
            //Before this year
            else if (searchDate.equals("4")) {
                localDateTime = localDateTime.withDayOfYear(1).withDayOfMonth(1).withHour(00).withMinute(00).withSecond(00);
                Instant instant = localDateTime.atZone(ZoneId.systemDefault()).toInstant();
                Date toDate = Date.from(instant);

                contentList = contentService.findAllByBeforeThisYear_Uploaded(customer.getId(), toDate, contentType);
            }

            return contentList;
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            return null;
        }
    }


}
