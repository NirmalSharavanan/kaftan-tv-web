package com.stinsoft.kaftan.service;

import com.stinsoft.kaftan.dto.ReOrderDTO;
import com.stinsoft.kaftan.model.Content;
import org.bson.types.ObjectId;
import org.springframework.web.multipart.MultipartFile;

import java.util.Date;
import java.util.List;

public interface IContentService {

    Content create(Content object);

    Content find(String id);

    Content find(ObjectId id);

    Content findByActiveDate(String id, Date active_date);

    Content findByOriginalFileId(String id);

    Content findContentByTitle(String name);

    List<Content> findChildContent(String parent_content_id);

    List<Content> findChildContent(ObjectId parent_content_id);

    List<Content> findChildContentByActiveDate(String parent_content_id, Date active_date);

    List<Content> findAll();

    Content update(Content object);

    Content updateBannerImage(ObjectId id, MultipartFile bannerImage, boolean isCompress);

    Content updateThumbnailImage(ObjectId id, MultipartFile thumbnailImage, boolean isCompress);

    Content updateWebVideoAudio(ObjectId id, MultipartFile videoAudioContent);

    Content updateTrailerVideoAudio(ObjectId id, MultipartFile videoAudioContent);

    boolean episodeReOrder(List<ReOrderDTO> reOrderDTOList, ObjectId contentId);

    List<Content> getAllContents(ObjectId customerId);

    List<Content> getAllContentsByContentType(ObjectId customerId, String contentType);

    List<Content> findAllContentWithEpisodes(ObjectId customerId);

    List<Content> findUnAssignedContentWithEpisodesForCategoryId(ObjectId customerId, ObjectId[] contentIds);

    List<Content> findUnAssignedContentForCategoryId(ObjectId customerId, ObjectId[] contentIds);

    List<Content> findMany(ObjectId[] contentIds);

    List<Content> findMany(String[] contentIds);

    List<Content> findManyOnlyActiveForAdmin(ObjectId[] contentIds);

    List<Content> findManyOnlyActive(ObjectId[] contentIds, Date active_date);

    List<Content> findAllByTitleForUserSearch(ObjectId customerId, String title, Date active_date);

    List<Content> findAllByTitleForAdminSearch(ObjectId customerId, String title, String contentType);

    List<Content> findAllByCurrent_Week_Month_Year_Uploaded(ObjectId customerId, Date fromDate, Date toDate, String contentType);

    List<Content> findAllByBeforeThisYear_Uploaded(ObjectId customerId, Date toDate, String contentType);

    List<Content> findAllByTitleFromContentList(ObjectId customerId, List<ObjectId> contentIds, String title, String contentType);

    ObjectId delete(ObjectId id);

}
