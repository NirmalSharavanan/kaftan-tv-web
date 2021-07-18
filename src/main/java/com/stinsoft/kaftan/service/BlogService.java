package com.stinsoft.kaftan.service;

import com.stinsoft.kaftan.dto.BlogDTOForUser;
import com.stinsoft.kaftan.model.Blog;
import com.stinsoft.kaftan.repository.BlogRepository;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.stereotype.Service;
import ss.core.dto.ReOrderDTO;
import ss.core.helper.DateHelper;

import java.util.List;

import static org.springframework.data.mongodb.core.aggregation.Aggregation.*;

@Service
public class BlogService implements IBlogService {

    @Autowired
    BlogRepository repository;

    @Autowired
    MongoOperations operations;

    private Logger logger = LoggerFactory.getLogger(BlogService.class);

    @Override
    public Blog create(Blog blog) {
        blog.setCreated_at(DateHelper.getCurrentDate());
        blog.setUpdated_at(DateHelper.getCurrentDate());
        return repository.save(blog);
    }

    @Override
    public Blog find(String id) {
        return repository.findOne(new ObjectId(id));
    }

    @Override
    public Blog find(ObjectId id) {
        return repository.findOne(id);
    }

    @Override
    public Blog findBlogByTitle(String title) {
        return repository.findBlogByTitle(title);
    }

    @Override
    public List<BlogDTOForUser> findAll() {

        AggregationResults<BlogDTOForUser> results = operations.aggregate(
                newAggregation(Blog.class,
                        lookup("user", "user_id", "_id", "userInfo"),
                        unwind("userInfo"),
                        sort(Sort.Direction.DESC, "sort_order")

                ), BlogDTOForUser.class);
        return results.getMappedResults();
       // return repository.findAll(new Sort(Sort.Direction.DESC, "sort_order"));
    }

    @Override
    public Blog update(ObjectId id, Blog blog) {
        blog.setUpdated_at(DateHelper.getCurrentDate());
        return repository.save(blog);
    }

    @Override
    public ObjectId delete(ObjectId id) {
        repository.delete(id);
        return id;
    }

    @Override
    public boolean blogReOrder(List<ReOrderDTO> reOrderDTOList) {
        try {
            boolean isSwapSuccess = false;

            if (reOrderDTOList != null && reOrderDTOList.size() > 0) {
                for (ReOrderDTO reOrderDTO : reOrderDTOList) {
                    Blog blog = repository.findOne(new ObjectId(reOrderDTO.getId()));
                    if (blog != null) {
                        blog.setSort_order(reOrderDTO.getSort_order());
                        repository.save(blog);
                    }
                }
                isSwapSuccess = true;
            }
            return isSwapSuccess;
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
        }
        return false;
    }

    @Override
    public List<Blog> findAllByTitleForUserSearch(String title) {
        try {
            return repository.findAllByTitleForUserSearch(title);
        }
        catch (Exception e) {
            logger.error(e.getMessage(), e);
        }

        return null;
    }
}
