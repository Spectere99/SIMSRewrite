import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
import 'rxjs/add/operator/map';

export class LookupItem {
    id: number;
    class: string;
    char_mod: string;
    description: string;
    order_by: number;
}

@Injectable()
export class LookupService {
    // private baseURL = 'http://localhost:56543/odata';
    private baseURL = environment.odataEndpoint;
    public requestResult: Array<any>;

    constructor( private http: Http ) { }

    private getHeaders(userId) {
        const headers = new Headers({ 'Accept': 'application/json' });
        headers.append('Content-Type', 'application/json; charset=UTF-8');
        headers.append('userid', userId);
        // headers.append('showInactive', this.showInactive.toString());
        return headers;
    }
    loadLookupData(userId): Observable<any> {
        return this.http.get(this.baseURL + '/LookupItems', {headers: this.getHeaders(userId)})
        .map((res: Response) => {
            // console.log(res.json());
            return res.json();
        });
    }
}

