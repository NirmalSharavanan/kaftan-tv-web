import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpService } from '../helper/httpService';
import { Observable } from 'rxjs/Observable';
import { RestAPI } from '../helper/api.constants';
import { ReOrder } from 'app/models/re-order';

@Injectable()
export class StaticPagesService extends HttpService {

  allPages: Observable<{}>;

  constructor(http: HttpClient) {
    super(http);
  }

  //Admin
  getStaticPagesForAdmin() {
    return this.get(RestAPI.GET_ALL_STATIC_PAGES_FOR_ADMIN);
  }

  addStaticPage(formData: FormData) {
    return this.post(RestAPI.POST_NEW_STATIC_PAGE, formData);
  }

  getStaticPage(staticPageId: string) {
    return this.get(RestAPI.GET_STATIC_PAGE_FOR_ADMIN + '/' + staticPageId);
  }

  updateStaticPage(formData: FormData, staticPageId: string) {
    return this.put(RestAPI.PUT_STATIC_PAGE + '/' + staticPageId, formData);
  }

  deleteStaticPage(staticPageId: string) {
    return this.delete(RestAPI.DELETE_STATIC_PAGE + '/' + staticPageId);
  }

  reorderPages(ordered: ReOrder[]) {
    return this.put(RestAPI.PUT_STATIC_PAGES_RE_ORDER + '/re-order', ordered);
  }

  //User end
  getStaticPagesForUser() {
    if (!this.allPages) {
      this.allPages = this.get(RestAPI.GET_ALL_STATIC_PAGES_FOR_USER)
        .publishReplay(1)
        .refCount();
    }
    return this.allPages;
  }

  getStaticPageForUser(staticPageUrl: string) {
    return this.get(RestAPI.GET_STATIC_PAGE_FOR_USER + '/' + staticPageUrl);
  }

}
