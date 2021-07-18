import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormGroupUtils } from './../../../common/utils/form-group-utils';
import { MessageService } from 'primeng/components/common/messageservice';
import { CustomerService } from './../../../services/customer.service';
import { SocialSignup } from './../../../models/SocialSignup';

@Component({
  selector: 'ss-social-signup',
  templateUrl: './social-signup.component.html',
  styleUrls: ['./social-signup.component.scss']
})
export class SocialSignupComponent implements OnInit {

  fg: FormGroup;
  customer: any;

  constructor(fb: FormBuilder,
    private messageService: MessageService, private service: CustomerService) {

      this.fg = fb.group({
        social_signup: fb.control('', [Validators.required]),
        app_id: fb.control('', [Validators.required]),
        app_secret: fb.control('', [Validators.required])
      });
  }
  
  ngOnInit() {
    this.init()
  }

  private init() {
    this.service.getCustomerForAdmin()
      .subscribe((customer: any) => {
        if (customer) {
          this.customer = customer;
          if (customer.socialSignup) {
            if (customer.socialSignup.facebookConfig && customer.socialSignup.googleConfig) {
              FormGroupUtils.applyValue(this.fg, customer.socialSignup.facebookConfig);
            }
            else {
              if (customer.socialSignup.facebookConfig) {
                FormGroupUtils.applyValue(this.fg, customer.socialSignup.facebookConfig);
              }
              if (customer.socialSignup.googleConfig) {
                FormGroupUtils.applyValue(this.fg, customer.socialSignup.googleConfig);
              }
            }
          }
          else{
            this.fg.get('social_signup').setValue(1);
          }
        }
      });
  }

  onChange(socialSignup) {
    if (this.customer.socialSignup) {
      if (socialSignup === "1") {
        if (this.customer.socialSignup.facebookConfig) {
          FormGroupUtils.applyValue(this.fg, this.customer.socialSignup.facebookConfig);
        }
        else{
          this.fg.reset();
          this.fg.get('social_signup').setValue(1);
        }
      }
      if (socialSignup === "2") {
        if (this.customer.socialSignup.googleConfig) {
          FormGroupUtils.applyValue(this.fg, this.customer.socialSignup.googleConfig);
        }
        else{
          this.fg.reset();
          this.fg.get('social_signup').setValue(2);
        }
      }
    }
  }

  onSubmit() {

    const socialSignupSettings = new SocialSignup();
    socialSignupSettings.app_id = this.fg.get('app_id').value;
    socialSignupSettings.app_secret = this.fg.get('app_secret').value;
    socialSignupSettings.social_signup = this.fg.get('social_signup').value;
   
    this.service.addCustomerSocialSignupSettings(this.fg.get('social_signup').value, socialSignupSettings)
      .subscribe((value: any) => {
        if (value.success) {
          this.messageService.add({ severity: 'info', summary: 'Social signup settings updated successfully!', detail: '' });
        }
        else {
          this.messageService.add({ severity: 'error', summary: value.message, detail: '' });
        }
      });
  }

}
