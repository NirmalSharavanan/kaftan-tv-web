import { ConfirmMessageService } from './../../service/confirm-message.service';
import { ResponseBase } from 'app/models/responseBase';
import { PayTransaction } from './../../../models/PayTransaction';
import { PaymentService } from './../../../services/payment.service';
import { PayUserInfo } from './../../../models/payUserInfo';
import {
  Component, OnInit, AfterViewChecked, AfterViewInit,
  ViewChild, ElementRef, OnChanges, Input, Output, EventEmitter
} from '@angular/core';
import { ConfrimMessage } from '../../model/confirm-message';

@Component({
  selector: 'ss-razorpay',
  templateUrl: './razorpay.component.html',
  styleUrls: ['./razorpay.component.scss']
})
export class RazorpayComponent implements OnInit, AfterViewInit, OnChanges {

  @ViewChild('razorpay') paymentForm: ElementRef;
  @Input() amount: number;
  @Input() label: string;
  @Input() contentId: string;

  @Output()
  paymentStatus: EventEmitter<boolean> = new EventEmitter<boolean>();

  payUserInfo: PayUserInfo;

  razorPay: any;

  constructor(private paymentService: PaymentService, private confirmMessageService: ConfirmMessageService) { }

  ngOnInit() {

    this.label = 'Buy $' + this.amount;
    this.amount = this.amount * 100;
  }

  ngAfterViewInit() {
    this.handlePayment();
  }

  ngOnChanges() {
    this.handlePayment();
  }

  private handlePayment() {
    if (this.paymentForm && this.amount) {
      if (this.paymentForm.nativeElement.getElementsByTagName('script').length > 0) {
        this.handleCleanup();
      }
      this.paymentForm.nativeElement.appendChild(this.createNode());
      // this.getUserInfo();
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
      const options = {
        key: this.payUserInfo.key_id,
        amount: this.payUserInfo.amount, // 2000 paise = INR 20
        name: this.payUserInfo.customer_name,
        description: '',
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
          this.processPaymentResponse(response);
        }
      }

      this.razorPay = (<any>window).Razorpay(options);
    }

  }

  getUserInfo() {
    this.paymentService.getUserInfo(this.contentId)
      .subscribe((response: PayUserInfo) => {
        if (response) {
          this.payUserInfo = response;
        }

      });
  }


  processPay() {
    this.confirmMessageService.addMessage(new ConfrimMessage('Need to do payment!'));

    //  this.initializeRazorPay();
    //  console.log('open razor pay');
    //  console.log(this.razorPay)
    //   this.razorPay.open();
  }

  processPaymentResponse(response: any) {

    const payTransaction = new PayTransaction();

    payTransaction.razorpay_payment_id = response.razorpay_payment_id;
    payTransaction.product_reference_id = this.contentId;
    payTransaction.amount = this.payUserInfo.amount;

    this.paymentService.processPayment(payTransaction)
      .subscribe((res: ResponseBase) => {
        if (res && res.success) {
          // console.log('payment successful');
          this.confirmMessageService.addMessage(new ConfrimMessage('Your payment was successfully processed. You can watch the exclusive video at anytime!'));
          this.paymentStatus.emit(true);
        } else {
          this.confirmMessageService.addMessage(new ConfrimMessage('Payment failed', null, 'error'));
        }

      });


  }

}
