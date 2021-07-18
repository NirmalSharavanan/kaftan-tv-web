import { PaymentHomeComponent } from './pages/payment-home/payment-home.component';
import { PlayComponent } from './template/play/play.component';
import { LogoutComponent } from 'app/session/user/logout/logout.component';
import { LayoutComponent } from './session-layout/layout.component';
import { Routes } from '@angular/router';

import { LoginComponent } from './user/login/login.component';
import { ForgotPasswordComponent } from './user/forgot-password/forgot-password.component';
import { LockScreenComponent } from './user/lockscreen/lockscreen.component';
import { HomeComponent } from './pages/home/home.component';
import { SignupComponent } from 'app/session/user/signup/signup.component';
import { UserActivationComponent } from 'app/session/user/user-activation/user-activation.component';
import { ResetPasswordComponent } from 'app/session/user/reset-password/reset-password.component';
import { SingnupConfirmationComponent } from 'app/session/user/singnup-confirmation/singnup-confirmation.component';
import { ResendEmailComponent } from 'app/session/user/resend-email/resend-email.component';
import { CategoryHomeComponent } from 'app/session/pages/category-home/category-home.component';
import { ContentComponent } from 'app/session/template/content/content.component';
import { ContentHomeComponent } from 'app/session/pages/content-home/content-home.component';
import { PlayHomeComponent } from 'app/session/pages/play-home/play-home.component';
import { ChangePasswordComponent } from 'app/session/user/change-password/change-password.component';
import { MyProfileComponent } from './user/my-profile/my-profile.component';
import { MyFavoritesComponent } from './user/my-favorites/my-favorites.component';
import { StaticPageComponent } from 'app/session/template/static-page/static-page.component';
import { PlaylistComponent } from 'app/session/template/playlist/playlist.component';
import { BlogComponent } from 'app/session/template/blog/blog.component';
import { BlogsComponent } from 'app/session/template/blogs/blogs.component';
import { PaymentCompletedComponent } from 'app/session/pages/paymentCompleted/paymentCompleted.component';

export const SessionRoutes: Routes = [{
  path: '',
  redirectTo: 'home',
  pathMatch: 'full',
},
{
  path: '',
  component: LayoutComponent,
  children:
    [
      {
        path: 'home',
        component: HomeComponent
      },
      {
        path: 'category',
        component: CategoryHomeComponent
      },
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'signup',
        component: SignupComponent
      },
      {
        path: 'signup-confirmation',
        component: SingnupConfirmationComponent
      },
      {
        path: 'forgot-password',
        component: ForgotPasswordComponent
      },
      {
        path: 'user-activation',
        children: [
          { path: '**', component: UserActivationComponent },
        ]
      },
      {
        path: 'reset-password',
        children: [
          { path: '**', component: ResetPasswordComponent },
        ]
      },
      {
        path: 'resend-email',
        component: ResendEmailComponent
      },
      {
        path: 'change-password',
        component: ChangePasswordComponent
      },
      {
        path: 'my-profile',
        component: MyProfileComponent
      },
      {
        path: 'my-favorites',
        component: MyFavoritesComponent
      },
      {
        path: 'logout',
        component: LogoutComponent,
      },
      {
        path: 'category/:id',
        component: CategoryHomeComponent,
      },
      {
        path: 'content/:id',
        component: ContentHomeComponent,
        children: [
          {
            path: 'play',
            component: PlayHomeComponent
          }
        ]
      },
      {
        path: 'premium',
        component: PaymentHomeComponent,
      },
      {
        path: 'static/:pageUrl/:id',
        component: StaticPageComponent,
      },
      {
        path: 'playlist/:id',
        component: PlaylistComponent,
      },
      {
        path: 'blog',
        component: BlogsComponent
      },
      {
        path: 'blog/:id',
        component: BlogComponent
      },
      {
        path: 'paymentCompleted/:id',
        component: PaymentCompletedComponent
      }
    ]
},
  // {
  //   path: 'content/play/:id',
  //   component: PlayHomeComponent,
  // }
];
