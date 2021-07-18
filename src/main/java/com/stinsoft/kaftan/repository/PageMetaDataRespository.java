package com.stinsoft.kaftan.repository;

import com.stinsoft.kaftan.model.PageMetadata;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import java.util.List;

public interface PageMetaDataRespository extends MongoRepository<PageMetadata, ObjectId> {

    @Query("{'customer_id': ?0}")
    List<PageMetadata> findAllMetaDataByCustomerId(ObjectId customer_id);

}
