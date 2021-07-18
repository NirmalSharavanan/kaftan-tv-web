package com.stinsoft.kaftan.service;

import com.stinsoft.kaftan.dto.AWSContentUsageDTO;
import com.stinsoft.kaftan.model.ContentUsageHistory;
import org.bson.types.ObjectId;

import java.util.Date;
import java.util.List;

public interface IContentUsageHistoryService {

    ContentUsageHistory create(ContentUsageHistory history);

    ContentUsageHistory find(String id);

    ContentUsageHistory find(ObjectId id);

    ContentUsageHistory findByAccessUrl(String accessUrl);

    ContentUsageHistory update(ContentUsageHistory history);

    List<AWSContentUsageDTO> findContentUsageHistoryByUsers(Date from_date, Date to_date, Boolean search_bydate);

    List<AWSContentUsageDTO> findContentUsageHistoryByMovie(Date from_date, Date to_date,Boolean search_bydate);

    List<AWSContentUsageDTO> findContentUsageHistoryByDate(Date from_date, Date to_date, Boolean search_bydate);

}
