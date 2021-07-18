package com.stinsoft.kaftan.service;

import com.stinsoft.kaftan.dto.AWSContentUsageDTO;
import com.stinsoft.kaftan.model.ContentUsageHistory;
import com.stinsoft.kaftan.repository.ContentUsageHistoryRepository;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.stereotype.Service;
import ss.core.helper.DateHelper;

import java.util.Date;
import java.util.List;

import static org.springframework.data.mongodb.core.aggregation.Aggregation.*;
import static org.springframework.data.mongodb.core.query.Criteria.where;

@Service
public class ContentUsageHistoryService implements IContentUsageHistoryService{

    @Autowired
    ContentUsageHistoryRepository repository;

    @Autowired
    MongoOperations operations;

    @Override
    public ContentUsageHistory create(ContentUsageHistory history) {
        history.setCreated_at(DateHelper.getCurrentDate());
        history.setUpdated_at(DateHelper.getCurrentDate());
        return repository.save(history);
    }

    @Override
    public ContentUsageHistory find(String id) {
        return repository.findOne(new ObjectId(id));
    }

    @Override
    public ContentUsageHistory find(ObjectId id) {
        return repository.findOne(id);
    }

    @Override
    public ContentUsageHistory findByAccessUrl(String accessUrl) {
        return repository.findByAccessUrl(accessUrl);
    }

    @Override
    public ContentUsageHistory update(ContentUsageHistory history) {
        history.setUpdated_at(DateHelper.getCurrentDate());
        return repository.save(history);
    }

    @Override
    public List<AWSContentUsageDTO> findContentUsageHistoryByUsers(Date from_date, Date to_date, Boolean search_bydate) {

        if (search_bydate) {
            AggregationResults<AWSContentUsageDTO> results = operations.aggregate(
                    newAggregation(ContentUsageHistory.class,

                            match(where("updated_at").gte(from_date)),
                            match(where("updated_at").lte(to_date)),
                            group("user_id")
                                    .sum("bytesDownloaded").as("totalBytesDownloaded")
                                    .sum("bytesUploaded").as("totalBytesUploaded"),
                            project("totalBytesDownloaded", "totalBytesUploaded").and("user_id").previousOperation(),
                            lookup("user", "user_id", "_id", "userInfo"),
                            unwind("userInfo"),
                            sort(Sort.Direction.DESC, "totalBytesDownloaded")

                    ), AWSContentUsageDTO.class);
            return results.getMappedResults();

        } else {
            AggregationResults<AWSContentUsageDTO> results = operations.aggregate(
                    newAggregation(ContentUsageHistory.class,
                            group("user_id")
                                    .sum("bytesDownloaded").as("totalBytesDownloaded")
                                    .sum("bytesUploaded").as("totalBytesUploaded"),
                            project("totalBytesDownloaded", "totalBytesUploaded").and("user_id").previousOperation(),
                            lookup("user", "user_id", "_id", "userInfo"),
                            unwind("userInfo"),
                            sort(Sort.Direction.DESC, "totalBytesDownloaded")

                    ), AWSContentUsageDTO.class);
            return results.getMappedResults();
        }
    }

    @Override
    public List<AWSContentUsageDTO> findContentUsageHistoryByMovie(Date from_date, Date to_date,Boolean search_bydate) {
        if (search_bydate) {
            AggregationResults<AWSContentUsageDTO> results = operations.aggregate(
                    newAggregation(ContentUsageHistory.class,
                            match(where("updated_at").gte(from_date)),
                            match(where("updated_at").lte(to_date)),
//                            group("contentTitle")
//                                    .sum("bytesDownloaded").as("totalBytesDownloaded")
//                                    .sum("bytesUploaded").as("totalBytesUploaded"),
//                            project("totalBytesDownloaded", "totalBytesUploaded").and("contentTitle").previousOperation(),

                            lookup("content", "content_id", "_id", "content"),
                            unwind("content"),
                            project("contentTitle", "content_id", "bytesDownloaded", "bytesUploaded", "content"),
                            group("contentTitle")
                                    .sum("bytesDownloaded").as("totalBytesDownloaded")
                                    .sum("bytesUploaded").as("totalBytesUploaded")
                                    .min("content").as("content"),

                            project("totalBytesDownloaded", "totalBytesUploaded", "content").and("contentTitle").previousOperation(),

                            sort(Sort.Direction.DESC, "totalBytesDownloaded")

                    ), AWSContentUsageDTO.class);

            return results.getMappedResults();
        } else {
            AggregationResults<AWSContentUsageDTO> results = operations.aggregate(
                    newAggregation(ContentUsageHistory.class,
                            lookup("content", "content_id", "_id", "content"),
                            unwind("content"),
                            project("contentTitle", "content_id", "bytesDownloaded", "bytesUploaded", "content"),
                            group("contentTitle")
                                    .sum("bytesDownloaded").as("totalBytesDownloaded")
                                    .sum("bytesUploaded").as("totalBytesUploaded")
                                    .min("content").as("content"),

                            project("totalBytesDownloaded", "totalBytesUploaded", "content").and("contentTitle").previousOperation(),

                            sort(Sort.Direction.DESC, "totalBytesDownloaded")

                    ), AWSContentUsageDTO.class);

            return results.getMappedResults();
        }

    }

    @Override
    public List<AWSContentUsageDTO> findContentUsageHistoryByDate(Date from_date, Date to_date, Boolean search_bydate) {
        if (search_bydate) {
            AggregationResults<AWSContentUsageDTO> results = operations.aggregate(
                    newAggregation(ContentUsageHistory.class,
                            match(where("updated_at").gte(from_date)),
                            match(where("updated_at").lte(to_date)),
                            project().and("bytesDownloaded").as("bytesDownloaded")
                                    .and("bytesUploaded").as("bytesUploaded")
                                    .andExpression("dateToString('%Y-%m-%d',updated_at)").as("accessedDate"), // convert datetime to date

                            group("accessedDate")
                                    .sum("bytesDownloaded").as("totalBytesDownloaded")
                                    .sum("bytesUploaded").as("totalBytesUploaded"),
                            project("totalBytesDownloaded", "totalBytesUploaded").and("accessedDate").previousOperation(),
                            sort(Sort.Direction.ASC, "accessedDate")

                    ), AWSContentUsageDTO.class);

            return results.getMappedResults();
        } else {
            AggregationResults<AWSContentUsageDTO> results = operations.aggregate(
                    newAggregation(ContentUsageHistory.class,
                            project().and("bytesDownloaded").as("bytesDownloaded")
                                    .and("bytesUploaded").as("bytesUploaded")
                                    .andExpression("dateToString('%Y-%m-%d',updated_at)").as("accessedDate"),

                            group("accessedDate")
                                    .sum("bytesDownloaded").as("totalBytesDownloaded")
                                    .sum("bytesUploaded").as("totalBytesUploaded"),
                            project("totalBytesDownloaded", "totalBytesUploaded").and("accessedDate").previousOperation(),
                            sort(Sort.Direction.DESC, "accessedDate")

                    ), AWSContentUsageDTO.class);

            return results.getMappedResults();
        }

    }
}
