import { HomeBannerService } from './../../../services/home-banner.service';
import { HomeBanner } from './../../../models/home-banner';
import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/components/common/messageservice';
import { ArrayUtils } from 'app/common/utils/array-utils';
import { ResponseBase } from 'app/models/responseBase';

@Component({
  selector: 'ss-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})
export class BannerComponent implements OnInit {

  banners: HomeBanner[];
  bannersOrg: string[];
  isSaveEnabled: boolean;
  display: boolean = false;
  bannerId: string;
  constructor(private service: HomeBannerService, private messageService: MessageService) { }

  ngOnInit() {
    this.init();
  }

  init() {
    this.service.getAllBanners(false)
      .subscribe((response: HomeBanner[]) => {
        if (response) {
          this.banners = response;
          this.bannersOrg = this.banners.map((banner: HomeBanner) => {
            return banner.id;
          });
        }
      });
  }

  onReorder() {
    this.service.reorder(ArrayUtils.reOrderInput(this.banners, this.bannersOrg))
      .subscribe((response: ResponseBase) => {
        if (response.success) {
          this.messageService.add({ severity: 'success', summary: 'Re-Ordering Successful !', detail: response.message });
          this.init();
          this.isSaveEnabled = false;
        } else {
          this.messageService.add({ severity: 'error', summary: 'Re-Ordering Failed !', detail: response.message });
        }
      });
  }

  enableSave() {
    this.isSaveEnabled = true;
  }

  showDialog(id: string) {
    this.bannerId = id;
    this.display = true;
  }

  deleteBanner(id: string) {
    this.display = false;
    this.service.deleteBanner(id)
      .subscribe((response: any) => {
        if (response) {
          if (response.success) {
            this.messageService.add({ severity: 'info', summary: response.message, detail: '' });
            this.init();
          }
        }
      });
  }

}
