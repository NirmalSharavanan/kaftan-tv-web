import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';

import { AdminComponent } from './admin-pages/admin-layout/admin.component';
import { VideoPlayerComponent } from './ss-core/video-player/video-player.component';
import { AdminAuthGuard } from './admin-auth.guard';
import { RedirectComponent } from './ss-core/redirect/redirect.component';

export const AppRoutes: Routes = [{
  path: '',
  redirectTo: 'session',
  pathMatch: 'full',
},
{
  path: 'admin',
  canActivate: [AdminAuthGuard],
  loadChildren: './admin-pages/pages.module#PagesModule'
},
{
  path: 'session',
  loadChildren: './session/session.module#SessionModule'
},
{
  path: 'video/test',
  component: VideoPlayerComponent
},
{
  path: 'redirect',
  pathMatch: 'full',
  component: RedirectComponent

}
];

