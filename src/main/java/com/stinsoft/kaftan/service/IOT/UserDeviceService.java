package com.stinsoft.kaftan.service.IOT;

import com.stinsoft.kaftan.model.IOT.iot_userDevice;
import com.stinsoft.kaftan.repository.IOT.UserDeviceRepository;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ss.core.helper.DateHelper;

import java.util.List;

@Service
public class UserDeviceService implements IUserDevice {

    @Autowired
    UserDeviceRepository repository;

    private Logger logger = LoggerFactory.getLogger(UserDeviceService.class);

    @Override
    public iot_userDevice findByDeviceId(ObjectId customerId, ObjectId deviceId, ObjectId userId, String placeName) {
        return repository.findByDeviceId(customerId, deviceId, userId, placeName);
    }

    @Override
    public iot_userDevice create(iot_userDevice device) {
        return repository.save(device);
    }

    @Override
    public iot_userDevice find(ObjectId deviceId) {
        return repository.findOne(deviceId);
    }

    @Override
    public iot_userDevice find(String deviceId) {
        return repository.findOne(new ObjectId(deviceId));
    }

    @Override
    public iot_userDevice update(iot_userDevice device) {
        device.setUpdated_at(DateHelper.getCurrentDate());
        return repository.save(device);
    }

    @Override
    public List<iot_userDevice> findAllByUserId(ObjectId customerId, ObjectId userId) {
        return repository.findAllByUserId(customerId, userId);
    }
}
