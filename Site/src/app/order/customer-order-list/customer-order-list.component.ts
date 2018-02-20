import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Http, HttpModule, Headers, Response } from '@angular/http';
import { LookupService } from '../../_services/lookups.service';
import { UserService } from '../../_services/user.service';

@Component({
  selector: 'app-customer-order-list',
  templateUrl: './customer-order-list.component.html',
  styleUrls: ['./customer-order-list.component.scss']
})
export class CustomerOrderListComponent implements OnInit {
@Input() customer;
baseUrl = environment.odataEndpoint;
dataSource: any;
popupVisible = false;
order_statusSource: any;
order_typeSource: any;
user_Source: any;
selectedOrder: any;
lookupDataSource: any;
customerId: number;


  constructor(private http: Http, lookupService: LookupService, userService: UserService) {

    lookupService.loadLookupData('').subscribe(res => {
      this.lookupDataSource = res.value;
      console.log('lookupDataSource', this.lookupDataSource);
      this.createStatusDataSource();
      this.createOrderTypeDataSource();
    });

    userService.getUsers('').subscribe(res => {
      this.user_Source = res.value;
      console.log('userDataSource', this.user_Source);
    });

   }

  createOrderDataSource() {
    console.log('Current Customer for Order pull', this.customer);
    this.dataSource = {
      store: {
          type: 'odata',
          url: this.baseUrl + 'orders'
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
      filter: ['customer_id', '=', this.customer.customer_id]
   };
  }
  createStatusDataSource() {

    this.order_statusSource = this.lookupDataSource.filter(item => item.class === 'ord');
  }

  createOrderTypeDataSource() {
    this.order_typeSource = this.lookupDataSource.filter(item => item.class === 'otyps');
  }
  selectionChanged(e) {
    this.selectedOrder = e.selectedRowsData[0];
    console.log('In selectionChanged', this.selectedOrder);
  }
  setReorderInd(data) {
    if (data === undefined) { return false; }
    return data.reorder_ind === 'Y';
  }
  showEditPopup(e) {
    // e.cancel = true;
    console.log('E', e);
    this.selectedOrder = e.data;
    console.log('Selected Order', this.selectedOrder);
    // alert('Editing!');

    this.popupVisible = true;
  }

  ngOnInit() {
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnChanges() {
    this.createOrderDataSource();
  }

}