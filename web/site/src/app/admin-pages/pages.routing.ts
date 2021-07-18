import { AdminComponent } from './admin-layout/admin.component';
import { CategoryComponent } from './category/category/category.component';
import { Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';


export const AdminPagesRoutes: Routes = [{
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
}, {
    path: '',
    component: AdminComponent,
    children:
        [
            {
                path: 'home',
                component: HomeComponent,
            },
            {
                path: 'wallet',
                loadChildren: './wallet/wallet.module#WalletModule'
            },
            {
                path: 'meta-data',
                loadChildren: './category/category.module#CategoryModule'
            },
            {
                path: 'content',
                loadChildren: './content/content.module#ContentModule'
            },
            {
                path: 'blogs',
                loadChildren: './blogs/blogs.module#BlogsModule'
            },
            {
                path: 'subscription',
                loadChildren: './subscription/subscription.module#SubscriptionModule'
            },
            {
                path: 'promotion',
                loadChildren: './promotion/promotion.module#PromotionModule'
            },
            {
                path: 'home-automation',
                loadChildren: './home-automation/home-automation.module#HomeAutomationModule'
            },
            {
                path: 'notifications',
                loadChildren: './notifications/notifications.module#NotificationsModule'
            },
            {
                path: 'mobile-apps',
                loadChildren: './mobile-apps/mobile-apps.module#MobileAppsModule'
            },
            {
                path: 'user-management',
                loadChildren: './user/user-management.module#UserManagementModule'
            },
            {
                path: 'page-meta-data',
                loadChildren: './page-meta-data/page-meta-data.module#PageMetaDataModule'
            },
            {
                path: 'settings',
                loadChildren: './settings/settings.module#SettingsModule'
            },
            {
                path: 'analytics',
                loadChildren: './analytics/analytics.module#AnalyticsModule'
            }
        ]
}];
