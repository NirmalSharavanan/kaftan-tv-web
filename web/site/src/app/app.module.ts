import { NgModule , CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SsCoreModule } from './ss-core/ss-core.module';
import { SessionStorageService } from './common/service/session-storage.service';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpModule, Http } from '@angular/http';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { OwlModule } from 'ngx-owl-carousel';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { NgxSpinnerModule } from "ngx-spinner";
import 'hammerjs';


// Components
import { AppComponent } from './app.component';
import { AppRoutes } from './app-routing.module';
import { AdminComponent } from './admin-pages/admin-layout/admin.component';
import { MenuToggleModule } from './core/menu/menu-toggle.module';
import { MenuItems } from './core/menu/menu-items/menu-items';
import { PageTitleService } from './core/page-title/page-title.service';


// Services
import { AdminAuthGuard } from './admin-auth.guard';
import { UserService } from './services/user.service';
import { AuthenticationService } from './services/authentication.service';
import { CustomerService } from './services/customer.service';
import { HttpService } from './helper/httpService';
import { ServiceStatusService } from 'app/common/service/service-status.service';
import { CustomInterceptor } from 'app/helper/customInterceptor';
import { GrowlModule, ProgressBarModule, DialogModule } from 'primeng/primeng';
import { MessageService } from 'primeng/components/common/messageservice';
import { UserRolesService } from './services/user-roles.service';
import { ContentService } from './services/content.service';
import { CategoryService } from './services/category.service';
import { ChartModule } from  'angular-highcharts';
import { BlogService } from './services/blog.service';
import { WalletService } from './services/wallet.service';
import { RealSessionStorageService } from './common/service/real-session-storage.service';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
	suppressScrollX: true
};

@NgModule({
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		FormsModule,
		ReactiveFormsModule,
		FlexLayoutModule,
		NgxSpinnerModule,
		MaterialModule,
		RouterModule.forRoot(AppRoutes),
		PerfectScrollbarModule,
		MenuToggleModule,
		HttpModule,
		GrowlModule,
		ProgressBarModule,
		DialogModule,
		HttpClientModule,
		SsCoreModule,
		ChartModule,
		OwlModule
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	declarations: [
		AppComponent,
		// AdminComponent
	],
	bootstrap: [AppComponent],
	providers: [
		MenuItems,
		PageTitleService,
		AdminAuthGuard,
		AuthenticationService,
		CustomerService,
		ContentService,
		CategoryService,
		UserService,
		HttpService,
		MessageService,
		ServiceStatusService,
		SessionStorageService,
		RealSessionStorageService,
		BlogService,
		WalletService,
		UserRolesService,
		DatePipe,
		{
			provide: HTTP_INTERCEPTORS,
			useClass: CustomInterceptor,
			multi: true,
		},
		{
			provide: PERFECT_SCROLLBAR_CONFIG,
			useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
		}
	]
})
export class AppModule { }
