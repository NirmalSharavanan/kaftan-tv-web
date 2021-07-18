import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DataTableModule, DataListModule, PanelModule } from 'primeng/primeng';
import { ReactiveFormsModule } from '@angular/forms';
import { PageMetaDataService } from './../../services/page-meta-data.service';
import { AddMetaDataComponent } from './add-meta-data/add-meta-data.component';
import { MetaDataComponent } from './meta-data/meta-data.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DataTableModule,
    DataListModule,
    PanelModule,
    RouterModule.forChild([
      {
        path: 'meta-data',
        component: MetaDataComponent
      },
      {
        path: 'add-meta-data',
        component: AddMetaDataComponent
      }
    ])
  ],
  declarations: [
    AddMetaDataComponent,
    MetaDataComponent
  ],
  providers: [PageMetaDataService]
})
export class PageMetaDataModule { }
