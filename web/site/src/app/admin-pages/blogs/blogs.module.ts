import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SsCoreModule } from './../../ss-core/ss-core.module';
import { PanelModule, OrderListModule, EditorModule } from 'primeng/primeng';
import { NgxSummernoteModule } from 'ngx-summernote';
import { BlogService } from './../../services/blog.service';
import { BlogComponent } from './blog/blog.component';
import { AddEditBlogComponent } from './add-edit-blog/add-edit-blog.component';

@NgModule({
  imports: [
    CommonModule,
    SsCoreModule,
    PanelModule, OrderListModule, EditorModule,
    NgxSummernoteModule,
    RouterModule.forChild([
      {
        path: 'blog',
        component: BlogComponent
      },
      {
        path: 'add-blog',
        component: AddEditBlogComponent
      },
      {
        path: 'edit-blog/:blogId',
        component: AddEditBlogComponent
      },
    ])
  ],
  declarations: [
    BlogComponent,
    AddEditBlogComponent
  ],
  providers: [BlogService]
})
export class BlogsModule { }
