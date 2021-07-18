import { UserService } from './user.service';
import { JwtToken } from './../models/jwtToken';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/catch'
import { RestAPI } from '../helper/api.constants';
import { HttpService } from '../helper/httpService';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { User } from '../models/user';


@Injectable()
export class AuthenticationService {
    public token: string;
    public name: string;
    public is_premium: boolean;
    private authSubject = new BehaviorSubject<boolean>(false);
    isAutheticated: Observable<boolean>;


    constructor(private httpService: HttpService, private userService: UserService) {
        // set token if saved in local storage
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.token = currentUser && currentUser.token;
        this.isAutheticated = this.authSubject.asObservable();
        this.authSubject.next(this.token ? true : false);
    }

    login(email: string, password: string): Observable<JwtToken> {

        return this.httpService.post<JwtToken>(RestAPI.LOGIN, { email: email, password: password })
            .map((tokenObj: JwtToken) => {
                // login successful if there's a jwt token in the response

                if (tokenObj && tokenObj.success) {

                  // console.log(tokenObj);

                    // set token property
                    this.token = tokenObj.token;
                    this.name = tokenObj.name;
                    this.is_premium = tokenObj.is_premium;


                    // store username and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(tokenObj));
                    localStorage.setItem('userName', this.name);
                    localStorage.setItem('is_premium', this.is_premium ? 'true' : 'false');

                    this.userService.reloadUserInfo();

                    this.authSubject.next(true);

                    // return true to indicate successful login
                    return tokenObj;
                } else {
                    // return false to indicate failed login
                    return tokenObj;
                }
            })
            .catch((error: any) => {
                // console.log(error);
                return Observable.of(null);
            });
    }

    loginByToken(token: string): Observable<JwtToken> {

        return this.userService.getUserByAccessToken(token)
            .map((tokenObj: JwtToken) => {
                // login successful if there's a jwt token in the response

                if (tokenObj && tokenObj.success) {

                    // console.log(tokenObj);

                    // set token property
                    this.token = tokenObj.token;
                    this.name = tokenObj.name;
                    this.is_premium = tokenObj.is_premium;

                    // store username and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(tokenObj));
                    localStorage.setItem('socialLogin', 'true');
                    localStorage.setItem('userName', this.name);
                    localStorage.setItem('is_premium', this.is_premium ? 'true' : 'false');

                    this.userService.reloadUserInfo();
                    
                    this.authSubject.next(true);

                    // return true to indicate successful login
                    return tokenObj;
                } else {
                    // return false to indicate failed login
                    return tokenObj;
                }
            })
            .catch((error: any) => {
                // console.log(error);
                return Observable.of(null);
            });
    }

    logout(): void {
        // clear token remove user from local storage to log user out
        this.token = null;
        localStorage.removeItem('currentUser');
        localStorage.removeItem('socialLogin');
        localStorage.removeItem('userName');
        localStorage.removeItem('is_premium');

        if (this.isSocialLogin()) {
            this.httpService.delete('/signin/facebook');
            this.httpService.delete('/signin/google');
        }

        localStorage.removeItem('socialLogin');
        this.authSubject.next(false);
    }

    isUserAuthenticated() {
        if (localStorage.getItem('currentUser')) {
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));

            if (currentUser && currentUser.token) {
                return this.userService.getLoggedInUser()
                    .map((user: User) => {
                        if (user) {
                            return true;
                        } else {
                            return false;
                        }
                    },
                        (error: any) => {
                            if (error.status = 403) {
                                this.logout();
                                return false;
                            } else { // need to check
                                return false;
                            }
                        }
                    ).flatMap(isUser => {
                        this.CheckAuthSubjectChanged(isUser);
                        return Observable.of(isUser);
                    })
            } else {
                this.CheckAuthSubjectChanged(false);
                return Observable.of(false);
            }
        } else {
            this.CheckAuthSubjectChanged(false);
            return Observable.of(false);
        }
    }

    CheckAuthSubjectChanged(newStatus: boolean) {
        if (this.authSubject.getValue() !== newStatus) {
            this.authSubject.next(newStatus);
        }
    }

    isPremiumUser() {
        if (localStorage.getItem('is_premium')) {
            const is_premium = localStorage.getItem('is_premium');

            if (is_premium && is_premium === 'true') {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    setIsPremium(isPremium: boolean) {
        this.is_premium = isPremium;
        localStorage.setItem('is_premium', this.is_premium ? 'true' : 'false');
    }

    isSocialLogin() {
        if (localStorage.getItem('socialLogin')) {
            const issocialLogin = localStorage.getItem('socialLogin');

            if (issocialLogin && issocialLogin === 'true') {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    getUserName() {
        if (localStorage.getItem('userName')) {
            return localStorage.getItem('userName');
        } else {
            return '';
        }
    }

    getUser() {
        if (localStorage.getItem('currentUser')) {
            return JSON.parse(localStorage.getItem('currentUser'));
        } else {
            return null;
        }
    }

}
