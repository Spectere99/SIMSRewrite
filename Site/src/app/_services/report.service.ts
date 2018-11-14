import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Http, Headers, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';


@Injectable()
export class ReportingService {
    private baseURL = environment.reportingEndpoint;

    constructor( private http: Http ) { }

    private getHeaders(userId, orderDate) {
        const headers = new Headers({ 'Accept': 'application/json' });
        headers.append('Content-Type', 'application/json; charset=UTF-8');
        headers.append('userid', userId);
        if (orderDate) {
            headers.append('orderDate', orderDate);    
        }
        // headers.append('showInactive', this.showInactive.toString());
        return headers;
    }
    getOrderBalanceData(userId, orderDate): Observable<any> {
        return this.http.get(this.baseURL + 'Reporting', {headers: this.getHeaders(userId, orderDate)})
        .map((res: Response) => {
            // console.log(res.json());
            return res.json();
        });
    }

    getOrderQuantityData(userId): Observable<any> {
        return this.http.get(this.baseURL + 'OrderQuantitiesRollup', {headers: this.getHeaders(userId, undefined)})
        .map((res: Response) => {
            // console.log(res.json());
            return res.json();
        });
    }


}
