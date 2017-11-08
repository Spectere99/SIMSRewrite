import { Injectable } from '@angular/core';

export class CustomerInfo {
    customer_id: number;
    customer_name: string;
    setup_date: string;
    setup_by: number;
    status_code: string;
    ship_to_bill_ind: boolean;
    website_url: string;
    account_number: string;
    override_validation_ind: boolean;
    parent_id: number;
    parent_ind: boolean;
}

const customerInfos: CustomerInfo[] = [{
    'customer_id': 1,
    'customer_name': 'My Company',
    'setup_date': '01/01/2017',
    'setup_by': 1,
    'status_code': 'act',
    'ship_to_bill_ind': true,
    'website_url': 'http://www.mycompany.com',
    'account_number': '12345',
    'override_validation_ind': true,
    'parent_id': null,
    'parent_ind': false
}];

@Injectable()
export class Service {
    getCustomerInfo() {
        return customerInfos;
    }
}
