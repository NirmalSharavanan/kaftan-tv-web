import { Component, OnInit } from '@angular/core';
import { SubscriptionService } from 'app/services/subscription.service';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { map } from 'rxjs/operators';
import { zip } from 'rxjs/observable/zip';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'app/services/authentication.service';

@Component({
  selector: 'ss-payment-home',
  templateUrl: './payment-home.component.html',
  styleUrls: ['./payment-home.component.scss']
})
export class PaymentHomeComponent implements OnInit {

  subscriptionPlan: any;
  userSubscription: any;
  subscriptionLength: number;
  subscriptionDate: boolean;
  activePlan: any = [];
  buttonName: string;

  constructor(private service: SubscriptionService,
    private authenticationService: AuthenticationService,
    private datepipe: DatePipe) { }

  ngOnInit() {

    if (this.authenticationService.token) {
      zip(this.service.getActiveSubscriptions(), this.service.getSubscriptionByUser())
        .pipe(
          map(([plans, userSubscription]) => {
            this.subscriptionPlan = plans as any;
            this.subscriptionLength = this.subscriptionPlan.length;

            this.userSubscription = (userSubscription as any);
            var newDate = this.datepipe.transform(new Date(), "yyyy-M-d");

            if (this.subscriptionPlan && this.subscriptionPlan.length > 0) {
              var currentDate=Date.parse(newDate);
              this.subscriptionPlan.map((sub: any) => {
                this.userSubscription.map((active: any) => {                 
                 
                    var startDate =  
                     active.subscriptionStarted_at.year+ "-"+ active.subscriptionStarted_at.monthValue + "-"+active.subscriptionStarted_at.dayOfMonth;
                  var endDate =active.subscriptionEnd_at.year+ "-" + active.subscriptionEnd_at.monthValue + "-" + active.subscriptionEnd_at.dayOfMonth; 
               
                    var subscriptionstartDate=Date.parse(startDate);
                    var subscriptionendDate=Date.parse(endDate);
                  
                  if (sub.id === active.subscriptionId) {
                    if (moment(subscriptionstartDate).isSameOrBefore(currentDate) &&
                      moment(currentDate).isSameOrBefore(subscriptionendDate)) {
                      this.activePlan = active;
                    }

                  } 
                });
              });
            }
          }))
        .subscribe((response: any) => {
        });

    } else {
      this.getActiveSubscriptions();
    }

  }

  getActiveSubscriptions() {
    this.service.getActiveSubscriptions().subscribe((response: any) => {
      if (response) {
        this.subscriptionPlan = response;
        this.subscriptionLength = this.subscriptionPlan.length;
      }
    });
  }

}
