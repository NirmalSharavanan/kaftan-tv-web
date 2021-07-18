import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/components/common/messageservice';
import { ArrayUtils } from 'app/common/utils/array-utils';
import { ResponseBase } from './../../../models/responseBase';
import { Blog } from './../../../models/Blog';
import { BlogService } from './../../../services/blog.service';

@Component({
  selector: 'ss-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {

  blogs: Blog[];

  //Delete Blog
  displaydialog: boolean;
  blogId: string;

  //reOrder
  orgOrder: string[];
  isSaveEnabled: boolean;

  constructor(private service: BlogService, private messageService: MessageService) { }

  ngOnInit() {
    this.init();
  }

  private init() {
    this.service.getAllBlogs(false).subscribe((blogs: Blog[]) => {
      if (blogs) {
        this.blogs = blogs;
        this.orgOrder = this.blogs.map((blog: Blog) => blog.id);
      }
    })
  }

  private showDeleteDialog(blogId) {
    this.displaydialog = true;
    this.blogId = blogId;
  }

  deleteBlog(blogId) {
    this.displaydialog = false;
    this.service.deleteBlog(blogId)
      .subscribe((response: any) => {
        if (response) {
          if (response.success) {
            this.init();
            this.messageService.add({ severity: 'info', summary: "Blog deleted successfully!!", detail: '' });
          }
        }
      });
  }

  enableSave() {
    this.isSaveEnabled = true;
  }

  onReorder() {
    this.service.reorderBlogs(ArrayUtils.reOrderInput(this.blogs, this.orgOrder))
      .subscribe((response: ResponseBase) => {
        if (response.success) {
          this.isSaveEnabled = false;
          this.init();
          this.messageService.add({ severity: 'success', summary: 'Re-Ordering Successful!', detail: response.message });
        } else {
          this.messageService.add({ severity: 'error', summary: 'Re-Ordering Failed!', detail: response.message });
        }
      });
  }


}
