import { AWSConfig } from './../model/AWSConfig';
import { FileObjectStatus } from './../model/FileObjectStatus';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AwsUploadService } from '../aws-upload.service';
import { S3 } from 'aws-sdk';

@Component({
  selector: 'app-aws-content-upload',
  templateUrl: './aws-content-upload.component.html',
  styleUrls: ['./aws-content-upload.component.scss']
})
export class AwsContentUploadComponent implements OnInit {

  @Input() fileObject: File;
  @Input() awsConfig: AWSConfig;
  @Input() key: string;

  @Output()
  uploadComplete: EventEmitter<any> = new EventEmitter<any>();

  FileObjectStatus = FileObjectStatus;
  fileObjectStatus: FileObjectStatus;
  progress = 0;
  speed = 0;
  uploadError: string;
  uploadHandle: any;

  constructor(private uploadService: AwsUploadService) { }

  ngOnInit() {
    this.upload();
  }

  upload() {
    // console.log('uploading', this.fileObject.name);
    this.fileObjectStatus = FileObjectStatus.Uploading;
    this.uploadError = undefined;
    this.progress = 0;
    this.key = this.key + '.' + this.fileObject.type.split('/')[1];
    this.uploadHandle = this.uploadService.upload(this.key, this.fileObject, this.awsConfig, this.handleS3UploadProgress());
  }

  private handleS3UploadProgress() {
    const awsObj: any = this;
    return (error: Error, progress: number, speed: number, data: S3.ManagedUpload.SendData) => {
      if (error) {
        awsObj.progress = 0;
        awsObj.speed = 0;
        awsObj.uploadError = error.message;
        awsObj.fileObjectStatus = FileObjectStatus.Failed;
      } else {
        awsObj.progress = progress || awsObj.progress;
        awsObj.speed = speed || awsObj.speed;
        // console.log(awsObj.progress);
        // console.log(awsObj.speed);
        if (awsObj.progress === 100) {
          awsObj.fileObjectStatus = FileObjectStatus.Uploaded;

          if (data != null) {
            awsObj.uploadComplete.emit(data);
            // console.log(data);
          }
        }
      }
    };
  }

  cancel() {
    if (this.fileObjectStatus === FileObjectStatus.Uploading) {
      // console.log('cancelling', this.fileObject.name);
      this.fileObjectStatus = FileObjectStatus.Canceled;
      this.uploadService.cancel(this.uploadHandle);
    }
  }
}
