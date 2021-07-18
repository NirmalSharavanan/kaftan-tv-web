import { Injectable } from '@angular/core';

@Injectable()
export class SessionStorageService {

  constructor() { }

  setSession(name: string, value: any) {
    localStorage.setItem(name, value);
  }

  getSession(name: string) {
    if (localStorage.getItem(name)) {
      return localStorage.getItem(name);
    } else {
      return null;
    }
  }

}
