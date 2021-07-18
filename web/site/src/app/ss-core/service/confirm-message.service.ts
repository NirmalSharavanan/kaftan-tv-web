import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ConfrimMessage } from '../model/confirm-message';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ConfirmMessageService {


  // Observable source
  private serviceStatus: BehaviorSubject<ConfrimMessage>;
  // Observable stream
  serviceState: Observable<ConfrimMessage>;

  constructor() {
    this.init();
  }

  // service command
  addMessage(message: ConfrimMessage) {
    this.serviceStatus.next(message);
  }

  reset() {
    this.init();
  }

  // TODO Memory leak needs to be checked
  init() {
    this.serviceStatus = new BehaviorSubject<ConfrimMessage>(null);
    this.serviceState = this.serviceStatus.asObservable();
  }

}


