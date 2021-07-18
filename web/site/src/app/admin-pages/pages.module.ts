import { AdminCustomInterceptor } from './adminCustomInterceptor';
import { MenuToggleModule } from './../core/menu/menu-toggle.module';
import { MaterialModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AdminComponent } from './admin-layout/admin.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import {CardModule} from 'primeng/card';
import { ChartModule } from  'angular-highcharts';

import { AdminPagesRoutes } from './pages.routing';

import { HomeComponent } from './home/home.component';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { GrowlModule, ProgressBarModule } from 'primeng/primeng';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(AdminPagesRoutes),
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MaterialModule,
    PerfectScrollbarModule,
    MenuToggleModule,
    CardModule,
    ChartModule
  ],
  declarations: [
    HomeComponent,
    AdminComponent,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AdminCustomInterceptor,
      multi: true,
    },
  ]
})
export class PagesModule { }
