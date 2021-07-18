package com.stinsoft.kaftan.service;

import com.stinsoft.kaftan.model.CelebrityType;
import com.stinsoft.kaftan.repository.CelebrityTypeRepository;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Created by ssu on 11/12/17.
 */
@Service
public class CelebrityTypeService implements ICelebrityTypeService {

    @Autowired
    CelebrityTypeRepository repository;

    @Override
    public CelebrityType create(CelebrityType celebrityType) {

        return repository.save(celebrityType);
    }

    @Override
    public CelebrityType find(String id) {
        return this.find(new ObjectId(id));
    }

    @Override
    public CelebrityType find(ObjectId id) {
        return repository.findOne(id);
    }

    @Override
    public CelebrityType findByName(String name) {
        return repository.findByName(name);
    }

    @Override
    public List<CelebrityType> findByCustomerId(ObjectId customer_id) {
        return repository.findByCustomerId(customer_id);
    }

    @Override
    public List<CelebrityType> findByCustomerId(String customer_id) {
        return repository.findByCustomerId(new ObjectId(customer_id) );
    }

    @Override
    public CelebrityType update(ObjectId id, CelebrityType celebrityType) {

        celebrityType.setId(id);
        return repository.save(celebrityType);
    }

    @Override
    public ObjectId delete(ObjectId id) {
        repository.delete(id);
        return id;
    }
}
