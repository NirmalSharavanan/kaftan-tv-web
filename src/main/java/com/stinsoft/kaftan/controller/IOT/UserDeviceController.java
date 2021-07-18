package com.stinsoft.kaftan.controller.IOT;

import com.stinsoft.kaftan.dto.IOT.UserDeviceDTO;
import com.stinsoft.kaftan.messages.AppMessages;
import com.stinsoft.kaftan.messages.ExceptionMessages;
import com.stinsoft.kaftan.model.IOT.iot_Device;
import com.stinsoft.kaftan.model.IOT.iot_userDevice;
import com.stinsoft.kaftan.service.IOT.DeviceService;
import com.stinsoft.kaftan.service.IOT.UserDeviceService;
import org.bson.types.ObjectId;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ss.core.aws.S3Service;
import ss.core.helper.DateHelper;
import ss.core.model.Customer;
import ss.core.security.service.ISessionService;
import ss.core.service.CustomerService;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("api/")
public class UserDeviceController {

    @Autowired
    UserDeviceService service;

    @Autowired
    DeviceService deviceService;

    @Autowired
    CustomerService customerService;

    @Autowired
    private ISessionService sessionService;

    @Autowired
    S3Service s3Service;

    @RequestMapping(value = "session/iot/userdevice/create", method = RequestMethod.POST)
    public ResponseEntity<?> create(@RequestBody UserDeviceDTO deviceDTO) {
        try {

            iot_userDevice device = service.findByDeviceId(sessionService.getCustomer().getId(), new ObjectId(deviceDTO.getDevice_id()), sessionService.getUser().getId(), deviceDTO.getName());
            if (device == null) {

                device = new iot_userDevice();

                ModelMapper modelMapper = new ModelMapper();
                device = modelMapper.map(deviceDTO, iot_userDevice.class);

                device.setDevice_id(new ObjectId(deviceDTO.getDevice_id()));
                device.setUser_id(sessionService.getUser().getId());
                device.setCustomer_id(sessionService.getUser().getCustomer_id());
                device.setCreated_at(DateHelper.getCurrentDate());
                device.setUpdated_at(DateHelper.getCurrentDate());

                device = service.create(device);
                if (device != null) {
                    device.setSuccess(true);
                    device.setMessage(AppMessages.DEVICE_CREATED);
                } else {
                    device = new iot_userDevice();
                    device.setSuccess(false);
                    device.setMessage(AppMessages.DEVICE_EXISTS);
                }
            } else {
                device = new iot_userDevice();
                device.setSuccess(false);
                device.setMessage(AppMessages.DEVICE_EXISTS);
            }
            return new ResponseEntity<>(device, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = "session/iot/userdevice/update/{userDeviceId}", method = RequestMethod.PUT)
    public ResponseEntity<?> update(@PathVariable String userDeviceId,
                                    @RequestBody UserDeviceDTO deviceDTO) {
        try {

            iot_userDevice device = service.find(userDeviceId);
            if (device != null) {
                if (deviceDTO.getName() != null && deviceDTO.getName() != "") {
                    device.setName(deviceDTO.getName());
                }
                if (deviceDTO.getUnique_Id() != null && deviceDTO.getUnique_Id() != "") {
                    device.setUnique_Id(deviceDTO.getUnique_Id());
                }

                device.setStatus(deviceDTO.isStatus());

                device = service.update(device);
                device.setSuccess(true);
                device.setMessage(AppMessages.DEVICE_UPDATED);
            } else {
                device = new iot_userDevice();
                device.setSuccess(false);
                device.setMessage(AppMessages.DEVICE_NOT_EXISTS);
            }
            return new ResponseEntity<>(device, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = "session/iot/userdevicelist", method = RequestMethod.GET)
    public ResponseEntity<?> getAllUserDeviceList() {
        try {
            List<iot_userDevice> deviceList = new ArrayList<>();
            List<Resource<iot_userDevice>> resources = new ArrayList<Resource<iot_userDevice>>();

            Customer customer = customerService.findByHost(sessionService.getHost());

            if (customer != null) {
                deviceList = service.findAllByUserId(customer.getId(), sessionService.getUser().getId());
                if (deviceList != null && deviceList.size() > 0)
                    for (iot_userDevice device : deviceList) {
                        // To Do:
                        // Get Device Name
                        resources.add(getDeviceResource(device, customer));
                    }
            }

            return new ResponseEntity<>(resources, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    private Resource<iot_userDevice> getDeviceResource(iot_userDevice device, Customer customer) {

        Resource<iot_userDevice> resource = new Resource<>(device);
        iot_Device iot_device = deviceService.find(device.getDevice_id());
        if (iot_device != null) {
            if (iot_device.getIcon_aws_info() != null)
                resource.add(new Link(s3Service.getAWSUrl(iot_device.getIcon_aws_info().getId(), customer.getAws_bucket()), "awsIconUrl"));
        }

        return resource;
    }
}
