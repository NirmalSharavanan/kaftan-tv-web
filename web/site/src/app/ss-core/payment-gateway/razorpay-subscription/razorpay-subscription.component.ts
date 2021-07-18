import { ConfirmMessageService } from './../../service/confirm-message.service';
import { ConfrimMessage } from './../../model/confirm-message';
import { Subscription } from 'rxjs/Subscription';
import { PaySubcription } from './../../../models/PaySubscription';
import { ResponseBase } from 'app/models/responseBase';
import { PayTransaction } from './../../../models/PayTransaction';
import { PaymentService } from './../../../services/payment.service';
import { PayUserInfo } from './../../../models/payUserInfo';
import { UserService } from './../../../services/user.service';

import {
  Component, OnInit, AfterViewChecked, AfterViewInit,
  ViewChild, ElementRef, OnChanges, Input, Output, EventEmitter
} from '@angular/core';

@Component({
  selector: 'ss-razorpay-subscription',
  templateUrl: './razorpay-subscription.component.html',
  styleUrls: ['./razorpay-subscription.component.scss']
})
export class RazorpaySubscriptionComponent implements OnInit, AfterViewInit, OnChanges {

  @ViewChild('razorpay') paymentForm: ElementRef;
  @Input() label: string;

  @Output()
  paymentStatus: EventEmitter<boolean> = new EventEmitter<boolean>();

  payUserInfo: PayUserInfo;

  razorPay: any;

  constructor(private paymentService: PaymentService,
    private userService: UserService,
    private confirmMessageService: ConfirmMessageService) { }

  ngOnInit() {
    this.label = 'Start Premium Membership';

  }

  ngAfterViewInit() {
    this.handlePayment();
  }

  ngOnChanges() {
    this.handlePayment();
  }

  private handlePayment() {
    if (this.paymentForm) {
      if (this.paymentForm.nativeElement.getElementsByTagName('script').length > 0) {
        this.handleCleanup();
      }
      this.paymentForm.nativeElement.appendChild(this.createNode());
      this.getUserInfo();
    }
  }

  private handleCleanup() {
    this.removeByClass('payment-gateway-script');
    this.removeByClass('razorpay-container');
    this.removeByClass('razorpay-payment-button');

  }

  private removeByClass(className: string) {
    const containers = document.getElementsByClassName(className);
    for (let i = 0; i < containers.length; i++) {
      containers.item(i).remove();
    }
  }

  private createNode() {
    const node = document.createElement('script');
    node.type = 'text/javascript';
    node.async = false;
    node.charset = 'utf-8';
    node.classList.add('payment-gateway-script');
    node.src = 'https://checkout.razorpay.com/v1/checkout.js';
    return node;
  }

  initializeRazorPay() {

    if (this.payUserInfo) {

      let options: any;

      options = {
        key: this.payUserInfo.key_id,
        subscription_id: this.payUserInfo.razorpay_subscription_id,
        name: this.payUserInfo.customer_name,
        description: 'Monthly Subscription',
        image: this.payUserInfo.logo_url,
        prefill: {
          name: this.payUserInfo.user_name,
          email: this.payUserInfo.user_email
        },
        // notes: {
        //   "address": "Hello World"
        // },
        theme: {
          'color': '#fd6901'
        },
        handler: response => {
          this.processSubscriptionResponse(response);
        }
      }

      this.razorPay = (<any>window).Razorpay(options);
    }

  }

  getUserInfo() {

    this.paymentService.getUserInfoForSubscription()
      .subscribe((response: PayUserInfo) => {
        if (response) {
          this.payUserInfo = response;
        }

      });

  }


  processPay() {
    this.initializeRazorPay();
    this.razorPay.open();
  }

  processSubscriptionResponse(response: any) {

    // console.log(response);

    if (response) {
      const paySubcription = new PaySubcription();

      paySubcription.razorpay_payment_id = response.razorpay_payment_id;
      paySubcription.razorpay_subscription_id = response.razorpay_subscription_id;
      paySubcription.razorpay_signature = response.razorpay_signature;

      this.paymentService.processSubscription(paySubcription)
        .subscribe((res: ResponseBase) => {
          if (res && res.success) {
            this.userService.reloadUserInfo();
            // console.log("subscription successful");
            this.paymentStatus.emit(true);
            this.confirmMessageService.addMessage(new ConfrimMessage('Your payment was successfully processed. Your premium membership is now active. You can watch videos until the subscription period ends!', '/session/home'));
          } else {
            this.paymentStatus.emit(false);
            this.confirmMessageService.addMessage(new ConfrimMessage('Subscription failed', '/session/home', 'error'));
          }

        });
    }
  }

}
