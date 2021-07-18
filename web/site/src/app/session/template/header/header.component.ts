import { SearchBase } from './../../../common/base/search.base';
import { SearchService } from './../../../ss-core/search.service';
import { ContentService } from 'app/services/content.service';
import { CustomerService } from 'app/services/customer.service';
import { Component, OnInit, HostListener, Inject } from '@angular/core';  
import { trigger, state, transition, style, animate } from '@angular/animations';  
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  animations:[ 
    trigger('fade',
    [ 
      state('void', style({ opacity : 0})),
      transition(':enter',[ animate(300)]),
      transition(':leave',[ animate(500)]),
    ]
)]
})
export class HeaderComponent extends SearchBase {

  logoImageUrl: string;
  faviconImageUrl: string;

  constructor(@Inject(DOCUMENT) document , service: ContentService, searchService: SearchService, private customerService: CustomerService) {
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

}
