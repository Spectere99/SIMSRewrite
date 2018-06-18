import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Http, HttpModule, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { LookupService, LookupItem } from '../../_services/lookups.service';
import { OrderService, Order, OrderDetail } from '../../_services/order.service';
import { AuthenticationService } from '../../_services/authentication.service';
import { UserService, User } from '../../_services/user.service';
import { CustomerService, Customer } from '../../_services/customer.service';
import { DxDataGridComponent, DxRadioGroupModule, DxTooltipModule, DxRadioGroupComponent } from 'devextreme-angular';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
  providers: [LookupService, OrderService, UserService, CustomerService]
})
export class TaskListComponent implements OnInit {
  @ViewChild(DxDataGridComponent) gridOrders: DxDataGridComponent;
  baseUrl = environment.odataEndpoint;
  popupVisible = false;
  dataSource: any;
  userDataSource: any;
  lookupDataSource: any;
  taskLookup: Array<LookupItem>;
  order_statusSource: Array<LookupItem>;
  customerDataSource: Array<Customer>;
  userProfile;
  selectedOrder: any;
  customer: Customer;
  leaveWindowOpen = false;

  filterNames = [
    'Default',
    'Today',
    'All'
  ];
  currentFilter = undefined;

  defaultLoadFilter = [  ];

  constructor(public lookupService: LookupService, public userService: UserService,
              public orderService: OrderService, public authService: AuthenticationService,
              public customerService: CustomerService) {
    console.log('Constructor');
    this.userProfile = JSON.parse(authService.getUserToken());
    this.currentFilter = this.defaultLoadFilter;
    lookupService.loadLookupData('').subscribe(res => {
      this.lookupDataSource = res.value;
      // console.log('lookupDataSource', this.lookupDataSource);
      this.order_statusSource = this.createLookupTypeSource('ord');
      this.removeOrderStatuses();
      // console.log('order_statusSource', this.order_statusSource);
      this.taskLookup = this.createLookupTypeSource('otask');
    });

    userService.getUsers('').subscribe(res => {
      this.userDataSource = res.value;
      // console.log('userDataSource', this.user_Source);
    });

    this.createTaskDataSource();
    console.log(this.dataSource);
  }

  createLookupTypeSource(className: string): any {
    return this.lookupDataSource.filter(item => item.class === className);
  }

  getUserDisplayExpr(item) {
    if (!item) {
        return '';
    }

    return item.first_name + ' ' + item.last_name;
}
  createTaskDataSource() {
    this.dataSource = {
      store: {
          type: 'odata',
          url: this.baseUrl + 'OrderTask',
          key: ['order_id', 'task_code'],
          keyType: {
                      order_id: 'Int32',
                      task_code: 'String'
                    },
          // key: 'order_id',
          // keyType: 'Int32',
          version: 3,
          jsonp: false,
          beforeSend: function (url, async, method, timeout, params, payload, headers) {

            console.log('beforeSend', url, async, method, timeout, params, payload, headers);
          }
      },
      expand: ['order'],
      select: [
        'order_id',
        'task_code',
        'order_by',
        'is_complete',
        'completed_by',
        'completed_date',
        'order/order_id',
        'order/order_date',
        'order/order_status',
        'order/customer_id',
        'order/order_number',
        'order/order_type',
        'order/order_due_date',
        'order/assigned_user_id',
        'order/taken_user_id',
        'order/est_begin_date',
        'order/act_begin_date',
        'order/est_complete_date',
        'order/act_complete_date'
      ],
      filter: [['order.order_status', '=', 'inq'],
              'or',
              ['order.order_status', '=', 'qtat'],
              'or',
              ['order.order_status', '=', 'ord'],
              'or',
              ['order.order_status', '=', 'inst']]
   };
  }

  showEditPopup(e) {
    // e.cancel = true;
    console.log('E', e);
    console.log('task-list:showEditPopup Calling getCustomerData');
    this.customerService.getCustomerData('', e.data.order.customer_id).subscribe(res => {
      this.customer = res;
      // this.contactPersons = this.orderCustomer.customer_person;
      // console.log('pulled Customer', this.orderCustomer);
    });
    // console.log('showPopup order', e.data);
    this.selectedOrder = e.data.order;
    console.log('Selected Order', this.selectedOrder);
    // alert('Editing!');

    this.popupVisible = true;
  }

  removeOrderStatuses() {
    let index = this.order_statusSource.findIndex(x => x.char_mod === 'clos');
    if (index >= 0) {
      this.order_statusSource.splice(index, 1);
    }
    index = this.order_statusSource.findIndex(x => x.char_mod === 'com');
    if (index >= 0) {
      this.order_statusSource.splice(index, 1);
    }
    index = this.order_statusSource.findIndex(x => x.char_mod === 'can');
    if (index >= 0) {
      this.order_statusSource.splice(index, 1);
    }
  }
  setCompletedInd(data) {
    // console.log('SetCompletedInd', data);
    if (data === undefined) { return false; }
    return data.is_complete === 'Y';
  }

  setCompletedValue(rowData, value) {
    console.log('SetCompletedValue', rowData, value);
    rowData.is_complete = (value === true) ? 'Y' : 'N';
  }
  setCustomerName(e) {
    console.log('setCustomerName', e);
  }

  ngOnInit() {
    console.log('OnInit');
  }

}
