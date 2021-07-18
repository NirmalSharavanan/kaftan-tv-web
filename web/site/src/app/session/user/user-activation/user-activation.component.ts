import { ResponseBase } from './../../../models/responseBase';
import { UserService } from './../../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/combineLatest';
import { FormGroup, FormBuilder } from '@angular/forms';
import { UrlSegment } from '@angular/router/src/url_tree';


@Component({
  selector: 'app-user-activation',
  templateUrl: './user-activation.component.html'
})
export class UserActivationComponent implements OnInit {
  fg: FormGroup;
  message = '';

  constructor(fb: FormBuilder,
    private router: ActivatedRoute,
    private service: UserService) {
    this.fg = fb.group({
    });
  }

  ngOnInit() {
    Observable
      .combineLatest([this.router.url])
      .switchMap(paramMap => {
        let serviceUrl = '';
        paramMap[0].forEach((urlSegment: UrlSegment) => {
          serviceUrl = serviceUrl + '/' + urlSegment.path;
        });
        return this.service.get(serviceUrl);
      })
      .subscribe((response: ResponseBase) => {
        if (response.success) {
          this.message = response.message;
        } else {
          this.fg.setErrors({
            userActivationFailed: response.message
          });
        }
      });
  }
}
