package com.stinsoft.kaftan.controller.IOT;

import com.stinsoft.kaftan.controller.BaseController;
import com.stinsoft.kaftan.dto.ReOrderDTO;
import com.stinsoft.kaftan.messages.AppMessages;
import com.stinsoft.kaftan.messages.ExceptionMessages;
import com.stinsoft.kaftan.model.IOT.iot_Device;
import com.stinsoft.kaftan.service.IOT.DeviceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ss.core.aws.S3Service;
import ss.core.helper.CounterHelper;
import ss.core.model.Customer;
import ss.core.model.Response;
import ss.core.security.service.ISessionService;
import ss.core.service.CustomerService;

import java.util.ArrayList;
import java.util.List;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;

@RestController
@RequestMapping("api/")
public class DeviceController extends BaseController {

    @Autowired
    DeviceService deviceService;

    @Autowired
    CustomerService customerService;

    @Autowired
    private ISessionService sessionService;

    @Autowired
    private CounterHelper counterHelper;

    @Autowired
    S3Service s3Service;

    @RequestMapping(value = "admin/session/iot/device/create", method = RequestMethod.POST)
    public ResponseEntity<?> create(@RequestParam(value = "deviceName", required = true) String deviceName,
                                    @RequestParam(value = "deviceIcon", required = true) MultipartFile deviceIcon,
                                    @RequestParam(value = "isActive", required = false) boolean isActive) {
        try {
            iot_Device device = deviceService.findDeviceByName(sessionService.getCustomer().getId(), deviceName);
            if (device == null) {
                device = new iot_Device();
                device.setDeviceName(deviceName);
                device.setActive(isActive);
                String uniqueName = iot_Device.class.getName() + "_" + sessionService.getUser().getCustomer_id().toString();
                device.setSort_order(counterHelper.getNextSequence(uniqueName));
                device.setCustomer_id(sessionService.getUser().getCustomer_id());

                device = deviceService.create(device, deviceIcon);
                device.setSuccess(true);
                device.setMessage(AppMessages.DEVICE_CREATED);
            } else {
                device = new iot_Device();
                device.setSuccess(false);
                device.setMessage(AppMessages.DEVICE_EXISTS);
            }
            return new ResponseEntity<>(device, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = "admin/session/iot/device/update/{deviceId}", method = RequestMethod.PUT)
    public ResponseEntity<?> update(@PathVariable String deviceId,
                                    @RequestParam(value = "deviceIcon", required = false) MultipartFile deviceIcon,
                                    @RequestParam(value = "deviceName", required = true) String deviceName,
                                    @RequestParam(value = "isActive", required = false) boolean isActive) {
        try {
            iot_Device device = deviceService.find(deviceId);
            if (device != null) {
                device.setDeviceName(deviceName);
                device.setActive(isActive);

                device = deviceService.update(device, deviceIcon);
                device.setSuccess(true);
                device.setMessage(AppMessages.DEVICE_UPDATED);
            } else {
                device = new iot_Device();
                device.setSuccess(false);
                device.setMessage(AppMessages.DEVICE_NOT_EXISTS);
            }
            return new ResponseEntity<>(device, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = "session/iot/devicelist", method = RequestMethod.GET)
    public ResponseEntity<?> getAllDeviceList() {
        try {
            List<iot_Device> deviceList = new ArrayList<>();
            List<Resource<iot_Device>> resources = new ArrayList<Resource<iot_Device>>();

            Customer customer = customerService.findByHost(sessionService.getHost());

            if (customer != null) {
                deviceList = deviceService.findAllByCustomerId(customer.getId());
                if (deviceList != null && deviceList.size() > 0)
                    for (iot_Device device : deviceList) {
                        resources.add(getDeviceResource(device, customer));
                    }
            }

            return new ResponseEntity<>(resources, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = "admin/session/iot/device/re-order", method = RequestMethod.PUT)
    public ResponseEntity<?> reOrder(@RequestBody List<ReOrderDTO> reOrderDTOList) {
        try {
            Response response = new Response();
            response.setSuccess(deviceService.deviceReOrder(reOrderDTOList));
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = "session/iot/device/{deviceId}", method = RequestMethod.GET)
    public ResponseEntity<?> getDevice(@PathVariable String deviceId) {
        try {

            iot_Device device = deviceService.find(deviceId);
            if (device != null) {

                Customer customer = customerService.find(device.getCustomer_id());
                Resource<iot_Device> resource = getDeviceResource(device, customer);

                device.setSuccess(true);
                return new ResponseEntity<>(resource, HttpStatus.OK);
            } else {
                device = new iot_Device();
                device.setSuccess(false);
                device.setMessage(AppMessages.DEVICE_NOT_EXISTS);
                return new ResponseEntity<>(device, HttpStatus.OK);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(ExceptionMessages.UNEXPECTED_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    private Resource<iot_Device> getDeviceResource(iot_Device device, Customer customer) {

        Resource<iot_Device> resource = new Resource<>(device);

        if (device.getIcon_aws_info() != null)
            resource.add(new Link(s3Service.getAWSUrl(device.getIcon_aws_info().getId(), customer.getAws_bucket()), "awsIconUrl"));

        return resource;
    }

}
