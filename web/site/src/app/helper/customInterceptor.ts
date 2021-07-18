import { ResponseBase } from './../models/responseBase';
import { UserService } from './../services/user.service';
import { Router } from '@angular/router';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AuthenticationService } from '../services/authentication.service';
import 'rxjs/add/operator/finally';
import 'rxjs/add/operator/do';
import { ServiceStatusService } from '../common/service/service-status.service';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { MessageService } from 'primeng/components/common/messageservice';
import { interval } from 'rxjs/observable/interval';


@Injectable()
export class CustomInterceptor implements HttpInterceptor {

    count: number = 0;
    lastUpdate: Date = new Date();
    authenticationService: AuthenticationService = this.injector.get(AuthenticationService);
    serviceStatus: ServiceStatusService = this.injector.get(ServiceStatusService);
    userService = this.injector.get(UserService);

    constructor(private injector: Injector, private router: Router) {
        // Every 28 minutes
        interval(1000 * 60 * 28)
            .debounceTime(5000)
            .subscribe((val) => {
                this.refreshJsonWebToken();
            });
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token: string = this.authenticationService.token;

        this.lastUpdate = new Date();

        // add it if we have one
        if (token) {
            req = req.clone({ headers: req.headers.set('x-auth-token', token) });
        }

        // if (!req.headers.has('Content-Type')) {
        //     req = req.clone({ headers: req.headers.set('Content-Type', 'application/json') });
        // }

        req = req.clone({ headers: req.headers.set('Accept', 'application/json') });

        // console.log(JSON.stringify(req.headers));
        const messageService = this.injector.get(MessageService);

        return next.handle(req)
            .do((request: HttpEvent<any>) => {
                if (request.type === 0) {
                    this.count++;
                }
                this.serviceStatus.changeState(true);
            })
            .catch((error: any) => {
                return this.handleError(error, messageService);
            })
            .finally(() => {
                this.count--;
                if (this.count === 0) {
                    this.serviceStatus.changeState(false);
                }
            });
    }

    private handleError(error: any, messageService: MessageService): ErrorObservable {
        // console.log(error);
        if (error.status === 403) {
            this.router.navigate(['/session/logout']);
        } else {
            messageService.add({ severity: 'error', summary: 'Internal Error !', detail: ' Please try again later.' });
        }
        return Observable.throw(error);
    }

    public refreshJsonWebToken() {
        if (!this.authenticationService.token) {
            return;
        }

        if ((new Date().getTime() - this.lastUpdate.getTime()) / 60000 <= 30) {
            console.log('Update token : ', (new Date().getTime() - this.lastUpdate.getTime()) / 60000);
            this.userService.keepAlive(this.authenticationService.token)
                .subscribe((newToken: ResponseBase) => {
                    this.authenticationService.token = newToken.message;
                });
        } else {
            console.log('time taken so far : ', (new Date().getTime() - this.lastUpdate.getTime()) / 60000, ' mins');
            //LOG OUT
        }
    }

}
