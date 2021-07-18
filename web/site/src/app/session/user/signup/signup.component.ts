import { ResponseBase } from './../../../models/responseBase';
import { RestAPI } from './../../../helper/api.constants';
import { UserService } from './../../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as _swal from 'sweetalert';
import { SweetAlert } from 'sweetalert/typings/core';
const swal: SweetAlert = _swal as any;

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html'
})
export class SignupComponent implements OnInit {
  fg: FormGroup;
  loading = false;
  constructor(fb: FormBuilder,
    private service: UserService,
    private router: Router) {
    this.fg = fb.group({
      name: fb.control('', [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern('^[a-zA-Z].*[\s]*$')]),
      password: fb.control('', [Validators.required, Validators.minLength(8)]),
      // email: fb.control('', [Validators.required, Validators.email]),
      email: fb.control('', [Validators.required]),
      mobileNo: fb.control('', [Validators.required, Validators.minLength(10)])
    });
  }

  get name() {
    return this.fg.get('name');
  }
  get password() {
    return this.fg.get('password');
  }
  get email() {
    return this.fg.get('email');
  }
  get mobileNo() {
    return this.fg.get('mobileNo');
  }

  onSubmit() {
    window.scroll(0, document.body.scrollHeight);
    this.loading = true;
    const response = this.service
      .post(RestAPI.POST_SIGNUP_USER, {name: this.name.value, email: this.email.value, password: this.password.value, mobileNo: this.mobileNo.value.substr(1)})
      .subscribe((value: ResponseBase) => {
        if (value.success) {
          swal({
            title: 'Terms and Conditions',
            text: 'This website terms and conditions template is for use on websites with typical features: informational pages, contact forms and user-submitted content.',
          }).then((result) => {
            this.router.navigateByUrl('/session/signup-confirmation');
          });
        } else {
          this.fg.setErrors({
            createUserFaild: value.message
          });
          this.loading = false;
          window.scroll(0, 0);
        }
      });
  }

  ngOnInit() {
  }

}
