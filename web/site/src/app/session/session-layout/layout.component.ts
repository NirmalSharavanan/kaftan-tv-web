import { Subscription } from 'rxjs/Subscription';
import { SearchService } from './../../ss-core/search.service';
import { AuthenticationService } from './../../services/authentication.service';
import { ServiceStatusService } from './../../common/service/service-status.service';
import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { OnDestroy } from '@angular/core';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LayoutComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  @ViewChild('searchToggle') element: ElementRef;
  searchSubscription: Subscription;
  authSubscription: Subscription;

  constructor(private serviceStatus: ServiceStatusService,
    private authenticationService: AuthenticationService,
    private service: SearchService,
    private cdr: ChangeDetectorRef,
    private router: Router) { }

  ngOnInit() {

    this.authSubscription = this.authenticationService.isAutheticated
      .subscribe(isAuth => {
        this.authStatusChangeEvent(isAuth);
      });

    this.searchSubscription = this.service.searchStatus
      .subscribe((res) => {
        this.element.nativeElement.classList.toggle('search-hidden', res);
      });

    // if (this.router.url.endsWith('session/home')) {
    //   require("style-loader!./../../common/assert-import/home.scss");
    // }
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  authStatusChangeEvent(isAuth: boolean) {
    this.isAuthenticated = isAuth;
    if (!isAuth) {
      this.cdr.detectChanges();
    }
  }
}
