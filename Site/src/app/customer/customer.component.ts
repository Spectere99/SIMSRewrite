import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
dataSource: any;

  constructor() {
    this.CreateCustomerDataSource();
   }

  CreateCustomerDataSource() {
    this.dataSource = {
      store: {
          type: 'odata',
          url: 'http://localhost:56543/odata/customers'
      },
      //expand: ['customer_person'],
      select: [
        'customer_id',
        'customer_name',
        'setup_date',
        'setup_by',
        'status_code',
        'ship_to_bill_ind',
        'website_url',
        'account_number',
        'override_validation_ind',
        'parent_id',
        'parent_ind'
      ],
       //filter: ['order_date', '>', this.filterDate]
   };
  }
  ngOnInit() {
  }

}
