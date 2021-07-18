import { PaySubcription } from './../models/PaySubscription';
import { PayTransaction } from './../models/PayTransaction';
import { RestAPI } from './../helper/api.constants';
import { HttpClient } from '@angular/common/http';
import { HttpService } from './../helper/httpService';
import { Injectable } from '@angular/core';
import { EBSPayment } from 'app/models/EBSPayment';

@Injectable()
export class PaymentService extends HttpService {

  constructor(http: HttpClient) {
    super(http);
  }

  getUserInfo(contentId: string) {
    return this.get(RestAPI.PAYEMNT_GET_USER + contentId);
  }

  getUserInfoForSubscription() {
    return this.get(RestAPI.PAYEMNT_GET_USER_FOR_SUBSCRIPTION);
  }

  processPayment(payTransaction: PayTransaction) {
    return this.post(RestAPI.PROCESS_PAYMENT, payTransaction);
  }

  processSubscription(paySubcription: PaySubcription) {
    return this.post(RestAPI.PROCESS_SUBSCIPTION, paySubcription);
  }

  //Stripe Payment Gateway
  getUserInfoForStripe(contentId: string) {
    return this.get(RestAPI.STRIPE_PAYEMNT_GET_USER + contentId);
  }

  processPayment_ByStripe(payTransaction: PayTransaction) {
    return this.post(RestAPI.STRIPE_PROCESS_PAYMENT, payTransaction);
  }

  getUserInfoForSubscriptionForStripe() {
    return this.get(RestAPI.STRIPE_PAYEMNT_GET_USER_FOR_SUBSCRIPTION);
  }

  processSubscription_ByStripe(paySubcription: PaySubcription) {
    return this.post(RestAPI.STRIPE_PROCESS_SUBSCIPTION, paySubcription);
  }

  //EBS Payment Gateway
  getSecureHash(paymentInfo : EBSPayment) {
    return this.post(RestAPI.EBS_GENERATE_SECURE_HASH, paymentInfo);
  }

}
