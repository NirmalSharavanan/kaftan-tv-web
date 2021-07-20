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
import { RealSessionStorageService } from 'app/common/service/real-session-storage.service';


@Injectable()
export class NavigateWithUrl {
    private navigateData: any;

    constructor(
        private sessionStorageService: RealSessionStorageService,
      ) { }

    setNavigateData(data) {
        this.navigateData = data;
        this.sessionStorageService.setSession("navigateData", JSON.stringify(this.navigateData));
    }

    getNavigateData() {
        if(!this.navigateData) {
            this.navigateData = JSON.parse(this.sessionStorageService.getSession("navigateData"));
        }
        return this.navigateData;
    }

}
