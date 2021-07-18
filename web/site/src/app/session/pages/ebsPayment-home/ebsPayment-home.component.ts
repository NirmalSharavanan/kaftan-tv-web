import {
  Component, OnInit, ViewChild,
  ElementRef, OnChanges, Input
} from '@angular/core';
import { PaymentService } from './../../../services/payment.service';
import { AuthenticationService } from './../../../services/authentication.service';
import { subscriptionPlan } from './../../../models/subscriptionPlan';
import { EBSPayment } from './../../../models/EBSPayment';

@Component({
  selector: 'ss-ebsPayment-home',
  templateUrl: './ebsPayment-home.component.html',
  styleUrls: ['./ebsPayment-home.component.scss']
})
export class EbsPaymentHomeComponent implements OnInit, OnChanges {

  @ViewChild('ebs') paymentForm: ElementRef;
  @ViewChild('form') form: ElementRef;
  @ViewChild('form') myFormPost: ElementRef;
  @Input() subscriptionPlanDetail: subscriptionPlan;
  @Input() activePlan: any;
  @Input() buttonText: string;

  isAuthenticated: boolean;
  premium_message: string;
  paymentDetails: EBSPayment;
  loading: boolean = false;
  isDisabled:boolean;
  isInvalidUser:boolean;

  constructor(private paymentService: PaymentService,
    private authService: AuthenticationService,
  ) { }

  ngOnInit() {
    this.authService.isUserAuthenticated()
    .subscribe((isAuth: boolean) => {
      this.isAuthenticated = isAuth;
      if(this.activePlan !=null && this.activePlan.subscriptionInfo != null && this.activePlan.subscriptionInfo.paymentPlan != 'Flex'){
        this.isDisabled=true;

      }else{
        this.isDisabled=false;

      }
    });
  }

  ngOnChanges() {
  }

  proceedToPay() {
  }

  getPaymentInfo(selectedPlan) {

    // this.authService.isUserAuthenticated()
    //   .subscribe((isAuth: boolean) => {
    //     this.isAuthenticated = isAuth;
        if (this.isAuthenticated) {
       this.loading = true;

        const paymentInfo = new EBSPayment();
        paymentInfo.amount = selectedPlan.amount;
        paymentInfo.subscriptionId = selectedPlan.id;
        this.paymentService.getSecureHash(paymentInfo)
          .subscribe((response: EBSPayment) => {
            if (response) {
              this.paymentDetails = response;
              this.delay(500).then(any => {
                if (this.paymentDetails && this.myFormPost) {
                  this.myFormPost.nativeElement.submit();
                  this.loading = false;
                }
              });

            }
          });
          this.isInvalidUser=false;
      }else {
        this.isInvalidUser=true;
     
    } 

    // });

  }

  // Sleep 3 second to set all ebs values
  async delay(ms: number) {
    await new Promise(resolve => setTimeout(() => resolve(), ms)).then(() => { });
  }

}

