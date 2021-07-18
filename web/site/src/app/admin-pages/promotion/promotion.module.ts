import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PromotionsComponent } from './promotions/promotions.component';
import { AddEditPromotionComponent } from './add-edit-promotion/add-edit-promotion.component';
import { SsCoreModule } from 'app/ss-core/ss-core.module';
import { PanelModule, OrderListModule, EditorModule, ListboxModule, FileUploadModule, GrowlModule, DataListModule, CheckboxModule, MultiSelectModule } from 'primeng/primeng';
import { ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';

@NgModule({
  imports: [
    CommonModule,
    SsCoreModule,
    PanelModule, OrderListModule, EditorModule,
    ListboxModule,
    FileUploadModule,
    ReactiveFormsModule,
    GrowlModule,
    DataListModule,
    CheckboxModule,
    MultiSelectModule,
    TableModule,
    RouterModule.forChild([
      {
          path: 'promotions',
          component: PromotionsComponent
      },
      {
          path: 'add-promotion',
          component: AddEditPromotionComponent
      },
      {
          path: 'edit-promotion/:promotionId',
          component: AddEditPromotionComponent
      },
  ])
  ],
  declarations: [
    PromotionsComponent,
    AddEditPromotionComponent
  ]
})
export class PromotionModule { }
