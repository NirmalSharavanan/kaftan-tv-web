package com.stinsoft.kaftan.service;

import com.amazonaws.services.s3.model.PutObjectResult;
import com.stinsoft.kaftan.dto.ReOrderDTO;
    import com.stinsoft.kaftan.model.HomeBanner;
import com.stinsoft.kaftan.repository.HomeBannerRepository;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import ss.core.aws.AWSInfo;
import ss.core.aws.S3Service;
import ss.core.helper.CounterHelper;
import ss.core.helper.ImageHelper;
import ss.core.security.service.ISessionService;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by ssu on 17/01/18.
 */
@Service
public class HomeBannerService implements IHomeBannerService {


    @Autowired
    HomeBannerRepository repository;

    private Logger logger = LoggerFactory.getLogger(CategoryService.class);

    @Autowired
    S3Service s3Service;

    @Autowired
    private ISessionService sessionService;

    @Autowired
    private CounterHelper counterHelper;

    @Autowired
    ImageHelper imageHelper;


    @Override
    public HomeBanner create(HomeBanner homeBanner, MultipartFile bannerImage, boolean isCompress) {

        try {
            homeBanner.setCustomer_id(sessionService.getCustomer().getId());
            //get the next sequence number for ordering
            String uniqueName = HomeBanner.class.getName() + "_" + homeBanner.getCustomer_id().toString();
            homeBanner.setSort_order(counterHelper.getNextSequence(uniqueName));


            if(bannerImage != null) {
                String uniqueImageID = s3Service.getUniqueId(bannerImage.getOriginalFilename());

                InputStream stream = bannerImage.getInputStream();
                if (isCompress) {
                    stream = imageHelper.createBannerImage(stream);
                }
                //upload image to AWS
                PutObjectResult putObjectResult = s3Service.upload(uniqueImageID, stream);

                if (putObjectResult != null) {

                    //set the AWS information
                    AWSInfo awsInfo = new AWSInfo();
                    awsInfo.setId(uniqueImageID);
                    awsInfo.seteTag(putObjectResult.getETag());

                    homeBanner.setBanner_aws_info(awsInfo);
                } else {
                    logger.error(String.format("Error upload banner image for %s", homeBanner.getText()));
                }
            }

            return repository.save(homeBanner);
        }
        catch (Exception e) {
            logger.error(e.getMessage(), e);
            return null;
        }

    }

    @Override
    public HomeBanner find(String id) {
        return this.find(new ObjectId(id));
    }

    @Override
    public HomeBanner find(ObjectId id) {
        return repository.findOne(id);
    }

    @Override
    public List<HomeBanner> findByCustomerId(ObjectId customerId) {
        return repository.findByCustomerId(customerId, new Sort(Sort.Direction.DESC, "sort_order"));
    }

    @Override
    public ObjectId delete(final ObjectId id) {

        HomeBanner homeBanner = repository.findOne(id);

        if (homeBanner != null) {
            AWSInfo awsInfo = homeBanner.getBanner_aws_info();
            if (awsInfo != null) {
                //Delete the old banner image in AWS
                s3Service.delete(awsInfo.getId());
            }
            repository.delete(id);
        }

        return id;
    }

    @Override
    public boolean reOrder(List<ReOrderDTO> reOrderDTOList) {

        boolean isSwapSuccess = false;

        if(reOrderDTOList != null && reOrderDTOList.size() > 0) {
            Map<ObjectId, Integer> map = new HashMap<ObjectId, Integer>();

            for (ReOrderDTO reOrderDTO : reOrderDTOList) {
                map.put(new ObjectId(reOrderDTO.getId()), reOrderDTO.getSort_order());
            }

            ObjectId[] bannerIds = map.keySet().toArray(new ObjectId[0]);

            List<HomeBanner> bannerList = new ArrayList<>();
            ObjectId CustomerId = sessionService.getCustomer().getId();
            Sort sort = new Sort(Sort.Direction.DESC, "sort_order");

            //get all records wit sort order range
            bannerList = repository.findMultiple(CustomerId, bannerIds, sort);

            if (bannerList != null && bannerList.size() > 0) {

                //upload the order for all the records
                for (HomeBanner banner : bannerList) {
                    banner.setSort_order(map.get(banner.getId()));
                }

                //update DB
                repository.save(bannerList);
                isSwapSuccess = true;

            }
        }

        return isSwapSuccess;
    }
}
