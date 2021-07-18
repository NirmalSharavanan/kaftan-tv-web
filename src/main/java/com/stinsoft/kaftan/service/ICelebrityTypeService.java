package com.stinsoft.kaftan.service;


import com.stinsoft.kaftan.model.CelebrityType;
import org.bson.types.ObjectId;

import java.util.List;

/**
 * Created by ssu on 11/12/17.
 */
public interface ICelebrityTypeService {

    CelebrityType create(CelebrityType object);

    CelebrityType find(String id);

    CelebrityType find(ObjectId id);

    CelebrityType findByName(String name);

    List<CelebrityType> findByCustomerId(ObjectId customer_id);

    List<CelebrityType> findByCustomerId(String customer_id);

    CelebrityType update(ObjectId id, CelebrityType object);

    ObjectId delete(ObjectId id);

}
