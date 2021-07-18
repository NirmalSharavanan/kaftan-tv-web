import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpService } from '../helper/httpService';
import { Observable } from 'rxjs/Observable';
import { RestAPI } from '../helper/api.constants';

@Injectable()
export class MobileAppService extends HttpService {

  constructor(http: HttpClient) {
    super(http);
  }

  getAppUpdates() {
    return this.get(RestAPI.GET_APP_UPDATES);
  }

  addAppUpdate(formData: FormData) {
    return this.post(RestAPI.POST_APP_UPDATE, formData);
  }

  getAppUpdate(appUpdateId: String) {
    return this.get(RestAPI.GET_APP_UPDATE + '/' + appUpdateId);
  }

  updateAppUpdate(formData: FormData, appUpdateId: String) {
    return this.put(RestAPI.PUT_APP_UPDATE + '/' + appUpdateId, formData);
  }
}
