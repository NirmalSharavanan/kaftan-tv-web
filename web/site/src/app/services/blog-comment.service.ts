import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpService } from '../helper/httpService';
import { Observable } from 'rxjs/Observable';
import { RestAPI } from '../helper/api.constants';
import { ReOrder } from 'app/models/re-order';

@Injectable()
export class BlogCommentService extends HttpService {


  constructor(http: HttpClient) {
    super(http);
  }

  addBlog(blogId: string, comment: string) {
    return this.post(RestAPI.POST_BLOG_COMMENT + '/' + blogId + '/' + comment, null);
  }

  getBlog(blogId: string) {
    return this.get(RestAPI.GET_BLOG_COMMENT + '/' + blogId);
  }
}