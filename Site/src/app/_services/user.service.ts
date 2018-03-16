import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Http, Headers, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

export class User {
    userId: number;
    loginId: string;
}

export class Group {
    hotjas_group_id: number;
    name: string;
    status_code: string;
    type_code: string;
}

@Injectable()
export class UserService {
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
    getUsers(userId): Observable<any> {
        return this.http.get(this.baseURL + '/Users', {headers: this.getHeaders(userId)})
        .map((res: Response) => {
            // console.log(res.json());
            return res.json();
        });
    }

    getGroups(userId): Observable<any> {
        return this.http.get(this.baseURL + '/Group', {headers: this.getHeaders(userId)})
        .map((res: Response) => {
            return res.json();
        });
    }
}
