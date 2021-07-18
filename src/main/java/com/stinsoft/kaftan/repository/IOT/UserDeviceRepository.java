package com.stinsoft.kaftan.repository.IOT;

import com.stinsoft.kaftan.model.IOT.iot_userDevice;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface UserDeviceRepository extends MongoRepository<iot_userDevice, ObjectId> {

    @Query("{ 'customer_id' : ?0, 'device_id': ?1, 'user_id': ?2, 'name': {$regex : ?3, $options: 'i'} }")
    iot_userDevice findByDeviceId(ObjectId customerId, ObjectId deviceId, ObjectId userId, String placeName);

    @Query("{ 'customer_id' : ?0, 'user_id': ?1 }")
    List<iot_userDevice> findAllByUserId(ObjectId customerId, ObjectId userId);

}
