import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { SubscriptionService } from 'app/services/subscription.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import { FormGroupUtils } from 'app/common/utils/form-group-utils';
import { Subscription } from './../../../models/Subscription';
import { MessageService } from 'primeng/components/common/messageservice';

@Component({
  selector: 'ss-add-edit-subscription',
  templateUrl: './add-edit-subscription.component.html',
  styleUrls: ['./add-edit-subscription.component.scss']
})
export class AddEditSubscriptionComponent implements OnInit {

  fg: FormGroup;
  subscriptionId: string;
  featureList: any;
  selectedCities: any[];
  subscription: Subscription;
  selectedObjectes: any[] = [];
  alertMessage: boolean;

  constructor(fb: FormBuilder, private router: Router,
    private activatedRoute: ActivatedRoute,
    private subscriptionService: SubscriptionService,
    private messageService: MessageService) {
    this.fg = fb.group({
      paymentPlan: fb.control('', [Validators.required]),
      selectedfeatures: fb.control('', [Validators.required]),
      amount: fb.control('', [Validators.required]),
      is_Active: fb.control(false),
      features: fb.control('')
    })
  }

  ngOnInit() {

    this.activatedRoute.paramMap
      .map((value: ParamMap) => {
        return value.get("subscriptionId");
      })
      .flatMap((subscriptionId: string) => {
        if (subscriptionId) {
          return this.subscriptionService.getSubscription(subscriptionId);
        } else {
          return Observable.of(null);
        }
      })
      .subscribe((response: any) => {
        if (response) {
          this.subscriptionId = response.id;
          this.subscription = response;
          var flexPlan = this.subscription.paymentPlan == "Flex"; var monthlyPlan = this.subscription.paymentPlan == "Monthly";
          var quarterlyPlan = this.subscription.paymentPlan == "Quarterly"; var yearlyPlan = this.subscription.paymentPlan == "Yearly";

          FormGroupUtils.applyValue(this.fg, response);

          const selectedObjectes: any[] = [];
          if (response.features) {
            this.featureList.forEach((item) => {
              if (response.features.indexOf(item.id) >= 0) {
                selectedObjectes.push(item);
              }
            });
          }
          if (flexPlan || monthlyPlan || quarterlyPlan || yearlyPlan) {
            this.fg.get("selectedfeatures").setValue(selectedObjectes);
            this.fg.get("selectedfeatures").disable();
          } else {

            this.fg.get("selectedfeatures").setValue(selectedObjectes);
          }
        }
      })
    this.featureList = [
      { name: 'Video On Demand', id: 'Video On Demand' },
      { name: 'Radio & Music On Demand', id: 'Radio & Music On Demand' },
      { name: 'Chat and Video Calling', id: 'Chat and Video Calling' },
      { name: 'Home Automation', id: 'Home Automation' },
      { name: 'Kaftan Pay', id: 'Kaftan Pay' },
      { name: 'Home Security', id: 'Home Security' }
    ];
  }

  onValueChange() {
    this.fg.get("features").setValue((this.fg.get("selectedfeatures").value as any[])
      .map((value: any) => value.id))
  }

  onSelectFeatures(event) {
    var paymentplan = event.target.value;
    if ((paymentplan == "Flex") || (paymentplan == "Monthly") || (paymentplan == "Quarterly") || (paymentplan == "Yearly")) {
      this.selectedObjectes = [];
      this.featureList.forEach((item) => {
        this.selectedObjectes.push(item);
      });
      this.fg.get("selectedfeatures").setValue(this.selectedObjectes);
      this.fg.get("features").setValue((this.fg.get("selectedfeatures").value as any[])
        .map((value: any) => value.id))
      this.fg.get("selectedfeatures").disable();
    } else {
      this.fg.get("selectedfeatures").setValue(null);
      this.fg.get("selectedfeatures").enable();
    }
  }

  onSubmit() {
    let subscriptionObs: Observable<any>;
    if (this.subscriptionId) {
      subscriptionObs = this.subscriptionService.updateSubscription(FormGroupUtils.extractValue(this.fg, this.subscription));
    } else {
      subscriptionObs = this.subscriptionService.addSubscription(this.fg.value);
    }
    subscriptionObs.subscribe(
      (value: any) => {
        this.alertMessage = value.message == "Subscription plan already exists!";
        if (value.success) {
          this.router.navigate(['/admin/subscription/subscriptionplan']);
          this.messageService.add({ severity: 'info', summary: value.message, detail: '' });
        } else {
          if (this.alertMessage) {
            this.messageService.add({ severity: 'info', summary: value.message, detail: '' });
          } else {
            this.messageService.add({ severity: 'error', summary: value.message, detail: '' });
          }
        }
      }
    )
  }
}
