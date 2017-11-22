import { Component, OnInit, Input } from '@angular/core';
import { CustomerContacts, Service } from './customer-contacts.service';
import { LookupService, LookupItem } from '../../_services/lookups.service';

@Component({
  selector: 'app-customer-contacts',
  templateUrl: './customer-contacts.component.html',
  styleUrls: ['./customer-contacts.component.css'],
  providers: [ Service ]
})
export class CustomerContactsComponent implements OnInit {
@Input() customer: any;
customerContacts: Array<CustomerContacts>;
phoneTypes: any;
personTypes: any;

  constructor(private customerService: Service, private lookupService: LookupService) {
    this.phoneTypes = lookupService.getPhoneTypes();
    this.personTypes = lookupService.getPersonTypes();
    const customerReturn = customerService.getCustomerContacts();
    if (customerReturn) {
      this.customerContacts = customerReturn;
      console.log('customerContact', this.customerContacts);
    } }

    showValues() {
      console.log('customer', this.customer);
    }

    addContact() {
      const newCustomer = {'customer_id': 1,
      'person_type': '',
      'first_name': '',
      'last_name': '',
      'email_address': '',
      'phone_1': '',
      'phone_1_ext':  null,
      'phone_1_type': '',
      'phone_2': '',
      'phone_2_ext': '',
      'phone_2_type': ''};
      this.customer.customer_person.unshift(newCustomer);
    }

    removeContact(customer) {
      const index: number = this.customer.customer_person.indexOf(customer);
      console.log('index found:', index);
      if (index !== -1) {
        this.customer.customer_person.splice(index, 1);
      }
    }
  ngOnInit() {
  }

}
