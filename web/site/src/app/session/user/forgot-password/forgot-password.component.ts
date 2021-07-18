import { ResponseBase } from './../../../models/responseBase';
import { RestAPI } from 'app/helper/api.constants';
import { UserService } from './../../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';


@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html'
})
export class ForgotPasswordComponent implements OnInit {

  fg: FormGroup;
  isMailSent = false;
  loading = false;
  isValidateEmail = false;

  constructor(fb: FormBuilder, private service: UserService) {
    this.fg = fb.group({
      email: fb.control('', [Validators.required]),
    });
  }

  get email() {
    return this.fg.get('email');
  }

  resendEmail() {
    this.isMailSent = false;
    this.loading = true;
    this.service.post(RestAPI.POST_FORGOT_PASSWORD, this.fg.value)
      .subscribe((outcome: ResponseBase) => {
        if (outcome.success) {
          if (outcome.message == "EmailNotValidated") {
            this.isValidateEmail = true;
          }
          else {
            this.isMailSent = true;
          }

          this.loading = false;
        } else {
          this.fg.setErrors({
            resendEmailFailed: outcome.message
          });
          this.loading = false;
        }
        window.scroll(0, 0);
      });
  }
  ngOnInit() {
  }

}
