import { AWSConfig } from './model/AWSConfig';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { config as AWSConfiguration, S3 } from 'aws-sdk';

@Injectable()
export class AwsUploadService {

  AWSService: any;
  awsInfo: AWSConfig;

  constructor() {
    // this.awsInfo = {
    //   region: 'ap-south-1',
    //   accessKeyId: 'AKIAJ2FZJELWLLM775EA',
    //   secretAccessKey: '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'
    // };
  }

  private preparePutObjectRequest(file: File, key: string): S3.Types.PutObjectRequest {
    return {
      Key: key,
      Bucket: this.awsInfo.bucket,
      Body: file,
      ContentType: file.type
    };
  }

  upload(key: string, file: File, awsConfig: AWSConfig,
    progressCallback: (error: Error, progress: number, speed: number, data: S3.ManagedUpload.SendData) => void, region?: string) {

    this.awsInfo = awsConfig;

    AWSConfiguration.update(awsConfig);

    const s3Upload = new S3.ManagedUpload({
      partSize: 5 * 1024 * 1024,
      queueSize: 4,
      params: this.preparePutObjectRequest(file, key)
    });
    s3Upload.on('httpUploadProgress', this.handleS3UploadProgress(progressCallback));
    s3Upload.send(this.handleS3UploadComplete(progressCallback));

    return s3Upload;
  }

  private handleS3UploadProgress
    (progressCallback: (error: Error, progress: number, speed: number, data: S3.ManagedUpload.SendData) => void) {
    let uploadStartTime = new Date().getTime();
    let uploadedBytes = 0;
    return (progressEvent: S3.ManagedUpload.Progress) => {
      const currentTime = new Date().getTime();
      const timeElapsedInSeconds = (currentTime - uploadStartTime) / 1000;
      if (timeElapsedInSeconds > 0) {
        const speed = (progressEvent.loaded - uploadedBytes) / timeElapsedInSeconds;
        const progress = Math.floor((progressEvent.loaded * 100) / progressEvent.total);
        progressCallback(undefined, progress, speed, null);
        uploadStartTime = currentTime;
        uploadedBytes = progressEvent.loaded;
      }
    };
  }

  private handleS3UploadComplete(
    progressCallback: (error: Error, progress: number, speed: number, data: S3.ManagedUpload.SendData) => void) {
    return (error: Error, data: S3.ManagedUpload.SendData) => {
      if (error) {
        progressCallback(error, undefined, undefined, null);
      } else {
        progressCallback(error, 100, undefined, data);
      }
    };
  }

  cancel(s3Upload: S3.ManagedUpload) {
    s3Upload.abort();
  }
}
