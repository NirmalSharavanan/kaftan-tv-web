package com.stinsoft.kaftan.dto;

public class ContentWatchHistoryDTO {

    private String   content_id;
    private boolean  inProgress;
    private String   currentTime;
    private String   totalTime;

    public String getContent_id() {
        return content_id;
    }

    public void setContent_id(String content_id) {
        this.content_id = content_id;
    }

    public boolean isInProgress() {
        return inProgress;
    }

    public void setInProgress(boolean inProgress) {
        this.inProgress = inProgress;
    }

    public String getCurrentTime() { return currentTime; }

    public void setCurrentTime(String currentTime) { this.currentTime = currentTime; }

    public String getTotalTime() { return totalTime; }

    public void setTotalTime(String totalTime) { this.totalTime = totalTime; }
}
