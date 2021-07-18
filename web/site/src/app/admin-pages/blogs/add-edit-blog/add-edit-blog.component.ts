import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormGroupUtils } from './../../../common/utils/form-group-utils';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { MessageService } from 'primeng/components/common/messageservice';
import { Blog } from './../../../models/Blog';
import { BlogService } from './../../../services/blog.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import { map, catchError } from 'rxjs/operators';
declare var $;

@Component({
  selector: 'ss-add-edit-blog',
  templateUrl: './add-edit-blog.component.html',
  styleUrls: ['./add-edit-blog.component.scss']
})
export class AddEditBlogComponent implements OnInit {

  fg: FormGroup;
  blogId: string;
  blog: Blog;
  config = {
    callbacks: {
      onImageUpload: (files) => this.uploadImage(files)
    }
  };

  constructor(fb: FormBuilder, private router: Router, private activatedRoute: ActivatedRoute,
    private messageService: MessageService, private service: BlogService) {
      this.fg = fb.group({
        title: fb.control('', [Validators.required]),
        content: fb.control('', [Validators.required]),
      })
  }

  // upload image to aws s3 to avoid base 64 format image

  private async uploadImage(files) {
    var formData = new FormData();
    formData.append('image', files[0]);
    this.service.uploadImage(formData)
      .pipe(
        map((response: { path: string }) => response && typeof response.path === 'string' && response.path),
        catchError(e => { return e}))
      .subscribe(dataIn => {
        if (dataIn) {
          $('.summernote').summernote('insertImage', dataIn);
        } 
      }, (e) => {
        return e;
      });
  }
  

  ngOnInit() {
    this.activatedRoute.paramMap
      .map((value: ParamMap) => {
        return value.get("blogId");
      })
      .flatMap((blogId: string) => {
        if (blogId) {
          return this.service.getBlog(blogId);
        } else {
          return Observable.of(null);
        }
      })
      .subscribe((response: Blog) => {
        if (response) {
          this.blogId = response.id;
          FormGroupUtils.applyValue(this.fg, response);
        }
      })
  }

  onSubmit() {

    let blogObs: Observable<any>;
    if (this.blogId) {
      blogObs = this.service.updateBlog(this.fg.value, this.blogId);
    }
    else {
      blogObs = this.service.addBlog(this.fg.value);
    }
    blogObs.subscribe(
      (value: Blog) => {
        if (value.success) {
          this.router.navigate(['/admin/blogs/blog']);
        }
        else {
          this.messageService.add({ severity: 'error', summary: value.message, detail: '' });
        }
      });
  }

}
