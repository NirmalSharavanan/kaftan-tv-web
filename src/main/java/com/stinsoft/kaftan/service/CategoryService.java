package com.stinsoft.kaftan.service;

import com.amazonaws.services.s3.model.PutObjectResult;
import com.stinsoft.kaftan.dto.ReOrderDTO;
import com.stinsoft.kaftan.model.ContentOrder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Sort;
import org.springframework.web.multipart.MultipartFile;
import ss.core.aws.AWSInfo;
import ss.core.aws.S3Service;
import ss.core.helper.DateHelper;
import ss.core.helper.CounterHelper;
import com.stinsoft.kaftan.model.Category;
import com.stinsoft.kaftan.repository.CategoryRepository;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ss.core.helper.ImageHelper;
import ss.core.security.service.ISessionService;

import java.io.InputStream;
import java.util.*;

@Service
public class CategoryService implements ICategoryService {

    private final CategoryRepository repository;

    private Logger logger = LoggerFactory.getLogger(CategoryService.class);

    @Autowired
    S3Service s3Service;

    @Autowired
    private ISessionService sessionService;

    @Autowired
    private CounterHelper counterHelper;

    @Autowired
    ImageHelper imageHelper;

    @Autowired
    public CategoryService(CategoryRepository categoryRepository) {
        this.repository = categoryRepository;
    }

    //public S3Service


    @Override
    public Category create(Category category) {
        category.setCreated_at(DateHelper.getCurrentDate());
        category.setUpdated_at(DateHelper.getCurrentDate());
        return repository.save(category);
    }

    @Override
    public Category create(Category category, MultipartFile bannerImage, MultipartFile thumbnailImage, boolean isCompress) {

        try {

            category.setCustomer_id(sessionService.getCustomer().getId());
            //get the next sequence number for ordering
            String uniqueName = Category.class.getName() + "_" + category.getCategory_type() + "_" + category.getCustomer_id().toString();
            category.setSort_order(counterHelper.getNextSequence(uniqueName));

            if(bannerImage!=null) {
                category = updateBanner(category, bannerImage, isCompress);
            }
            if(thumbnailImage!=null){
                category = updateThumbnailImage(category, thumbnailImage, isCompress);
            }

            category.setCreated_at(DateHelper.getCurrentDate());
            category.setUpdated_at(DateHelper.getCurrentDate());
            return repository.save(category);
        }
        catch (Exception e) {
            logger.error(e.getMessage(), e);
            return null;
        }
    }

    @Override
    public Category update(ObjectId id, Category category, MultipartFile bannerImage, MultipartFile thumbnailImage, boolean isCompress) {
        category.setId(id);

        final Category saved = repository.findOne(id);

        if (saved != null) {
            if(bannerImage!=null) {
                category = updateBanner(category, bannerImage, isCompress);
            }
            if(thumbnailImage!=null){
                category = updateThumbnailImage(category, thumbnailImage, isCompress);
            }
            category.setCreated_at(saved.getCreated_at());
            category.setUpdated_at(DateHelper.getCurrentDate());
        } else {
            category.setCreated_at(DateHelper.getCurrentDate());
        }
        repository.save(category);
        return category;
    }

    @Override
    public Category find(String id) {
        return this.find(new ObjectId(id));
    }

    @Override
    public Category find(ObjectId id) {
        return repository.findOne(id);
    }

    @Override
    public Category findCategoryByName(Integer category_type, String name) {
        return repository.findCategoryByName(category_type, name);
    }

    @Override
    public List<Category> findAll() {
        return repository.findAll();
    }

    @Override
    public Category update(ObjectId id, Category category) {
        category.setId(id);

        final Category saved = repository.findOne(id);

        if (saved != null) {
            category.setCreated_at(saved.getCreated_at());
            category.setUpdated_at(DateHelper.getCurrentDate());
        } else {
            category.setCreated_at(DateHelper.getCurrentDate());
        }
        repository.save(category);
        return category;
    }

    public Category updateBanner(Category category, MultipartFile bannerImage, boolean isCompress) {
        try {

            if (category != null) {

                AWSInfo awsInfo = category.getBanner_aws_info();
                if (awsInfo == null) {
                    awsInfo = new AWSInfo();
                } else {
                    //Delete the old thumbnail image in AWS
                    s3Service.delete(awsInfo.getId());
                }

                //upload the new banner image from AWS
                String uniqueImageID = s3Service.getUniqueId(bannerImage.getOriginalFilename());

                InputStream stream = bannerImage.getInputStream();

                if (isCompress) {
                    stream = imageHelper.createBannerImage(stream);
                }

                //upload image to AWS
                PutObjectResult putObjectResult = s3Service.upload(uniqueImageID, stream);
                if (putObjectResult != null) {

                    awsInfo.setId(uniqueImageID);
                    awsInfo.seteTag(putObjectResult.getETag());
                    category.setBanner_aws_info(awsInfo);

                } else {
                    logger.error(String.format("Error upload banner image for %s", category.getName()));
                }
            }

            return category;
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            return null;
        }
    }

    public Category updateThumbnailImage(Category category, MultipartFile thumbnailImage, boolean isCompress) {
        try {

            if (category != null) {

                AWSInfo awsInfo = category.getThumbnail_aws_info();
                if (awsInfo == null) {
                    awsInfo = new AWSInfo();
                } else {
                    //Delete the old thumbnail image in AWS
                    s3Service.delete(awsInfo.getId());
                }

                //upload the new thumbnail image from AWS
                String uniqueImageID = s3Service.getUniqueId(thumbnailImage.getOriginalFilename());

                InputStream stream = thumbnailImage.getInputStream();
                if (isCompress) {
                    stream = imageHelper.createThumbnailImage(stream);
                }

                //upload image to AWS
                PutObjectResult putObjectResult = s3Service.upload(uniqueImageID, stream);
                if (putObjectResult != null) {

                    awsInfo.setId(uniqueImageID);
                    awsInfo.seteTag(putObjectResult.getETag());
                    awsInfo.setContentType(thumbnailImage.getContentType());
                    category.setThumbnail_aws_info(awsInfo);

                } else {
                    logger.error(String.format("Error upload thumbnail image for %s", category.getName()));
                }
            }

            return category;
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            return null;
        }
    }

    @Override
    public Category updateBannerImage(ObjectId id, MultipartFile bannerImage, boolean isCompress) {

        Category category = repository.findOne(id);

        try {

            if (category != null) {

                if(bannerImage!=null) {
                    category = updateBanner(category, bannerImage, isCompress);
                }

                category.setCreated_at(DateHelper.getCurrentDate());
                category.setUpdated_at(DateHelper.getCurrentDate());
                return repository.save(category);
            }
        }
        catch (Exception e) {
            logger.error(e.getMessage(), e);
            return null;
        }

        return category;
    }

    @Override
    public boolean contentReOrder(List<ReOrderDTO> reOrderDTOList, ObjectId categoryId) {
        try {
            boolean isSwapSuccess = false;

            if (reOrderDTOList != null && reOrderDTOList.size() > 0) {
                Map<ObjectId, Integer> map = new HashMap<ObjectId, Integer>();

                for (ReOrderDTO reOrderDTO : reOrderDTOList) {
                    map.put(new ObjectId(reOrderDTO.getId()) , reOrderDTO.getSort_order());
                }

                List<ContentOrder> contentList = new ArrayList<>();

                //get all records wit sort order range
                Category category = repository.findOne(categoryId);
                if (category != null) {

                    if (category.getContentOrderList() != null && category.getContentOrderList().size() > 0) {

                        //upload the order for all the records
                        for (ContentOrder contentOrder: category.getContentOrderList()) {

                            if(map.containsKey(contentOrder.getContent_id())) {
                                contentOrder.setSort_order(map.get(contentOrder.getContent_id() ));
                            }
                        }

                        //update DB
                        repository.save(category);
                        isSwapSuccess = true;
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
    public boolean reOrder(List<ReOrderDTO> reOrderDTOList, Integer category_type) {

        boolean isSwapSuccess = false;

        if(reOrderDTOList != null && reOrderDTOList.size() > 0) {
            Map<ObjectId, Integer> map = new HashMap<ObjectId, Integer>();

            for (ReOrderDTO reOrderDTO : reOrderDTOList) {
                map.put(new ObjectId(reOrderDTO.getId()), reOrderDTO.getSort_order());
            }

            ObjectId[] categoryIds = map.keySet().toArray(new ObjectId[0]);

            List<Category> categoryList = new ArrayList<>();
            ObjectId CustomerId = sessionService.getCustomer().getId();
            Sort sort = new Sort(Sort.Direction.DESC, "sort_order");

            //get all records wit sort order range
            categoryList = repository.findMultiple(CustomerId, category_type, categoryIds, sort);

            if (categoryList != null && categoryList.size() > 0) {

                //upload the order for all the records
                for (Category category : categoryList) {
                    category.setSort_order(map.get(category.getId()));
                }

                //update DB
                repository.save(categoryList);
                isSwapSuccess = true;

            }
        }

        return isSwapSuccess;
    }

    @Override
    public List<Category> findCategoryByCustomerId(ObjectId customer_id, Integer category_type) {
        return repository.findCategoryByCustomerId(customer_id, category_type, new Sort(Sort.Direction.DESC, "sort_order"));
    }

    //Find by foreign key always should be object_id
    @Override
    public List<Category> findCategoryByCustomerId(String customer_id, Integer category_type) {
        return this.findCategoryByCustomerId(new ObjectId(customer_id), category_type);
    }

    @Override
    public List<Category> findCategoryByCustomerId(ObjectId customer_id) {
        return repository.findCategoryByCustomerId(customer_id, new Sort(Sort.Direction.DESC, "sort_order"));
    }

    @Override
    public List<Category> findContentByContentId(ObjectId contentId) {
        try{
            return repository.findContentByContentId(contentId);
        }
        catch (Exception e){
            logger.error(e.getMessage(),e);
        }
        return  null;
    }

    @Override
    public Category findContentBy_ContentId_CategoryId(ObjectId contentId, ObjectId categoryId) {
        try{
            return repository.findContentBy_ContentId_CategoryId(contentId, categoryId);
        }
        catch (Exception e){
            logger.error(e.getMessage(),e);
        }
        return  null;
    }

    public List<Category> findMultiple(ObjectId customer_id, List<ObjectId> ids) {
        return repository.findMultiple(customer_id, ids);
    }

    @Override
    public List<Category> findMany(ObjectId customer_id, ObjectId[] categoryIds) {
        return repository.findMany(customer_id, categoryIds);
    }

    @Override
    public ObjectId delete(ObjectId id) {
        repository.delete(id);
        return id;
    }

    @Override
    public List<Category> findAllByTitleForUserSearch(ObjectId customerId, String title) {
        try {
            return repository.findAllByTitleForUserSearch(customerId, title);
        }
        catch (Exception e) {
            logger.error(e.getMessage(), e);
        }

        return null;
    }

}
