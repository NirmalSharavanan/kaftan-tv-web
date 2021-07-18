package com.stinsoft.kaftan.service;

import com.stinsoft.kaftan.model.ContentWatchHistory;
import com.stinsoft.kaftan.repository.ContentWatchHistoryRepository;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import ss.core.helper.DateHelper;

import java.util.List;

@Service
public class ContentWatchHistoryService implements IContentWatchHistoryService {

    @Autowired
    ContentWatchHistoryRepository repository;

    @Override
    public ContentWatchHistory create(ContentWatchHistory history) {
        history.setCreated_at(DateHelper.getCurrentDate());
        history.setUpdated_at(DateHelper.getCurrentDate());
        return repository.save(history);
    }

    @Override
    public ContentWatchHistory update(ContentWatchHistory history) {
        history.setUpdated_at(DateHelper.getCurrentDate());
        return repository.save(history);
    }

    @Override
    public ContentWatchHistory findByUserId(ObjectId userId, ObjectId contentId) {
        return repository.findByUserId(userId, contentId);
    }

    @Override
    public List<ContentWatchHistory> findAllByUserId(ObjectId userId, boolean inProgress) {
        return repository.findAllByUserId(userId, inProgress, new PageRequest(0, 10, Sort.Direction.DESC, "id"));
    }

}
