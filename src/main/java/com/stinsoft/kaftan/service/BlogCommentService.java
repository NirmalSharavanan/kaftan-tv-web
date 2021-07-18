package com.stinsoft.kaftan.service;

import com.stinsoft.kaftan.dto.BlogCommentDTO;
import org.bson.types.ObjectId;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.stereotype.Service;
import com.stinsoft.kaftan.model.BlogComment;
import com.stinsoft.kaftan.repository.BlogCommentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import ss.core.dto.PushNotificationByUserDTO;
import ss.core.dto.UserDetailsDTO;
import ss.core.helper.DateHelper;
import ss.core.model.PushNotificationByUser;
import ss.core.model.UserBaseEntity;

import java.util.List;

import static org.springframework.data.mongodb.core.aggregation.Aggregation.*;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.match;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.sort;
import static org.springframework.data.mongodb.core.query.Criteria.where;

@Service
public class BlogCommentService implements IBlogCommentService {

    @Autowired
    BlogCommentRepository repository;

    @Autowired
    MongoOperations operations;

    private Logger logger = LoggerFactory.getLogger(BlogComment.class);

    @Override
    public BlogComment create(BlogComment blogComment) {
        blogComment.setCreated_at(DateHelper.getCurrentDate());
        blogComment.setUpdated_at(DateHelper.getCurrentDate());
        return repository.save(blogComment);
    }

    @Override
    public BlogComment find(ObjectId id) {
        return null;
    }

    @Override
    public List<BlogCommentDTO> findBlog(ObjectId blog_id) {

        AggregationResults<BlogCommentDTO> results = operations.aggregate(
                newAggregation(BlogComment.class,
                        match(where("blog_id").is(blog_id)),
                        lookup("user", "user_id", "_id", "userInfo"),
                        unwind("userInfo"),
                        sort(Sort.Direction.DESC, "id"),
                        limit((50))
                ), BlogCommentDTO.class);

        return results.getMappedResults();
    }

    @Override
    public BlogComment update(ObjectId id, BlogComment blogComment) {
        return null;
    }

    @Override
    public ObjectId delete(ObjectId id) {
        return null;
    }
}
