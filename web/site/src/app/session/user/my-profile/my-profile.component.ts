import { Component, OnInit } from '@angular/core';
import { FormGroupUtils } from './../../../common/utils/form-group-utils';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from './../../../services/user.service';
import { User } from './../../../models/user';
import { AuthenticationService } from './../../../services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'ss-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})
export class MyProfileComponent implements OnInit {

  loading = false;
  fg: FormGroup;
  user: User;
  showdialCode: boolean = false;

  constructor(fb: FormBuilder, private service: UserService, private router: Router,
    private authenticationService: AuthenticationService) {
    this.fg = fb.group({
      name: fb.control('', [Validators.required]),
      email: fb.control('', [Validators.required, Validators.email]),
      mobileNo: fb.control('', [Validators.required, Validators.minLength(10)])
    });
  }

  get name() {
    return this.fg.get('name');
  }

  get email() {
    return this.fg.get('email');
  }

  get mobileNo() {
    return this.fg.get('mobileNo');
  }

  ngOnInit() {
    if (this.authenticationService.token) {
      this.service.getLoggedInUser()
        .subscribe((response: any) => {
          if (response) {
            this.user = response;
            FormGroupUtils.applyValue(this.fg, response);
          }
        })
    } else {
      this.router.navigateByUrl('/session/home');
    }
  }

  onMobileNumChange(value) {
    if (!this.showdialCode) {
      this.mobileNo.setValue("");
      this.showdialCode = true;
    }
  }

  onSubmit() {
    this.loading = true;

    var mobilenumber = this.mobileNo.value;
    if (this.showdialCode) {
      mobilenumber = this.mobileNo.value && this.mobileNo.value.length > 1 ? this.mobileNo.value.substr(1) : this.mobileNo.value;
    }

    this.service.updateUser(this.name.value, this.email.value, mobilenumber, this.user.id)
      .subscribe((response: any) => {
        if (response) {
          if (response.success) {
            localStorage.setItem('userName', response.name);
            this.fg.setErrors({ updateProfileSuccess: response.message });
            this.service.reloadUserInfo();
          }
          else {
            this.fg.setErrors({ updateProfileFailed: response.message });
          }
        }
        this.loading = false;
        window.scroll(0, 0);
      })
  }
}
