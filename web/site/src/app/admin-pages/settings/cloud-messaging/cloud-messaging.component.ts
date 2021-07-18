import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomerService } from 'app/services/customer.service';
import { MessageService } from 'primeng/components/common/messageservice';
import { FormGroupUtils } from 'app/common/utils/form-group-utils';
import { SettingsConfiguration } from 'app/models/SettingsConfiguration';

@Component({
  selector: 'ss-cloud-messaging',
  templateUrl: './cloud-messaging.component.html',
  styleUrls: ['./cloud-messaging.component.scss']
})
export class CloudMessagingComponent implements OnInit {

  fg: FormGroup;

  constructor(fb: FormBuilder, private service: CustomerService,
    private messageService: MessageService) {
    this.fg = fb.group({
      authKey: fb.control('', [Validators.required])
    })
  }

  ngOnInit() {
    this.init();
  }

  private init() {
    this.service.getCustomerForAdmin()
    .subscribe((customer: any) => {
      if (customer) {
        if (customer.cloudMessaging) {
          FormGroupUtils.applyValue(this.fg, customer.cloudMessaging);
        }
      }
    });
  }

  onSubmit() {
    const cloudMessagingSettings = new SettingsConfiguration();
    cloudMessagingSettings.authKey = this.fg.get('authKey').value;
    this.service.updateCloudMessagingSettings(FormGroupUtils.extractValue(this.fg, cloudMessagingSettings))
      .subscribe((value: any) => {
        if (value.success) {
          this.messageService.add({ severity: 'info', summary: 'Cloud Messaging Settings Updated Successfully!', detail: '' });
        }
        else {
          this.messageService.add({ severity: 'error', summary: value.message, detail: '' });
        }
      });
  }
}