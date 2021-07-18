package com.stinsoft.kaftan.model;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.stinsoft.kaftan.dto.CategoryDTO;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import ss.core.aws.AWSInfo;
import ss.core.model.Response;
import ss.core.helper.JsonObjectIdSerializer;

import java.util.Collections;
import java.util.Date;
import java.util.List;

@Document
public class Category extends Response {

    @Id
    @JsonSerialize(using=JsonObjectIdSerializer.class)
    private ObjectId          id;
    private String          name;

    private boolean          show_in_menu;

//    private int             banner_width;
//    private int             banner_height;
    private AWSInfo         banner_aws_info;

//    private int             thumbnail_width;
//    private int             thumbnail_height;
//    private String          thumbnail_image_id;

    private int             category_type;

    //Only if category_type is celebrity (2)
    private List<String>    celebrityTypeList;

    private float           price;
    private float           premium_price;

    @JsonSerialize(using=JsonObjectIdSerializer.class)
    private ObjectId          parent_category_id;

    private CategoryDTO       parentCategory;

    @JsonSerialize(using=JsonObjectIdSerializer.class)
    private ObjectId          home_category_id;

    private boolean         showImageOnly;
    private String          link;

    private int             sort_order;

    private Date            created_at;
    private Date            updated_at;
    private boolean         is_active;

    @JsonSerialize(using=JsonObjectIdSerializer.class)
    private ObjectId customer_id;

    private List<ContentOrder> contentOrderList;

    // Live TV Channels, Radio
    private AWSInfo    thumbnail_aws_info;
    private LiveUrl    liveUrl;
    private boolean    showChannels;
    private boolean    showRadio;
    private boolean    showInMusic;
    private boolean    showMyPlayList;
    private boolean    showInHome;
    private boolean    showActive;

    public ObjectId getId() {
        return id;
    }

    public void setId(ObjectId id) {
        this.id = id;
    }

    public AWSInfo getBanner_aws_info() {
        return banner_aws_info;
    }

    public void setBanner_aws_info(AWSInfo banner_aws_info) {
        this.banner_aws_info = banner_aws_info;
    }

    public int getCategory_type() {
        return category_type;
    }

    public void setCategory_type(int category_type) {
        this.category_type = category_type;
    }

    public int getSort_order() {
        return sort_order;
    }

    public void setSort_order(int sort_order) {
        this.sort_order = sort_order;
    }

    public boolean is_active() {
        return is_active;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Date getCreated_at() {
        return created_at;
    }

    public void setCreated_at(Date created_at) {
        this.created_at = created_at;
    }

    public Date getUpdated_at() {
        return updated_at;
    }

    public void setUpdated_at(Date updated_at) {
        this.updated_at = updated_at;
    }

    public boolean isIs_active() {
        return is_active;
    }

    public void setIs_active(boolean is_active) {
        this.is_active = is_active;
    }

    public List<ContentOrder> getContentOrderList() {

        if(contentOrderList != null) {
            Collections.sort(contentOrderList);
        }

        return contentOrderList;
    }

    public void setContentOrderList(List<ContentOrder> contentOrderList) {
        this.contentOrderList = contentOrderList;
    }

    public List<String> getCelebrityTypeList() {
        return celebrityTypeList;
    }

    public void setCelebrityTypeList(List<String> celebrityTypeList) {
        this.celebrityTypeList = celebrityTypeList;
    }

    public ObjectId getCustomer_id() {
        return customer_id;
    }

    public void setCustomer_id(ObjectId customer_id) {
        this.customer_id = customer_id;
    }

    public boolean isShow_in_menu() {
        return show_in_menu;
    }

    public void setShow_in_menu(boolean show_in_menu) {
        this.show_in_menu = show_in_menu;
    }

    public float getPrice() {
        return price;
    }

    public void setPrice(float price) {
        this.price = price;
    }

    public float getPremium_price() {
        return premium_price;
    }

    public void setPremium_price(float premium_price) {
        this.premium_price = premium_price;
    }

    public ObjectId getParent_category_id() {
        return parent_category_id;
    }

    public void setParent_category_id(ObjectId parent_category_id) {
        this.parent_category_id = parent_category_id;
    }

    public CategoryDTO getParentCategory() {
        return parentCategory;
    }

    public void setParentCategory(CategoryDTO parentCategory) {
        this.parentCategory = parentCategory;
    }

    public ObjectId getHome_category_id() {
        return home_category_id;
    }

    public void setHome_category_id(ObjectId home_category_id) {
        this.home_category_id = home_category_id;
    }

    public boolean isShowImageOnly() {
        return showImageOnly;
    }

    public void setShowImageOnly(boolean showImageOnly) {
        this.showImageOnly = showImageOnly;
    }

    public String getLink() {
        return link;
    }

    public void setLink(String link) {
        this.link = link;
    }

    public AWSInfo getThumbnail_aws_info() {
        return thumbnail_aws_info;
    }

    public void setThumbnail_aws_info(AWSInfo thumbnail_aws_info) {
        this.thumbnail_aws_info = thumbnail_aws_info;
    }

    public LiveUrl getLiveUrl() {
        return liveUrl;
    }

    public void setLiveUrl(LiveUrl liveUrl) {
        this.liveUrl = liveUrl;
    }

    public boolean isShowChannels() {
        return showChannels;
    }

    public void setShowChannels(boolean showChannels) {
        this.showChannels = showChannels;
    }

    public boolean isShowRadio() {
        return showRadio;
    }

    public void setShowRadio(boolean showRadio) {
        this.showRadio = showRadio;
    }

    public boolean isShowInMusic() {
        return showInMusic;
    }

    public void setShowInMusic(boolean showInMusic) {
        this.showInMusic = showInMusic;
    }

    public boolean isShowMyPlayList() {
        return showMyPlayList;
    }

    public void setShowMyPlayList(boolean showMyPlayList) {
        this.showMyPlayList = showMyPlayList;
    }

    public boolean isShowInHome() {
        return showInHome;
    }

    public void setShowInHome(boolean showInHome) {
        this.showInHome = showInHome;
    }

    public boolean isShowActive() {
        return showActive;
    }

    public void setShowActive(boolean showActive) {
        this.showActive = showActive;
    }
}
