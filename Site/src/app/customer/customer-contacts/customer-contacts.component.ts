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
  ngOnInit() {
  }

}
