import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Http, HttpModule, Headers, Response } from '@angular/http';
import { LookupService } from '../../_services/lookups.service';
import { UserService } from '../../_services/user.service';
import { Order } from '../../_services/order.service';

@Component({
  selector: 'app-customer-order-list',
  templateUrl: './customer-order-list.component.html',
  styleUrls: ['./customer-order-list.component.scss']
})
export class CustomerOrderListComponent implements OnInit {
@Input() customer;
baseUrl = environment.odataEndpoint;
defaultArtFolder = environment.defaultArtFolder;
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
      // console.log('lookupDataSource', this.lookupDataSource);
      this.createStatusDataSource();
      this.createOrderTypeDataSource();
    });

    userService.getUsers('').subscribe(res => {
      this.user_Source = res.value;
      // console.log('userDataSource', this.user_Source);
    });

   }

  createOrderDataSource() {
    // console.log('Current Customer for Order pull', this.customer);
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

  createNewOrder(customer_id) {
    // console.log('Creating Order!!!', customer_id);
    this.selectedOrder = new Order();
    this.selectedOrder.order_id = 0;
    this.selectedOrder.customer_id = customer_id;
    const today = new Date();
    this.selectedOrder.order_number = this.formatOrderNumber(today);
    this.selectedOrder.order_date = today;
    this.setOrderContact();
    this.setOrderBillAndShipAddresses();
    // this.selectedOrder.ship_attn = this.customer
    this.popupVisible = true;
  }
  setOrderContact() {
    this.selectedOrder.contact = this.customer.customer_person[0].first_name + ' ' + this.customer.customer_person[0].last_name;
    this.selectedOrder.contact_email = this.customer.customer_person[0].email_address;
    this.selectedOrder.contact_email = this.customer.customer_person[0].email_address;
    this.selectedOrder.contact_phone1 = this.customer.customer_person[0].phone_1;
    this.selectedOrder.contact_phone1_ext = this.customer.customer_person[0].phone_1_ext;
    this.selectedOrder.contact_phone1_type = this.customer.customer_person[0].phone_1_type;
    this.selectedOrder.contact_phone2 = this.customer.customer_person[0].phone_2;
    this.selectedOrder.contact_phone2_ext = this.customer.customer_person[0].phone_2_ext;
    this.selectedOrder.contact_phone2_type = this.customer.customer_person[0].phone_2_type;
  }
  setOrderBillAndShipAddresses() {
    // Get the Billing Address if available
    console.log('setBillingAndShipmentAddress', this.customer);
    const billingAddress = this.customer.customer_address.filter(item => item.type_code === 'bill');
    this.selectedOrder.ship_attn = this.customer.customer_name;
    if (billingAddress) {
      console.log('Billing Adr', billingAddress[0]);
      this.selectedOrder.BILL_ADDRESS_1 = billingAddress[0].address_1;
      this.selectedOrder.BILL_ADDRESS_2 = billingAddress[0].address_2;
      this.selectedOrder.BILL_CITY = billingAddress[0].city;
      this.selectedOrder.BILL_STATE = billingAddress[0].state;
      this.selectedOrder.BILL_ZIP = billingAddress[0].zip;
      if (this.customer.ship_to_bill_ind === 'Y') {
        this.selectedOrder.SHIP_ADDRESS_1 = billingAddress[0].address_1;
        this.selectedOrder.SHIP_ADDRESS_2 = billingAddress[0].address_2;
        this.selectedOrder.SHIP_CITY = billingAddress[0].city;
        this.selectedOrder.SHIP_STATE = billingAddress[0].state;
        this.selectedOrder.SHIP_ZIP = billingAddress[0].zip;
      } else {
        const shippingAddress = this.customer.customer_address.filter(item => item.type_code === 'ship');
        if (shippingAddress) {
          this.selectedOrder.SHIP_ADDRESS_1 = shippingAddress[0].address_1;
          this.selectedOrder.SHIP_ADDRESS_2 = shippingAddress[0].address_2;
          this.selectedOrder.SHIP_CITY = shippingAddress[0].city;
          this.selectedOrder.SHIP_STATE = shippingAddress[0].state;
          this.selectedOrder.SHIP_ZIP = shippingAddress[0].zip;
        }
      }
    }
  }

  formatOrderNumber(today): string {
    let dd = today.getDate();
    let mm = (today.getMonth() + 1); // January is 0!
    const yyyy = today.getFullYear().toString();
    if (dd < 10) {
      dd = '0' + dd;
    }
    if (mm < 10) {
      mm = '0' + mm;
    }
    return mm + dd + yyyy;
  }

  showValues() {
    console.log('Showing Order Values', this.selectedOrder);
  }

  selectionChanged(e) {
    this.selectedOrder = e.selectedRowsData[0];
    // console.log('In selectionChanged', this.selectedOrder);
  }
  setReorderInd(data) {
    if (data === undefined) { return false; }
    return data.reorder_ind === 'Y';
  }
  showEditPopup(e) {
    // e.cancel = true;
    // console.log('E', e);
    this.selectedOrder = e.data;
    // console.log('Selected Order', this.selectedOrder);
    // alert('Editing!');

    this.popupVisible = true;
  }

  ngOnInit() {
    if (this.customer) {
      this.customerId = this.customer.customer_id;
    }
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnChanges() {
    if (this.customer) {
      this.customerId = this.customer.customer_id;
    }
    this.createOrderDataSource();
  }

}
