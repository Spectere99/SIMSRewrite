import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Http, Headers, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

export class Correspondence {
    correspondence_id: number;
    customer_id: number;
    order_id: number;
    corr_date: string;
    corr_type: string;
    corr_disp: string;
    user_id: number;
    corr_filename: string;
    file_stream: string;
}

@Injectable()
export class CorrespondenceService {
    // private baseURL = 'http://localhost:56543/odata';
    private baseURL = environment.odataEndpoint;
    private docURL = environment.docUploadURL;
    public requestResult: Array<any>;
    public options: string;

    public _ORDER_ACTION = 'orders';

    constructor( private http: Http ) { }

    private getHeaders(userId) {
        const headers = new Headers({ 'Accept': 'application/json' });
        headers.append('Content-Type', 'application/json; charset=UTF-8');
        headers.append('userid', userId);
        // headers.append('showInactive', this.showInactive.toString());
        return headers;
    }

    getCorrespondenceData(userId: string, orderId: number): Observable<any> {
        const expandCmd = '?$expand=';
        const expandFields = 'correspondences';
        this.options = '(' + orderId + ')';
        this.options = this.options.concat(expandCmd, expandFields);
        return this.http.get(this.baseURL + this._ORDER_ACTION +  this.options, {headers: this.getHeaders(userId)})
        .map((res: Response) => {
            // console.log(res.json());
            return res.json();
        });
    }

    addCorrespondence(userId: string, correspondence: Correspondence): Observable<any> {
        // console.log('Correspondence', correspondence);
        return this.http.post(this.docURL, correspondence, {headers: this.getHeaders(userId) })
        .map((res: Response) => {
            // console.log('Correspondence return', res.json());
            return res.json();
        },
        err => console.log(err));
    }
}
