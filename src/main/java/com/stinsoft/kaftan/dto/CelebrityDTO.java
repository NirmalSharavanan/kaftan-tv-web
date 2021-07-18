package com.stinsoft.kaftan.dto;

import com.stinsoft.kaftan.model.CelebrityType;
import org.springframework.data.mongodb.core.mapping.DBRef;

/**
 * Created by ssu on 12/12/17.
 */
public class CelebrityDTO {

    private String name;
    private String          description;
    private String celebrityTypeId;
    @DBRef
    private CelebrityType celebrityType;


    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCelebrityTypeId() {
        return celebrityTypeId;
    }

    public void setCelebrityTypeId(String celebrityTypeId) {
        this.celebrityTypeId = celebrityTypeId;
    }

    public CelebrityType getCelebrityType() {
        return celebrityType;
    }

    public void setCelebrityType(CelebrityType celebrityType) {
        this.celebrityType = celebrityType;
    }
}
