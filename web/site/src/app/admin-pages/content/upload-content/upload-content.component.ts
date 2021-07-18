import { QualityType } from './../../../aws/model/QualityType';
import { ContentService } from './../../../services/content.service';
import { CustomerService } from './../../../services/customer.service';
import { Customer } from './../../../models/customer';
import { AWSConfig } from './../../../aws/model/AWSConfig';
import { ResponseBase } from './../../../models/responseBase';
import { AWSUploadStatus } from './../../../models/awsUploadStatus';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DatePipe } from '@angular/common'

@Component({
  selector: 'ss-upload-content',
  templateUrl: './upload-content.component.html',
  styleUrls: ['./upload-content.component.scss']
})
export class UploadContentComponent implements OnInit {

  @Input() contentId: string;
  @Input() qualityType: string;
  @Input() video: File;

  awsConfig: AWSConfig;
  awsOriginalKey: string;
  startUpload: boolean;

  @Output() uploadComplete: EventEmitter<String> = new EventEmitter();

  constructor(private service: ContentService,
    private customerService: CustomerService, private datepipe: DatePipe) { }

  ngOnInit() {
    this.uploadVideo();
  }

  uploadVideo() {

    this.customerService.getCustomerForAdmin()
      .subscribe((customer: Customer) => {
        if (customer) {
          this.awsConfig = new AWSConfig();
          this.awsConfig.region = customer.aws_region;
          this.awsConfig.accessKeyId = customer.aws_access_key;
          this.awsConfig.secretAccessKey = customer.aws_secret_access_key;
          this.awsConfig.bucket = customer.aws_bucket;

          if (this.qualityType === QualityType.ORIGINAL) {
            this.awsOriginalKey = 'input/';
          } else {
            this.awsOriginalKey = 'output/'
          }

          const currentDateTime = this.datepipe.transform(new Date(), 'ddMMyyyyhhmmss');
          this.awsOriginalKey += currentDateTime + '_' + this.contentId + '_' + this.qualityType;

          this.startUpload = true;
        }
      });
  }

  uploadVideoCompleted($event) {

    if ($event != null) {
      const awsUploadStatus = new AWSUploadStatus();
      awsUploadStatus.key = $event.Key;
      awsUploadStatus.ETag = $event.ETag;
      awsUploadStatus.qualityType = this.qualityType;

      awsUploadStatus.key = awsUploadStatus.key.replace('"', '');
      awsUploadStatus.ETag = awsUploadStatus.ETag.replace('"', '').replace('"', '');

      this.service.updateS3UploadStatus(this.contentId, awsUploadStatus)
        .subscribe((response: ResponseBase) => {
          if (response) {
            // console.log(response);

            if (this.qualityType === QualityType.ORIGINAL) {
              this.uploadComplete.emit(QualityType.ORIGINAL);
            } else if (this.qualityType === QualityType.P_360) {
              this.uploadComplete.emit(QualityType.P_360);
            } else if (this.qualityType === QualityType.P_480) {
              this.uploadComplete.emit(QualityType.P_480);
            } else if (this.qualityType === QualityType.P_720) {
              this.uploadComplete.emit(QualityType.P_720);
            } else if (this.qualityType === QualityType.P_1080) {
              this.uploadComplete.emit(QualityType.P_1080);
            }
          }
        });

      // console.log(awsUploadStatus);
    }

  }
}
