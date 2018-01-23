import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

export class PriceListItem {
    pricelist_id: number;
    order_by: number;
    pricelist_type: string;
    pricelist_description: string;
    pricelist_code: string;
    pricelist_price: string;
    taxable_ind: string;
    default_ind: string;
    created_by: string;
    created_date: string;
    updated_by: string;
    updated_date: string;
}

@Injectable()
export class PriceListService {
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
    loadPricelistData(userId): Observable<any> {
        return this.http.get(this.baseURL + '/Pricelist', {headers: this.getHeaders(userId)})
        .map((res: Response) => {
            // console.log(res.json());
            return res.json();
        });
    }
}

