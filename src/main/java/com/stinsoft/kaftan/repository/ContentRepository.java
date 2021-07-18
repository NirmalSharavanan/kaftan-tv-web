package com.stinsoft.kaftan.repository;

import com.stinsoft.kaftan.model.Content;
import org.bson.types.ObjectId;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.Date;
import java.util.List;

public interface ContentRepository extends MongoRepository<Content, ObjectId> {

    @Query("{ 'title' : ?0 }")
    Content findContentByTitle(String title);

    @Query("{ 'original_file_id' : ?0 }")
    Content findByOriginalFileId(String original_file_id);

    //this is high level query where there should always parent_content_id is null
    @Query("{'customer_id' : ?0, '_id' :{ $nin : ?1 }, 'parent_content_id': null }")
    List<Content> findUnAssignedContentForCategoryId(ObjectId customerId, ObjectId[] ids);

    //this is high level query where there should always parent_content_id is null
    @Query("{'customer_id' : ?0, 'parent_content_id': null }")
    List<Content> findAllContent(ObjectId customerId, Sort sort);

    //this is high level query where there should always parent_content_id is null
    @Query("{'customer_id' : ?0, 'parent_content_id': null, 'content_type' : ?1 }")
    List<Content> findAllContentByContentType(ObjectId customerId, String contentType, Sort sort);

    @Query("{'customer_id' : ?0 }")
    List<Content> findAllContentWithEpisodes(ObjectId customerId);

    @Query("{'customer_id' : ?0, '_id' :{ $nin : ?1 } }")
    List<Content> findContentWithEpisodesForCategoryId(ObjectId customerId, ObjectId[] ids);

    @Query("{'_id' :{ $in : ?0 }}")
    List<Content> findMany(ObjectId[] ids);

    @Query("{'_id' :{ $in : ?0 }, $or:[{uploadInProgress:false},{uploadInProgress:{$exists:false}}], $or:[{transcodeInProgress:false},{transcodeInProgress:{$exists:false}}], 'active_date' : {'$lte' : ?1 } }")
    List<Content> findManyOnlyActive(ObjectId[] ids, Date active_date);

    @Query("{'parent_content_id' : ?0 }")
    List<Content> findChildContent(ObjectId parent_content_id, Sort sort);

    //Search content by title
    @Query("{'customer_id' : ?0, $and:[ {$or:[{'title' : {$regex : ?1, $options: 'i'}},{'description' : {$regex : ?1, $options: 'i'}}]}, {$or:[{'parent_content_id': {$exists: true} },{'categoryList': { $exists: true, $not: {$size: 0}}}]} ], 'active_date' : {'$lte' : ?2 } }")
    //need to create following index for better search in DB
    //db.content.createIndex( { title: "text" } )
    //@Query("{'customer_id' : ?0, '$text' : {$search : ?1} }")
    List<Content> findAllByTitleForUserSearch(ObjectId customerId, String title, Date active_date);

    @Query("{'customer_id' : ?0, $or:[{'title' : {$regex : ?1, $options: 'i'}},{'description' : {$regex : ?1, $options: 'i'}}], 'parent_content_id': { $exists: false}, 'content_type' : ?2 }")
    List<Content> findAllByTitleForAdminSearch(ObjectId customerId, String title, String contentType);

    //Search content by this week, this month and this year uploaded
    @Query("{'customer_id' : ?0, 'created_at' : {'$gte': ?1, '$lte': ?2}, 'parent_content_id': { $exists: false}, 'content_type' : ?3 }")
    List<Content> findAllByCurrent_Week_Month_Year_Uploaded(ObjectId customerId, Date fromDate, Date toDate, String contentType);

    //Search content by before this year uploaded
    @Query("{'customer_id' : ?0, 'created_at' : {'$lt': ?1}, 'parent_content_id': { $exists: false}, 'content_type' : ?2 }")
    List<Content> findAllByBeforeThisYear_Uploaded(ObjectId customerId, Date toDate, String contentType);

    //Search title from content list
    @Query("{'customer_id' : ?0, '_id' : {$in : ?1}, 'title' : {$regex : ?2, $options: 'i'}, 'parent_content_id': { $exists: false}, 'content_type' : ?3 }")
    List<Content> findAllByTitleFromContentList(ObjectId customerId, List<ObjectId> contentIds, String title, String contentType);

    //Find content by active date
    @Query("{'_id' : ?0, 'active_date' : {'$lte' : ?1 } }")
    Content findByActiveDate(ObjectId contentId, Date active_date);

    @Query("{'_id' :{ $in : ?0 }, $or:[{uploadInProgress:false},{uploadInProgress:{$exists:false}}], $or:[{transcodeInProgress:false},{transcodeInProgress:{$exists:false}}] }")
    List<Content> findManyOnlyActiveForAdmin(ObjectId[] ids);

    @Query("{'parent_content_id' : ?0, 'active_date' : {'$lte' : ?1 } }")
    List<Content> findChildContentByActiveDate(ObjectId parent_content_id, Date active_date, Sort sort);

}
