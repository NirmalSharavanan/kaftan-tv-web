import { ContentService } from 'app/services/content.service';
import { Content } from 'app/models/content';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NavigateWithUrl } from 'app/services/navigate-with-url.service';

@Component({
  selector: 'ss-content-home',
  templateUrl: './content-home.component.html',
  styleUrls: ['./content-home.component.scss']
})
export class ContentHomeComponent implements OnInit {

  contentId: string;
  content: Content;
  private sub: any;

  constructor(
    private navigateWithUrl: NavigateWithUrl,
    private route: ActivatedRoute,
    private service: ContentService
  ) { }

  ngOnInit() {
    this.contentId = this.navigateWithUrl.getNavigateData(this.route.snapshot.paramMap.get('id')).id;
    this.loadContent();
  }


  loadContent() {
    this.service.getContent(this.contentId, true)
      .subscribe((response: Content) => {
        this.content = response;
      });
  }
}
