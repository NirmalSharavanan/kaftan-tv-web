import { HomeBanner } from './../../../models/home-banner';
import { HomeBannerService } from './../../../services/home-banner.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ss-home-banner',
  templateUrl: './home-banner.component.html',
  styleUrls: ['./home-banner.component.scss']
})
export class HomeBannerComponent implements OnInit {

  homeBannerList: HomeBanner[];

  constructor(private service: HomeBannerService) { }

  ngOnInit() {
    this.service.getAllBanners(true)
      .subscribe((response: HomeBanner[]) => {
        if (response) {
          this.homeBannerList = response;
        }
      });
  }

}
