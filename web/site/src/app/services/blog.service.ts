import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpService } from '../helper/httpService';
import { Observable } from 'rxjs/Observable';
import { RestAPI } from '../helper/api.constants';
import { ReOrder } from 'app/models/re-order';

@Injectable()
export class BlogService extends HttpService {

  allBlogs: Observable<{}>;

  constructor(http: HttpClient) {
    super(http);
  }

  private loadBlogsFromServer() {
    if (!this.allBlogs) {
      this.allBlogs = this.get(RestAPI.GET_ALL_BLOGS)
        .publishReplay(1)
        .refCount();
    }
  }

  getAllBlogs(isCache: boolean) {
    if (isCache) {
      this.loadBlogsFromServer();
      return this.allBlogs;
    }
    else {
      return this.get(RestAPI.GET_ALL_BLOGS);
    }
  }

  addBlog(formData: FormData) {
    return this.post(RestAPI.POST_BLOG, formData);
  }

  getBlog(blogId: string) {
    return this.get(RestAPI.GET_BLOG + '/' + blogId);
  }

  updateBlog(formData: FormData, blogId: string) {
    return this.put(RestAPI.PUT_BLOG + '/' + blogId, formData);
  }

  uploadImage(formData: FormData) {
    return this.post(RestAPI.POST_IMAGE, formData);
  }

  deleteBlog(blogId: string) {
    return this.delete(RestAPI.DELETE_BLOG + '/' + blogId);
  }

  reorderBlogs(ordered: ReOrder[]) {
    return this.put(RestAPI.PUT_BLOG_RE_ORDER, ordered);
  }
}
