import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { User } from './../../../models/user';
import { ContentService } from 'app/services/content.service';
import { SearchService } from './../../../ss-core/search.service';
import { SearchBase } from './../../../common/base/search.base';
import { AuthenticationService } from './../../../services/authentication.service';
import { UserService } from './../../../services/user.service';
import { CustomerService } from 'app/services/customer.service';
import { Component, OnInit, OnDestroy , HostListener, Inject  } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-secure-header',
  templateUrl: './secure-header.component.html',
  styleUrls: ['./secure-header.component.css']
})

export class SecureHeaderComponent extends SearchBase implements OnInit, OnDestroy {
  isPremiumUser: boolean = true;
  userSubscription: Subscription;
  logoImageUrl: string;
  faviconImageUrl: string;

  constructor(@Inject(DOCUMENT) document , private authenticationService: AuthenticationService,
    private userService: UserService,
    service: ContentService,
    searchService: SearchService,
    private customerService: CustomerService,
    private router: Router) {
    super(service, searchService);
  }

  ngOnInit() {
    super.ngOnInit();
    this.init();
  }

  
  @HostListener('window:scroll', ['$event'])
  onWindowScroll(e) {
     if (window.pageYOffset > 250) {
       let element = document.getElementById('navbar');
       element.classList.add('sticky');
       element.classList.add('animate__animated');
       element.classList.add('animate__fadeInDown');
       element.classList.add('animate__faster');
     } else {
      let element = document.getElementById('navbar');
        element.classList.remove('sticky'); 
        element.classList.remove('animate__animated');
        element.classList.remove('animate__fadeInDown');
        element.classList.remove('animate__faster');
     }
  }

  init() {

    this.authenticationService.isUserAuthenticated()
      .subscribe((isAuth: boolean) => {
        if (isAuth) {
          this.checkisPremiumUser();
          this.getCustomerInfo()
        }
      });

    if (this.authenticationService.isUserAuthenticated()) {
      this.checkisPremiumUser()
    }

    this.userSubscription = this.userService.localPremiumUserState
      .subscribe((premiumUser: any) => {
        if (premiumUser && premiumUser.length > 0) {
          if(premiumUser[premiumUser.length-1].subscriptionInfo.paymentPlan != 'Flex') {
            this.isPremiumUser = true;
          } else {
            this.isPremiumUser = false;
          }
        } else {
          this.isPremiumUser = false;
        }
      })
    // this.userSubscription = this.userService.localUserState
    //   .subscribe((user: User) => {
    //     if (user) {
    //       this.isPremiumUser = user.is_premium;
    //     }
    //   });
  }

  get userName(){
    return this.authenticationService.getUserName();
  }

  checkisPremiumUser() {
    // this.userService.getLoggedInUser()
    //   .subscribe((user: User) => {
    //     if (user) {
    //       this.isPremiumUser = user.is_premium;
    //     }
    //   },
    //     (error: any) => {
    //       if (error.status = 403) {
    //         this.router.navigate(['/session/login']);
    //       }
    //     }
    //   );
    this.userService.getPremiumUser()
      .subscribe((premiumUser: any) => {
        if (premiumUser && premiumUser.length > 0) {
          if(premiumUser[premiumUser.length-1].subscriptionInfo.paymentPlan != 'Flex') {
            this.isPremiumUser = true;
          } else {
            this.isPremiumUser = false;
          }
        } else {
          this.isPremiumUser = false;
        }
      },
        (error: any) => {
          if (error.status = 403) {
            this.router.navigate(['/session/login']);
          }
        }
      );
  }

  getCustomerInfo() {
    // get customer logo & favicon
    this.customerService.getCustomer()
      .subscribe((customer: any) => {
        if (customer) {
          if (customer._links) {
            if (customer._links.awsLogoUrl) {
              this.logoImageUrl = customer._links.awsLogoUrl.href;
            }

            if (customer._links.awsFaviconUrl) {
              this.faviconImageUrl = customer._links.awsFaviconUrl.href;
            }
          }
        }
      });
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
}
