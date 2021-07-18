package com.stinsoft.kaftan.controller;

import com.stinsoft.kaftan.dto.CelebrityTypeDTO;
import com.stinsoft.kaftan.messages.AppMessages;
import com.stinsoft.kaftan.messages.ExceptionMessages;
import com.stinsoft.kaftan.service.CelebrityTypeService;
import com.stinsoft.kaftan.model.CelebrityType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ss.core.security.service.ISessionService;

import java.util.ArrayList;
import java.util.List;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.methodOn;

/**
 * Created by ssu on 12/12/17.
 */
@RestController
@RequestMapping("api/")
public class CelebrityTypeController extends BaseController {


    @Autowired
    CelebrityTypeService service;

    @Autowired
    private ISessionService sessionService;

    Logger logger = LoggerFactory.getLogger(this.getClass());;

    @RequestMapping(value = "admin/session/celebrity-type/create", method = RequestMethod.POST)
    public ResponseEntity<?> create(@RequestBody final CelebrityTypeDTO celebrityTypeDTO) {

        try {

            CelebrityType celebrityType = service.findByName(celebrityTypeDTO.getName());


            if(celebrityType == null) {

                celebrityType = new CelebrityType();
                celebrityType.setName(celebrityTypeDTO.getName());
                celebrityType.setCustomer_id(sessionService.getUser().getCustomer_id());

                celebrityType = service.create(celebrityType);
                celebrityType.setSuccess(true);
                celebrityType.setMessage(AppMessages.CELEBRITY_TYPE_CREATED);
            }
            else {

                celebrityType = new CelebrityType();
                celebrityType.setSuccess(false);
                celebrityType.setMessage(AppMessages.CELEBRITY_TYPE_EXISTS);
                logger.info(String.format("celebrity exists %s", celebrityTypeDTO.getName()));
            }

            return new ResponseEntity<>(celebrityType, HttpStatus.OK);
        }
        catch (Exception e) {
            logger.error(ExceptionMessages.UNEXPECTED_MESSAGE, e );
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = "admin/session/celebrity-type/update/{id}", method = RequestMethod.PUT)
    public ResponseEntity<?> update(@PathVariable String id, @RequestBody final CelebrityTypeDTO celebrityTypeDTO) {

        try {

            CelebrityType celebrityType = service.find(id);


            if (celebrityType != null) {

                celebrityType.setName(celebrityTypeDTO.getName());

                celebrityType = service.update(celebrityType.getId(), celebrityType);
                celebrityType.setSuccess(true);
                celebrityType.setMessage(AppMessages.CELEBRITY_TYPE_CREATED);
            }
            else {

                celebrityType = new CelebrityType();
                celebrityType.setSuccess(false);
                celebrityType.setMessage(AppMessages.CELEBRITY_TYPE_NOT_EXISTS);
                logger.info(String.format("celebrity exists %s", celebrityTypeDTO.getName()));
            }

            return new ResponseEntity<>(celebrityType, HttpStatus.OK);
        }
        catch (Exception e) {
            logger.error(ExceptionMessages.UNEXPECTED_MESSAGE, e );
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = "session/celebrity-type/", method = RequestMethod.GET)
    public ResponseEntity<?> getAllCelebrityType() {

        try {

            List<Resource<CelebrityType>> resources = new ArrayList<Resource<CelebrityType>>();

            List<CelebrityType> celebrityTypeList = service.findByCustomerId(sessionService.getCustomer().getId());

            for (CelebrityType celebrityType : celebrityTypeList) {
                resources.add(getCelebrityTypeResource(celebrityType));
            }

            return new ResponseEntity<>(resources, HttpStatus.OK);
        }
        catch (Exception e) {
            logger.error(ExceptionMessages.UNEXPECTED_MESSAGE, e );
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = "session/celebrity-type/{id}", method = RequestMethod.GET)
    public ResponseEntity<?> getCelebrityType(@PathVariable String id) {
        try {

            CelebrityType celebrityType = service.find(id);

            if(celebrityType != null) {
                celebrityType.setSuccess(true);
            }
            else {
                celebrityType = new CelebrityType();
                celebrityType.setSuccess(false);
                celebrityType.setMessage(AppMessages.CELEBRITY_TYPE_NOT_EXISTS);
            }

            Resource<CelebrityType> resource = getCelebrityTypeResource(celebrityType);
            return new ResponseEntity<>(resource, HttpStatus.OK);
        }
        catch (Exception e) {
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    private Resource<CelebrityType> getCelebrityTypeResource(CelebrityType celebrityType) {

        Resource<CelebrityType> resource = new Resource<CelebrityType>(celebrityType);
        resource.add(linkTo(methodOn(this.getClass()).getCelebrityType(celebrityType.getId().toString())).withSelfRel());
        return resource;
    }
}
