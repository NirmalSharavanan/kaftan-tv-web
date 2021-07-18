package com.stinsoft.kaftan.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import ss.core.model.Customer;
import ss.core.model.Response;

import java.util.List;

/**
 * Created by ssu on 04/12/17.
 */
@Document
public class Genre extends Response {

    @Id
    private String          id;

    private String          name;
    private int             sort_order;

    @DBRef
    private Customer customer;

    @DBRef
    private List<Content> contentList;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getSort_order() {
        return sort_order;
    }

    public void setSort_order(int sort_order) {
        this.sort_order = sort_order;
    }

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public List<Content> getContentList() {
        return contentList;
    }

    public void setContentList(List<Content> contentList) {
        this.contentList = contentList;
    }
}
