import { MessageService } from 'primeng/components/common/messageservice';
import { ContentService } from 'app/services/content.service';
import { Content } from './../../../models/content';
import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'ss-map-content',
  templateUrl: './map-content.component.html',
  styleUrls: ['./map-content.component.scss']
})
export class MapContentComponent implements OnInit {

  unAssigned: Content[];
  assigned: Content[];

  @Input() categoryId: string;
  @Input() contentType: string;

  constructor(private contentService: ContentService,
    private messageService: MessageService) { }

  onMoveToTarget(event) {
    this.processRequest(
      this.contentService.mapContentToCategory(this.categoryId,
        (event.items as Content[]).map((element: Content) => element.id))
    );
  }

  onMoveToSource(event) {
    this.processRequest(
      this.contentService.removeContentToCategoryMapping(this.categoryId,
        (event.items as Content[]).map((element: Content) => element.id))
    );
  }

  private processRequest(observable: Observable<any>) {
    if (observable) {
      observable.subscribe(value => {
        this.messageService.add({ severity: 'success', summary: 'Re-Ordering Successful !', detail: '' });
      });
    }
  }

  ngOnInit() {
    Observable
      .forkJoin(
        this.contentService.getUnAssignedContents(this.categoryId),
        this.contentService.getAdminAssignedContents(this.categoryId)
      )
      .subscribe((response: any[]) => {
        this.assignData(response);
      });
  }

  private assignData(response: any[]) {
    if (response[0]) {
      if (this.contentType != null) {
        this.unAssigned = this.contentType === 'all' ? response[0] : response[0].filter(outcome => outcome.content_type === this.contentType);
      }
      else {
        this.unAssigned = response[0];
      }
    } else {
      this.unAssigned = [];
    }
    if (response[1]) {
      this.assigned = response[1];//.map(item => item.content);
    } else {
      this.assigned = [];
    }
  }

}
