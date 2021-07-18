import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/components/common/messageservice';
import { UserService } from './../../../services/user.service';
import { PasswordValidator } from '../../../common/validator/password-validator';

@Component({
  selector: 'ss-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  fg: FormGroup;

  constructor(fb: FormBuilder,
    private messageService: MessageService,
    private service: UserService) {
    this.fg = fb.group({
      oldPassword: fb.control('', [Validators.required]),
      newPassword: fb.control('', [Validators.required, Validators.minLength(8)]),
      confirmPassword: fb.control('', [Validators.required, Validators.minLength(8)])
    }, 
    {
      validator: [
        PasswordValidator.validateSamePassword('oldPassword', 'newPassword'),
        PasswordValidator.validateConfirmPassword('newPassword', 'confirmPassword')
      ]
    });
  }

  ngOnInit() {
  }

  onSubmit() {
      this.service.changePassword(this.fg.value).subscribe((response: any) => {
        if (response.success) {
          this.fg.reset();
          this.messageService.add({ severity: 'info', summary: response.message, detail: '' });
        }
        else {
          this.messageService.add({ severity: 'error', summary: response.message, detail: '' });
        }
      });
  }
}
