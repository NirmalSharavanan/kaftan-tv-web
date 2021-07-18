import { Component, OnInit } from '@angular/core';
import { SubscriptionService } from 'app/services/subscription.service';
import { MessageService } from 'primeng/components/common/messageservice';
import { Subscription } from 'app/models/Subscription';

@Component({
  selector: 'ss-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.scss']
})
export class SubscriptionsComponent implements OnInit {

  subscriptionList: Subscription[];
  cols: any;

  constructor(private service: SubscriptionService) { }
  ngOnInit() {
    this.init();
  }

  private init() {
    this.service.getAllSubscriptions().subscribe((subscriptions: Subscription[]) => {
      if (subscriptions) {
        this.subscriptionList = subscriptions;
      }
    });

    this.cols = [
      { field: 'paymentPlan', header: 'Payment Plan' },
      { field: 'features', header: 'Features', width: '25%' },
      { field: 'amount', header: 'Amount' },
      { field: 'is_Active', header: 'IsActive' },
      { field: 'id', header: 'Edit', width: '7%' }
    ];
  }
}
