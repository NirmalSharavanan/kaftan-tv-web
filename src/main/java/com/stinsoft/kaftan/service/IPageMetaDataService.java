package com.stinsoft.kaftan.service;

import com.stinsoft.kaftan.model.PageMetadata;
import org.bson.types.ObjectId;
import java.util.List;

/**
Created by divya on 27/01/2018
 **/

public interface IPageMetaDataService {
    PageMetadata create(PageMetadata object);
    List<PageMetadata> findAllMetaDataByCustomerId(ObjectId customer_id);
    PageMetadata find(String id);
    PageMetadata find(ObjectId id);
    PageMetadata update(ObjectId id, PageMetadata object);
    ObjectId delete(ObjectId id);
}
