import { SsCoreModule } from './../../ss-core/ss-core.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FileUploadModule, DataListModule, OrderListModule, PanelModule, DropdownModule, EditorModule } from 'primeng/primeng';
import { ReactiveFormsModule } from '@angular/forms';
import { LogoComponent } from './logo/logo.component';
import { SocialMedialinkComponent } from './social-medialink/social-medialink.component';
import { CustomerService } from './../../services/customer.service';
import { EmailComponent } from './email/email.component';
import { AwsComponent } from './aws/aws.component';
import { PaymentComponent } from './payment/payment.component';
import { SocialSignupComponent } from './social-signup/social-signup.component';
import { AddEditStaticPageComponent } from './add-edit-static-page/add-edit-static-page.component';
import { StaticPagesComponent } from './static-pages/static-pages.component';
import { StaticPagesService } from './../../services/static-pages.service';
import { VideoCallingComponent } from './video-calling/video-calling.component';
import { FirebaseComponent } from './firebase/firebase.component';
import { CloudMessagingComponent } from './cloud-messaging/cloud-messaging.component';

@NgModule({
  imports: [
    CommonModule,
    FileUploadModule,
    DataListModule,
    OrderListModule,
    PanelModule,
    DropdownModule,
    EditorModule,
    ReactiveFormsModule,
    SsCoreModule,
    RouterModule.forChild([
      {
        path: 'add-logo',
        component: LogoComponent
      },
      {
        path: 'add-social-medialinks',
        component: SocialMedialinkComponent
      },
      {
        path: 'email',
        component: EmailComponent
      },
      {
        path: 'aws',
        component: AwsComponent
      },
      {
        path: 'payment-gateway',
        component: PaymentComponent
      },
      {
        path: 'social-signup',
        component: SocialSignupComponent
      },
      {
        path: 'add-static-page',
        component: AddEditStaticPageComponent
      },
      {
        path: 'edit-static-page/:pageId',
        component: AddEditStaticPageComponent
      },
      {
        path: 'static-pages',
        component: StaticPagesComponent
      },
      {
        path: 'firebase-sdk',
        component: FirebaseComponent
      },
      {
        path: 'video-calling',
        component: VideoCallingComponent
      },
      {
        path: 'cloud-messaging',
        component: CloudMessagingComponent
      },
    ])
  ],
  declarations: [LogoComponent, SocialMedialinkComponent, EmailComponent, AwsComponent, PaymentComponent, SocialSignupComponent, AddEditStaticPageComponent, StaticPagesComponent, VideoCallingComponent,CloudMessagingComponent, FirebaseComponent],
  providers: [CustomerService, StaticPagesService]
})
export class SettingsModule { }
