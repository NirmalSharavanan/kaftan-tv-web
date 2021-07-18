import { ResponseBase } from './../../../models/responseBase';
import { UserService } from './../../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, UrlSegment } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/combineLatest';
import { PasswordValidator } from '../../../common/validator/password-validator';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html'
})
export class ResetPasswordComponent implements OnInit {

  fg: FormGroup;
  loading = false;

  constructor(fb: FormBuilder,
    private service: UserService,
    private router: ActivatedRoute) {

    this.fg = fb.group({
      password: fb.control('', [Validators.required, Validators.minLength(8)]),
      confirmPassword: fb.control('', [Validators.required, Validators.minLength(8)]),
    }, {
        validator: [
          PasswordValidator.validateConfirmPassword('password', 'confirmPassword')
        ]
      });
  }

  resetPassword() {
    this.loading = true;
    Observable
      .combineLatest([this.router.url])
      .switchMap(paramMap => {
        let serviceUrl = '';
        paramMap[0].forEach((urlSegment: UrlSegment) => {
          serviceUrl = serviceUrl + '/' + urlSegment.path;
        });
        return this.service.post(serviceUrl, this.fg.value);
      })
      .subscribe((response: ResponseBase) => {
        if (response.success) {
          this.fg.reset();
          this.fg.setErrors({
            resetPasswordSuccess: response.message
          });
        } else {
          this.fg.setErrors({
            resetPasswordFailed: response.message
          });
        }
        this.loading = false;
        window.scroll(0, 0);
      });
  }

  ngOnInit() {
  }

}
