package com.stinsoft.kaftan.service;

import com.stinsoft.kaftan.dto.BlogCommentDTO;
import com.stinsoft.kaftan.model.BlogComment;
import org.bson.types.ObjectId;

import java.util.List;

public interface IBlogCommentService {
    BlogComment create(BlogComment blogComment);
    BlogComment find(ObjectId id);
    List<BlogCommentDTO> findBlog(ObjectId blog_id);
    BlogComment update(ObjectId id, BlogComment blogComment);
    ObjectId delete(ObjectId id);
}
