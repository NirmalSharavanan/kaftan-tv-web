import { RedirectComponent } from './redirect/redirect.component';
import { PaymentService } from './../services/payment.service';
import { RazorpayComponent } from './payment-gateway/razorpay/razorpay.component';
import { SearchService } from './search.service';
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorComponent } from './error/error.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { FileUploadModule, GrowlModule, DialogModule } from 'primeng/primeng';
import { SearchInputComponent } from './search-input/search-input.component';
import { RazorpaySubscriptionComponent } from './payment-gateway/razorpay-subscription/razorpay-subscription.component';
import { DialogComponent } from './dialog/dialog.component';
import { ConfirmMessageService } from './service/confirm-message.service';
import { StripeComponent } from './payment-gateway/stripe/stripe.component';
import { StripeSubscriptionComponent } from './payment-gateway/stripe-subscription/stripe-subscription.component';
import { VideoPlayerComponent } from './video-player/video-player.component';

@NgModule({
  imports: [
    CommonModule,
    FileUploadModule,
    GrowlModule,
    ReactiveFormsModule,
    DialogModule
  ],
  exports: [
    FileUploadComponent,
    CommonModule,
    FileUploadModule,
    GrowlModule,
    ReactiveFormsModule,
    DialogModule,
    ErrorComponent,
    SearchInputComponent,
    RazorpayComponent,
    StripeComponent,
    StripeSubscriptionComponent,
    RazorpaySubscriptionComponent,
    DialogComponent,
    VideoPlayerComponent,
    RedirectComponent
  ],
  declarations: [
    ErrorComponent,
    FileUploadComponent,
    SearchInputComponent,
    RazorpayComponent,
    RazorpaySubscriptionComponent,
    DialogComponent,
    StripeComponent,
    StripeSubscriptionComponent,
    VideoPlayerComponent,
    RedirectComponent
  ],
  providers: [
    SearchService,
    PaymentService,
    ConfirmMessageService
  ]
})
export class SsCoreModule { }
