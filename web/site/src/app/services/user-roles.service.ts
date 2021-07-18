import { Injectable } from '@angular/core';
import { UserRole } from '../models/user-role';

@Injectable()
export class UserRolesService {

    roles: Array<UserRole> = [];

    constructor() {
        // FIXME should me be moved to service
       
        const admin_role = new UserRole('ROLE_ADMIN');
        admin_role.addStates(
            'admin',
            'admin/home',
            'admin/wallet',
            'admin/wallet/home',
            'admin/wallet/search-subscriber',
            'admin/wallet/charge-config',
            'admin/wallet/operator-wallet',
            'admin/wallet/app-management',
            'admin/wallet/transaction-report',
            'admin/wallet/transaction-summary',
            'admin/wallet/stock-purchase-history',
            'admin/content/banner',
            'admin/meta-data/HomeCategory',
            'admin/meta-data/Featured',
            'admin/settings/add-social-medialinks',
            'admin/meta-data/Category',
            'admin/meta-data/Celebrity',
            'admin/meta-data/Genre',
            'admin/meta-data/PayPerView',
            'admin/meta-data/Channel',
            'admin/meta-data/Radio',
            'admin/content/video',
            'admin/content/audio',
            'admin/content/celebrityType',
            'admin/notifications/send-email',
            'admin/notifications/send-notification',
            'admin/mobile-apps/app-update',
            'admin/analytics/content-usage-by-user',
            'admin/analytics/content-usage-by-movie',
            'admin/analytics/content-usage-total-report',
            'admin/user-management/users',
            'admin/user-management/edit-user',
            'admin/user-management/sign-up-users',
            'admin/user-management/change-password',
            // 'admin/user-management/add-user',
            'admin/settings/email',
            'admin/settings/social-signup',
            'admin/settings/static-pages',
            'admin/settings/edit-static-page',
            'admin/blogs/blog',
            'admin/blogs/edit-blog',
            'admin/subscription/subscriptionplan',
            'admin/subscription/add-subscription',
            'admin/subscription/edit-subscription',
            'admin/settings/payment-gateway',
            // 'admin/promotion/promotions',
            // 'admin/promotion/add-promotion',
            // 'admin/promotion/edit-promotion',
            'content',
            'mobile-apps',
            'notifications',
            'admin/settings/firebase-sdk',
            'admin/settings/video-calling',
            'admin/settings/cloud-messaging',

        );

        const limited_role = new UserRole('ROLE_SUPER_USER');
        limited_role.addStates(
            'admin',
            'admin/home',
            'admin/wallet',
            'admin/wallet/home',
            'admin/wallet/search-subscriber',
            'admin/wallet/charge-config',
            'admin/wallet/operator-wallet',
            'admin/wallet/app-management',
            'admin/wallet/transaction-report',
            'admin/wallet/transaction-summary',
            'admin/wallet/stock-purchase-history',
            'admin/content/banner',
            'admin/meta-data/HomeCategory',
            'admin/meta-data/Featured',
            'admin/settings/add-social-medialinks',
            'admin/meta-data/Category',
            'admin/meta-data/Celebrity',
            'admin/meta-data/Genre',
            'admin/meta-data/PayPerView',
            'admin/meta-data/Channel',
            'admin/meta-data/Radio',
            'admin/content/video',
            'admin/content/audio',
            'admin/content/celebrityType',
            'admin/notifications/send-email',
            'admin/notifications/send-notification',
            'admin/mobile-apps/app-update',
            'admin/user-management/users',
            'admin/user-management/edit-user',
            'admin/user-management/sign-up-users',
            'admin/user-management/change-password',
            'admin/user-management/add-user',
            'admin/settings/social-signup',
            'admin/settings/static-pages',
            'admin/settings/edit-static-page',
            'admin/blogs/blog',
            'admin/blogs/edit-blog',
            'admin/subscription/subscriptionplan',
            'admin/subscription/add-subscription',
            'admin/subscription/edit-subscription',
            'admin/settings/payment-gateway',
            // 'admin/promotion/promotions',
            // 'admin/promotion/add-promotion',
            // 'admin/promotion/edit-promotion',
            'content',
            'mobile-apps',
            'notifications',
            'admin/settings/firebase-sdk',
            'admin/settings/video-calling',
            'admin/settings/cloud-messaging',
        );

        this.roles.push(admin_role);
        this.roles.push(limited_role);

        const app_admin_role = new UserRole('ROLE_APP_ADMIN');
        app_admin_role.addStates(
            'admin',
            'admin/home',
            'admin/mobile-apps/app-update',
            'admin/notifications/send-email',
            'admin/notifications/send-notification',
            'admin/user-management/change-password',
            'admin/user-management/users',
            'mobile-apps',
            'notifications'
        );
        this.roles.push(app_admin_role);

        const content_uploader_role = new UserRole('ROLE_CONTENT_UPLOADER');
        content_uploader_role.addStates(
            'admin',
            'admin/home',
            'admin/content/banner',
            'admin/content/video',
            'admin/content/audio',
            'admin/content/celebrityType',
            'admin/meta-data/Category',
            'admin/meta-data/SubCategory',
            'admin/meta-data/Celebrity',
            'admin/meta-data/Featured',
            'admin/meta-data/Genre',
            'admin/meta-data/PayPerView',
            'admin/meta-data/Channel',
            'admin/meta-data/Radio',
            'admin/blogs/blog',
            'admin/settings/static-pages',
            'admin/user-management/change-password',
            'admin/user-management/users',
            'admin/settings/add-social-medialinks',
            'content',
        );
        this.roles.push(content_uploader_role);

        const site_manager_role = new UserRole('ROLE_SITE_MANAGER');
        site_manager_role.addStates(
            'admin',
            'admin/home',
            'admin/settings/add-social-medialinks',
            'admin/settings/firebase-sdk',
            'admin/settings/video-calling',
            'admin/settings/cloud-messaging',
            'admin/settings/email',
            'admin/settings/payment-gateway',
            'admin/settings/social-signup',
            'admin/settings/static-pages',
            'admin/user-management/change-password',
            'admin/user-management/users',
        );
        this.roles.push(site_manager_role);

        const reports_role = new UserRole('ROLE_REPORTS');
        reports_role.addStates(
            'admin',
            'admin/home',
            'admin/user-management/change-password',
            'admin/user-management/users',
            'admin/analytics/content-usage-by-user',
            'admin/analytics/content-usage-by-movie',
            'admin/analytics/content-usage-total-report'
        );
        this.roles.push(reports_role);

        const systemAdmin_role = new UserRole('ROLE_SYSTEM_ADMINISTRATOR');
        systemAdmin_role.addStates(
            'admin',
            'admin/home',
            'admin/wallet/home',
            'admin/user-management/change-password',
            'admin/user-management/users',
            'admin/wallet/search-subscriber',
            'admin/wallet/charge-config',
            'admin/wallet/operator-wallet',
            'admin/wallet/app-management',
            'admin/wallet/transaction-report',
            'admin/wallet/transaction-summary',
            'admin/wallet/stock-purchase-history'
        );
        this.roles.push(systemAdmin_role);

    }

    getUserRoles(): Array<UserRole> {
        return this.roles;
    }

    getUserRole(role: string): UserRole {
        for (const userRole of this.roles) {
            if (userRole.role === role) {
                return userRole;
            }
        }
        return null;
    }

}
