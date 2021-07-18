package com.stinsoft.kaftan.service;
import com.stinsoft.kaftan.dto.ReOrderDTO;
import com.stinsoft.kaftan.model.HomeBanner;
import org.bson.types.ObjectId;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * Created by ssu on 17/01/18.
 */
public interface IHomeBannerService {

    HomeBanner create(HomeBanner homeBanner, MultipartFile bannerImage, boolean isCompress);
    HomeBanner find(String id);
    HomeBanner find(ObjectId id);
    List<HomeBanner> findByCustomerId(ObjectId customer_id);
    ObjectId delete(ObjectId id);
    boolean reOrder(List<ReOrderDTO> reOrderDTOList);
}
