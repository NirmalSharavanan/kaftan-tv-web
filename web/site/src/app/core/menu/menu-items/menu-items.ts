import { Injectable } from '@angular/core';
import { UserRolesService } from './../../../services/user-roles.service';
import { UserService } from './../../../services/user.service';
import { UserRole } from './../../../models/user-role';
import { User } from './../../../models/user';

export interface ChildrenItems {
  state: string;
  name: string;
  type?: string;
}

export interface Menu {
  state: string;
  name: string;
  type: string;
  icon: string;
  children?: ChildrenItems[];
}

const MENUITEMS: Menu[] = [
  {
    state: 'admin',
    name: 'KAFTANTV Dashboard',
    icon: 'dashboard',
    type: 'link',
    children: [{ state: 'admin/home', name: '' }]
  },
 
  {
    state: 'admin',
    name: 'KAFTANPAY Dashboard',
    type: 'paylink',
    icon: 'home',
    children: [
      { state: 'admin/wallet/home', name: '' }
    ]
  },
  {
    state: 'admin',
    name: 'Wallet Subscribers',
    type: 'sub',
    icon: 'persons',
    children: [
      { state: 'admin/wallet/search-subscriber', name: 'Search Subscriber' },
      { state: 'admin/wallet/charge-config', name: 'Charges Configuration' },
      { state: 'admin/wallet/operator-wallet', name: 'Create Operator/Biller Wallet' },
      { state: 'admin/wallet/app-management', name: 'App Menu/Services Mgmt' },
    ]
  },
  {
    state: 'admin',
    name: 'Wallet Reports',
    type: 'sub',
    icon: 'assessment',
    children: [
      { state: 'admin/wallet/transaction-report', name: 'Transaction Reports' },
      { state: 'admin/wallet/transaction-summary', name: 'Transaction Summary' },
      { state: 'admin/wallet/stock-purchase-history', name: 'Operator/Biller stock Purchase history' },
    ]
  },
  {
    state: 'admin',
    name: 'Home Page',
    type: 'sub',
    icon: 'home',
    children: [
      { state: 'admin/content/banner', name: 'Banner' },
      { state: 'admin/meta-data/HomeCategory', name: 'Category' },
      { state: 'admin/meta-data/Featured', name: 'Featured' },
      // { state: 'admin/settings/add-logo', name: 'Logo and Favicon' },
      { state: 'admin/settings/add-social-medialinks', name: 'Social Media Links' },
    ]
  },
  {
    state: 'admin',
    name: 'Meta Data',
    type: 'sub',
    icon: 'perm_media',
    children: [
      { state: 'admin/meta-data/Category', name: 'Category' },
      { state: 'admin/meta-data/Celebrity', name: 'Celebrity' },
      { state: 'admin/meta-data/Genre', name: 'Genre' },
      { state: 'admin/meta-data/PayPerView', name: 'Pay Per View' },
      { state: 'admin/meta-data/Channel', name: 'Channel' },
      { state: 'admin/meta-data/Radio', name: 'Radio' },
      //{ state: 'admin/page-meta-data/meta-data', name: 'SEO' },
    ]
  },
  {
    state: 'content',
    name: 'Media',
    type: 'sub',
    icon: 'video_library',
    children: [
      { state: 'admin/content/video', name: 'Video Content' },
      { state: 'admin/content/audio', name: 'Audio Content' },
      { state: 'admin/content/celebrityType', name: 'Celebrity Type' }
    ]
  },
  // {
  //   state: 'home-automation',
  //   name: 'Home Automation',
  //   type: 'sub',
  //   icon: 'wifi',
  //   children: [
  //     { state: 'admin/home-automation/device', name: 'Device' },
  //   ]
  // },
  {
    state: 'blogs',
    name: 'Blogs',
    type: 'sub',
    icon: 'library_books',
    children: [
      { state: 'admin/blogs/blog', name: 'Blogs' },
    ]
  },
  {
    state: 'notifications',
    name: 'Notifications',
    type: 'sub',
    icon: 'reply_all',
    children: [
      { state: 'admin/notifications/send-email', name: 'Email' },
      { state: 'admin/notifications/send-notification', name: 'Push Notifications' },
    ]
  },
  {
    state: 'subscription',
    name: 'Subscription',
    type: 'sub',
    icon: 'subscriptions',
    children: [
      { state: 'admin/subscription/subscriptionplan', name: 'Subscription Plan' },
    ]
  },
  // {
  //   state: 'promotion',
  //   name: 'Promotion',
  //   type: 'sub',
  //   icon: 'promotions',
  //   children: [
  //     { state: 'admin/promotion/promotions', name: 'Promotion' },
  //   ]
  // },
  {
    state: 'mobile-apps',
    name: 'Mobile Apps',
    type: 'sub',
    icon: 'phonelink_setup',
    children: [
      { state: 'admin/mobile-apps/app-update', name: 'App Updates' }
    ]
  },
  {
    state: 'admin',
    name: 'Analytics',
    type: 'sub',
    icon: 'assessment',
    children: [
      { state: 'admin/analytics/content-usage-by-user', name: 'Content Usage by User' },
      { state: 'admin/analytics/content-usage-by-movie', name: 'Content Usage by Movie' },
      { state: 'admin/analytics/content-usage-total-report', name: 'Content Usage Consolidated' }
    ]
  },
  {
    state: 'admin',
    name: 'User Management',
    type: 'sub',
    icon: 'person',
    children: [
      { state: 'admin/user-management/users', name: 'Admin Users' },
      { state: 'admin/user-management/sign-up-users', name: 'Signed Up Users' },
      { state: 'admin/user-management/change-password', name: 'Change Password' },
      // { state: 'admin/user-management/add-user', name: 'Add Admin User' },
    ]
  },
  {
    state: 'admin',
    name: 'Settings',
    type: 'sub',
    icon: 'settings',
    children: [
      { state: 'admin/settings/email', name: 'Email' },
      // { state: 'admin/settings/aws', name: 'AWS' },
      { state: 'admin/settings/social-signup', name: 'Social Signup' },
      { state: 'admin/settings/static-pages', name: 'Static Pages' },
      { state: 'admin/settings/payment-gateway', name: 'Payment Gateway' },
      { state: 'admin/settings/firebase-sdk', name: 'Firebase SDK' },
      { state: 'admin/settings/video-calling', name: 'Video Calling' },
      { state: 'admin/settings/cloud-messaging', name: 'Cloud Messaging' }
    ]
  },

];

@Injectable()
export class MenuItems {

  userRoles: Array<string>;
  menu: Menu[] = [];

  constructor(private userService: UserService, private userRolesService: UserRolesService) {
    this.init();
  }
  getAll(): Menu[] {
    return this.menu;
  }

  private init(): void {
    this.userService.getLoggedInUser()
      .subscribe((user: User) => {
        this.userRoles = user.authorities;
        this.createMenu();
      });
  }

  private createMenu() {
    // Reset
    this.menu = [];
    // Get all avialable states
    const validStates: Array<string> = [];
    this.userRolesService.getUserRoles().forEach((userRole: UserRole) => {
      if (this.userRoles && this.userRoles.includes(userRole.role)) {
        validStates.push(...userRole.states);
      }
    });

    // Iterate and create response menu
    MENUITEMS.forEach((value: Menu) => {
      const lvalue: Menu = Object.assign({}, value);
      lvalue.children = [];
      if (value.children) {
        value.children.forEach((child: ChildrenItems) => {
          if (validStates.includes(child.state)) {
            lvalue.children.push(child);
          }
        });
        if (lvalue.children && lvalue.children.length > 0) {
          this.menu.push(lvalue);
        }
      }
    });
  }
}
