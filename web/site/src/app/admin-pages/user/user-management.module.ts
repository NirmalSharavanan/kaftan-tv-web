import { SsCoreModule } from './../../ss-core/ss-core.module';
import { UsersComponent } from './users/users.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FileUploadModule, GrowlModule, OrderListModule, DataListModule, CheckboxModule, PanelModule, ListboxModule, MultiSelectModule } from 'primeng/primeng';
import { TableModule } from 'primeng/table';
import { ReactiveFormsModule } from '@angular/forms';
import { AddUserComponent } from './add-user/add-user.component';
import { SignedUpUsersComponent } from './signed-up-users/signed-up-users.component';
import { AdminAuthGuard } from '../../admin-auth.guard';

@NgModule({
  imports: [
    CommonModule,
    FileUploadModule,
    ReactiveFormsModule,
    GrowlModule,
    DataListModule,
    OrderListModule,
    CheckboxModule,
    PanelModule,
    ListboxModule,
    MultiSelectModule,
    TableModule,
    SsCoreModule,
    RouterModule.forChild([{
      path: 'users',
      canActivate: [AdminAuthGuard],
      component: UsersComponent
    },
    {
      path: 'add-user',
      canActivate: [AdminAuthGuard],
      component: AddUserComponent
    },
    {
      path: 'edit-user/:userId',
      canActivate: [AdminAuthGuard],
      component: AddUserComponent
    },
    {
      path: 'change-password',
      canActivate: [AdminAuthGuard],
      component: ChangePasswordComponent
    },
    {
      path: 'sign-up-users',
      canActivate: [AdminAuthGuard],
      component: SignedUpUsersComponent
    },
    
    ])
  ],
  declarations: [
    UsersComponent,
    ChangePasswordComponent,
    AddUserComponent,
    SignedUpUsersComponent
  ],
  providers: [

  ]
})
export class UserManagementModule { }
