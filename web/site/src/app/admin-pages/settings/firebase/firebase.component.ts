import { Component, OnInit } from '@angular/core';
import { FormGroupUtils } from 'app/common/utils/form-group-utils';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { CustomerService } from 'app/services/customer.service';
import { MessageService } from 'primeng/components/common/messageservice';
import { SettingsConfiguration } from 'app/models/SettingsConfiguration';

@Component({
  selector: 'ss-firebase',
  templateUrl: './firebase.component.html',
  styleUrls: ['./firebase.component.scss']
})
export class FirebaseComponent implements OnInit {

  fg: FormGroup;

  constructor(fb: FormBuilder, private service: CustomerService,
    private messageService: MessageService) {
    this.fg = fb.group({
      apiKey: fb.control('', [Validators.required]),
      appId: fb.control('', [Validators.required]),
      authDomain: fb.control('', [Validators.required]),
      databaseUrl: fb.control('', [Validators.required]),
      projectId: fb.control('', [Validators.required]),
      storageBucket: fb.control('', [Validators.required]),
      messagingSenderId: fb.control('', [Validators.required]),
    })
  }

  ngOnInit() {
    this.init();
  }

  private init() {
    this.service.getCustomerForAdmin()
      .subscribe((customer: any) => {
        if (customer) {
          if(customer.firebaseSDK) {
            FormGroupUtils.applyValue(this.fg, customer.firebaseSDK);
          }
        }
      });
  }

  onSubmit() {
    const firebaseSettings = new SettingsConfiguration();
    firebaseSettings.apiKey = this.fg.get('apiKey').value;
    firebaseSettings.appId = this.fg.get('appId').value;
    firebaseSettings.authDomain = this.fg.get('authDomain').value;
    firebaseSettings.databaseUrl = this.fg.get('databaseUrl').value;
    firebaseSettings.projectId = this.fg.get('projectId').value;
    firebaseSettings.storageBucket = this.fg.get('storageBucket').value;
    firebaseSettings.messagingSenderId = this.fg.get('messagingSenderId').value;
    
    this.service.updateFirebaseSettings(FormGroupUtils.extractValue(this.fg, firebaseSettings))
      .subscribe((value: any) => {
        if (value.success) {
          this.messageService.add({ severity: 'info', summary: 'Firebase SDK Settings Updated Successfully!', detail: '' });
        }
        else {
          this.messageService.add({ severity: 'error', summary: value.message, detail: '' });
        }
      });
  }
}