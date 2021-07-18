import { MessageService } from 'primeng/components/common/messageservice';
import { ContentService } from 'app/services/content.service';
import { Content } from './../../../models/content';
import { Component, OnInit, Input } from '@angular/core';
import { ArrayUtils } from 'app/common/utils/array-utils';
import { ResponseBase } from 'app/models/responseBase';

@Component({
  selector: 'ss-order-content',
  templateUrl: './order-content.component.html',
  styleUrls: ['./order-content.component.scss']
})
export class OrderContentComponent implements OnInit {

  @Input() categoryId: string;
  assigned: Content[];
  isSaveEnabled: boolean;
  orgOrder: string[];

  constructor(private contentService: ContentService,
    private messageService: MessageService) { }

  onReorder() {
    this.contentService.reorder(this.categoryId, ArrayUtils.reOrderInput(this.assigned, this.orgOrder))
      .subscribe((response: ResponseBase) => {
        if (response.success) {
          this.isSaveEnabled = false;
          this.messageService.add({ severity: 'success', summary: 'Re-Ordering Successful !', detail: response.message });
        } else {
          this.messageService.add({ severity: 'error', summary: 'Re-Ordering Failed !', detail: response.message });
        }
      });
  }

  enableSave() {
    this.isSaveEnabled = true;
  }

  ngOnInit() {
    this.contentService.getAdminAssignedContents(this.categoryId)
      .subscribe((response: Content[]) => {
        if (response) {
          this.assigned = response;
        } else {
          this.assigned = [];
        }
        this.orgOrder = this.assigned.map((content: Content) => content.id);
      });
  }

  // private assignData(response: ContentOrder[]) {
  //   console.log(response);
  //   if (response) {
  //     this.assigned = response.map((contentOrder: ContentOrder) => {
  //       const content = contentOrder.content;
  //       content.sort_order = contentOrder.sort_order;
  //       return content;
  //     });
  //   } else {
  //     this.assigned = [];
  //   }
  //   this.orgOrder = this.assigned.map((content: Content) => content.id);
  // }
}
