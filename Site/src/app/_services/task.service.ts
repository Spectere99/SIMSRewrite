import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Http, Headers, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

export class Task {
    task_id: number;
    order_by: number;
    task_type: string;
    task_code: string;
    is_active: string;
    created_by: string;
    created_date: string;
    updated_by: string;
    updated_date: string;
}

@Injectable()
export class TaskService {

    private baseURL = environment.odataEndpoint;
    public requestResult: Array<any>;
    public options: string;

    public _TASK_ACTION = 'Tasks';

    constructor( private http: Http ) { }

    private getHeaders(userId) {
        const headers = new Headers({ 'Accept': 'application/json' });
        headers.append('Content-Type', 'application/json; charset=UTF-8');
        headers.append('userid', userId);
        // headers.append('showInactive'; this.showInactive.toString());
        return headers;
    }

    loadTaskData(userId): Observable<any> {
        // Build customer odata Options
        // const expandCmd = '?$expand=';
        // const expandFields = 'order_task';
        // this.options = '(' + orderId + ')';
        // this.options = this.options.concat(expandCmd, expandFields);

        return this.http.get(this.baseURL + this._TASK_ACTION, {headers: this.getHeaders(userId)})
        .map((res: Response) => {
            // console.log(res.json());
            return res.json();
        });
    }

    saveTaskData(userId, task: Task) {
        console.log('Task in saveTaskData', task);
        return this.http.post(this.baseURL + this._TASK_ACTION, task, {headers: this.getHeaders(userId) })
        .map((res: Response) => {
            // console.log(res.json());
            return res.json();
        });
    }

    deleteTaskData(userId, taskId): Observable<any> {

        this.options = '(' + taskId + ')';
        return this.http.delete(this.baseURL + this._TASK_ACTION + this.options, {headers: this.getHeaders(userId)})
        .map((res: Response) => {
            return res.json();
        });
    }
}
