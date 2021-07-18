import { Component, OnInit } from '@angular/core';
import { ArrayUtils } from 'app/common/utils/array-utils';
import { ResponseBase } from './../../../models/responseBase';
import { Device } from './../../../models/Device';
import { DeviceService } from './../../../services/device.service';
import { MessageService } from 'primeng/components/common/messageservice';

@Component({
  selector: 'ss-device',
  templateUrl: './device.component.html',
  styleUrls: ['./device.component.scss']
})
export class DeviceComponent implements OnInit {

  devices: Device[];

  //reOrder
  orgOrder: string[];
  isSaveEnabled: boolean;

  constructor(private service: DeviceService, private messageService: MessageService) { }

  ngOnInit() {
    this.init();
  }

  private init() {
    this.service.getAllDeviceList().subscribe((response: Device[]) => {
      if (response) {
        this.devices = response;
        this.orgOrder = response.map((device: Device) => device.id);
      }
    })
  }

  enableSave() {
    this.isSaveEnabled = true;
  }

  onReorder() {
    this.service.reorderDevices(ArrayUtils.reOrderInput(this.devices, this.orgOrder))
      .subscribe((response: ResponseBase) => {
        if (response.success) {
          this.isSaveEnabled = false;
          this.init();
          this.messageService.add({ severity: 'success', summary: 'Re-Ordering Successful!', detail: response.message });
        } else {
          this.messageService.add({ severity: 'error', summary: 'Re-Ordering Failed!', detail: response.message });
        }
      });
  }

}
