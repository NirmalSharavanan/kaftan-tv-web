import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { StaticPage } from 'app/models/StaticPage';
import { StaticPagesService } from 'app/services/static-pages.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'ss-static-page',
  templateUrl: './static-page.component.html',
  styleUrls: ['./static-page.component.scss']
})
export class StaticPageComponent implements OnInit {

  pageurl: string;
  staticPage: StaticPage;
  loading = true;

  constructor(private route: ActivatedRoute, private service: StaticPagesService, private sanitized: DomSanitizer) { }

  ngOnInit() {
    this.loading = true;
    this.route.params.subscribe(params => {
      this.pageurl = params['id'];
      this.service.getStaticPageForUser(this.pageurl)
        .subscribe((response: StaticPage) => {
          if (response) {
            this.staticPage = response;
          }
          this.loading = false;
        })
    })
  }
}
