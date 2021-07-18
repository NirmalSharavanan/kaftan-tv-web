package com.stinsoft.kaftan.repository;

import com.stinsoft.kaftan.model.BlogComment;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface BlogCommentRepository extends MongoRepository<BlogComment, ObjectId> {
    @Query("{ 'blog_id' : ?0}")
    List<BlogComment> findAllUsers(ObjectId blog_id);
}
