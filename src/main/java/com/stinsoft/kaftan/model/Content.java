package com.stinsoft.kaftan.model;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.stinsoft.kaftan.dto.CategoryDTO;
import com.stinsoft.kaftan.dto.ParentContent;
import org.apache.commons.lang3.StringUtils;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.Document;
import ss.core.aws.AWSInfo;
import ss.core.helper.JsonObjectIdListSerializer;
import ss.core.helper.JsonObjectIdSerializer;
import ss.core.model.Response;

import java.util.Date;
import java.util.List;

/**
 * Created by ssu on 23/11/17.
 */
@Document
public class Content extends Response implements Comparable<Content>  {

    @Id
    @JsonSerialize(using=JsonObjectIdSerializer.class)
    private ObjectId          id;

    //if this content is child, parent_content should be there
    @JsonSerialize(using=JsonObjectIdSerializer.class)
    private ObjectId          parent_content_id;

    //title to display in UI
    private String          title;

    //description about the content to render in UI
    private String          description;
    
    //content gives some data or info about the video
    private String          content;

    //Content type (video, Audio, images)
    private String          content_type;

    private boolean         is_premium;

    private int             sort_order;

    private String          original_file_id;

    private AWSInfo         banner_aws_info;

    //Thumbnail image reference to cloud, ex aws reference Id
    private AWSInfo         thumbnail_aws_info;

    private AWSInfo         trailer_aws_info;

    private AWSInfo         aws_info_480p;

    private AWSInfo         aws_info_720p;

    private AWSInfo         aws_info_360p;

    private AWSInfo         aws_info_1080p;

    //Reference for episodes series, if yes the will have child contest list (contentList)
    private boolean         has_episode;

    private boolean         is_organized_by_season;

    private int             season_number;

    // Channel will have Channel
    private boolean         is_Channel;

    private int             averageRating;
    private List<Rating>    ratingList;

    private List<ObjectId>    likeList;
    private List<Comment>   commentList;

    @JsonSerialize(using=JsonObjectIdListSerializer.class)
    private List<ObjectId>  categoryList;

    @JsonSerialize(using=JsonObjectIdSerializer.class)
    private ObjectId        payperviewCategoryId;

    @JsonSerialize(using=JsonObjectIdSerializer.class)
    private ObjectId customer_id;

    @JsonSerialize(using=JsonObjectIdSerializer.class)
    private ObjectId          created_by;

    @JsonSerialize(using=JsonObjectIdSerializer.class)
    private ObjectId          updated_by;

    private Date            created_at;
    private Date            updated_at;

    private boolean         uploadInProgress;
    private boolean         transcodeInProgress;
    private boolean         useEncoding;

    @Transient
    private List<CategoryDTO> categoryDTOList;

    @Transient
    private boolean isContentUploded;

    @Transient
    private ParentContent parentContent;

    private String          youtube_VideoLink;

    private String          youtube_TrailerLink;

    private String          year;

    private Date            active_date;

    public boolean isContentUploded() {

        if(aws_info_480p != null || StringUtils.isNotEmpty(youtube_VideoLink)) {
            return true;
        }
        else {
            return false;
        }
    }

    public ObjectId getId() {
        return id;
    }

    public void setId(ObjectId id) {
        this.id = id;
    }

    public ObjectId getParent_content_id() {
        return parent_content_id;
    }

    public void setParent_content_id(ObjectId parent_content_id) {
        this.parent_content_id = parent_content_id;
    }

    public boolean is_episode() {
        return has_episode;
    }

    public void setHas_episode(boolean has_episode) {
        this.has_episode = has_episode;
    }

    public boolean isHas_episode() {
        return has_episode;
    }

    public boolean is_organized_by_season() {
        return is_organized_by_season;
    }

    public void setIs_organized_by_season(boolean is_organized_by_season) {
        this.is_organized_by_season = is_organized_by_season;
    }

    public int getSeason_number() {
        return season_number;
    }

    public void setSeason_number(int season_number) {
        this.season_number = season_number;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public String getContent_type() {
        return content_type;
    }

    public void setContent_type(String content_type) {
        this.content_type = content_type;
    }

    public boolean isIs_premium() {
        return is_premium;
    }

    public void setIs_premium(boolean is_premium) {
        this.is_premium = is_premium;
    }

    public int getSort_order() {
        return sort_order;
    }

    public void setSort_order(int sort_order) {
        this.sort_order = sort_order;
    }

    public AWSInfo getBanner_aws_info() {
        return banner_aws_info;
    }

    public void setBanner_aws_info(AWSInfo banner_aws_info) {
        this.banner_aws_info = banner_aws_info;
    }

    public AWSInfo getThumbnail_aws_info() {
        return thumbnail_aws_info;
    }

    public void setThumbnail_aws_info(AWSInfo thumbnail_aws_info) {
        this.thumbnail_aws_info = thumbnail_aws_info;
    }

    public int getAverageRating() {
        return averageRating;
    }

    public void setAverageRating(int averageRating) {
        this.averageRating = averageRating;
    }

    public List<Rating> getRatingList() {
        return ratingList;
    }

    public void setRatingList(List<Rating> ratingList) {
        this.ratingList = ratingList;
    }

   public List<Comment> getCommentList() {
        return commentList;
    }

    public void setCommentList(List<Comment> commentList) {
        this.commentList = commentList;
    }

    public List<ObjectId> getCategoryList() {
        return categoryList;
    }

    public void setCategoryList(List<ObjectId> categoryList) {
        this.categoryList = categoryList;
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

    public boolean is_premium() {
        return is_premium;
    }

    public AWSInfo getTrailer_aws_info() {
        return trailer_aws_info;
    }

    public void setTrailer_aws_info(AWSInfo trailer_aws_info) {
        this.trailer_aws_info = trailer_aws_info;
    }

    public void setIsContentUploded(boolean isContentUploded) {
        this.isContentUploded = isContentUploded;
    }

    public AWSInfo getAws_info_480p() {
        return aws_info_480p;
    }

    public void setAws_info_480p(AWSInfo aws_info_480p) {
        this.aws_info_480p = aws_info_480p;
    }

    public AWSInfo getAws_info_720p() {
        return aws_info_720p;
    }

    public void setAws_info_720p(AWSInfo aws_info_720p) {
        this.aws_info_720p = aws_info_720p;
    }

    public AWSInfo getAws_info_360p() {
        return aws_info_360p;
    }

    public void setAws_info_360p(AWSInfo aws_info_360p) {
        this.aws_info_360p = aws_info_360p;
    }

    public AWSInfo getAws_info_1080p() {
        return aws_info_1080p;
    }

    public void setAws_info_1080p(AWSInfo aws_info_1080p) {
        this.aws_info_1080p = aws_info_1080p;
    }

    public List<ObjectId> getLikeList() {
        return likeList;
    }

    public void setLikeList(List<ObjectId> likeList) {
        this.likeList = likeList;
    }

    public ObjectId getCreated_by() {
        return created_by;
    }

    public void setCreated_by(ObjectId created_by) {
        this.created_by = created_by;
    }

    public ObjectId getUpdated_by() {
        return updated_by;
    }

    public void setUpdated_by(ObjectId updated_by) {
        this.updated_by = updated_by;
    }

    public ObjectId getCustomer_id() {
        return customer_id;
    }

    public void setCustomer_id(ObjectId customer_id) {
        this.customer_id = customer_id;
    }

    public boolean is_Channel() {
        return is_Channel;
    }

    public void setIs_Channel(boolean is_Channel) {
        this.is_Channel = is_Channel;
    }

    public boolean isUploadInProgress() {
        return uploadInProgress;
    }

    public void setUploadInProgress(boolean uploadInProgress) {
        this.uploadInProgress = uploadInProgress;
    }

    public boolean isTranscodeInProgress() {
        return transcodeInProgress;
    }

    public void setTranscodeInProgress(boolean transcodeInProgress) {
        this.transcodeInProgress = transcodeInProgress;
    }

    public boolean isUseEncoding() {
        return useEncoding;
    }

    public void setUseEncoding(boolean useEncoding) {
        this.useEncoding = useEncoding;
    }

    public List<CategoryDTO> getCategoryDTOList() {
        return categoryDTOList;
    }

    public void setCategoryDTOList(List<CategoryDTO> categoryDTOList) {
        this.categoryDTOList = categoryDTOList;
    }

    public ParentContent getParentContent() {
        return parentContent;
    }

    public void setParentContent(ParentContent parentContent) {
        this.parentContent = parentContent;
    }

    @Override
    public int compareTo(Content o) {

        String title1 = this.getTitle();
        String title2 = o.getTitle();

        return title1.compareTo(title2);

    }

    public ObjectId getPayperviewCategoryId() {
        return payperviewCategoryId;
    }

    public void setPayperviewCategoryId(ObjectId payperviewCategoryId) {
        this.payperviewCategoryId = payperviewCategoryId;
    }

    public String getYoutube_VideoLink() {
        return youtube_VideoLink;
    }

    public void setYoutube_VideoLink(String youtube_VideoLink) {
        this.youtube_VideoLink = youtube_VideoLink;
    }

    public String getYoutube_TrailerLink() {
        return youtube_TrailerLink;
    }

    public void setYoutube_TrailerLink(String youtube_TrailerLink) {
        this.youtube_TrailerLink = youtube_TrailerLink;
    }

    public String getOriginal_file_id() {
        return original_file_id;
    }

    public void setOriginal_file_id(String original_file_id) {
        this.original_file_id = original_file_id;
    }

    public Date getActive_date() {
        return active_date;
    }

    public void setActive_date(Date active_date) {
        this.active_date = active_date;
    }

    public String getYear() {
        return year;
    }

    public void setYear(String year) {
        this.year = year;
    }
}
