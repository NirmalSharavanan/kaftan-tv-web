import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from './../../../services/user.service';
import { AuthenticationService } from './../../../services/authentication.service';
import { Router } from '@angular/router';
import { PasswordValidator } from '../../../common/validator/password-validator';

@Component({
  selector: 'ss-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  loading = false;
  fg: FormGroup;

  constructor(fb: FormBuilder, private service: UserService, private router: Router,
    private authenticationService: AuthenticationService) {
    this.fg = fb.group({
      oldPassword: fb.control('', [Validators.required]),
      newPassword: fb.control('', [Validators.required, Validators.minLength(8)]),
      confirmPassword: fb.control('', [Validators.required, Validators.minLength(8)])
    }, {
        validator: [
          PasswordValidator.validateSamePassword('oldPassword', 'newPassword'),
          PasswordValidator.validateConfirmPassword('newPassword', 'confirmPassword')
        ]
      });
  }

  ngOnInit() {
    if (this.authenticationService.token) {
    } else {
      this.router.navigateByUrl('/session/home');
    }
  }

  onSubmit() {
    this.loading = true;
    this.service.changePassword(this.fg.value).subscribe((response: any) => {
      if (response.success) {
        this.fg.reset();
        this.fg.setErrors({ changepasswordSuccess: response.message });
      } else {
        this.fg.setErrors({ changepasswordFailed: response.message });
      }
      window.scroll(0, 0);
    });
    this.loading = false;
  }

}
