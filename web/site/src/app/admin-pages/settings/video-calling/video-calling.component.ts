import { Component, OnInit } from '@angular/core';
import { FormGroupUtils } from 'app/common/utils/form-group-utils';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from 'app/services/customer.service';
import { MessageService } from 'primeng/components/common/messageservice';
import { SettingsConfiguration } from 'app/models/SettingsConfiguration';

@Component({
  selector: 'ss-video-calling',
  templateUrl: './video-calling.component.html',
  styleUrls: ['./video-calling.component.scss']
})
export class VideoCallingComponent implements OnInit {

  fg: FormGroup;
  customer: any;

  constructor(fb: FormBuilder, private service: CustomerService,
    private messageService: MessageService) {
    this.fg = fb.group({
      apiKey: fb.control('', [Validators.required]),
      apiSecret: fb.control('', [Validators.required]),
    })
  }

  ngOnInit() {
    this.init();
  }

  private init() {
    this.service.getCustomerForAdmin()
    .subscribe((customer: any) => {
      if (customer) {
        if (customer.videoCalling) {
        FormGroupUtils.applyValue(this.fg, customer.videoCalling);
        }
      }
    });
  }

  onSubmit() {
    const videoCallingSettings = new SettingsConfiguration();
    videoCallingSettings.apiKey = this.fg.get('apiKey').value;
    videoCallingSettings.apiSecret = this.fg.get('apiSecret').value;
    this.service.updateVideoCallSettings(FormGroupUtils.extractValue(this.fg, videoCallingSettings))
      .subscribe((value: any) => {
        if (value.success) {
          this.messageService.add({ severity: 'info', summary: 'Video Calling Settings Updated Successfully!', detail: '' });
        }
        else {
          this.messageService.add({ severity: 'error', summary: value.message, detail: '' });
        }
      });
  }
}