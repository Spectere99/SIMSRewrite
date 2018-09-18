import { Component, OnInit, OnChanges, Input, ViewChild } from '@angular/core';
import { Globals } from '../../globals';
import { GlobalDataProvider } from '../../_providers/global-data.provider';
import { Customer, CustomerService } from '../../_services/customer.service';
import { AuthenticationService } from '../../_services/authentication.service';
import { OrderService, Order, OrderDetail, OrderStatusHistory } from '../../_services/order.service';
import { StateService, StateInfo } from '../../_shared/states.service';
import { OrderTaskListComponent } from '../order-task-list/order-task-list.component';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA,
  MatSnackBar } from '@angular/material';
import { WindowRef } from '../../_services/window-ref.service';

@Component({
  selector: 'app-order-info',
  templateUrl: './order-info.component.html',
  styleUrls: ['./order-info.component.scss'],
  providers: [CustomerService, OrderService, StateService]
})
export class OrderInfoComponent implements OnInit, OnChanges {
  @Input() currentOrder: Order;
  @Input() customer: Customer;
  @Input() taskList: OrderTaskListComponent;
  orderCustomer: any;
  lookupDataSource: any;
  contactPersons: any;
  stateList: any;
  phoneTypes: any;
  orderTypes: any;
  statusTypes: any;
  userDataSource: any;

  newMode: boolean;
  userProfile;
  originalOrderStatus: string;
  orderStatusChanged = false;
  loading = false;
  window;
 // customerService: CustomerService;

  constructor(globalDataProvider: GlobalDataProvider, public customerService: CustomerService,
              private usStateService: StateService, public orderService: OrderService, public snackBar: MatSnackBar,
              public authService: AuthenticationService, private globals: Globals, public windowRef: WindowRef) {
    this.window = windowRef.nativeWindow;
    this.userProfile = JSON.parse(authService.getUserToken());
    this.stateList = this.usStateService.getStateList();
    this.lookupDataSource = globalDataProvider.getLookups();
    this.userDataSource = globalDataProvider.getUsers();
    this.phoneTypes = this.createLookupTypeSource('PHON');
    this.orderTypes = this.createLookupTypeSource('otyps');
    this.statusTypes = this.createLookupTypeSource('ord');

   }

  createLookupTypeSource(className: string): any {
    return this.lookupDataSource.filter(item => item.class === className);
  }

  getCustomerFullName(customer: any): string {
    return customer.first_name + ' ' + customer.last_name;
  }

  onChange(e) {
    /* console.log('order Contact before: ', this.currentOrder.contact);
    console.log('contact selection changed:', e);
    console.log('contactPersons', this.contactPersons); */
    const selectedContact = this.contactPersons.filter(item => (item.first_name + ' ' + item.last_name) === e);
    // console.log('selectedContact', selectedContact);
    this.currentOrder.contact = selectedContact[0].first_name + ' ' + selectedContact[0].last_name;

    this.currentOrder.contact_email = selectedContact[0].email_address;
    this.currentOrder.contact_phone1 = selectedContact[0].phone_1;
    this.currentOrder.contact_phone1_ext = selectedContact[0].phone_1_ext;
    this.currentOrder.contact_phone1_type = selectedContact[0].phone_1_type;
    this.currentOrder.contact_phone2 = selectedContact[0].phone_2;
    this.currentOrder.contact_phone2_ext = selectedContact[0].phone_2_ext;
    this.currentOrder.contact_phone2_type = selectedContact[0].phone_2_type;
  }

  batchSave() {
    return this.saveOrderInfo().map(res => {
      console.log('Order Info Saved', res);
      console.log('Order Status Changed', this.orderStatusChanged);
      if (this.orderStatusChanged === true) {
        this.saveOrderStatusHistory(res).subscribe(res2 => {
          console.log('Order Status History Saved', res2);
        });
      }
      return res;
    });
  }

  convertOrderInfo(order: Order): Order {
    const orderToSave = new Order();
    orderToSave.order_id = order.order_id;
    orderToSave.customer_id = order.customer_id;
    orderToSave.order_number = order.order_number;
    orderToSave.order_type =  order.order_type;
    orderToSave.purchase_order =  order.purchase_order;
    const fixedOrderDate = new Date(order.order_date);
    console.log('order-info:convertOrderInfo - fixedOrderDate', fixedOrderDate.toISOString());
    fixedOrderDate.setUTCHours(0,0,0,0);
    console.log('order-info:convertOrderInfo - fixedOrderDate-After', fixedOrderDate.toISOString());
    orderToSave.order_date =  fixedOrderDate.toISOString();
    orderToSave.order_due_date =  new Date(order.order_due_date).toISOString();
    orderToSave.order_status =  order.order_status;
    orderToSave.taken_user_id =  order.taken_user_id;
    orderToSave.assigned_user_id =  order.assigned_user_id;
    orderToSave.est_begin_date =  order.est_begin_date;
    orderToSave.act_begin_date =  order.act_begin_date;
    orderToSave.est_complete_date =  order.est_complete_date;
    orderToSave.act_complete_date =  order.act_complete_date;
    orderToSave.shipped_date =  order.shipped_date;
    orderToSave.subtotal =  order.subtotal.toString();
    orderToSave.tax_rate =  order.tax_rate.toString();
    orderToSave.tax_amount =  order.tax_amount.toString();
    orderToSave.shipping =  order.shipping.toString();
    orderToSave.total =  order.total.toString();
    orderToSave.payments =  order.payments.toString();
    orderToSave.balance_due =  order.balance_due.toString();
    orderToSave.IMAGE_FILE =  order.IMAGE_FILE;
    orderToSave.BILL_ADDRESS_1 =  order.BILL_ADDRESS_1;
    orderToSave.BILL_ADDRESS_2 =  order.BILL_ADDRESS_2;
    orderToSave.BILL_CITY =  order.BILL_CITY;
    orderToSave.BILL_STATE =  order.BILL_STATE;
    orderToSave.BILL_ZIP =  order.BILL_ZIP;
    orderToSave.SHIP_ADDRESS_1 =  order.SHIP_ADDRESS_1;
    orderToSave.SHIP_ADDRESS_2 =  order.SHIP_ADDRESS_2;
    orderToSave.SHIP_CITY =  order.SHIP_CITY;
    orderToSave.SHIP_STATE =  order.SHIP_STATE;
    orderToSave.SHIP_ZIP =  order.SHIP_ZIP;
    orderToSave.PRIORITY =  order.PRIORITY;
    orderToSave.PERCENT_COMPLETE =  order.PERCENT_COMPLETE;
    orderToSave.ship_carrier =  order.ship_carrier;
    orderToSave.ship_tracking = order.ship_tracking;
    orderToSave.previous_order = order.previous_order;
    orderToSave.reorder_ind =  order.reorder_ind;
    orderToSave.ship_attn =  order.ship_attn;
    orderToSave.contact =  order.contact;
    orderToSave.contact_email =  order.contact_email;
    orderToSave.contact_phone1 =  order.contact_phone1;
    orderToSave.contact_phone1_ext =  order.contact_phone1_ext;
    orderToSave.contact_phone1_type =  order.contact_phone1_type;
    orderToSave.contact_phone2 =  order.contact_phone2;
    orderToSave.contact_phone2_ext =  order.contact_phone2_ext;
    orderToSave.contact_phone2_type =  order.contact_phone2_type;

    return orderToSave;
  }

  saveOrderInfo() {
    // console.log('Order on Save', this.currentOrder);
      const insOrder = this.convertOrderInfo(this.currentOrder);
      console.log('Converted Order on Save', insOrder);
      if (this.currentOrder.order_id <= 0) {
        this.currentOrder.order_id = 0;
        return this.orderService.addOrderInfo('rwflowers', insOrder)
        .map(res => {
          // console.log('Save orderInfo Return', res);
          this.currentOrder.order_id = res.order_id;
          this.snackBar.open('Order Added!', '', {
            duration: 4000,
            verticalPosition: 'top'
          });
          return res.order_id;
        });
      } else {
        const updOrder = this.convertOrderInfo(this.currentOrder);
        return this.orderService.updateOrderInfo('rwflowers', updOrder)
        .map(res => {
          // console.log('Update orderInfo Return', res);
          this.snackBar.open('Order Added Updated!', '', {
            duration: 4000,
            verticalPosition: 'top'
          });
          return updOrder.order_id;
        });
      }
  }

  saveOrderStatusHistory(orderId: number) {
    console.log('Saving Order Status History orderId=', orderId);
    console.log('user', this.userProfile);
    const orderStatusHistory = new OrderStatusHistory();
    orderStatusHistory.order_status_history_id = 0;
    orderStatusHistory.order_id = orderId;
    orderStatusHistory.order_status = this.currentOrder.order_status;
    const today = new Date();
    // today.setHours(0, 0, 0, 0);
    orderStatusHistory.status_date = today.toISOString();
    orderStatusHistory.set_by_user_id = this.userProfile.profile.user_id;

    console.log('order-info:saveOrderStatusHistory - OrderStatusHistory', orderStatusHistory);
    return this.orderService.addOrderStatus(this.userProfile.login_id, orderStatusHistory)
    .map(res => {
      this.orderStatusChanged = false;
      this.newMode = false;
      return res;
    });
  }

  setDefaultTaskList(orderType: string) {
    // console.log('setDefaultTaskList: orderType', orderType);
    this.taskList.buildDefaultTaskList(this.currentOrder.order_id, orderType);
  }

  onOrderStatusChange(e) {
    // console.log('onOrderStatusChange', e);
    // console.log('Current Order Status', this.currentOrder.order_status);
    if (e !== this.originalOrderStatus) {
      this.orderStatusChanged = true;
    } else {
      this.orderStatusChanged = false;
    }
    this.currentOrder.order_status = e;
    console.log('Order Status value(s)', this.currentOrder.order_status, this.originalOrderStatus);
    console.log('Save Order Status', this.orderStatusChanged);
  }

  ngOnInit() {
    console.log('OnInit currentOrder', this.currentOrder);
    // this.editMode = this.currentOrder !== undefined;
    console.log('OnInit customer', this.customer);
    this.newMode = this.currentOrder.order_id === 0;
    this.orderCustomer = this.customer;
    this.contactPersons = this.customer.customer_person;
    /* if (this.currentOrder) {
      console.log('order-info:ngOnInit Calling getCustomerData');
      this.customerService.getCustomerData('', this.currentOrder.customer_id).subscribe(res => {
        this.orderCustomer = res;
        this.contactPersons = this.orderCustomer.customer_person;
        // console.log('pulled Customer', this.orderCustomer);
      });
    } else {
      this.currentOrder = new Order();
    } */

  }

  ngOnChanges() {
    console.log('OnChanges currentOrder', this.currentOrder);
    console.log('OnChanges customer', this.customer);
    this.newMode = this.currentOrder.order_id === 0;
    this.orderStatusChanged = this.newMode;
    this.orderCustomer = this.customer;
    this.contactPersons = this.customer.customer_person;
    /* if (this.currentOrder.customer_id !== 0) {
      console.log('order-info:ngOnChanges Calling getCustomerData');
      this.customerService.getCustomerData('', this.currentOrder.customer_id).subscribe(res => {
        this.orderCustomer = res;
        this.contactPersons = this.orderCustomer.customer_person;
        // console.log('pulled Customer', this.orderCustomer);
      });
    } else {
      // this.currentOrder = new Order();
    } */
    this.originalOrderStatus = this.currentOrder.order_status;
  }

}
