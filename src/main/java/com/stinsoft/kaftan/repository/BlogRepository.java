package com.stinsoft.kaftan.repository;

import com.stinsoft.kaftan.model.Blog;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface BlogRepository extends MongoRepository<Blog, ObjectId> {

    @Query("{ 'title' : ?0 }")
    Blog findBlogByTitle(String title);

    //Search category by name
    @Query("{ $or:[{'title' : {$regex : ?0, $options: 'i'}},{'content' : {$regex : ?0, $options: 'i'}}] }")
    List<Blog> findAllByTitleForUserSearch(String title);
 }
