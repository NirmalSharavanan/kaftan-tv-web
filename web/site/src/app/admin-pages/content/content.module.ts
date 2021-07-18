import { AwsModule } from './../../aws/aws.module';
import { SsCoreModule } from './../../ss-core/ss-core.module';
import { PlayerComponent } from './player/player.component';
import { CelebrityTypeService } from './../../services/celebrity-type.service';
import { ContentService } from './../../services/content.service';
import { CategoryService } from './../../services/category.service';
import { ContentComponent } from './content/content.component';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FileUploadModule, GrowlModule, OrderListModule, DataListModule, CheckboxModule, PanelModule, DialogModule, DropdownModule, ListboxModule, CalendarModule, InputMaskModule } from 'primeng/primeng';
import { ReactiveFormsModule } from '@angular/forms';
import { AddContentComponent } from './add-content/add-content.component';
import { AddEditContentComponent } from './add-edit-content/add-edit-content.component';
import { UploadAudioVideoComponent } from './upload-audio-video/upload-audio-video.component';
import { ContentManagementComponent } from './content-management/content-management.component';
import { BannerComponent } from './banner/banner.component';
import { AddBannerComponent } from './add-banner/add-banner.component';
import { HomeBannerService } from 'app/services/home-banner.service';
import { AddCelebrityTypeComponent } from './add-celebrity-type/add-celebrity-type.component';
import { CelebrityTypeComponent } from './celebrity-type/celebrity-type.component';

import { VgCoreModule } from 'videogular2/core';
import { VgControlsModule } from 'videogular2/controls';
import { VgOverlayPlayModule } from 'videogular2/overlay-play';
import { VgBufferingModule } from 'videogular2/buffering';
import { ContentRouting } from 'app/admin-pages/content/content.routing';
import { CategorySelectionComponent } from './category-selection/category-selection.component';
import { UploadContentComponent } from './upload-content/upload-content.component';

@NgModule({
  imports: [
    CommonModule,
    FileUploadModule,
    ReactiveFormsModule,
    GrowlModule,
    DataListModule,
    OrderListModule,
    CheckboxModule,
    PanelModule,
    DialogModule,
    DropdownModule,
    ListboxModule,
    CalendarModule,
    InputMaskModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
    SsCoreModule,
    AwsModule,
    RouterModule.forChild(ContentRouting)
  ],
  declarations: [
    ContentComponent,
    AddContentComponent,
    AddEditContentComponent,
    UploadAudioVideoComponent,
    ContentManagementComponent,
    BannerComponent,
    AddBannerComponent,
    AddCelebrityTypeComponent,
    CelebrityTypeComponent,
    PlayerComponent,
    CategorySelectionComponent,
    UploadContentComponent
  ],
  providers: [
    ContentService,
    HomeBannerService,
    CelebrityTypeService,
    CategoryService,
    DatePipe
  ]
})
export class ContentModule { }
