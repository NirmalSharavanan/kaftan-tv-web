import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SubscriptionService } from './../../../services/subscription.service';

@Component({
  selector: 'ss-paymentCompleted',
  templateUrl: './paymentCompleted.component.html',
  styleUrls: ['./paymentCompleted.component.scss']
})
export class PaymentCompletedComponent implements OnInit {

  subscriptionId: string;
  subscriptionDetails: any;
  starteDate: string;
  endDate: string;

  constructor(private route: ActivatedRoute, private service: SubscriptionService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.subscriptionId = params['id'];

      // Get Payment details
      this.service.getPaymentDetails(this.subscriptionId)
        .subscribe((response: any) => {
          if(response && response.length > 0) {
            this.subscriptionDetails = response[0];
            this.starteDate = response[0].subscriptionStarted_at.dayOfMonth + " " + response[0].subscriptionStarted_at.month + " " + response[0].subscriptionStarted_at.year;
            this.endDate = response[0].subscriptionEnd_at.dayOfMonth + " " + response[0].subscriptionEnd_at.month + " " + response[0].subscriptionEnd_at.year;
          }
        });
    });
  }

}
