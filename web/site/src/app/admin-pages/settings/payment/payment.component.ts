import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormGroupUtils } from './../../../common/utils/form-group-utils';
import { MessageService } from 'primeng/components/common/messageservice';
import { CustomerService } from './../../../services/customer.service';
import { PaymentGateWay } from './../../../models/PaymentGateWay';

@Component({
  selector: 'ss-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {

  fg: FormGroup;
  customer: any;
  paymentgateway: string;

  constructor(fb: FormBuilder,
    private messageService: MessageService, private service: CustomerService) {

    this.fg = fb.group({
      //Razorpay & Stripe
      payment_gateway: fb.control('', []),
      // key_id: fb.control('', []),
      // key_secret: fb.control('', []),
      // premium_plan_id: fb.control('', []),
      //EBS
      accountId: fb.control('', []),
      secureKey: fb.control('', []),
      mode: fb.control('', []),  // Payment mode is TEST / LIVE
    });
  }

  ngOnInit() {
    this.init();
  }

  private init() {
    this.service.getCustomerForAdmin()
      .subscribe((customer: any) => {
        if (customer) {
          this.customer = customer;
          if (customer.paymentGateWay) {
            // if (customer.paymentGateWay.razorPayConfig) {
            //   FormGroupUtils.applyValue(this.fg, customer.paymentGateWay.razorPayConfig);
            //   this.paymentgateway = customer.paymentGateWay.razorPayConfig.payment_gateway;
            // }
            // if (customer.paymentGateWay.stripeConfig) {
            //   FormGroupUtils.applyValue(this.fg, customer.paymentGateWay.stripeConfig);
            //   this.paymentgateway = customer.paymentGateWay.stripeConfig.payment_gateway;
            // }
            if (customer.paymentGateWay.ebsConfig) {
              FormGroupUtils.applyValue(this.fg, customer.paymentGateWay.ebsConfig);
              this.paymentgateway = customer.paymentGateWay.ebsConfig.payment_gateway;
            }
          }
          else {
            this.fg.get('payment_gateway').setValue("3");
            this.fg.get('mode').setValue("TEST");
          }
        }
      });
  }

  onChange(paymentGateWay) {
    if (this.customer.paymentGateWay) {
      // if (paymentGateWay === '1') {
      //   this.paymentgateway = paymentGateWay;
      //   if (this.customer.paymentGateWay.razorPayConfig) {
      //     FormGroupUtils.applyValue(this.fg, this.customer.paymentGateWay.razorPayConfig);
      //   }
      //   else {
      //     this.fg.reset();
      //     this.fg.get('payment_gateway').setValue("1");
      //   }
      // }
      // if (paymentGateWay === '2') {
      //   this.paymentgateway = paymentGateWay;
      //   if (this.customer.paymentGateWay.stripeConfig) {
      //     FormGroupUtils.applyValue(this.fg, this.customer.paymentGateWay.stripeConfig);
      //   }
      //   else {
      //     this.fg.reset();
      //     this.fg.get('payment_gateway').setValue("2");
      //   }
      // }
      if (paymentGateWay === '3') {
        this.paymentgateway = paymentGateWay;
        if (this.customer.paymentGateWay.ebsConfig) {
          FormGroupUtils.applyValue(this.fg, this.customer.paymentGateWay.ebsConfig);
        }
        else {
          this.fg.reset();
          this.fg.get('payment_gateway').setValue("3");
        }
      }
    } else {
      this.paymentgateway = paymentGateWay;
    }
  }

  onSubmit() {

    const paymentSettings = new PaymentGateWay();
    // if ((this.paymentgateway === '1') || (this.paymentgateway === '2')) {
    //Razorpay & Stripe
    //   paymentSettings.key_id = this.fg.get('key_id').value;
    //   paymentSettings.key_secret = this.fg.get('key_secret').value;
    //   paymentSettings.payment_gateway = this.fg.get('payment_gateway').value.id;
    //   paymentSettings.premium_plan_id = this.fg.get('premium_plan_id').value;
    // } else {
    //EBS
    paymentSettings.accountId = this.fg.get('accountId').value;
    paymentSettings.secureKey = this.fg.get('secureKey').value;
    paymentSettings.mode = this.fg.get('mode').value;
    paymentSettings.payment_gateway = this.fg.get('payment_gateway').value;
    // }

    this.service.addCustomerPaymentSettings(this.fg.get('payment_gateway').value, paymentSettings)
      .subscribe((value: any) => {
        if (value.success) {
          this.messageService.add({ severity: 'info', summary: 'Payment settings updated successfully!', detail: '' });
        }
        else {
          this.messageService.add({ severity: 'error', summary: value.message, detail: '' });
        }
      });
  }
}
