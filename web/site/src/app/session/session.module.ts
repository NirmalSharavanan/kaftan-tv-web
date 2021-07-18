import { SessionCustomInterceptor } from './sessionCustomInterceptor';
import { PaymentHomeComponent } from './pages/payment-home/payment-home.component';
import { SsCoreModule } from './../ss-core/ss-core.module';
import { SessionStorageService } from './../common/service/session-storage.service';
import { HomeBannerService } from './../services/home-banner.service';
import { LazyLoadDirective } from './../core/lazy-loading/lazy-load.directive';
import { CategoryService } from 'app/services/category.service';
import { HeaderComponent } from './template/header/header.component';
import { FooterComponent } from './template/footer/footer.component';
import { LayoutComponent } from './session-layout/layout.component';
import { AuthenticationService } from './../services/authentication.service';
import { ServiceStatusService } from './../common/service/service-status.service';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MdIconModule } from '@angular/material';
import { HttpModule, Http } from '@angular/http';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { OwlModule } from 'ngx-owl-carousel';
import { InternationalPhoneNumberModule } from 'ngx-international-phone-number';

import { LoginComponent } from './user/login/login.component';
import { ForgotPasswordComponent } from './user/forgot-password/forgot-password.component';
import { LockScreenComponent } from './user/lockscreen/lockscreen.component';

import { VgCoreModule } from 'videogular2/core';
import { VgControlsModule } from 'videogular2/controls';
import { VgOverlayPlayModule } from 'videogular2/overlay-play';
import { VgBufferingModule } from 'videogular2/buffering';

import { SessionRoutes } from './session.routing';
import { HttpService } from 'app/helper/httpService';
import { ResendEmailComponent } from 'app/session/user/resend-email/resend-email.component';
import { ResetPasswordComponent } from 'app/session/user/reset-password/reset-password.component';
import { SignupComponent } from 'app/session/user/signup/signup.component';
import { SingnupConfirmationComponent } from 'app/session/user/singnup-confirmation/singnup-confirmation.component';
import { UserActivationComponent } from 'app/session/user/user-activation/user-activation.component';
import { MainComponent } from 'app/session/template/main/main.component';
import { CategoryComponent } from 'app/session/template/category/category.component';
import { CategoryContentComponent } from 'app/session/template/category-content/category-content.component';
import { SecureHeaderComponent } from 'app/session/template/secure-header/secure-header.component';
import { HomeComponent } from 'app/session/pages/home/home.component';
import { CategoryHomeComponent } from 'app/session/pages/category-home/category-home.component';
import { LogoutComponent } from 'app/session/user/logout/logout.component';

import { DataListModule, DataGridModule, DialogModule } from 'primeng/primeng';
import { InViewportModule } from 'ng-in-viewport';
import { ContentService } from 'app/services/content.service';
import { LoadingComponent } from './template/loading/loading.component';
import { BannerComponent } from './template/banner/banner.component';
import { ContentComponent } from './template/content/content.component';
import { ContentThumbnailComponent } from './template/content-thumbnail/content-thumbnail.component';
import { ContentListComponent } from './template/content-list/content-list.component';
import { ContentHomeComponent } from './pages/content-home/content-home.component';
import { SocialComponent } from './template/social/social.component';
import { ContentCategoriesComponent } from './template/content-categories/content-categories.component';
import { CategoryInHeaderComponent } from './template/category-in-header/category-in-header.component';
import { PlayComponent } from './template/play/play.component';
import { PlayHomeComponent } from './pages/play-home/play-home.component';
import { HomeBannerComponent } from './template/home-banner/home-banner.component';
import { PlayerComponent } from './template/player/player.component';
import { InvalidUserComponent } from './template/invalid-user/invalid-user.component';
import { ChangePasswordComponent } from './user/change-password/change-password.component';
import { MyProfileComponent } from './user/my-profile/my-profile.component';
import { AccountMenuComponent } from './template/account-menu/account-menu.component';
import { MyFavoritesComponent } from './user/my-favorites/my-favorites.component';
import { StaticPageComponent } from './template/static-page/static-page.component';
import { StaticPagesService } from 'app/services/static-pages.service';
import { ThumbnailLoaderComponent } from './template/thumbnail-loader/thumbnail-loader.component';
import { ChannelThumbnailComponent } from './template/channel-thumbnail/channel-thumbnail.component';
import { ChannelPlayerComponent } from './template/channel-player/channel-player.component';
import { AddToPlaylistComponent } from './template/add-to-playlist/add-to-playlist.component';
import { MyPlaylistComponent } from './template/my-playlist/my-playlist.component';
import { PlaylistComponent } from './template/playlist/playlist.component';
import { HomeFeaturedComponent } from './template/home-featured/home-featured.component';
import { BlogService } from 'app/services/blog.service';
import { BlogsComponent } from './template/blogs/blogs.component';
import { BlogComponent } from './template/blog/blog.component';

import { BlogCommentService } from 'app/services/blog-comment.service';
import {SafehtmlPipe } from './../safepipe/safehtml.pipe';
import { SubscriptionService } from 'app/services/subscription.service';
import { EbsPaymentHomeComponent } from './pages/ebsPayment-home/ebsPayment-home.component';
import { PaymentCompletedComponent } from './pages/paymentCompleted/paymentCompleted.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MdIconModule,
    RouterModule.forChild(SessionRoutes),
    HttpModule,
    HttpClientModule,
    InViewportModule.forRoot(),
    DataListModule,
    DataGridModule,
    DialogModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
    SsCoreModule,
    OwlModule,
    InternationalPhoneNumberModule
  ],
  declarations: [
    LoginComponent,
    ForgotPasswordComponent,
    LockScreenComponent,
    HomeComponent,
    ResendEmailComponent,
    ResetPasswordComponent,
    SignupComponent,
    SingnupConfirmationComponent,
    UserActivationComponent,
    LayoutComponent,
    CategoryHomeComponent,
    HeaderComponent,
    FooterComponent,
    MainComponent,
    CategoryComponent,
    CategoryContentComponent,
    SecureHeaderComponent,
    LogoutComponent,
    LoadingComponent,
    BannerComponent,
    ContentComponent,
    ContentThumbnailComponent,
    ContentListComponent,
    LazyLoadDirective,
    ContentHomeComponent,
    SocialComponent,
    ContentCategoriesComponent,
    CategoryInHeaderComponent,
    PlayComponent,
    PlayHomeComponent,
    HomeBannerComponent,
    PlayerComponent,
    InvalidUserComponent,
    ChangePasswordComponent,
    MyProfileComponent,
    AccountMenuComponent,
    MyFavoritesComponent,
    PaymentHomeComponent,
    StaticPageComponent,
    ThumbnailLoaderComponent,
    ChannelThumbnailComponent,
    ChannelPlayerComponent,
    AddToPlaylistComponent,
    MyPlaylistComponent,
    PlaylistComponent,
    HomeFeaturedComponent,
    BlogComponent,
    BlogsComponent,
    SafehtmlPipe,
    EbsPaymentHomeComponent,
    PaymentCompletedComponent
  ],
  providers: [
    // MenuItems,
    // PageTitleService,
    // AuthGuard,
    //     AuthenticationService,
    //     UserService,
    HttpService,
    ServiceStatusService,
    CategoryService,
    ContentService,
    StaticPagesService,
    SessionStorageService,
    HomeBannerService,
    BlogService,
    BlogCommentService,
    SubscriptionService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: SessionCustomInterceptor,
      multi: true,
    },
  ],
})

export class SessionModule { }
