import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/components/common/messageservice';
import { ArrayUtils } from 'app/common/utils/array-utils';
import { ResponseBase } from './../../../models/responseBase';
import { StaticPage } from './../../../models/StaticPage';
import { StaticPagesService } from './../../../services/static-pages.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'ss-static-pages',
  templateUrl: './static-pages.component.html',
  styleUrls: ['./static-pages.component.scss']
})
export class StaticPagesComponent implements OnInit {

  staticPages: StaticPage[];

  //Delete Page
  displaydialog: boolean;
  pageId: string;

  //reOrder
  orgOrder: string[];
  isSaveEnabled: boolean;

  constructor(private service: StaticPagesService, private messageService: MessageService, private sanitized: DomSanitizer) { }

  ngOnInit() {
    this.init();
  }

  private init() {
    this.service.getStaticPagesForAdmin().subscribe((staticPages: StaticPage[]) => {
      if (staticPages) {
        this.staticPages = staticPages;
        this.orgOrder = this.staticPages.map((staticPage: StaticPage) => staticPage.id);
      }
    })
  }

  private showDeleteDialog(pageId) {
    this.displaydialog = true;
    this.pageId = pageId;
  }

  deletePage(pageId) {
    this.displaydialog = false;
    this.service.deleteStaticPage(pageId)
      .subscribe((response: any) => {
        if (response) {
          if (response.success) {
            this.init();
            this.messageService.add({ severity: 'info', summary: "Page deleted successfully!!", detail: '' });
          }
        }
      });
  }

  enableSave() {
    this.isSaveEnabled = true;
  }

  onReorder() {
    this.service.reorderPages(ArrayUtils.reOrderInput(this.staticPages, this.orgOrder))
      .subscribe((response: ResponseBase) => {
        if (response.success) {
          this.isSaveEnabled = false;
          this.init();
          this.messageService.add({ severity: 'success', summary: 'Re-Ordering Successful!', detail: response.message });
        } else {
          this.messageService.add({ severity: 'error', summary: 'Re-Ordering Failed!', detail: response.message });
        }
      });
  }

}
