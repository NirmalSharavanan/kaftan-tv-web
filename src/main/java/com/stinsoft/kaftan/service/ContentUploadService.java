package com.stinsoft.kaftan.service;

import com.stinsoft.kaftan.model.Content;
import com.stinsoft.kaftan.repository.ContentRepository;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import ss.core.aws.IS3UploadCallBack;

/**
 * Created by ssu on 20/02/18.
 */
public class ContentUploadService implements IS3UploadCallBack {

    public enum VIDEO_TYPE {
        WEB,
        TRAILER
    }

    ContentRepository contentRepository;

    private Logger logger = LoggerFactory.getLogger(ContentUploadService.class);

    private String reference_id = null;
    private VIDEO_TYPE reference_type = null;
    private String content_type = null;


    public ContentUploadService(String reference_id, VIDEO_TYPE reference_type, String content_type, ContentRepository contentRepository) {
        this.reference_id = reference_id;
        this.reference_type = reference_type;
        this.content_type = content_type;
        this.contentRepository = contentRepository;
    }


    @Override
    public void uploadStatus(String status, String key) {


        final Content content = contentRepository.findOne(new ObjectId(reference_id) );
        if (content != null) {

            if(status == "success") {
                logger.info("content upload successfully ");
            }
            else {
                logger.info("content upload error ");
            }

            content.setOriginal_file_id(key);
            content.setUploadInProgress(false);
            //Transcoding triggered from AWS directly
            content.setTranscodeInProgress(true);
            contentRepository.save(content);
        }
    }
}
