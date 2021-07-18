import { PayHomeComponent } from "./pay-home/pay-home.component";
import { Routes } from "@angular/router";
import { SearchSubscriberComponent } from './search-subscriber/search-subscriber.component';
import { ChargesConfigurationComponent } from './charges-configuration/charges-configuration.component';
import { OperatorWalletComponent } from './operator-wallet/operator-wallet.component';
import { AppMenuComponent } from './app-menu/app-menu.component';
import { TransactionReportComponent } from './transaction-report/transaction-report.component';
import { TransactionSummaryComponent } from './transaction-summary/transaction-summary.component';
import { StockPurchaseHistoryComponent } from './stock-purchase-history/stock-purchase-history.component';

export const WalletRouting = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
    },
    {
        path: 'home',
        component: PayHomeComponent
    },
    {
        path: 'search-subscriber',
        component: SearchSubscriberComponent
    },
    {
        path: 'charge-config',
        component: ChargesConfigurationComponent
    },
    {
        path: 'operator-wallet',
        component: OperatorWalletComponent
    },
    {
        path:'app-management',
        component:AppMenuComponent
    },
    {
        path: 'transaction-report',
        component: TransactionReportComponent
    },
    {
        path: 'transaction-summary',
        component: TransactionSummaryComponent
    },
    {
        path:'stock-purchase-history',
        component:StockPurchaseHistoryComponent
    }
];