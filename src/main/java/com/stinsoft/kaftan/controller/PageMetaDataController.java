package com.stinsoft.kaftan.controller;

import com.stinsoft.kaftan.model.PageMetadata;
import com.stinsoft.kaftan.service.PageMetaDataService;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.stinsoft.kaftan.dto.PageMetaDataDTO;
import com.stinsoft.kaftan.messages.AppMessages;
import com.stinsoft.kaftan.messages.ExceptionMessages;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ss.core.model.Customer;
import ss.core.security.service.ISessionService;

import java.util.ArrayList;
import java.util.List;

/**
 Created by divya on 27/01/2018
 **/
@RestController
@RequestMapping("api/")

public class PageMetaDataController extends BaseController{

    @Autowired
    PageMetaDataService pageMetaDataService;

    @Autowired
    ISessionService sessionService;

    Logger logger = LoggerFactory.getLogger(this.getClass());


    @RequestMapping(value = "admin/session/page-metadata/create", method = RequestMethod.POST)
    public ResponseEntity<?> create(@RequestBody final PageMetaDataDTO pageMetaDataDTO){
        try {

            PageMetadata pageMetadata = new PageMetadata();

            pageMetadata.setPage_type(pageMetaDataDTO.getPage_type());
            pageMetadata.setPage_name(pageMetaDataDTO.getPage_name());
            pageMetadata.setTitle(pageMetaDataDTO.getTitle());
            pageMetadata.setDescription(pageMetaDataDTO.getDescription());
            pageMetadata.setKeywords(pageMetaDataDTO.getKeywords());

            Customer customer = null;
            if(sessionService.getUser() != null) {
                customer = sessionService.getUser().getCustomer();
            }

            pageMetadata.setCustomer_id(customer.getId());
            pageMetadata =  pageMetaDataService.create(pageMetadata);

            if(pageMetadata!=null){
                pageMetadata.setSuccess(true);
                pageMetadata.setMessage(AppMessages.PAGE_META_DATA_CREATED);
            }
            else {
                pageMetadata = new PageMetadata();
                pageMetadata.setSuccess(false);
                pageMetadata.setMessage(ExceptionMessages.PAGE_META_DATA_CREATE_ERROR);
            }

            return new ResponseEntity<>(pageMetadata, HttpStatus.OK);
        }
        catch (Exception e){
            logger.error(ExceptionMessages.UNEXPECTED_MESSAGE, e);
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = "admin/session/page-metadata", method = RequestMethod.GET)
    public ResponseEntity<?> getAllPageMetaData(){
        try{

            Customer customer = null;
            if(sessionService.getUser() != null) {
                customer = sessionService.getUser().getCustomer();
            }

            List<PageMetadata> pageMetadataList=new ArrayList<>();
            pageMetadataList=pageMetaDataService.findAllMetaDataByCustomerId(customer.getId());
            return new ResponseEntity<>(pageMetadataList, HttpStatus.OK);
        }
        catch (Exception e){
            logger.error(ExceptionMessages.UNEXPECTED_MESSAGE, e);
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = "admin/session/page-metadata/{id}", method = RequestMethod.GET)
    public ResponseEntity<?> getPageMetaData(@PathVariable String id){
        try{

            PageMetadata pageMetadata=pageMetaDataService.find(id);
            if(pageMetadata!=null){
                pageMetadata.setSuccess(true);
            }
            else {
                pageMetadata = new PageMetadata();
                pageMetadata.setSuccess(false);
                pageMetadata.setMessage(AppMessages.PAGE_META_DATA_NOT_EXISTS);
            }

            return new ResponseEntity<>(pageMetadata,HttpStatus.OK);
        }
        catch (Exception e){
            logger.error(ExceptionMessages.UNEXPECTED_MESSAGE, e);
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = "admin/session/page-metadata/update/{id}", method = RequestMethod.PUT)
    public ResponseEntity<?> update(@PathVariable String id, @RequestBody final PageMetaDataDTO pageMetaDataDTO){
        try{

            PageMetadata pageMetadata=pageMetaDataService.find(id);

            if(pageMetadata!=null){

                pageMetadata.setPage_type(pageMetaDataDTO.getPage_type());
                pageMetadata.setPage_name(pageMetaDataDTO.getPage_name());
                pageMetadata.setTitle(pageMetaDataDTO.getTitle());
                pageMetadata.setDescription(pageMetaDataDTO.getDescription());
                pageMetadata.setKeywords(pageMetaDataDTO.getKeywords());

                pageMetadata =  pageMetaDataService.update(new ObjectId(id), pageMetadata);
                pageMetadata.setSuccess(true);
                pageMetadata.setMessage(AppMessages.PAGE_META_DATA_UPDATED);
            }
            else {
                pageMetadata = new PageMetadata();
                pageMetadata.setSuccess(false);
                pageMetadata.setMessage(AppMessages.PAGE_META_DATA_NOT_EXISTS);
            }

            return new ResponseEntity<>(pageMetadata,HttpStatus.OK);
        }
        catch (Exception e){
            logger.error(ExceptionMessages.UNEXPECTED_MESSAGE, e);
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = "admin/session/page-metadata/delete/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<?> delete(@PathVariable String id){
        try{

            PageMetadata pageMetadata=pageMetaDataService.find(id);

            if(pageMetadata!=null){

                pageMetaDataService.delete(new ObjectId(id));
                pageMetadata = new PageMetadata();
                pageMetadata.setSuccess(true);
                pageMetadata.setMessage(AppMessages.PAGE_META_DATA_DELETED);
            }
            else {
                pageMetadata = new PageMetadata();
                pageMetadata.setSuccess(false);
                pageMetadata.setMessage(AppMessages.PAGE_META_DATA_NOT_EXISTS);
            }

            return new ResponseEntity<>(pageMetadata,HttpStatus.OK);
        }
        catch (Exception e){
            logger.error(ExceptionMessages.UNEXPECTED_MESSAGE, e);
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }
}
