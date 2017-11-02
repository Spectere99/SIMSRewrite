import { Injectable } from '@angular/core';

import { Http, RequestOptionsArgs, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { IUrlOptions, RequestTypes } from './odata.model';

@Injectable()
export class ODataService {

    constructor(
        private host: string,
        private http: Http
    ) { }

    private constructUrl(urlOptions: IUrlOptions): string {
        return this.host + urlOptions.restOfUrl;
    }

    // T specifies a generic output of function
    public Request<T>(requestType: RequestTypes, urlOptions: IUrlOptions, body?: any, options?: RequestOptionsArgs): Observable<T> {
        let response: Observable<Response>;
        // True in case of post, put and patch
        if (body && options) {
            response = this.http[RequestTypes[requestType]](
                this.constructUrl(urlOptions),
                body,
                options);
        }
        // True in case of post, put and patch if options is empty
        if (body) {
            response = this.http[RequestTypes[requestType]](
                this.constructUrl(urlOptions),
                body);
        }
        // True in case of get, delete, head and options
        if (options) {
            response = this.http[RequestTypes[requestType]](
                this.constructUrl(urlOptions),
                options);
        }
        // True in case of get, delete, head and options, if options is empty
        else {
            response = this.http[RequestTypes[requestType]](
                this.constructUrl(urlOptions),
                options);
        }

        return response.map((res) => <T>res.json());
    }
}
