import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpService } from '../helper/httpService';
import { Observable } from 'rxjs/Observable';
import { RestAPI } from '../helper/api.constants';
import { Customer } from '../models/customer';
import { PaymentGateWay } from '../models/PaymentGateWay';
import { SocialSignup } from '../models/SocialSignup';
import 'rxjs/add/operator/publishReplay';

@Injectable()
export class CustomerService extends HttpService {

  customer: Observable<{}>;

  constructor(http: HttpClient) {
    super(http);
  }

  getCustomerFromServer() {
    if (!this.customer) {
      this.customer = this.get(RestAPI.GET_LOGEDDIN_CUSTOMER)
        .publishReplay(1)
        .refCount();
    }
  }

  //get customer for user end
  getCustomer() {
    this.getCustomerFromServer();
    return this.customer;
  }

  //get customer for admin
  getCustomerForAdmin() {
    return this.get(RestAPI.GET_LOGEDDIN_CUSTOMER_FOR_ADMIN);
  }

  addCustomerLogo(formData: FormData) {
    return this.put(RestAPI.PUT_CUSTOMER_LOGO, formData);
  }

  addCustomerFavicon(formData: FormData) {
    return this.put(RestAPI.PUT_CUSTOMER_FAVICON, formData);
  }

  //Settings
  addCustomerEmailSettings(customer: Customer) {
    return this.put(RestAPI.PUT_CUSTOMER_EMAIL_SETTINGS, customer);
  }

  addCustomerAWSSettings(customer: Customer) {
    return this.put(RestAPI.PUT_CUSTOMER_AWS_SETTINGS, customer);
  }

  addCustomerSocialSignupSettings(socialSignupType : String, socialSignup: SocialSignup) {
    return this.put(RestAPI.PUT_CUSTOMER_SOCIAL_SIGNUP_SETTINGS + "/" + socialSignupType, socialSignup);
  }

  addCustomerSocialMediaLinks(customer: Customer) {
    return this.put(RestAPI.PUT_CUSTOMER_SOCIAL_MEDIA_LINKS, customer);
  }

  addCustomerPaymentSettings(paymentType: String, paymentGateWay: PaymentGateWay) {
    return this.put(RestAPI.PUT_CUSTOMER_PAYMENT_SETTINGS + "/" + paymentType, paymentGateWay);
  }

  updateEmailHeaderImage(formData: FormData) {
    return this.put(RestAPI.PUT_EMAIL_HEADER_IMAGE , formData);
  }

  updateFirebaseSettings(firebase: any) {
    return this.put(RestAPI.PUT_FIREBASE_SETTINGS, firebase);
  }

  updateVideoCallSettings(videoCall: any) {
    return this.put(RestAPI.PUT_VIDEO_CALL_SETTINGS, videoCall);
  }

  updateCloudMessagingSettings(pushNotification: any) {
    return this.put(RestAPI.PUT_CLOUD_MESSAGING_SETTINGS, pushNotification);
  }

}

