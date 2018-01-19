import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

export class Order {
    order_id: number;
    customer_id: number;
    order_number: string;
    order_type: string;
    purchase_order: string;
    order_date: string;
    order_due_date: string;
    order_status: string;
    taken_user_id: number;
    assigned_user_id: number;
    est_begin_date: string;
    act_begin_date: string;
    est_complete_date: string;
    act_complete_date: string;
    shipped_date: string;
    subtotal: number;
    tax_rate: number;
    tax_amount: number;
    shipping: number;
    total: number;
    payments: number;
    balance_due: number;
    IMAGE_FILE: string;
    BILL_ADDRESS_1: string;
    BILL_ADDRESS_2: string;
    BILL_CITY: string;
    BILL_STATE: string;
    BILL_ZIP: string;
    SHIP_ADDRESS_1: string;
    SHIP_ADDRESS_2: string;
    SHIP_CITY: string;
    SHIP_STATE: string;
    SHIP_ZIP: string;
    PRIORITY: number;
    PERCENT_COMPLETE: string;
    ship_carrier: null;
    ship_tracking: null;
    previous_order: null;
    reorder_ind: null;
    ship_attn: string;
    contact: string;
    contact_email: string;
    contact_phone1: string;
    contact_phone1_ext: string;
    contact_phone1_type: string;
    contact_phone2: string;
    contact_phone2_ext: string;
    contact_phone2_type: string;
}

export class OrderDetail {
    color: string;
}

@Injectable()
export class OrderService {
    private baseURL = 'http://localhost:56543/odata';
    public requestResult: Array<any>;
    public options: string;

    constructor( private http: Http ) { }

    private getHeaders(userId) {
        const headers = new Headers({ 'Accept': 'application/json' });
        headers.append('Content-Type', 'application/json; charset=UTF-8');
        headers.append('userid', userId);
        // headers.append('showInactive'; this.showInactive.toString());
        return headers;
    }

    loadOrderData(userId, orderId: number): Observable<any> {
        // Build customer odata Options
        const expandCmd = '?$expand=';
        const expandFields = 'order_detail';
        this.options = '(' + orderId + ')';
        this.options = this.options.concat(expandCmd, expandFields);

        return this.http.get(this.baseURL + '/orders' + this.options, {headers: this.getHeaders(userId)})
        .map((res: Response) => {
            // console.log(res.json());
            return res.json();
        });
    }

    loadArtPlacementData(userId, orderId: number): Observable<any> {
        // Build customer odata Options
        const expandCmd = '?$expand=';
        const expandFields = 'order_art_placement';
        this.options = '(' + orderId + ')';
        this.options = this.options.concat(expandCmd, expandFields);

        return this.http.get(this.baseURL + '/orders' + this.options, {headers: this.getHeaders(userId)})
        .map((res: Response) => {
            // console.log(res.json());
            return res.json();
        });
    }
}
