import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpService } from '../helper/httpService';
import { Observable } from 'rxjs/Observable';
import { RestAPI } from '../helper/api.constants';
import { ReOrder } from 'app/models/re-order';

@Injectable()
export class DeviceService extends HttpService {

  constructor(http: HttpClient) {
    super(http);
  }

  getAllDeviceList() {
    return this.get(RestAPI.GET_ALL_DEVICE);
  }

  addDevice(formData: FormData) {
    return this.post(RestAPI.POST_DEVICE, formData);
  }

  getDevice(deviceId: string) {
    return this.get(RestAPI.GET_DEVICE + '/' + deviceId);
  }

  updateDevice(formData: FormData, deviceId: string) {
    return this.put(RestAPI.PUT_DEVICE + '/' + deviceId, formData);
  }

  reorderDevices(ordered: ReOrder[]) {
    return this.put(RestAPI.REORDER_DEVICE, ordered);
  }
}
