import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SsCoreModule } from './../../ss-core/ss-core.module';
import { RouterModule } from '@angular/router';
import { PanelModule, DataListModule } from 'primeng/primeng';
import { ReactiveFormsModule } from '@angular/forms';
import { AppUpdateComponent } from './app-update/app-update.component';
import { AddEditAppUpdateComponent } from './add-edit-app-update/add-edit-app-update.component';
import { MobileAppService } from '../../services/mobile-app.service';

@NgModule({
  imports: [
    CommonModule,
    SsCoreModule,
    PanelModule,
    DataListModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: 'app-update',
        component: AppUpdateComponent
      },
      {
        path: 'add-app-update',
        component: AddEditAppUpdateComponent
      },
      {
        path: 'edit-app-update/:appUpdateId',
        component: AddEditAppUpdateComponent
      },
    ])
  ],
  declarations: [AppUpdateComponent, AddEditAppUpdateComponent],
  providers: [MobileAppService]
})
export class MobileAppsModule { }
