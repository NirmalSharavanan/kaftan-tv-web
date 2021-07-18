

import { AwsUploadService } from './aws-upload.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AwsContentUploadComponent } from './aws-content-upload/aws-content-upload.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    AwsContentUploadComponent
  ],
  exports: [
    AwsContentUploadComponent
  ],
  providers: [
    AwsUploadService
  ]
})
export class AwsModule { }
