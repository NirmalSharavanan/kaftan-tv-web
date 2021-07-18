package com.stinsoft.kaftan.service;

import com.stinsoft.kaftan.model.PageMetadata;
import com.stinsoft.kaftan.repository.PageMetaDataRespository;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 Created by divya on 27/01/2018
 **/

@Service
public class PageMetaDataService implements IPageMetaDataService {

    @Autowired
    PageMetaDataRespository pageMetaDataRespository;

    @Override
    public PageMetadata create(PageMetadata pageMetadata) {
        return pageMetaDataRespository.save(pageMetadata);
    }

    @Override
    public List<PageMetadata> findAllMetaDataByCustomerId(ObjectId customer_id) {
        return pageMetaDataRespository.findAllMetaDataByCustomerId(customer_id);
    }

    @Override
    public PageMetadata find(String id) {
        return pageMetaDataRespository.findOne(new ObjectId(id));
    }

    @Override
    public PageMetadata find(ObjectId id) {
        return pageMetaDataRespository.findOne(id);
    }

    @Override
    public PageMetadata update(ObjectId id, PageMetadata pageMetadata) {
        return pageMetaDataRespository.save(pageMetadata);
    }

    @Override
    public ObjectId delete(ObjectId id) {
        pageMetaDataRespository.delete(id);
        return id;
    }
}
