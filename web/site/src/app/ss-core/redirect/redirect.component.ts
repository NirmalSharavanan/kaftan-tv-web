import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'ss-redirect',
  templateUrl: './redirect.component.html',
  styleUrls: ['./redirect.component.css']
})
export class RedirectComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute, private router: Router, 
    private zone: NgZone,
    private location: Location) {
  }

  ngOnInit() {
    this.activatedRoute.queryParamMap
      .subscribe((parmMap: ParamMap) => {
        const url = parmMap.get('url');
        if (url) {
          this.zone.run(() => this.router.navigate([url]));
        } else {
          this.location.back();
        }
      });
  }

}
