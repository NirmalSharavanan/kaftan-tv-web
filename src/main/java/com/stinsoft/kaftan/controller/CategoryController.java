package com.stinsoft.kaftan.controller;

import com.stinsoft.kaftan.dto.CategoryDTO;
import com.stinsoft.kaftan.dto.ReOrderDTO;
import com.stinsoft.kaftan.model.*;
import com.stinsoft.kaftan.model.*;
import com.stinsoft.kaftan.service.ContentService;
import com.stinsoft.kaftan.service.CategoryService;
import org.apache.commons.lang3.StringUtils;
import org.modelmapper.ModelMapper;
import ss.core.helper.DateHelper;
import ss.core.service.CustomerService;
import com.stinsoft.kaftan.service.ICelebrityTypeService;
import org.bson.types.ObjectId;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.Resource;
import org.springframework.hateoas.mvc.ControllerLinkBuilder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ss.core.aws.S3Service;
import ss.core.helper.ConfigHelper;
import com.stinsoft.kaftan.messages.AppMessages;
import com.stinsoft.kaftan.messages.ExceptionMessages;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import ss.core.model.Customer;
import ss.core.model.Response;
import ss.core.security.service.ISessionService;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.methodOn;

@RestController
@RequestMapping("api/")
public class CategoryController extends BaseController {

    private final CategoryService categoryService;

    @Autowired
    CustomerService customerService;

    @Autowired
    ContentService contentService;

    private final ConfigHelper configHelper;
    Logger logger = null;

    @Autowired
    S3Service s3Service;

    @Autowired
    private ISessionService sessionService;

    @Autowired
    ICelebrityTypeService celebrityTypeService;

    @Autowired
    public CategoryController(CategoryService categoryService, ConfigHelper configHelper) {

        this.categoryService = categoryService;
        this.customerService = customerService;
        this.configHelper = configHelper;

        logger = LoggerFactory.getLogger(this.getClass());
    }

    @RequestMapping(value = "admin/session/category/{category_type}/create", method = RequestMethod.POST)
    public ResponseEntity<?> create(@PathVariable Integer category_type,
                                    @RequestParam(value = "bannerImage", required = false) MultipartFile bannerImage,
                                    @RequestParam(value = "isCompress", required = false, defaultValue = "true") boolean isCompress,
                                    @RequestParam(value = "name", required = true) String categoryName,
                                    @RequestParam(value = "showInMenu", required = false) boolean showInMenu,
                                    @RequestParam(value = "celebrityTypeId", required = false) String[] celebrityTypeId,
                                    @RequestParam(value = "price", required = false) Float price,
                                    @RequestParam(value = "premium_price", required = false) Float premium_price,
                                    @RequestParam(value = "parent_category_id", required = false) String parent_category_id,
                                    @RequestParam(value = "thumbnailImage", required = false) MultipartFile thumbnailImage,
                                    @RequestParam(value = "liveUrl", required = false) String liveUrl,
                                    @RequestParam(value = "showChannels", required = false) boolean showChannels,
                                    @RequestParam(value = "showRadio", required = false) boolean showRadio,
                                    @RequestParam(value = "showInMusic", required = false) boolean showInMusic,
                                    @RequestParam(value = "showMyPlayList", required = false)boolean showMyPlayList,
                                    @RequestParam(value = "showInHome", required = false) boolean showInHome,
                                    @RequestParam(value = "showImageOnly", required = false) boolean showImageOnly,
                                    @RequestParam(value = "showActive", required = false) boolean showActive,
                                    @RequestParam(value = "link", required = false) String link,
                                    @RequestParam(value = "home_category_id", required = false) String home_category_id) {
        try {

            Category category = categoryService.findCategoryByName(category_type, categoryName);

            if (category == null) {

                category = new Category();
                category.setName(categoryName);
                category.setShow_in_menu(showInMenu);
                category.setCategory_type(category_type);
                category.setShowInHome(showInHome);
                category.setShowRadio(showRadio);
                category.setShowInMusic(showInMusic);

                if (category_type == CategoryType.CATEGORY.getValue()) {
                    category.setShowChannels(showChannels);

                    category.setShowMyPlayList(showMyPlayList);
                }
                else if (category_type == CategoryType.CELEBRITY.getValue() && celebrityTypeId != null) {

                    List<String> celebrityTypes = new ArrayList<>();

                    for (int i = 0; i < celebrityTypeId.length; i++) {
                        logger.info(celebrityTypeId[i]);
                        CelebrityType celebrityType = celebrityTypeService.find(celebrityTypeId[i]);
                        if (celebrityType != null) {
                            celebrityTypes.add(celebrityType.getId().toString() );
                        }
                    }
                    category.setCelebrityTypeList(celebrityTypes);
                }
                else if(category_type == CategoryType.PAYPERVIEW.getValue())
                {
                    category.setPrice(price);
                    category.setPremium_price(premium_price);
                }
                else if(category_type == CategoryType.CHANNEL.getValue() || category_type == CategoryType.RADIO.getValue()){
                    LiveUrl Liveurl = new LiveUrl();
                    Liveurl.setLive480Url(liveUrl);
                    category.setLiveUrl(Liveurl);
                    category.setShowActive(showActive);
                }
                else if (category_type == CategoryType.HOME_FEATURED.getValue()) {
                    if (StringUtils.isNotBlank(parent_category_id)) {
                        category.setParent_category_id(new ObjectId(parent_category_id));
                    }
                    if(StringUtils.isNotBlank(home_category_id)) {
                        category.setHome_category_id(new ObjectId(home_category_id));
                    }
                }
                else if(category_type == CategoryType.HOME_CATEGORY.getValue()){
                    category.setShowImageOnly(showImageOnly);
                    category.setLink(link);
                }
                category = categoryService.create(category, bannerImage, thumbnailImage, isCompress);

                if (category != null) {
                    category.setSuccess(true);
                    category.setMessage(AppMessages.CATEGORY_CREATED);
                } else {
                    category = new Category();
                    category.setSuccess(false);
                    category.setMessage(ExceptionMessages.CATEGORY_CREATE_ERROR);
                }
            } else {
                category = new Category();
                category.setSuccess(false);
                category.setMessage(AppMessages.CATEGORY_EXISTS_MESSAGE);
            }
            return new ResponseEntity<>(category, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = "admin/session/category/{category_type}/{id}", method = RequestMethod.PUT)
    public ResponseEntity<?> update(@PathVariable Integer category_type, @PathVariable String id,
                                    @RequestParam(value = "bannerImage", required = false) MultipartFile bannerImage,
                                    @RequestParam(value = "isCompress", required = false, defaultValue = "true") boolean isCompress,
                                    @RequestParam(value = "name", required = true) String categoryName,
                                    @RequestParam(value = "showInMenu", required = false) boolean showInMenu,
                                    @RequestParam(value = "celebrityTypeId", required = false) String[] celebrityTypeId,
                                    @RequestParam(value = "price", required = false) Float price,
                                    @RequestParam(value = "premium_price", required = false) Float premium_price,
                                    @RequestParam(value = "parent_category_id", required = false) String parent_category_id,
                                    @RequestParam(value = "thumbnailImage", required = false) MultipartFile thumbnailImage,
                                    @RequestParam(value = "liveUrl", required = false) String liveUrl,
                                    @RequestParam(value = "showChannels", required = false) boolean showChannels,
                                    @RequestParam(value = "showRadio", required = false) boolean showRadio,
                                    @RequestParam(value = "showInMusic", required = false) boolean showInMusic,
                                    @RequestParam(value = "showMyPlayList", required = false)boolean showMyPlayList,
                                    @RequestParam(value = "showInHome", required = false) boolean showInHome,
                                    @RequestParam(value = "showImageOnly", required = false) boolean showImageOnly,
                                    @RequestParam(value = "showActive", required = false) boolean showActive,
                                    @RequestParam(value = "link", required = false) String link,
                                    @RequestParam(value = "home_category_id", required = false) String home_category_id){
        try {

            Category category = categoryService.find(id);

            if (category != null) {

                category.setName(categoryName);
                category.setCategory_type(category_type);
                category.setShow_in_menu(showInMenu);
                category.setShowInHome(showInHome);
                category.setShowRadio(showRadio);
                category.setShowChannels(showChannels);

                if (category_type == CategoryType.CATEGORY.getValue()) {
                    category.setShowInMusic(showInMusic);
                    category.setShowMyPlayList(showMyPlayList);

                }
                else if (category_type == CategoryType.CELEBRITY.getValue()&& celebrityTypeId != null) {

                    List<String> celebrityTypes = category.getCelebrityTypeList();
                    if (celebrityTypes == null) {
                        celebrityTypes = new ArrayList<>();
                    } else {
                        celebrityTypes.clear();
                    }

                    for (int i = 0; i < celebrityTypeId.length; i++) {
                        logger.info(celebrityTypeId[i]);
                        CelebrityType celebrityType = celebrityTypeService.find(celebrityTypeId[i]);
                        if (celebrityType != null) {
                            celebrityTypes.add(celebrityType.getId().toString());
                        }
                    }
                    category.setCelebrityTypeList(celebrityTypes);
                }
                else if(category_type == CategoryType.PAYPERVIEW.getValue()){
                    category.setPrice(price);
                    category.setPremium_price(premium_price);
                }
                else if(category_type == CategoryType.CHANNEL.getValue() || category_type == CategoryType.RADIO.getValue()){
                    LiveUrl Liveurl = new LiveUrl();
                    Liveurl.setLive480Url(liveUrl);
                    category.setLiveUrl(Liveurl);
                    category.setShowActive(showActive);
                }
                else if (category_type == CategoryType.HOME_FEATURED.getValue()) {
                    if (StringUtils.isNotBlank(parent_category_id)) {
                        category.setParent_category_id(new ObjectId(parent_category_id));
                    }
                    if(StringUtils.isNotBlank(home_category_id)) {
                        category.setHome_category_id(new ObjectId(home_category_id));
                    }
                }
                else if(category_type == CategoryType.HOME_CATEGORY.getValue()){
                    category.setShowImageOnly(showImageOnly);
                    category.setLink(link);
                }
                category = categoryService.update(category.getId(), category, bannerImage, thumbnailImage, isCompress);

                category.setSuccess(true);
                category.setMessage(AppMessages.CATEGORY_UPDATED);
            } else {
                category = new Category();
                category.setSuccess(false);
                category.setMessage(AppMessages.CATEGORY_DOES_NOT_EXISTS);
            }
            return new ResponseEntity<>(category, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }
//    public ResponseEntity<?> update(@PathVariable Integer category_type, @PathVariable String id,
//                                    @RequestBody CategoryDTO categoryDTO) {
//        try {
//
//            Category category = categoryService.find(id);
//
//            if (category != null) {
//
//                category.setName(categoryDTO.getName());
//                category.setCategory_type(category_type);
//                category.setShow_in_menu(categoryDTO.isShow_in_menu());
//
//                if (category_type == CategoryType.CELEBRITY.getValue()) {
//
//                    List<String> celebrityTypes = category.getCelebrityTypeList();
//                    if (celebrityTypes == null) {
//                        celebrityTypes = new ArrayList<>();
//                    } else {
//                        celebrityTypes.clear();
//                    }
//
//                    for (int i = 0; i < categoryDTO.getCelebrityType().length; i++) {
//                        logger.info(categoryDTO.getCelebrityType()[i]);
//                        CelebrityType celebrityType = celebrityTypeService.find(categoryDTO.getCelebrityType()[i]);
//                        if (celebrityType != null) {
//                            celebrityTypes.add(celebrityType.getId());
//                        }
//                    }
//                    category.setCelebrityTypeList(celebrityTypes);
//                }
//
//                category = categoryService.update(category.getId(), category);
//
//                category.setSuccess(true);
//                category.setMessage(AppMessages.CATEGORY_UPDATED);
//            } else {
//                category = new Category();
//                category.setSuccess(false);
//                category.setMessage(AppMessages.CATEGORY_DOES_NOT_EXISTS);
//            }
//            return new ResponseEntity<>(category, HttpStatus.OK);
//        } catch (Exception e) {
//            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
//        }
//    }

    @RequestMapping(value = "admin/session/category/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<?> delete(@PathVariable String id){
        try {

           final Category category = categoryService.find(id);

            if (category != null) {

                //loop through and remove category from content
                List<ContentOrder> contentOrderList = category.getContentOrderList();

                if(contentOrderList!=null && contentOrderList.size()>0) {

                    List<ObjectId> contentIdList = contentOrderList.stream().map(Content -> Content.getContent_id()).collect(Collectors.toList());
                    List<Content> contentList = contentService.findMany(contentIdList.toArray(new ObjectId[contentIdList.size()]));

                    if (contentList != null && contentList.size() > 0) {
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
                        });
                    }
                }
                categoryService.delete(new ObjectId(id));
                category.setSuccess(true);
                category.setMessage(AppMessages.CATEGORY_DELETED);
            }
            else{
                Category deleteCategory = new Category();
                deleteCategory.setSuccess(false);
                deleteCategory.setMessage(AppMessages.CATEGORY_DOES_NOT_EXISTS);
            }
            return new ResponseEntity<>(category, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = "admin/session/category/banner/{id}", method = RequestMethod.PUT)
    public ResponseEntity<?> updateBanner(@PathVariable String id,
                                          @RequestParam("bannerImage") MultipartFile bannerImage,
                                          @RequestParam(value = "isCompress", required = false, defaultValue = "true") boolean isCompress, Principal principal) {
        try {

            Category category = categoryService.find(id);

            if (category != null) {

                categoryService.updateBannerImage(category.getId(), bannerImage, isCompress);

                category.setSuccess(true);
                category.setMessage(AppMessages.CATEGORY_UPDATED);
            } else {
                category = new Category();
                category.setSuccess(false);
                category.setMessage(AppMessages.CATEGORY_DOES_NOT_EXISTS);
            }
            return new ResponseEntity<>(category, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = "admin/session/category/{category_type}/re-order", method = RequestMethod.PUT)
    public ResponseEntity<?> reOrder(@PathVariable Integer category_type, @RequestBody List<ReOrderDTO> reOrderDTOList) {
        try {

            Response response = new Response();
            response.setSuccess(categoryService.reOrder(reOrderDTOList, category_type));
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = "admin/session/category/{categoryId}/content-re-order", method = RequestMethod.PUT)
    public ResponseEntity<?> contentReOrder(@PathVariable String categoryId, @RequestBody List<ReOrderDTO> reOrderDTOList) {
        try {
            Response response = new Response();
            response.setSuccess(categoryService.contentReOrder(reOrderDTOList, new ObjectId(categoryId)));
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = "category/{id}", method = RequestMethod.GET)
    public ResponseEntity<?> getCategory(@PathVariable String id) {
        try {

            Category category = categoryService.find(id);

            if (category != null) {

                Customer customer = customerService.find(category.getCustomer_id());

                category.setSuccess(true);
                Resource<Category> resource = getCategoryResource(category, customer);
                return new ResponseEntity<>(resource, HttpStatus.OK);
            } else {
                category = new Category();
                category.setSuccess(false);
                category.setMessage(AppMessages.CATEGORY_DOES_NOT_EXISTS);
                return new ResponseEntity<>(category, HttpStatus.OK);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = "category/by-type/{category_type}", method = RequestMethod.GET)
    public ResponseEntity<?> getCategoryList(@PathVariable Integer category_type, Principal principal) {
        try {

            List<Resource<Category>> resources = new ArrayList<Resource<Category>>();

            Customer customer = customerService.findByHost(sessionService.getHost()); // getUserDetails(principal).getCustomer();

            for (Category category : categoryService.findCategoryByCustomerId(customer.getId(), category_type)) {

                //Attach parent category if it is featured category and it has parent_category_id
                if(category.getParent_category_id()!=null){

                    Category parentCategory = categoryService.find(category.getParent_category_id());

                    if (parentCategory != null) {
                        ModelMapper modelMapper = new ModelMapper();
                        CategoryDTO categoryDTO = modelMapper.map(parentCategory, CategoryDTO.class);
                        category.setParentCategory(categoryDTO);
                    }
                }
                
                resources.add(getCategoryResource(category, customer));

            }

            return new ResponseEntity<>(resources, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = "category/all", method = RequestMethod.GET)
    public ResponseEntity<?> getAllCategoryList(Principal principal) {
        try {

            List<Resource<Category>> resources = new ArrayList<Resource<Category>>();

            Customer customer = customerService.findByHost(sessionService.getHost()); // getUserDetails(principal).getCustomer();

            for (Category category : categoryService.findCategoryByCustomerId(customer.getId())) {
                resources.add(getCategoryResource(category, customer));
            }

            return new ResponseEntity<>(resources, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    //with security
    private Resource<Category> getCategoryResource(Category category) {

        Resource<Category> resource = new Resource<Category>(category);
        resource.add(linkTo(methodOn(this.getClass()).getCategory(category.getId().toString())).withSelfRel());
        resource.add(new Link(s3Service.getAWSUrl(category.getBanner_aws_info().getId()), "awsUrl"));
        return resource;
    }

    //Without Security
    private Resource<Category> getCategoryResource(Category category, Customer customer) {

        Resource<Category> resource = new Resource<Category>(category);

        ControllerLinkBuilder linkTo = linkTo(methodOn(this.getClass()).getCategory(category.getId().toString()));

        resource.add(linkTo.withSelfRel());
        resource.add(new Link(getUIPath(category, linkTo.toUri().getPath()), "UIHref"));
        if(category.getBanner_aws_info() != null)
            resource.add(new Link(s3Service.getAWSUrl(category.getBanner_aws_info().getId(), customer.getAws_bucket()), "awsBannerUrl"));
        if(category.getThumbnail_aws_info() != null)
            resource.add(new Link(s3Service.getAWSUrl(category.getThumbnail_aws_info().getId(), customer.getAws_bucket()), "awsThumbnailUrl"));

        return resource;
    }

    private String getUIPath(Category category, String path) {
        return path.replace("/api", "/session");
    }

}
