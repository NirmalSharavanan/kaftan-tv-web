import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class ServiceStatusService {

  // Observable source
  private serviceStatus = new BehaviorSubject<boolean>(false);
  // Observable stream
  serviceState = this.serviceStatus.asObservable();

  constructor() { }

  unSubscribe() {
    this.serviceStatus.unsubscribe();
  }

  // service command
  changeState(state: boolean) {
    this.serviceStatus.next(state);
  }

}
