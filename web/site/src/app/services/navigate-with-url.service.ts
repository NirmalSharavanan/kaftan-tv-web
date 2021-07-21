import { UserService } from './user.service';
import { JwtToken } from '../models/jwtToken';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/catch'
import { RestAPI } from '../helper/api.constants';
import { HttpService } from '../helper/httpService';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { User } from '../models/user';
import { SessionStorageService } from 'app/common/service/session-storage.service';


@Injectable()
export class NavigateWithUrl {
    private navigateData: any = {};

    constructor(
        private sessionStorageService: SessionStorageService,
      ) { }

    setNavigateData(data) {
        this.navigateData[data.url] = data;
        this.sessionStorageService.setSession("navigateData", JSON.stringify(this.navigateData));
    }

    getNavigateData(name:string) {
        if(!this.navigateData[name]) {
            this.navigateData = JSON.parse(this.sessionStorageService.getSession("navigateData"));
        }
        return this.navigateData[name];
    }

}
