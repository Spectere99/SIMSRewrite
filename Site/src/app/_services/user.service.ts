import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { ODataService } from '../_odata/odata.service';
import { RequestTypes } from '../_odata/odata.model';
import { IUrlOptions } from '../_odata/odata.model';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

export class User {
    userId: number;
    loginId: string;
}

@Injectable()
export class UserService {
    private baseURL = 'http://localhost:56543/odata';
    public requestResult: Array<any>;

    constructor( private http: Http ) { }

    private getHeaders(userId) {
        const headers = new Headers({ 'Accept': 'application/json' });
        headers.append('Content-Type', 'application/json; charset=UTF-8');
        headers.append('userid', userId);
        // headers.append('showInactive', this.showInactive.toString());
        return headers;
    }
    getUsers(userId): Observable<any> {
        return this.http.get(this.baseURL + '/Users', {headers: this.getHeaders(userId)})
        .map((res: Response) => {
            // console.log(res.json());
            return res.json();
        });
    }
}
