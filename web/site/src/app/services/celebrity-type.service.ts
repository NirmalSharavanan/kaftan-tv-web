import { RestAPI } from './../helper/api.constants';
import { HttpClient } from '@angular/common/http';
import { CelebrityType } from './../models/CelebrityType';
import { Injectable } from '@angular/core';
import { HttpService } from 'app/helper/httpService';

@Injectable()
export class CelebrityTypeService extends HttpService {

  constructor(http: HttpClient) {
    super(http);
  }
  getAllCelebrityType() {
    return this.get(RestAPI.GET_ALL_CELEBRIY_TYPE);
  }

  addCelebrityType(cebrityType: CelebrityType) {
    return this.post(RestAPI.POST_CREATE_CELEBRIY_TYPE, cebrityType);
  }

  getCelebrityType(celebrityTypeId: string) {
    return this.get(RestAPI.GET_CELEBRITY_TYPE + '/' + celebrityTypeId);
  }

  updateCelebrityType(cebrityType: CelebrityType) {
    return this.put(RestAPI.PUT_UPDATE_CELEBRIY_TYPE + '/' + cebrityType.id, cebrityType);
  }

}
