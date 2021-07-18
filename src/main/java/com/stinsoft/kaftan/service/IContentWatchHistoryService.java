package com.stinsoft.kaftan.service;

import com.stinsoft.kaftan.model.ContentWatchHistory;
import org.bson.types.ObjectId;

import java.util.List;

public interface IContentWatchHistoryService {

    ContentWatchHistory create(ContentWatchHistory history);

    ContentWatchHistory update(ContentWatchHistory history);

    ContentWatchHistory findByUserId(ObjectId userId, ObjectId contentId);

    List<ContentWatchHistory> findAllByUserId(ObjectId userId, boolean inProgress);

}
