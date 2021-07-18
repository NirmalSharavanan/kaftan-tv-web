import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SsCoreModule } from './../../ss-core/ss-core.module';
import { RouterModule } from '@angular/router';
import { PanelModule, OrderListModule } from 'primeng/primeng';
import { ReactiveFormsModule } from '@angular/forms';
import { AddEditDeviceComponent } from './add-edit-device/add-edit-device.component';
import { DeviceComponent } from './device/device.component';
import { DeviceService } from '../../services/device.service';

@NgModule({
  imports: [
    CommonModule,
    SsCoreModule,
    PanelModule,
    OrderListModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: 'device',
        component: DeviceComponent
      },
      {
        path: 'add-device',
        component: AddEditDeviceComponent
      },
      {
        path: 'edit-device/:deviceId',
        component: AddEditDeviceComponent
      },
    ])
  ],
  declarations: [AddEditDeviceComponent, DeviceComponent],
  providers: [DeviceService]
})
export class HomeAutomationModule { }
