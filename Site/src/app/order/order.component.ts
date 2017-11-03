import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  dataSource: any;
  order_statusSource: any;
  order_typeSource: any;
  user_Source: any;

  filterDate = new Date(2008, 1, 1);

    constructor() {
      this.createOrderDataSource();

      this.order_statusSource = [
      {char_mod: 'inq', description: 'Quote'},
      {char_mod: 'inst', description: 'Invoiced'},
      {char_mod: 'qtat', description: 'Quote/Artwork'},
      {char_mod: 'ord', description: 'Order'},
      {char_mod: 'com', description: 'Completed'},
      {char_mod: 'clos', description: 'Closed'},
      {char_mod: 'can', description: 'Cancelled'} ];
     // this.createStatusDataSource();
      this.createOrderTypeDataSource();
    }

  createOrderDataSource() {
    this.dataSource = {
      store: {
          type: 'odata',
          url: 'http://localhost:56543/odata/orders'
      },
      expand: ['customer'],
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
        'contact_phone2_type',
        'customer/customer_name'
      ],
       //filter: ['order_date', '>', this.filterDate]
   };
  }

  createStatusDataSource() {
    this.order_statusSource = {
      store: {
          type: 'odata',
          url: 'http://localhost:56543/odata/LookupItems'
      },
      select: [
        'id',
        'class',
        'description',
        'char_mod'
      ],
      filter: ['class', 'eq', 'ord']
    };
  }

  createOrderTypeDataSource() {
    this.order_typeSource = {
      store: {
          type: 'odata',
          url: 'http://localhost:56543/odata/LookupItems'
      },
      select: [
        'id',
        'class',
        'description',
        'char_mod'
      ],
      filter: ['class', 'eq', 'otyps']
    };
  }
  convertToBooleanDisplay(value) {
    return value === 'Y';
  }
  ngOnInit() {
  }

}
