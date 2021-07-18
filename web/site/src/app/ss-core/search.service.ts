import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class SearchService {

  private searchSubject: BehaviorSubject<boolean>;
  public searchStatus: Observable<boolean>;

  constructor() {
    // console.log('New service created');
    this.searchSubject = new BehaviorSubject<boolean>(false);
    this.searchStatus = this.searchSubject.asObservable();
  }

  // service command
  changeState(state: boolean) {
    this.searchSubject.next(state);
  }

  unSubscribe() {
    this.searchSubject.unsubscribe();
  }
}
