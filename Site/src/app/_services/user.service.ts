import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Http, Headers, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

export class User {
    user_id: number;
    login_id: string;
    manager_id: number;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    user_group: any[];
}

export class UserDTO {
    user_id: number;
    login_id: string;
    manager_id: string;
    password: string;
    login_attempt_count: number;
    first_name: string;
    last_name: string;
    email: string;
    status_code: string;
    language_code: string;
    wu_id: number;
    lookup_item_code: string;
    current_group: string;
    order_search_for: string;
    order_search_code: string;
    current_table: string;
    customer_search_for: string;
    customer_search_code: string;
    pass_change_1: string;
    pass_change_2: string;
    edit_email: string;
    edit_subject: string;
    edit_message: string;
    report_sel: number;
    corr_type: string;
    corr_disp: string;
    task_list_type: string;
    pricelist_type: string;
    active_order_ind: string;
    order_search_date: string;
    task_type_code: string;
    order_parent_search_for: number;
    order_type_search_for: string;
    assigned_to_search_for: number;
}

export class Group {
    hotjas_group_id: number;
    name: string;
    status_code: string;
    type_code: string;
}

export class UserGroupDTO {
    user_id: number;
    hotjas_group_id: number;
}

@Injectable()
export class UserService {
    // private baseURL = 'http://localhost:56543/odata';
    private baseURL = environment.odataEndpoint;
    public requestResult: Array<any>;
    public options: string;
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

    addUser(userId, user: UserDTO): Observable<any> {
        // Build customer odata Options
        // this.options = '(' + customerPersonId + ')';
        console.log('User in addUser', user);
        return this.http.post(this.baseURL + '/Users', user, {headers: this.getHeaders(userId) })
        .map((res: Response) => {
            // console.log(res.json());
            return res.json();
        });
    }
    updateUser(userId, user: UserDTO): Observable<any> {
        // Build customer odata Options
        this.options = '(' + user.user_id + ')';
        console.log('User in updateUser', user);
        return this.http.put(this.baseURL + '/Users' + this.options, user, {headers: this.getHeaders(userId) })
        .map((res: Response) => {
            // console.log(res.json());
            return res.json();
        });
    }

    addUserGroup(userId, userGroup: UserGroupDTO): Observable<any> {
        // Build customer odata Options
        // this.options = '(' + customerPersonId + ')';
        console.log('User in addUserGroup', userGroup);
        return this.http.post(this.baseURL + '/UserGroup', userGroup, {headers: this.getHeaders(userId) })
        .map((res: Response) => {
            // console.log(res.json());
            return res.json();
        });
    }
    deleteUserGroup(userId, usrId: number): Observable<any> {
        // Build customer odata Options
        this.options = '(' + usrId + ')';
        console.log('UserId in deleteUserGroup', usrId);
        return this.http.delete(this.baseURL + '/UserGroup' + this.options, {headers: this.getHeaders(userId) })
        .map((res: Response) => {
            // console.log(res.json());
            return res.json();
        });
    }
}
