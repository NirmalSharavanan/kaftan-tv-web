import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpService } from '../helper/httpService';
import { RestAPI } from '../helper/api.constants';
import { PageMetaData } from '../models/page-meta-data';

@Injectable()
export class PageMetaDataService extends HttpService {

  constructor(http: HttpClient) {
    super(http);
  }

  addPageMetaData(pagemetadata: PageMetaData) {
    return this.post(RestAPI.POST_PAGE_META_DATA, pagemetadata);
  }

  getAllPageMetaData() {
    return this.get(RestAPI.GET_ALL_PAGE_META_DATA);
  }

  getPageMetaData(id: string) {
    return this.get(RestAPI.GET_PAGE_META_DATA + '/' + id);
  }

  updatePageMetaData(pagemetadata: PageMetaData) {
    return this.put(RestAPI.PUT_PAGE_META_DATA + '/' + pagemetadata.id, pagemetadata);
  }

  deletePageMetaData(pagemetadata: PageMetaData) {
    return this.delete(RestAPI.DELETE_PAGE_META_DATA + '/' + pagemetadata.id);
  }
}
