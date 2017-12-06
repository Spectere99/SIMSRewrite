import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { Order } from './order.service';

export class Customer {
    customer_id: number;
    customer_name: string;
    setup_date: string;
    setup_by: number;
    status_code: string;
    ship_to_bill_ind: string;
    website_url: string;
    account_number: string;
    override_validation_ind: string;
    parent_id: number;
    parent_ind: string;
    customer_address: CustomerAddress[];
    customer_contacts: CustomerPerson[];
    orders: Order[];
}
export class CustomerPerson {
    customer_person_id: number;
    customer_id: number;
    setup_date: string;
    person_type: string;
    first_name: string;
    last_name: string;
    email_address: string;
    address_1: string;
    address_2: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    phone_1: string;
    phone_1_type: string;
    phone_2: string;
    phone_2_type: string;
    ccnum: string;
    ccexp_date: string;
    ccverfcode: string;
    phone_1_ext: string;
    phone_2_ext: string;
}

export class CustomerAddress {
    customer_address_id: number;
    customer_id: number;
    type_code: string;
    address_1: string;
    address_2: string;
    city: string;
    state: string;
    zip: string;
}
@Injectable()
export class CustomerService {
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
    loadCustomerData(userId, customerId: number): Observable<any> {
        // Build customer odata Options
        const expandCmd = '?$expand=';
        const expandFields = 'customer_person,customer_address,orders';
        this.options = '(' + customerId + ')';
        this.options = this.options.concat(expandCmd, expandFields);

        return this.http.get(this.baseURL + '/customers' + this.options, {headers: this.getHeaders(userId)})
        .map((res: Response) => {
            // console.log(res.json());
            return res.json();
        });
    }

    addCustomerContact(userId, customerPerson: CustomerPerson): Observable<any> {
        // Build customer odata Options
        // this.options = '(' + customerPersonId + ')';
        console.log('CustomerPerson in addCustomerContact', customerPerson);
        return this.http.post(this.baseURL + '/CustomerPerson', customerPerson, {headers: this.getHeaders(userId) })
        .map((res: Response) => {
            // console.log(res.json());
            return res.json();
        });
    }

    updateCustomerContact(userId, customerPerson: CustomerPerson): Observable<any> {
        // Build customer odata Options
        this.options = '(' + customerPerson.customer_person_id + ')';

        return this.http.put(this.baseURL + '/CustomerPerson' + this.options, customerPerson, {headers: this.getHeaders(userId) })
        .map((res: Response) => {
            // console.log(res.json());
            return res.json();
        });
    }

    deleteCustomerContact(userId, customerPersonId: number): Observable<any> {
        // Build customer odata Options
        this.options = '(' + customerPersonId + ')';

        return this.http.delete(this.baseURL + '/CustomerPerson' + this.options, {headers: this.getHeaders(userId)})
        .map((res: Response) => {
            // console.log(res.json());
            return res.json();
        });
    }
}
