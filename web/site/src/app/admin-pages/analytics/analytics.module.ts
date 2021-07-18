import { SsCoreModule } from './../../ss-core/ss-core.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DataListModule, PanelModule, DropdownModule, CalendarModule, EditorModule } from 'primeng/primeng';
import { GrowlModule, CheckboxModule } from 'primeng/primeng';
import { TableModule } from 'primeng/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContentUsageByUserComponent } from './content-usage-by-user/content-usage-by-user.component';
import { ContentUsageByMovieComponent } from './content-usage-by-movie/content-usage-by-movie.component';
import { ContentUsageTotalReportComponent } from './content-usage-total-report/content-usage-total-report.component';

@NgModule({
    imports: [
      CommonModule,
      FormsModule,
      DataListModule,
      GrowlModule,
      CheckboxModule,
      PanelModule,
      TableModule,
      DropdownModule,
      EditorModule,
      CalendarModule,
      ReactiveFormsModule,
      SsCoreModule,
      RouterModule.forChild([
               {
          path: 'content-usage-by-user',
          component: ContentUsageByUserComponent
        },
        {
          path: 'content-usage-by-movie',
          component: ContentUsageByMovieComponent
        },
        {
          path: 'content-usage-total-report',
          component: ContentUsageTotalReportComponent
        },
      ])
    ],
    declarations: [ ContentUsageByUserComponent, ContentUsageByMovieComponent, ContentUsageTotalReportComponent],
    providers: []
  })
  export class AnalyticsModule { }