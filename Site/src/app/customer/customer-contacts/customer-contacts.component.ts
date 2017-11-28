import { Component, OnInit, Input } from '@angular/core';
import { CustomerContacts, Service } from './customer-contacts.service';
import { LookupService, LookupItem } from '../../_services/lookups.service';
import { Customer, CustomerPerson } from '../../_services/customer.service';

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
      console.log('customerContact', this.customer);
    } }

    showValues() {
      console.log('customer', this.customer);
    }

    addContact() {
      const newCustomerPerson = new CustomerPerson;
      if (this.customer.customer_person !== undefined) {
        this.customer.customer_person.unshift(newCustomerPerson);
      } else {
        this.customer.customer_person = [newCustomerPerson];
      }
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
