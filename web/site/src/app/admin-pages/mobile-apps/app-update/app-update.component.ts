import { Component, OnInit } from '@angular/core';
import { MobileAppService } from './../../../services/mobile-app.service';
import { AppUpdate } from './../../../models/AppUpdate';

@Component({
  selector: 'ss-app-update',
  templateUrl: './app-update.component.html',
  styleUrls: ['./app-update.component.scss']
})
export class AppUpdateComponent implements OnInit {

  appUpdates: AppUpdate[];

  constructor(private service: MobileAppService) { }

  ngOnInit() {
    this.init();
  }

  private init() {
    this.service.getAppUpdates().subscribe((appUpdates: AppUpdate[]) => {
      if (appUpdates) {
        this.appUpdates = appUpdates;
      }
    })
  }

}
