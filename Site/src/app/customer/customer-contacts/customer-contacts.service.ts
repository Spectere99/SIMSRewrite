import { Injectable } from '@angular/core';

export class CustomerContacts {
    customer_id: number;
    person_type: string;
    first_name: string;
    last_name: string;
    email_address: string;
    phone_1: string;
    phone_1_type: string;
    phone_2: string;
    phone_2_type: string;
    phone_1_ext: string;
    phone_2_ext: string; }
const customerContact: CustomerContacts[] = [{
    'customer_id': 1,
    'person_type': 'primary',
    'first_name': 'Bob',
    'last_name': 'Newbie',
    'email_address': 'bobnewbie@mycompany.com',
    'phone_1': '803-111-2233',
    'phone_1_ext':  null,
    'phone_1_type': 'cell phone',
    'phone_2': '803-222-1133',
    'phone_2_ext': '1027',
    'phone_2_type': 'work phone'
}];

@Injectable()
export class Service {
    getCustomerContacts() {
        return customerContact;
    }
}
