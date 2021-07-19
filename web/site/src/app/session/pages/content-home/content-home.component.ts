import { ContentService } from 'app/services/content.service';
import { Content } from 'app/models/content';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { RealSessionStorageService } from 'app/common/service/real-session-storage.service';

@Component({
  selector: 'ss-content-home',
  templateUrl: './content-home.component.html',
  styleUrls: ['./content-home.component.scss']
})
export class ContentHomeComponent implements OnInit {

  contentId: string;
  content: Content;
  contentList: Content[];
  private sub: any;

  constructor(
    private realSessionStorageService: RealSessionStorageService,
    private route: ActivatedRoute,
    private service: ContentService
  ) { }

  ngOnInit() {

    this.sub = this.route.params.subscribe(params => {
      this.contentList = JSON.parse(this.realSessionStorageService.getSession("contentList"))
      let title = params['id'].replace(/_/g, " ")
      this.contentList.map(item => {
        if(item.title === title) {
          this.contentId = item.id
        }
      })
      this.loadContent();
    });
  }

  loadContent() {
    this.service.getContent(this.contentId, true)
      .subscribe((response: Content) => {
        this.content = response;
      });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
