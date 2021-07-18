package com.stinsoft.kaftan.repository;

import com.stinsoft.kaftan.model.Category;
import org.bson.types.ObjectId;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface CategoryRepository extends MongoRepository<Category, ObjectId> {

    @Query("{ 'name' : ?1, 'category_type' : ?0 }")
    Category findCategoryByName(Integer category_type, String name);

    //do not select customer by default
    @Query(value = "{ 'customer_id' : ?0, 'category_type' : ?1  }", fields = "{ 'contentOrderList': 0 }")
    List<Category> findCategoryByCustomerId(ObjectId customer_id, Integer category_type,  Sort sort);

    //do not select customer by default
    @Query(value = "{ 'customer_id' : ?0}", fields = "{ 'contentOrderList': 0 }")
    List<Category> findCategoryByCustomerId(ObjectId customer_id,  Sort sort);

    //do not select customer by default
    @Query(value = "{ 'customer_id' : ?0, 'category_type' : ?1 }")
    List<Category> findCategoryWithCustomer(ObjectId customer_id, Integer category_type, Sort sort);

    @Query(value = "{ 'customer_id' : ?0, 'category_type' : ?1, 'sort_order' :  {$gte : ?2, $lte: ?3 } }")
    List<Category> findWithSortRange(ObjectId customer_id, Integer category_type, int fromSortOrder, int toSortOrder, Sort sort);

    @Query(value = "{ 'customer_id' : ?0, 'category_type' : ?1, 'id' :  { $in : ?2 } }")
    List<Category> findMultiple(ObjectId customer_id, Integer category_type, ObjectId[] ids, Sort sort);

    @Query(value = "{ 'customer_id' : ?0, 'id' :  { $in : ?1 } }")
    List<Category> findMultiple(ObjectId customer_id, List<ObjectId> ids);

    @Query(value = "{ 'customer_id' : ?0, 'id' :  { $in : ?1 } }")
    List<Category> findMany(ObjectId customer_id, ObjectId[] ids);

    //find content list by contentId
    @Query("{'contentOrderList': {$elemMatch: {'content_id': ?0 }} }")
    List<Category> findContentByContentId(ObjectId contentId);

    //find content list by contentId and categoryId
    @Query("{'contentOrderList': {$elemMatch: {'content_id': ?0 }}, '_id': ?1 }")
    Category findContentBy_ContentId_CategoryId(ObjectId contentId, ObjectId categoryId);

    //Search category by name
    @Query("{'customer_id' : ?0, 'name' : {$regex : ?1, $options: 'i'}, 'show_in_menu' : { $ne : true }, $or:[{'category_type' : { $eq : 6 }}, {'category_type' : { $eq : 7 }}] }")
    List<Category> findAllByTitleForUserSearch(ObjectId customerId, String title);

//    @Query("{ 'customer.$id' : ?0 }")
//    Category findMin(ObjectId customer_id, Sort sort, Pageable pageable);
}
