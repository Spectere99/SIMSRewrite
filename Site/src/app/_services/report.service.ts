import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Http, Headers, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';


@Injectable()
export class ReportingService {
    private baseURL = environment.reportingEndpoint;

    constructor( private http: Http ) { }

    private getHeaders(userId) {
        const headers = new Headers({ 'Accept': 'application/json' });
        headers.append('Content-Type', 'application/json; charset=UTF-8');
        headers.append('userid', userId);
        // headers.append('showInactive', this.showInactive.toString());
        return headers;
    }
    getOrderBalanceData(userId): Observable<any> {
        return this.http.get(this.baseURL + 'OrderReporting', {headers: this.getHeaders(userId, )})
        .map((res: Response) => {
            // console.log(res.json());
            return res.json();
        });
    }
}
