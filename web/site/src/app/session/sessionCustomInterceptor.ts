import { CustomInterceptor } from './../helper/customInterceptor';
import { interval } from 'rxjs/observable/interval';
import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';



@Injectable()
export class SessionCustomInterceptor extends CustomInterceptor {

    constructor(private sessionInjector: Injector, private sessionRouter: Router) {

        super(sessionInjector, sessionRouter);
        // Every 28 minutes
        interval(1000 * 60 * 28)
            .debounceTime(5000)
            .subscribe((val) => {
                this.refreshJsonWebToken();
            });
    }

}
