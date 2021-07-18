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
  selector: 'ss-stripe',
  templateUrl: './stripe.component.html',
  styleUrls: ['./stripe.component.scss']
})
export class StripeComponent implements OnInit, AfterViewInit, OnChanges {

  @ViewChild('stripe') paymentForm: ElementRef;
  @Input() amount: number;
  @Input() label: string;
  @Input() contentId: string;

  @Output()
  paymentStatus: EventEmitter<boolean> = new EventEmitter<boolean>();

  payUserInfo: PayUserInfo;

  stripePay: any;

  constructor(private paymentService: PaymentService, private confirmMessageService: ConfirmMessageService) { }

  ngOnInit() {
    this.label = "Buy ₹" + this.amount;
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
      this.getUserInfo();
    }
  }

  private handleCleanup() {
    this.removeByClass('payment-gateway-script');
    // this.removeByClass('razorpay-container');
    // this.removeByClass('razorpay-payment-button');

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
    node.src = 'https://checkout.stripe.com/checkout.js';
    return node;
  }

  initializeStripePay() {

    if (this.payUserInfo) {
      const options = {
        key: this.payUserInfo.key_id,
        amount: this.payUserInfo.amount,
        name: this.payUserInfo.customer_name,
        description: "Purchase Description",
        image: this.payUserInfo.logo_url,
        theme: {
          "color": "#F37254"
        },
        token: response => {
          // You can access the token ID with `token.id`.
          // Get the token ID to your server-side code for use.
          this.processPaymentResponse(response);
        }
      }

      this.stripePay = (<any>window).StripeCheckout.configure(options);
    }

  }

  getUserInfo() {
    this.paymentService.getUserInfoForStripe(this.contentId)
      .subscribe((response: PayUserInfo) => {
        if (response) {
          this.payUserInfo = response;
        }

      });
  }

  processPay() {
    this.initializeStripePay();
    this.stripePay.open({});
  }

  processPaymentResponse(response: any) {

    const payTransaction = new PayTransaction();

    payTransaction.razorpay_payment_id = response.id;
    payTransaction.product_reference_id = this.contentId;
    payTransaction.amount = this.payUserInfo.amount;

    this.paymentService.processPayment_ByStripe(payTransaction)
      .subscribe((res: ResponseBase) => {
        if (res && res.success) {
          // console.log("payment successful");
          this.confirmMessageService.addMessage(new ConfrimMessage('payment successful'));
          this.paymentStatus.emit(true);
        } else {
          this.confirmMessageService.addMessage(new ConfrimMessage('payment failed', null, 'error'));
        }

      });


  }

}
