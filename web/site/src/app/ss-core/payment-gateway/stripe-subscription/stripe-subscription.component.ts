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
    selector: 'ss-stripe-subscription',
    templateUrl: './stripe-subscription.component.html',
    styleUrls: ['./stripe-subscription.component.scss']
})

export class StripeSubscriptionComponent implements OnInit, AfterViewInit, OnChanges {

    @ViewChild('stripe') paymentForm: ElementRef;
    @Input() label: string;

    @Output()
    paymentStatus: EventEmitter<boolean> = new EventEmitter<boolean>();

    payUserInfo: PayUserInfo;

    stripePay: any;

    constructor(private paymentService: PaymentService,
        private userService: UserService,
        private confirmMessageService: ConfirmMessageService) { }

    ngOnInit() {
        this.label = "Start Premium Membership";

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

    initializeRazorPay() {

        if (this.payUserInfo) {

            let options: any;

            options = {
                key: this.payUserInfo.key_id,
                amount: this.payUserInfo.amount,
                name: this.payUserInfo.customer_name,
                description: "Purchase Description",
                image: this.payUserInfo.logo_url,
                // prefill: {
                //     name: this.payUserInfo.user_name,
                //     email: this.payUserInfo.user_email
                // },
                // notes: {
                //   "address": "Hello World"
                // },
                // theme: {
                //     "color": "#F37254"
                // },
                token: response => {
                    this.processSubscriptionResponse(response);
                }
            }

            this.stripePay = (<any>window).StripeCheckout.configure(options);
        }

    }

    getUserInfo() {

        this.paymentService.getUserInfoForSubscriptionForStripe()
            .subscribe((response: PayUserInfo) => {
                if (response) {
                    // console.log(response);
                    this.payUserInfo = response;
                }

            });

    }


    processPay() {
        this.initializeRazorPay();
        this.stripePay.open();
    }

    processSubscriptionResponse(response: any) {

        // console.log(response);

        if (response) {
            const paySubcription = new PaySubcription();

            paySubcription.razorpay_payment_id = response.razorpay_payment_id;
            paySubcription.razorpay_subscription_id = response.razorpay_subscription_id;
            paySubcription.razorpay_signature = response.razorpay_signature;

            this.paymentService.processSubscription_ByStripe(paySubcription)
                .subscribe((res: ResponseBase) => {
                    if (res && res.success) {
                        this.userService.reloadUserInfo();
                        // console.log("subscription successful");
                        this.paymentStatus.emit(true);
                        this.confirmMessageService.addMessage(new ConfrimMessage('subscription successful', '/session/home'));
                    } else {
                        this.paymentStatus.emit(false);
                        this.confirmMessageService.addMessage(new ConfrimMessage('subscription failed', '/session/home', 'error'));
                    }

                });
        }
    }

}