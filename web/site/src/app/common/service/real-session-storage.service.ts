import { Injectable } from '@angular/core';

@Injectable()
export class RealSessionStorageService {

  constructor() { }

  setSession(name: string, value: any) {
    sessionStorage.setItem(name, value);
  }

  getSession(name: string) {
    if (sessionStorage.getItem(name)) {
      return sessionStorage.getItem(name);
    } else {
      return null;
    }
  }

}
