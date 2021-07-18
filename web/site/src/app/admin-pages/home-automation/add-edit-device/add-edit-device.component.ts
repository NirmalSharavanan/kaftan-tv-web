import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap, Params } from '@angular/router';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/components/common/messageservice';
import { Device } from './../../../models/Device';
import { DeviceService } from './../../../services/device.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';

@Component({
  selector: 'ss-add-edit-device',
  templateUrl: './add-edit-device.component.html',
  styleUrls: ['./add-edit-device.component.scss']
})
export class AddEditDeviceComponent implements OnInit {

  fg: FormGroup;
  deviceId: string;
  deviceIcon: File | null;
  deviceIconUrl: string;

  constructor(fb: FormBuilder,
    private router: Router, private activatedRoute: ActivatedRoute,
    private service: DeviceService, private messageService: MessageService) {

    this.fg = fb.group({
      deviceName: fb.control('', [Validators.required]),
      isActive: fb.control(false),
    })

  }

  ngOnInit() {
    this.activatedRoute.paramMap
      .map((value: ParamMap) => {
        return value.get("deviceId");
      })
      .flatMap((deviceId: string) => {
        if (deviceId) {
          return this.service.getDevice(deviceId);
        } else {
          return Observable.of(null);
        }
      })
      .subscribe((response: Device) => {
        if (response) {
          this.deviceId = response.id;
          this.fg.get('deviceName').setValue(response.deviceName);
          this.fg.get('isActive').setValue(response.active);
          if (response._links) {
            if (response._links.awsIconUrl) {
              this.deviceIconUrl = response._links.awsIconUrl.href;
            }
          }
        }
      })
  }

  onSubmit() {
    const formData: FormData = new FormData();
    formData.append('deviceName', this.fg.get('deviceName').value);
    formData.append('isActive', this.fg.get('isActive').value);
    formData.append('deviceIcon', this.deviceIcon);

    let updateObs: Observable<any>;
    if (this.deviceId) {
      updateObs = this.service.updateDevice(formData, this.deviceId);
    }
    else {
      if (this.deviceIcon) {
        updateObs = this.service.addDevice(formData);
      }
      else {
        this.messageService.add({ severity: 'error', summary: 'Please upload device icon image', detail: '' });
      }
    }
    updateObs.subscribe(
      (value: any) => {
        if (value.success) {
          this.router.navigate(['/admin/home-automation/device']);
        }
        else {
          this.messageService.add({ severity: 'error', summary: value.message, detail: '' });
        }
      });

  }

}
