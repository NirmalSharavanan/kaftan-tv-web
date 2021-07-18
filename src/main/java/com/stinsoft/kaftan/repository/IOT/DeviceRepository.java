package com.stinsoft.kaftan.repository.IOT;

import com.stinsoft.kaftan.model.IOT.iot_Device;
import org.bson.types.ObjectId;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface DeviceRepository extends MongoRepository<iot_Device, ObjectId> {

    @Query("{ 'customer_id' : ?0, 'deviceName' : ?1 }")
    iot_Device findDeviceByName(ObjectId customerId, String deviceName);

    @Query("{ 'customer_id' : ?0 }")
    List<iot_Device> findAllByCustomerId(ObjectId customerId, Sort sort);
}
