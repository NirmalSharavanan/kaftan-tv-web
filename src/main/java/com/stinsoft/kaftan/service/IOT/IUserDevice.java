package com.stinsoft.kaftan.service.IOT;

import com.stinsoft.kaftan.model.IOT.iot_userDevice;
import org.bson.types.ObjectId;

import java.util.List;

public interface IUserDevice {

    iot_userDevice findByDeviceId(ObjectId customerId, ObjectId deviceId, ObjectId userId, String placeName);

    iot_userDevice create(iot_userDevice device);

    iot_userDevice find(ObjectId deviceId);

    iot_userDevice find(String deviceId);

    iot_userDevice update(iot_userDevice device);

    List<iot_userDevice> findAllByUserId(ObjectId customerId, ObjectId userId);

}
