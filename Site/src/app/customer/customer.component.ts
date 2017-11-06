import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {

  constructor() {
    //this.createCustomerDataSource();
   }

   createCustomerDataSource() {
      /* this.dataSource = {
        store: {
            type: 'odata',
            url: 'http://localhost:56543/odata/orders'
        },
        select: [
          'order_id',
          'customer_id',
          'reorder_ind',
          'order_number',
          'order_status',
          'ship_attn',
          'order_date',
          'order_type',
          'purchase_order',
          'order_due_date',
          'assigned_user_id',
          'taken_user_id',
          'est_begin_date',
          'act_begin_date',
          'est_complete_date',
          'act_complete_date',
          'shipped_date',
          'subtotal',
          'tax_rate',
          'tax_amount',
          'shipping',
          'total',
          'payments',
          'balance_due',
          'IMAGE_FILE',
          'BILL_ADDRESS_1',
          'BILL_ADDRESS_2',
          'BILL_CITY',
          'BILL_STATE',
          'BILL_ZIP',
          'SHIP_ADDRESS_1',
          'SHIP_ADDRESS_2',
          'SHIP_CITY',
          'SHIP_STATE',
          'SHIP_ZIP',
          'PRIORITY',
          'PERCENT_COMPLETE',
          'ship_carrier',
          'ship_tracking',
          'previous_order',
          'contact',
          'contact_email',
          'contact_phone1',
          'contact_phone1_ext',
          'contact_phone1_type',
          'contact_phone2',
          'contact_phone2_ext',
          'contact_phone2_type'
        ],
         filter: ['order_date', '>', this.filterDate]
     }; */
    }

  ngOnInit() {
  }

}
