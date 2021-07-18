import { SsCoreModule } from './../../ss-core/ss-core.module';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { PayHomeComponent } from './pay-home/pay-home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PanelModule, DataListModule, DropdownModule, CalendarModule } from 'primeng/primeng';
import { TableModule } from 'primeng/table';
import { AdminPagesRoutes } from '../pages.routing';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '@angular/material';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { MenuToggleModule } from 'app/core/menu/menu-toggle.module';
import { CardModule } from 'primeng/card';
//import { ChartModule } from 'primeng/primeng';
import { WalletRouting } from './wallet.routing';
import { SearchSubscriberComponent } from './search-subscriber/search-subscriber.component';
import { ChargesConfigurationComponent } from './charges-configuration/charges-configuration.component';
import { OperatorWalletComponent } from './operator-wallet/operator-wallet.component';
import { AppMenuComponent } from './app-menu/app-menu.component';
import { TransactionReportComponent } from './transaction-report/transaction-report.component';
import { TransactionSummaryComponent } from './transaction-summary/transaction-summary.component';
import { StockPurchaseHistoryComponent } from './stock-purchase-history/stock-purchase-history.component';
import { InternationalPhoneNumberModule } from 'ngx-international-phone-number';
import { ChartModule } from  'angular-highcharts';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(WalletRouting),
    FormsModule,
    PanelModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MaterialModule,
    PerfectScrollbarModule,
    MenuToggleModule,
    CardModule,
    ChartModule,
    DataListModule,
    DropdownModule,
    CalendarModule,
    TableModule,
    SsCoreModule,
    InternationalPhoneNumberModule
  ],
  declarations: [
    PayHomeComponent,
    SearchSubscriberComponent,
    ChargesConfigurationComponent,
    OperatorWalletComponent,
    AppMenuComponent,
    TransactionReportComponent,
    TransactionSummaryComponent,
    StockPurchaseHistoryComponent,
  ],
  providers: [
    DatePipe
  ]

})
export class WalletModule { }
