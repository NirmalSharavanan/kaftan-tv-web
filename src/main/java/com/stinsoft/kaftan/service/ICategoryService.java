package com.stinsoft.kaftan.service;

import com.stinsoft.kaftan.dto.ReOrderDTO;
import com.stinsoft.kaftan.model.Category;
import org.bson.types.ObjectId;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ICategoryService {

    Category create(Category object);
    Category create(Category category, MultipartFile bannerImage, MultipartFile thumbnailImage, boolean isCompress);
    Category find(String id);
    Category find(ObjectId id);
    Category findCategoryByName(Integer category_type, String name);
    List<Category> findAll();
    Category update(ObjectId id, Category object);
    Category update(ObjectId id, Category object, MultipartFile bannerImage, MultipartFile thumbnailImage, boolean isCompress);
    Category updateBannerImage(ObjectId id, MultipartFile bannerImage, boolean isCompress);
    boolean reOrder(List<ReOrderDTO> reOrderDTOList, Integer category_type);
    boolean contentReOrder(List<ReOrderDTO> reOrderDTOList, ObjectId categoryId);
    List<Category> findCategoryByCustomerId(ObjectId customer_id, Integer category_type);
    List<Category> findCategoryByCustomerId(String customer_id, Integer category_type);
    List<Category> findCategoryByCustomerId(ObjectId customer_id);
    List<Category> findContentByContentId(ObjectId contentId);
    Category findContentBy_ContentId_CategoryId(ObjectId contentId, ObjectId categoryId);
    List<Category> findMany(ObjectId customer_id, ObjectId[] categoryIds);
    ObjectId delete(ObjectId id);
    List<Category> findAllByTitleForUserSearch(ObjectId customerId, String title);

}
