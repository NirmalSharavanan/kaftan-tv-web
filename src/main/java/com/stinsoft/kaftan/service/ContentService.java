package com.stinsoft.kaftan.service;

import com.amazonaws.services.s3.model.PutObjectResult;
import com.stinsoft.kaftan.dto.ReOrderDTO;
import com.stinsoft.kaftan.model.Content;
import com.stinsoft.kaftan.repository.ContentRepository;
import org.apache.commons.lang3.StringUtils;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import ss.core.aws.AWSInfo;
import ss.core.aws.IS3UploadCallBack;
import ss.core.aws.S3Service;
import ss.core.helper.ArrayHelper;
import ss.core.helper.DateHelper;
import ss.core.helper.ImageHelper;
import ss.core.model.Customer;
import ss.core.security.service.ISessionService;
import ss.core.service.CustomerService;

import java.io.IOException;
import java.io.InputStream;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ContentService implements IContentService {

    @Autowired
    ContentRepository contentRepository;

    @Autowired
    S3Service s3Service;

    @Autowired
    ISessionService sessionService;

    @Autowired
    CustomerService customerService;

    @Autowired
    ImageHelper imageHelper;

    private Logger logger = LoggerFactory.getLogger(ContentService.class);

    @Override
    public Content create(Content content) {
        return contentRepository.save(content);
    }

    @Override
    public Content find(String id) {
        return contentRepository.findOne(new ObjectId(id));
    }

    @Override
    public Content find(ObjectId id) {
        return contentRepository.findOne(id);
    }

    @Override
    public Content findByActiveDate(String id, Date active_date) {
        return contentRepository.findByActiveDate(new ObjectId(id), active_date);
    }

    @Override
    public Content findByOriginalFileId(String id) {
        return contentRepository.findByOriginalFileId(id);
    }

    @Override
    public Content findContentByTitle(String name) {
        return contentRepository.findContentByTitle(name);
    }


    @Override
    public List<Content> findChildContent(String parent_content_id) {
        return this.findChildContent(new ObjectId(parent_content_id));
    }

    @Override
    public List<Content> findChildContent(ObjectId parent_content_id) {
        return contentRepository.findChildContent(parent_content_id, new Sort(Sort.Direction.DESC, "sort_order"));
    }

    @Override
    public List<Content> findChildContentByActiveDate(String parent_content_id, Date active_date) {
        return contentRepository.findChildContentByActiveDate(new ObjectId(parent_content_id), active_date, new Sort(Sort.Direction.DESC, "sort_order"));
    }

    @Override
    public List<Content> findAll() {
        return null;
    }

    @Override
    public Content update(Content content) {
        return contentRepository.save(content);
    }

    @Override
    public Content updateBannerImage(ObjectId id, MultipartFile bannerImage, boolean isCompress) {
        final Content content = contentRepository.findOne(id);
        InputStream stream = null;
        try {

            if (content != null) {
                AWSInfo awsInfo = content.getBanner_aws_info();
                if (awsInfo == null) {
                    awsInfo = new AWSInfo();
                } else {
                    //Delete the old thumbnail image in AWS
                    s3Service.delete(awsInfo.getId());
                }
                //upload the new banner image from AWS
                String uniqueImageID = s3Service.getUniqueId(bannerImage.getOriginalFilename());

                stream = bannerImage.getInputStream();

                if (isCompress) {
                    stream = imageHelper.createBannerImage(stream);
                }

                PutObjectResult putObjectResult = s3Service.upload(uniqueImageID, stream);
                if (putObjectResult != null) {

                    awsInfo.setId(uniqueImageID);
                    awsInfo.seteTag(putObjectResult.getETag());
                    awsInfo.setContentType(bannerImage.getContentType());
                    content.setBanner_aws_info(awsInfo);

                    content.setUpdated_by(sessionService.getCustomer().getId());
                    content.setCreated_at(DateHelper.getCurrentDate());
                    content.setUpdated_at(DateHelper.getCurrentDate());
                    return contentRepository.save(content);
                }
            }
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
        } finally {
            try {
                stream.close();
            } catch (IOException ex) {
                logger.error("Error in updateBannerImage: "+ex.getMessage(), ex);
            }
        }

        return content;
    }

    @Override
    public Content updateThumbnailImage(ObjectId id, MultipartFile thumbnailImage, boolean isCompress) {
        final Content content = contentRepository.findOne(id);
        InputStream stream = null;
        try {

            if (content != null) {
                AWSInfo awsInfo = content.getThumbnail_aws_info();
                if (awsInfo == null) {
                    awsInfo = new AWSInfo();
                } else {
                    //Delete the old thumbnail image in AWS
                    s3Service.delete(awsInfo.getId());
                }
                //upload the new thumbnail image from AWS
                String uniqueImageID = s3Service.getUniqueId(thumbnailImage.getOriginalFilename());

                stream = thumbnailImage.getInputStream();
                if(isCompress){
                    stream = imageHelper.createThumbnailImage(stream);
                }

                PutObjectResult putObjectResult = s3Service.upload(uniqueImageID, stream);
                if (putObjectResult != null) {

                    awsInfo.setId(uniqueImageID);
                    awsInfo.seteTag(putObjectResult.getETag());
                    awsInfo.setContentType(thumbnailImage.getContentType());
                    content.setThumbnail_aws_info(awsInfo);

                    content.setUpdated_by(sessionService.getCustomer().getId());
                    content.setCreated_at(DateHelper.getCurrentDate());
                    content.setUpdated_at(DateHelper.getCurrentDate());
                    return contentRepository.save(content);
                }
            }
        }
        catch (Exception e) {
            logger.error(e.getMessage(), e);
        } finally {
            try {
                stream.close();
            } catch (IOException ex) {
                logger.error("Error in updateThumbnailImage: "+ex.getMessage(), ex);
            }
        }

        return content;
    }

    @Override
    public Content updateWebVideoAudio(ObjectId id, MultipartFile videoAudioContent) {
        Content content = contentRepository.findOne(id);
        if (content != null) {

            String original_file_id = content.getOriginal_file_id();

            //delete old files if already there
            if (StringUtils.isNotEmpty(original_file_id) && original_file_id != null) {
                //originalFile
                s3Service.delete(original_file_id);

                if(content.getAws_info_360p() != null)
                    s3Service.delete(content.getAws_info_360p().getId());

                if(content.getAws_info_480p() != null)
                    s3Service.delete(content.getAws_info_480p().getId());

                if(content.getAws_info_720p() != null)
                    s3Service.delete(content.getAws_info_720p().getId());
            }

            IS3UploadCallBack iS3UploadCallBack = new ContentUploadService(id.toString(), ContentUploadService.VIDEO_TYPE.WEB, videoAudioContent.getContentType(), contentRepository);
            String uniqueImageID = s3Service.getUniqueIdForVideo(videoAudioContent.getOriginalFilename());

            try {
                content.setUploadInProgress(true);
                content = contentRepository.save(content);

                s3Service.uploadAsync(uniqueImageID, videoAudioContent.getInputStream(), iS3UploadCallBack);

            } catch (IOException e) {
                logger.error(e.getMessage(), e);
            }
        }
        return content;
    }

    @Override
    //TRAILER UPLOAD moved to youtube link, this method may nt be used
    public Content updateTrailerVideoAudio(ObjectId id, MultipartFile videoAudioContent) {
        Content content = contentRepository.findOne(id);
        if (content != null) {
            AWSInfo awsInfo = content.getTrailer_aws_info();
            if (awsInfo == null) {
                awsInfo = new AWSInfo();
            }
            else {
                //Delete the old video/audio image in AWS
                s3Service.delete(awsInfo.getId());
            }
            IS3UploadCallBack iS3UploadCallBack = new ContentUploadService(id.toString(), ContentUploadService.VIDEO_TYPE.TRAILER, videoAudioContent.getContentType(), contentRepository);
            String uniqueImageID = s3Service.getUniqueIdForVideo(videoAudioContent.getOriginalFilename());

            try {
                //awsInfo.setUploadInProgress(true);
                content.setTrailer_aws_info(awsInfo);
                content = contentRepository.save(content);

                s3Service.uploadAsync(uniqueImageID, videoAudioContent.getInputStream(), iS3UploadCallBack);

            } catch (IOException e) {
                logger.error(e.getMessage(), e);
            }
        }
        return content;
    }

    @Override
    public boolean episodeReOrder(List<ReOrderDTO> reOrderDTOList, ObjectId contentId) {
        try {
            boolean isSwapSuccess = false;

            if (reOrderDTOList != null && reOrderDTOList.size() > 0) {
                Map<ObjectId, Integer> map = new HashMap<ObjectId, Integer>();

                for (ReOrderDTO reOrderDTO : reOrderDTOList) {
                    map.put(new ObjectId(reOrderDTO.getId()), reOrderDTO.getSort_order());
                }

                //get all records wit sort order range
                Content content = contentRepository.findOne(contentId);
                if (content != null) {

                    if (content.isHas_episode()) {

                        List<Content> contentList = new ArrayList<>();
                        contentList = contentRepository.findChildContent(contentId, new Sort(Sort.Direction.DESC, "sort_order"));

                        if (contentList != null && contentList.size() > 0) {

                            //upload the order for all the records
                            for (Content episode : contentList) {

                                if (map.containsKey(episode.getId())) {
                                    episode.setSort_order(map.get(episode.getId()));

                                    //update DB
                                    contentRepository.save(episode);
                                }

                            }

                            isSwapSuccess = true;
                        }
                    }
                }
            }
            return isSwapSuccess;
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
        }
            return false;
    }

    @Override
    public List<Content> getAllContents(ObjectId customerId) {
        try {
        	//TODO Pagination needed for lazy loading
            return contentRepository.findAllContent(customerId, new Sort(Sort.Direction.DESC, "updated_at"));
        }
        catch (Exception e){
            logger.error(e.getMessage(), e);
        }
        return  null;
    }

    @Override
    public List<Content> getAllContentsByContentType(ObjectId customerId, String contentType) {
        try {
            //TODO Pagination needed for lazy loading
            return contentRepository.findAllContentByContentType(customerId, contentType, new Sort(Sort.Direction.DESC, "updated_at"));
        }
        catch (Exception e){
            logger.error(e.getMessage(), e);
        }
        return  null;
    }

    @Override
    public List<Content> findAllContentWithEpisodes(ObjectId customerId) {
        try {

            Customer customer = null;

            if (sessionService.getUser() != null) {
                customer = sessionService.getUser().getCustomer();
            } else {
                customer = customerService.findByHost(sessionService.getHost());
            }

            List<Content> contentList = contentRepository.findAllContentWithEpisodes(customer.getId());

            if (contentList != null) {

                Map<ObjectId, String> contentMap = contentList.stream().collect(Collectors.toMap(x -> x.getId(), x -> x.getTitle()));

                for (Content content : contentList) {
                    if (content.getParent_content_id() != null) {
                        String parentName = contentMap.get(content.getParent_content_id());
                        content.setTitle(parentName + " - " + content.getTitle());
                    }
                }

                Collections.sort(contentList);
            }

            return contentList;
        }
        catch (Exception e){
            logger.error(e.getMessage(), e);
        }
        return  null;
    }

    @Override
    public List<Content> findUnAssignedContentWithEpisodesForCategoryId(ObjectId customerId, ObjectId[] contentIds) {
        try {

            Customer customer = null;

            if (sessionService.getUser() != null) {
                customer = sessionService.getUser().getCustomer();
            } else {
                customer = customerService.findByHost(sessionService.getHost());
            }

            List<Content> contentList = contentRepository.findContentWithEpisodesForCategoryId(customer.getId(), contentIds);

            if (contentList != null) {

                Map<ObjectId, String> contentMap = contentList.stream().collect(Collectors.toMap(x -> x.getId(), x -> x.getTitle()));

                for (Content content : contentList) {
                   if(content.getParent_content_id() != null){
                        String parentName = contentMap.get(content.getParent_content_id());
                        if(parentName != null && parentName !=""){
                            content.setTitle(parentName + " - " + content.getTitle());
                        }
                    }
                }
                Collections.sort(contentList);
            }

            return contentList;
        }
        catch (Exception e){
            logger.error(e.getMessage(), e);
        }
        return  null;
    }

    @Override
    public List<Content> findUnAssignedContentForCategoryId(ObjectId customerId, ObjectId[] contentIds) {
        try {
            return contentRepository.findUnAssignedContentForCategoryId(customerId, contentIds);
        }
        catch (Exception e){
            logger.error(e.getMessage(), e);
        }
        return  null;
    }

    @Override
    public List<Content> findMany(String[] contentIds) {
        return this.findMany(ArrayHelper.convertStringToObjectId(contentIds) );
    }

    @Override
    public List<Content> findMany(ObjectId[] contentIds) {
        try {

            if(contentIds != null && contentIds.length > 0) {
                return contentRepository.findMany(contentIds);
            }
            else
                return null;

        } catch (Exception e){
            logger.error(e.getMessage(), e);
        }
        return  null;
    }

    @Override
    public List<Content> findManyOnlyActiveForAdmin(ObjectId[] contentIds) {
        try {

            if(contentIds != null && contentIds.length > 0) {
                return contentRepository.findManyOnlyActiveForAdmin(contentIds);
            }
            else
                return null;

        } catch (Exception e){
            logger.error(e.getMessage(), e);
        }
        return  null;
    }

    @Override
    public List<Content> findManyOnlyActive(ObjectId[] contentIds, Date active_date) {
        try {

            if(contentIds != null && contentIds.length > 0) {
                return contentRepository.findManyOnlyActive(contentIds, active_date);
            }
            else
                return null;

        } catch (Exception e){
            logger.error(e.getMessage(), e);
        }
        return  null;
    }

    @Override
    public List<Content> findAllByTitleForUserSearch(ObjectId customerId, String title, Date active_date) {
        try {
            return contentRepository.findAllByTitleForUserSearch(customerId, title, active_date);
        }
        catch (Exception e) {
            logger.error(e.getMessage(), e);
        }

        return null;
    }

    @Override
    public List<Content> findAllByTitleForAdminSearch(ObjectId customerId, String title, String contentType) {
        try {
            return contentRepository.findAllByTitleForAdminSearch(customerId, title, contentType);
        }
        catch (Exception e) {
            logger.error(e.getMessage(), e);
        }

        return null;
    }

    @Override
    public List<Content> findAllByCurrent_Week_Month_Year_Uploaded(ObjectId customerId, Date fromDate, Date toDate, String contentType) {
        try {
            return contentRepository.findAllByCurrent_Week_Month_Year_Uploaded(customerId, fromDate, toDate, contentType);
        }
        catch (Exception e) {
            logger.error(e.getMessage(), e);
        }

        return null;
    }

    @Override
    public List<Content> findAllByBeforeThisYear_Uploaded(ObjectId customerId, Date toDate, String contentType) {
        try {
            return contentRepository.findAllByBeforeThisYear_Uploaded(customerId, toDate, contentType);
        }
        catch (Exception e) {
            logger.error(e.getMessage(), e);
        }

        return null;
    }

    @Override
    public List<Content> findAllByTitleFromContentList(ObjectId customerId, List<ObjectId> contentIds, String title, String contentType) {
        try {
            return contentRepository.findAllByTitleFromContentList(customerId, contentIds, title, contentType);
        }
        catch (Exception e) {
            logger.error(e.getMessage(), e);
        }

        return null;
    }

    @Override
    public ObjectId delete(ObjectId id) {
        contentRepository.delete(id);
        return id;
    }


}
