package com.stinsoft.kaftan.service.IOT;

import com.amazonaws.services.s3.model.PutObjectResult;
import com.stinsoft.kaftan.dto.ReOrderDTO;
import com.stinsoft.kaftan.model.IOT.iot_Device;
import com.stinsoft.kaftan.repository.IOT.DeviceRepository;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import ss.core.aws.AWSInfo;
import ss.core.aws.S3Service;
import ss.core.helper.DateHelper;

import java.io.InputStream;
import java.util.List;

@Service
public class DeviceService implements IDeviceService {

    @Autowired
    DeviceRepository repository;

    @Autowired
    S3Service s3Service;

    private Logger logger = LoggerFactory.getLogger(DeviceService.class);

    @Override
    public iot_Device create(iot_Device device, MultipartFile deviceIcon) {
        try {
            if (deviceIcon != null) {
                device = uploadIconImage(device, deviceIcon);
            }
            device.setCreated_at(DateHelper.getCurrentDate());
            device.setUpdated_at(DateHelper.getCurrentDate());
            return repository.save(device);
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            return null;
        }
    }

    public iot_Device uploadIconImage(iot_Device device, MultipartFile deviceIcon) {
        try {
            AWSInfo awsInfo = device.getIcon_aws_info();
            if (awsInfo == null) {
                awsInfo = new AWSInfo();
            } else {
                //Delete the old icon in AWS
                s3Service.delete(awsInfo.getId());
            }

            //upload the new icon image from AWS
            String uniqueImageID = s3Service.getUniqueId(deviceIcon.getOriginalFilename());

            InputStream stream = deviceIcon.getInputStream();

            //upload image to AWS
            PutObjectResult putObjectResult = s3Service.upload(uniqueImageID, stream);
            if (putObjectResult != null) {

                awsInfo.setId(uniqueImageID);
                awsInfo.seteTag(putObjectResult.getETag());
                device.setIcon_aws_info(awsInfo);

            } else {
                logger.error(String.format("Error upload icon image for %s", device.getDeviceName()));
            }
            return device;

        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            return null;
        }
    }

    @Override
    public List<iot_Device> findAllByCustomerId(ObjectId customerId) {
        return repository.findAllByCustomerId(customerId, new Sort(Sort.Direction.DESC, "sort_order"));
    }

    @Override
    public iot_Device find(ObjectId deviceId) {
        return repository.findOne(deviceId);
    }

    @Override
    public iot_Device find(String deviceId) {
        return repository.findOne(new ObjectId(deviceId));
    }

    @Override
    public iot_Device findDeviceByName(ObjectId customerId, String deviceName) {
        return repository.findDeviceByName(customerId, deviceName);
    }

    @Override
    public iot_Device update(iot_Device device, MultipartFile deviceIcon) {
        try {
            if (deviceIcon != null) {
                device = uploadIconImage(device, deviceIcon);
            }
            device.setUpdated_at(DateHelper.getCurrentDate());
            return repository.save(device);
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            return null;
        }
    }

    @Override
    public boolean deviceReOrder(List<ReOrderDTO> reOrderDTOList) {
        try {
            boolean isSwapSuccess = false;

            if (reOrderDTOList != null && reOrderDTOList.size() > 0) {
                for (ReOrderDTO reOrderDTO : reOrderDTOList) {
                    iot_Device device = repository.findOne(new ObjectId(reOrderDTO.getId()));
                    if (device != null) {
                        device.setSort_order(reOrderDTO.getSort_order());
                        repository.save(device);
                    }
                }
                isSwapSuccess = true;
            }
            return isSwapSuccess;
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
        }
        return false;
    }
}
