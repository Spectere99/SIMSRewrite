import { Component, OnInit, Input } from '@angular/core';
import { CustomerContacts, Service } from './customer-contacts.service';
import { LookupService } from '../../_services/lookups.service';

@Component({
  selector: 'app-customer-contacts',
  templateUrl: './customer-contacts.component.html',
  styleUrls: ['./customer-contacts.component.css'],
  providers: [ Service ]
})
export class CustomerContactsComponent implements OnInit {
@Input() customer: any;
customerContact: CustomerContacts;
lookupDataSource: Array<any>;
personTypes: any;

  constructor(private customerService: Service, lookupService: LookupService) {
    /* const customerReturn = customerService.getCustomerContacts();
    if (customerReturn) {
      this.customerContact = customerReturn[0];
      console.log('customerContact', this.customerContact);
    } */
    this.customerContact = this.customer;
    lookupService.loadLookupData('').subscribe(res => {
      this.lookupDataSource = res.value;
      this.createPersonTypeDataSource();
    });
  }

  createPersonTypeDataSource() {
    this.personTypes = this.lookupDataSource.filter(item => item.class === 'CONT').sort(function(obj1, obj2) {
      // Ascending: first age less than the previous
      return obj1.order_by - obj2.order_by;
    });
    console.log('PersonTypes', this.personTypes);
  }
  ngOnInit() {
  }

}
