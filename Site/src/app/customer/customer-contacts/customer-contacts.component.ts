import { Component, OnInit } from '@angular/core';
import { CustomerContacts, Service } from './customer-contacts.service';
@Component({
  selector: 'app-customer-contacts',
  templateUrl: './customer-contacts.component.html',
  styleUrls: ['./customer-contacts.component.css'],
  providers: [ Service ]
})
export class CustomerContactsComponent implements OnInit {
customerContact: CustomerContacts;
  constructor(private customerService: Service) {
    const customerReturn = customerService.getCustomerContacts();
    if (customerReturn) {
      this.customerContact = customerReturn[0];
      console.log('customerContact', this.customerContact);
    } }

  ngOnInit() {
  }

}
