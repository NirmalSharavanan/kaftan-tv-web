import { SessionStorageService } from './common/service/session-storage.service';
import { NavigationEnd, Router, ActivationStart } from '@angular/router';
import { ServiceStatusService } from 'app/common/service/service-status.service';
import { Component, Optional, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { MdDialog, MdDialogConfig, MdDialogRef, MdSnackBar } from '@angular/material';
import { ChangeDetectorRef } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";

declare var window: any;

@Component({
  selector: 'app-root',
  template: `
  <router-outlet></router-outlet>
  <p-growl></p-growl>
  <p-progressBar *ngIf="isPending" mode="indeterminate" [style]="{'height': '5px'}"></p-progressBar>
  `,
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit, OnDestroy {
  isPending: boolean;

  constructor(private router: Router,
    private sessionStorageService: SessionStorageService,
    private serviceStatus: ServiceStatusService,
    private spinner: NgxSpinnerService,
    private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.spinner.show();

    setTimeout(() => {
      /** spinner ends after 5 seconds */
      this.spinner.hide();
    }, 5000);
    this.serviceStatus.serviceState.subscribe(state => {
      if (this.isPending !== state) {
        this.isPending = state;
        this.cdr.detectChanges();
      }
    });

    this.router.events
      .filter(event => event instanceof ActivationStart)
      .subscribe(() => {
        window.scroll(0, 0);
      });
  }

  ngOnDestroy() {
    this.serviceStatus.unSubscribe();
  }

}
