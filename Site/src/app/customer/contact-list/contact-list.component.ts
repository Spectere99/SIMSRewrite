import { Component, OnInit } from '@angular/core';
import { LookupService } from '../../_services/lookups.service';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  providers: [LookupService],
  styleUrls: ['./contact-list.component.css']
})
export class ContactListComponent implements OnInit {
dataSource: any;
lookupDataSource: any;
personTypes: any;

  constructor(lookupService: LookupService) {
    this.CreateContactDataSource();
    lookupService.loadLookupData('').subscribe(res => {
      this.lookupDataSource = res.value;
      this.createPersonTypeDataSource();
    });
  }


  CreateContactDataSource() {
    this.dataSource = {
      store: {
          type: 'odata',
          url: 'http://localhost:56543/odata/CustomerPerson'
      },
      expand: ['customers'],
      select: [
        'customer_person_id',
        'person_type',
        'first_name',
        'last_name',
        'email_address',
        'phone_1_type',
        'phone_1',
        'phone_1_ext',
        'phone_2_type',
        'phone_2',
        'phone_2_ext',
        'customers/customer_id',
        'customers/customer_name',
        'customers/setup_date',
        'customers/setup_by',
        'customers/status_code',
        'customers/ship_to_bill_ind',
        'customers/website_url',
        'customers/account_number',
        'customers/override_validation_ind',
        'customers/parent_id',
        'customers/parent_ind'
      ],
      //  filter: ['customer_address/type_code', '=', 'bill']
      // filter: ['order_date', '>', this.filterDate]
   };
  }

  createPersonTypeDataSource() {
    this.personTypes = this.lookupDataSource.filter(item => item.class === 'CONT');
  }

  ngOnInit() {
  }

}
