import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  dataSource: any;

  filterDate = new Date(2015, 1, 1);

    constructor() {
      this.dataSource = {
        store: {
            type: 'odata',
            url: 'http://localhost:56543/odata/orders'
        },
        select: [
          'order_id',
          'customer_id',
          'order_number',
          'order_type',
          'purchase_order',
          'order_date',
          'order_due_date',
          'order_status',
          'taken_user_id',
          'assigned_user_id',
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
          'reorder_ind',
          'ship_attn',
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
     };
    }
  ngOnInit() {
  }

}
