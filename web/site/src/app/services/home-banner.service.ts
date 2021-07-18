import { UrlUtils } from 'app/common/utils/url-utils';
import { HomeBanner } from './../models/home-banner';
import { HttpClient } from '@angular/common/http';
import { HttpService } from 'app/helper/httpService';
import { RestAPI } from './../helper/api.constants';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/publishReplay';
import { ReOrder } from 'app/models/re-order';

@Injectable()
export class HomeBannerService extends HttpService {

  allBanners: Observable<{}>;

  constructor(http: HttpClient) {
    super(http);
  }

  addBanner(formData: FormData) {
    return this.post(
      RestAPI.POST_CREATE_HOME_BANNER,
      formData);
  }

  deleteBanner(id: string) {
    return this.delete(RestAPI.DELETE_HOME_BANNER + '/' + id);
  }

  private loadBannersFromServer() {
    if (!this.allBanners) {
      this.allBanners = this.get(
        UrlUtils.formatUrl(RestAPI.GET_ALL_HOME_BANNER))
        .publishReplay(1)
        .refCount();
    }
  }

  getAllBanners(isCache: boolean) {
    if (isCache) {
      this.loadBannersFromServer();
      return this.allBanners;
    }
    else {
      return this.get(
        UrlUtils.formatUrl(RestAPI.GET_ALL_HOME_BANNER))
        .publishReplay(1)
        .refCount();
    }
  }

  reorder(ordered: ReOrder[]) {
    return this.put(
        UrlUtils.formatUrl(RestAPI.PUT_REORDER_BANNER),
        ordered);
}
}
