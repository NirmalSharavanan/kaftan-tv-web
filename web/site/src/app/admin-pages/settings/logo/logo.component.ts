import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormGroupUtils } from './../../../common/utils/form-group-utils';
import { FileUpload } from 'primeng/primeng';
import { MessageService } from 'primeng/components/common/messageservice';
import { CustomerService } from './../../../services/customer.service';
import { Customer } from './../../../models/customer';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'ss-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss']
})
export class LogoComponent implements OnInit {

  fg: FormGroup;
  logoImage: File | null;
  logoImageUrl: string;
  faviconImage: File | null;
  faviconImageUrl: string;

  constructor(fb: FormBuilder, private messageService: MessageService,
    private service: CustomerService) {
    this.fg = fb.group({

    });
  }

  ngOnInit() {
    this.init();
  }

  private init() {
    this.service.getCustomerForAdmin()
      .subscribe((customer: any) => {
        if (customer) {
          if (customer._links) {
            if (customer._links.awsLogoUrl) {
              this.logoImageUrl = customer._links.awsLogoUrl.href;
            }
            if (customer._links.awsFaviconUrl) {
              this.faviconImageUrl = customer._links.awsFaviconUrl.href;
            }
          }
        }
      });
  }

  onLogoSubmit() {
    if (this.logoImage) {
      const formData: FormData = new FormData();
      formData.append('logo', this.logoImage);
      this.service.addCustomerLogo(formData)
        .subscribe((value: any) => {
          if (value.hasOwnProperty('success') && !value.success) {
            this.messageService.add({ severity: 'error', summary: 'Logo Uploaded failed', detail: '' });
          } else {
            this.logoImage = null;
            this.init();
            this.messageService.add({ severity: 'info', summary: value.message, detail: '' });
          }
        });
    } else {
      this.messageService.add({ severity: 'error', summary: 'Please upload logo', detail: '' });
    }
  }

  onFaviconSubmit() {
    if (this.faviconImage) {
      const formData: FormData = new FormData();
      formData.append('favicon', this.faviconImage);
      this.service.addCustomerFavicon(formData)
        .subscribe((value: any) => {
          if (value.hasOwnProperty('success') && !value.success) {
            this.messageService.add({ severity: 'error', summary: 'Favicon Uploaded failed', detail: '' });
          } else {
            this.faviconImage = null;
            this.init();
            this.messageService.add({ severity: 'info', summary: value.message, detail: '' });
          }
        });
    } else {
      this.messageService.add({ severity: 'error', summary: 'Please upload favicon', detail: '' });
    }
  }
}
