import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Http, HttpModule, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { LookupService, LookupItem } from '../../_services/lookups.service';
import { OrderService, OrderMaster, Order, OrderDetail } from '../../_services/order.service';
import { AuthenticationService } from '../../_services/authentication.service';
import { UserService, User } from '../../_services/user.service';
import { CustomerService, Customer } from '../../_services/customer.service';
import { CorrespondenceService } from '../../_services/correspondence.service';
import { DxDataGridComponent, DxRadioGroupModule, DxTooltipModule, DxRadioGroupComponent } from 'devextreme-angular';
import { forkJoin } from 'rxjs/observable/forkJoin';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
  providers: [LookupService, OrderService, UserService, CustomerService, CorrespondenceService]
})
export class TaskListComponent implements OnInit {
  @ViewChild(DxDataGridComponent) gridOrders: DxDataGridComponent;
  baseUrl = environment.odataEndpoint;
  
  selectedOrderMaster: OrderMaster;
  /* Data Strutures for Orders */
  selectedOrder: any;
  selectedTasks: any;
  selectedOrderLines: any;
  selectedArtPlacements: any;
  selectedFees: any;
  selectedPayments: any;
  selectedCorrespondence: any;
  selectedOrderFees: any;
  selectedArtFiles: any;
  selectedNotes: any;
  selectedStatusHistory: any;

  popupVisible = false;
  dataSource: any;
  userDataSource: any;
  lookupDataSource: any;
  taskLookup: Array<LookupItem>;
  order_statusSource: Array<LookupItem>;
  customerDataSource: Array<Customer>;
  userProfile;

  customer: Customer;
  leaveWindowOpen = false;
  loading: boolean;
  loadingOrder: boolean;

  filterNames = [
    'Default',
    'Today',
    'All'
  ];
  currentFilter = undefined;

  defaultLoadFilter = [  ];

  constructor(public lookupService: LookupService, public userService: UserService,
              public orderService: OrderService, public authService: AuthenticationService,
              public customerService: CustomerService,  public correspondenceService: CorrespondenceService) {
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
    console.log('task-list:showEditPopup Calling loadOrder');
    // this.customerService.getCustomerData('', e.data.order.customer_id).subscribe(res => {
      // this.customer = res;
      this.loadOrder(e.data);
      // this.contactPersons = this.orderCustomer.customer_person;
      // console.log('pulled Customer', this.orderCustomer);
    //});
    // console.log('showPopup order', e.data);
    console.log('Selected Order', this.selectedOrder);
    // alert('Editing!');

    /* this.popupVisible = true; */
  }

  loadOrder(e) {
    this.loadingOrder = true;
    this.loading = true;
    this.selectedOrder = e.order;
    this.selectedOrderMaster = e.order;
    forkJoin(
      this.orderService.loadOrderInfo('', this.selectedOrder.order_id), // 0
      this.orderService.loadOrderData('', this.selectedOrder.order_id), // 1
      this.orderService.loadArtPlacementData('', this.selectedOrder.order_id), // 2
      this.orderService.loadOrderFeeData('', this.selectedOrder.order_id), // 3
      this.orderService.loadOrderPaymentData('', this.selectedOrder.order_id), // 4
      this.orderService.loadOrderArtFileData('', this.selectedOrder.order_id), // 5
      this.orderService.loadOrderNotesData('', this.selectedOrder.order_id), // 6
      this.orderService.loadOrderStatusHistoryData('', this.selectedOrder.order_id), // 7
      this.orderService.loadOrderTaskData('', this.selectedOrder.order_id), // 8
      this.correspondenceService.getCorrespondenceData('', this.selectedOrder.order_id), // 9
      this.customerService.getCustomerData('', this.selectedOrder.customer_id) // 10
    ).subscribe(results => {
      console.log('selectedOrder', this.selectedOrder);
      console.log('forkJoin Return', results);
      this.customer = results[10];
      this.selectedOrder = results[0];
      this.selectedOrderMaster = results[0];
      this.selectedOrderLines = results[1].order_detail;
      this.selectedOrderMaster.order_detail = results[1].order_detail;
      this.selectedArtPlacements = results[2].order_art_placement;
      this.selectedOrderMaster.order_art_placements = results[2].order_art_placement;
      this.selectedOrderFees = results[3].order_fees;
      this.selectedOrderMaster.order_fees = results[3].order_fees;
      this.selectedPayments = results[4].order_payments;
      this.selectedOrderMaster.order_payments = results[4].order_payments;
      this.selectedArtFiles = results[5].order_art_file;
      this.selectedOrderMaster.order_art_file = results[5].order_art_file;
      this.selectedNotes = results[6].order_notes;
      this.selectedOrderMaster.order_notes = results[6].order_notes;
      this.selectedStatusHistory = results[7].order_status_history;
      this.selectedOrderMaster.order_status_histories = results[7].order_status_history;
      this.selectedTasks = results[8].order_task;
      this.selectedOrderMaster.order_tasks = results[8].order_task;
      this.selectedCorrespondence = results[9].correspondences;
      this.selectedOrderMaster.order_correspondence = results[9].correspondences;
      this.selectedOrderMaster.customer = this.customer;
      console.log('Order Master Return', this.selectedOrderMaster);
      this.loadingOrder = false;
      this.loading = false;
      this.popupVisible = true;
    });
  }

  /* getOrderQty(data) {
    console.log('getOrderQty', data);
    let orderDetail;
    this.orderService.loadOrderData('', data.order_id).subscribe(res => {
      orderDetail = res.order_detail;
      if (orderDetail !== undefined) {
        let itemQty = 0;
        data.order_detail.forEach(element => {
          itemQty = itemQty + element.item_quantity;
        });
        return itemQty;
      }
      return 0;
    })
  } */

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
