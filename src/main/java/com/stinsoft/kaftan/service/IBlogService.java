package com.stinsoft.kaftan.service;

import com.stinsoft.kaftan.dto.BlogDTOForUser;
import com.stinsoft.kaftan.model.Blog;
import org.bson.types.ObjectId;
import ss.core.dto.ReOrderDTO;

import java.util.List;

public interface IBlogService {

    Blog create(Blog blog);
    Blog find(String id);
    Blog find(ObjectId id);
    Blog findBlogByTitle(String title);
    List<BlogDTOForUser> findAll();
    Blog update(ObjectId id, Blog blog);
    ObjectId delete(ObjectId id);
    boolean blogReOrder(List<ReOrderDTO> reOrderDTOList);
    List<Blog> findAllByTitleForUserSearch(String title);

}
