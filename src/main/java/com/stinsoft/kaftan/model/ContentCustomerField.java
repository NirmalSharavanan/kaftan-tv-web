package com.stinsoft.kaftan.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import ss.core.model.Customer;

/**
 * Created by ssu on 04/12/17.
 */
@Document
public class ContentCustomerField {

    @Id
    private String          id;
    private String          name;
    private String          fieldType;
    private String          fieldValue;

}
