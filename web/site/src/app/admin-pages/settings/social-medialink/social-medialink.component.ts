import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormGroupUtils } from './../../../common/utils/form-group-utils';
import { MessageService } from 'primeng/components/common/messageservice';
import { CustomerService } from './../../../services/customer.service';
import { Customer } from './../../../models/customer';

@Component({
  selector: 'ss-social-medialink',
  templateUrl: './social-medialink.component.html',
  styleUrls: ['./social-medialink.component.scss']
})
export class SocialMedialinkComponent implements OnInit {

  fg: FormGroup;
  customer: Customer[];

  constructor(fb: FormBuilder,
    private messageService: MessageService,
    private service: CustomerService) {
    this.fg = fb.group({
      facebook_link: fb.control(''),
      twitter_link: fb.control(''),
      googleplus_link: fb.control(''),
      instagram_link: fb.control(''),
      youtube_link: fb.control(''),
      ios_link: fb.control(''),
      android_link: fb.control(''),
    });
  }

  private init() {
    this.service.getCustomerForAdmin()
      .subscribe((customer: Customer[]) => {
        if (customer) {
          this.customer = customer;
          FormGroupUtils.applyValue(this.fg, customer);
        }
      });
  }

  ngOnInit() {
    this.init()
  }

  onSubmit() {
    this.service.addCustomerSocialMediaLinks(FormGroupUtils.extractValue(this.fg, this.customer))
      .subscribe((value: Customer) => {
        if (value.success) {
          this.messageService.add({ severity: 'info', summary: 'Social media links updated successfully!', detail: '' });
        }
        else {
          this.messageService.add({ severity: 'error', summary: value.message, detail: '' });
        }
      });
  }

}
