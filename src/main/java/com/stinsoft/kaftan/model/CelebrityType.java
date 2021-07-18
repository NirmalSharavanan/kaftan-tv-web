package com.stinsoft.kaftan.model;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import ss.core.helper.JsonObjectIdSerializer;
import ss.core.model.Customer;
import ss.core.model.Response;

import java.util.List;

/**
 * Created by ssu on 06/12/17.
 */
//Type in the meaning of (singers, directors, actors, camera, etc
public class CelebrityType extends Response {

    @Id
    @JsonSerialize(using=JsonObjectIdSerializer.class)
    private ObjectId id;
    private String          name;

    @JsonSerialize(using=JsonObjectIdSerializer.class)
    private ObjectId customer_id;

    public ObjectId getId() {
        return id;
    }

    public void setId(ObjectId id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public ObjectId getCustomer_id() {
        return customer_id;
    }

    public void setCustomer_id(ObjectId customer_id) {
        this.customer_id = customer_id;
    }
}
