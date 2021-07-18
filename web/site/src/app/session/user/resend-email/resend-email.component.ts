import { ResponseBase } from './../../../models/responseBase';
import { UserService } from './../../../services/user.service';
import { RestAPI } from 'app/helper/api.constants';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-resend-email',
  templateUrl: './resend-email.component.html'
})
export class ResendEmailComponent implements OnInit {

  fg: FormGroup;
  isMailSent = false;
  loading = false;

  constructor(fb: FormBuilder, private service: UserService) {
    this.fg = fb.group({
      email: fb.control('', [Validators.required]),
    });
  }

  resendEmail() {
    this.loading = true;
    this.isMailSent = false;
    this.service.post(RestAPI.POST_RESEND_EMAIL, this.fg.value)
      .subscribe((outcome: ResponseBase) => {
        if (outcome.success) {
          this.isMailSent = true;
        } else {
          this.fg.setErrors({
            resendEmailFailed: outcome.message
          });
        }
        this.loading = false;
        window.scroll(0, 0);
      });
  }

  ngOnInit() {
  }

}
