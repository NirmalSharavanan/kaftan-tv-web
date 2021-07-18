
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ApplicationException } from '../common/exception/application-exception';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';


@Injectable()
export class HttpService {

    constructor(private http: HttpClient) {

    }

    public get<T>(actionUrl: string): Observable<T> {
        return this.http.get<T>(actionUrl).catch(this.handleError);
    }

    public getSingle<T>(actionUrl: string, id: number): Observable<T> {
        return this.http.get<T>(this.getPath(actionUrl) + id).catch(this.handleError);
    }


    public post<T>(actionUrl: string, itemName: any, options?: any): Observable<T> {
        //const toAdd = JSON.stringify({ ItemName: itemName });

        return this.http.post<T>(actionUrl, itemName, options).catch(this.handleError);
    }

    public put<T>(actionUrl: string, itemName: any, options?: any): Observable<T> {
        return this.http.put<T>(actionUrl, itemName, options).catch(this.handleError);
    }

    public update<T>(actionUrl: string, id: number, itemToUpdate: any): Observable<T> {
        return this.http
            .put<T>(this.getPath(actionUrl) + id, itemToUpdate).catch(this.handleError);
    }

    public delete<T>(actionUrl: string): Observable<T> {
        return this.http.delete<T>(actionUrl).catch(this.handleError);
    }

    public deleteSingle<T>(actionUrl: string, id: number): Observable<T> {
        return this.http.delete<T>(this.getPath(actionUrl) + id).catch(this.handleError);
    }

    private getPath(actionUrl: string) {
        if (actionUrl && !actionUrl.endsWith('/')) {
            actionUrl = actionUrl + '/';
            return actionUrl;
        } else {
            return '';
        }


    }
    private handleError(error: any): ErrorObservable {
        return Observable.throw(error);
    }
}

