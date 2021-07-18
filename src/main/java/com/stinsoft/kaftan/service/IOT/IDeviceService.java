package com.stinsoft.kaftan.service.IOT;

import com.stinsoft.kaftan.dto.ReOrderDTO;
import com.stinsoft.kaftan.model.IOT.iot_Device;
import org.bson.types.ObjectId;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface IDeviceService {

    iot_Device create(iot_Device device, MultipartFile deviceIcon);
    List<iot_Device> findAllByCustomerId(ObjectId customerId);
    iot_Device find(ObjectId deviceId);
    iot_Device find(String deviceId);
    iot_Device findDeviceByName(ObjectId customerId, String deviceName);
    iot_Device update(iot_Device device, MultipartFile deviceIcon);
    boolean deviceReOrder(List<ReOrderDTO> reOrderDTOList);

}
