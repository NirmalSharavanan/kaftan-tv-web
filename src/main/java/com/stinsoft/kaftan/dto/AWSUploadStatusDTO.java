package com.stinsoft.kaftan.dto;

/**
 * Created by ssu on 3/21/2018.
 */
public class AWSUploadStatusDTO {
    String qualityType;
    String key;
    String ETag;

    public String getQualityType() {
        return qualityType;
    }

    public void setQualityType(String qualityType) {
        this.qualityType = qualityType;
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public String getETag() {
        return ETag;
    }

    public void setETag(String ETag) {
        this.ETag = ETag;
    }
}
