import { SsCoreModule } from './../../ss-core/ss-core.module';
import { CelebrityTypeService } from './../../services/celebrity-type.service';
import { ContentService } from './../../services/content.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryComponent } from './category/category.component';
import { RouterModule } from '@angular/router';
import {
  FileUploadModule, GrowlModule, OrderListModule, PickListModule, PanelModule,
  CheckboxModule, ListboxModule
} from 'primeng/primeng';
import { ReactiveFormsModule } from '@angular/forms';
import { EditCategoryComponent } from './edit-category/edit-category.component';
import { CategoryService } from 'app/services/category.service';
import { MapContentComponent } from './map-content/map-content.component';
import { OrderContentComponent } from './order-content/order-content.component';
import { CelebrityTypeSelectionComponent } from './celebrity-type-selection/celebrity-type-selection.component';

@NgModule({
  imports: [
    CommonModule,
    FileUploadModule,
    ReactiveFormsModule,
    GrowlModule,
    OrderListModule,
    PickListModule,
    CheckboxModule,
    PanelModule,
    ListboxModule,
    SsCoreModule,
    RouterModule.forChild([
      {
        path: '',
        redirectTo: 'Category',
        pathMatch: 'full',
      },
      {
        path: ':categoryType',
        component: CategoryComponent
      },
      {
        path: ':categoryType/add-category',
        component: EditCategoryComponent
      },
      {
        path: ':categoryType/edit-category/:categoryId',
        component: EditCategoryComponent
      }
    ])
  ],
  declarations: [
    CategoryComponent,
    EditCategoryComponent,
    MapContentComponent,
    OrderContentComponent,
    CelebrityTypeSelectionComponent,
  ],
  providers: [
    CategoryService,
    ContentService,
    CelebrityTypeService
  ]
})
export class CategoryModule { }
