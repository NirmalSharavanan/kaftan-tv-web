import { Router } from '@angular/router';
import { Component, OnInit, Input, OnDestroy, ChangeDetectorRef, NgZone } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { ConfirmMessageService } from '../service/confirm-message.service';
import { ConfrimMessage } from '../model/confirm-message';

@Component({
  selector: 'ss-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit, OnDestroy {
  visible: boolean;
  message: ConfrimMessage;
  subscription: Subscription;
  constructor(private router: Router,
    private messageServcie: ConfirmMessageService,
    private cdr: ChangeDetectorRef,
    private zone: NgZone
  ) {

  }

  ngOnInit() {
    this.subscription = this.messageServcie.serviceState
      .subscribe((res: ConfrimMessage) => {
        this.message = res;
        this.showDialog();
      });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onHide() {
    let url = this.message.navigation;
    this.hideDialog();
    this.message = null;
    this.cdr.detectChanges();
    if (!url) {
      url = this.router.url;
    }
    this.zone.run(() => this.router.navigate(['/redirect'], { queryParams: { url: url } }));

  }

  private showDialog() {
    this.visible = true;
  }

  private hideDialog() {
    this.visible = false;
    this.messageServcie.reset();
  }

}
