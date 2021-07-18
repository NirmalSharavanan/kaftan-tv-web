import { Injectable } from '@angular/core';
import { HttpService } from 'app/helper/httpService';
import { HttpClient } from '@angular/common/http';
import { RestAPI } from 'app/helper/api.constants';
import { Subscription } from '../models/Subscription';

@Injectable()
export class SubscriptionService extends HttpService{

  constructor(http: HttpClient) {
    super(http);
  }

  addSubscription(formData: FormData) {
    return this.post(RestAPI.POST_SUBSCRIPTION, formData);
  }

  updateSubscription(subscription: Subscription) {
    return this.put(RestAPI.PUT_SUBSCRIPTION + '/' + subscription.id, subscription);
  }

  getSubscription(subscriptionId: string) {
    return this.get(RestAPI.GET_SUBSCRIPTION + '/' + subscriptionId);
  }

  getPaymentDetails(subscriptionId: string) {
    return this.get(RestAPI.GET_PAYMENT_DETAILS + '/' + subscriptionId);
  }

  getAllSubscriptions() {
    return this.get(RestAPI.GET_ALL_SUBSCRIPTIONS);
  }

  getActiveSubscriptions() {
    return this.get(RestAPI.GET_ACTIVE_SUBSCRIPTIONS);
  }

  getSubscriptionByUser(){
    return this.get(RestAPI.GET_USER_SUBSCRIPTION);
  }

  createFlexUser(){
    return this.post(RestAPI.POST_FLEX_USER, null);
  }

  getFlexUser() {
    return this.get(RestAPI.GET_FLEX_USER);
  }
  
}
