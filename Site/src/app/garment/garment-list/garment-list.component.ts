import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Http, HttpModule, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { LookupService, LookupItem } from '../../_services/lookups.service';
import { OrderService, Order, OrderDetail } from '../../_services/order.service';
import { PriceListService, PriceListItem } from '../../_services/pricelist.service';
import { CustomerService, Customer } from '../../_services/customer.service';
import { AuthenticationService } from '../../_services/authentication.service';
import { UserService, User } from '../../_services/user.service';
import { OrderInfoComponent } from '../../order/order-info/order-info.component';
import { OrderDetailComponent } from '../../order/order-detail/order-detail.component';
import { OrderArtComponent } from '../../order/order-art/order-art.component';
import { OrderTaskListComponent } from '../../order/order-task-list/order-task-list.component';
import { OrderSummaryComponent } from '../../order/order-summary/order-summary.component';
import { OrderNotesHistoryComponent } from '../../order/order-notes-history/order-notes-history.component';
import { DxDataGridComponent, DxRadioGroupModule, DxTooltipModule, DxRadioGroupComponent } from 'devextreme-angular';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-garment-list',
  templateUrl: './garment-list.component.html',
  providers: [OrderService, LookupService, UserService,
              PriceListService, CustomerService, AuthenticationService],
  styleUrls: ['./garment-list.component.scss']
})
export class GarmentListComponent implements OnInit {
  @ViewChild(DxDataGridComponent) gridOrders: DxDataGridComponent;
  @ViewChild(OrderInfoComponent) orderInfo: OrderInfoComponent;
  @ViewChild(OrderDetailComponent) orderDetail: OrderDetailComponent;
  @ViewChild(OrderArtComponent) orderArt: OrderArtComponent;
  @ViewChild(OrderTaskListComponent) orderTaskList: OrderTaskListComponent;
  @ViewChild(OrderSummaryComponent) orderSummary: OrderSummaryComponent;
  @ViewChild(OrderNotesHistoryComponent) orderNotesHistory: OrderNotesHistoryComponent;
  customer: Customer;
  baseUrl = environment.odataEndpoint;
  popupVisible = false;
  dataSource: any;
  userDataSource: any;
  priceListDataSource: Array<PriceListItem>;
  lookupDataSource: any;
  vendorTypes: Array<LookupItem>;
  itemTypes: Array<PriceListItem>;
  userProfile;
  selectedOrder: any;
  todayDate;
  currentFilterName: string;
  customGarmentOrderDate;

  enableSave = false;

  filterNames = [
    'Default',
    'Today',
    'All'
  ];
  currentFilter = undefined;

  defaultLoadFilter = [
                        ['order/order_status', '=', 'ord'],
                        'and',
                        ['vendor', '<>', 'gmtpr'],
                        'and',
                        [
                          ['garment_order_date', '=', null],
                          'or',
                          ['garment_recvd_date', '=', null],
                        ]
                      ];
  todayOrderFilter = [
                  ['order/order_status', '=', 'ord'],
                  'and',
                  ['garment_order_date', '=', this.getToday()]
                ];

  allOrderFilter = [
                ['order/order_status', '=', 'ord']];

  constructor(public lookupService: LookupService, public userService: UserService, public priceListService: PriceListService,
              public orderService: OrderService, public customerService: CustomerService, public authService: AuthenticationService) {
    this.userProfile = JSON.parse(authService.getUserToken());
    console.log('User Profile', this.userProfile);
    this.enableSave = this.userProfile.profile.role !== 'Readonly';
    this.customGarmentOrderDate = this.getToday();
    this.currentFilter = this.defaultLoadFilter;
    this.createOrderDataSource();
  }

  getToday(): Date {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  }

  applyChanges() {
    this.orderInfo.batchSave().subscribe(res => {
      this.orderDetail.batchSave(res);
      // Still need art tab batch save.
      this.orderArt.batchSave(res);
      // this.selectedOrder = null;
      this.orderTaskList.batchSave(res);
      this.orderNotesHistory.batchSave(res);
      setTimeout(() => {
        this.gridOrders.instance.refresh();
      }, 1000);
      this.popupVisible = false;
    });
  }

  onValueChanged(event) {
    console.log(event);
    console.log('Custom Hour value', this.customGarmentOrderDate);
    this.currentFilterName = event.value;
    switch (event.value) {
      case 'Default': {
        this.currentFilter = this.defaultLoadFilter;
        console.log('Default Filter', this.currentFilter);
        // this.gridOrders.instance.refresh();
        break;
      }
      case 'Today': {
        this.currentFilter = this.todayOrderFilter;
        console.log('Todays Filter', this.currentFilter);
        // this.gridOrders.instance.refresh();
        break;
      }
      case 'All': {
        this.currentFilter = this.allOrderFilter;
        console.log('Custom Filter', this.currentFilter);
        // this.gridOrders.instance.refresh();
        break;
      }
    }

    this.gridOrders.instance.clearFilter();
    this.gridOrders.instance.filter(this.currentFilter);
  }

  createLookupTypeSource(className: string): any {
    return this.lookupDataSource.filter(item => item.class === className);
  }

  createItemTypeSource(type: string): any {
    return this.priceListDataSource.filter(item => item.pricelist_type === type);
  }

  createOrderDataSource() {
    this.dataSource = {
      store: {
          type: 'odata',
          url: this.baseUrl + 'OrderDetails',
          key: 'order_detail_id',
          keyType: 'Int32',
          version: 3,
          jsonp: false,
          beforeSend: function (url, async, method, timeout, params, payload, headers) {
            console.log('beforeSend', url, async, method, timeout, params, payload, headers);
          }
      },
      expand: ['order'],
      select: [
        'order_id',
        'order_detail_id',
        'checked_in_ind',
        'checked_out_ind',
        'garment_order_date',
        'garment_recvd_date',
        'shipping_po',
        'customer_name',
        'vendor',
        'pricelist_id',
        'product_code',
        'color_code',
        'xsmall_qty',
        'small_qty',
        'med_qty',
        'large_qty',
        'xl_qty',
        'C2xl_qty',
        'C3xl_qty',
        'C4xl_qty',
        'C5xl_qty',
        'other1_type',
        'other1_qty',
        'order/order_number',
        'order/customer_id'
        /* 'order/order_date',
        'order/order_status',
        'order/order_id',
        'order/customer_id',
        'order/reorder_ind',
        'order/order_number',
        'order/ship_attn',
        'order/order_type',
        'order/purchase_order',
        'order/order_due_date',
        'order/assigned_user_id',
        'order/taken_user_id',
        'order/est_begin_date',
        'order/act_begin_date',
        'order/est_complete_date',
        'order/act_complete_date',
        'order/shipped_date',
        'order/subtotal',
        'order/tax_rate',
        'order/tax_amount',
        'order/shipping',
        'order/total',
        'order/payments',
        'order/balance_due',
        'order/IMAGE_FILE',
        'order/BILL_ADDRESS_1',
        'order/BILL_ADDRESS_2',
        'order/BILL_CITY',
        'order/BILL_STATE',
        'order/BILL_ZIP',
        'order/SHIP_ADDRESS_1',
        'order/SHIP_ADDRESS_2',
        'order/SHIP_CITY',
        'order/SHIP_STATE',
        'order/SHIP_ZIP',
        'order/ship_carrier',
        'order/ship_tracking',
        'order/previous_order',
        'order/contact',
        'order/contact_email',
        'order/contact_phone1',
        'order/contact_phone1_ext',
        'order/contact_phone1_type',
        'order/contact_phone2',
        'order/contact_phone2_ext',
        'order/contact_phone2_type', */
      ],
       filter: this.currentFilter
   };
  }

  updatingGarmentOrderData(key, values) {
    console.log('updating', key, values);
  }

  setCheckedInInd(data) {
    if (data === undefined) { return false; }
    return data.checked_in_ind === 'Y';
  }

  setCheckedOutInd(data) {
    if (data === undefined) { return false; }
    return data.checked_out_ind === 'Y';
  }

  showEditPopup(e) {
    // e.cancel = true;
    console.log('E', e);
    this.customerService.getCustomerData('', e.data.order.customer_id).subscribe(res => {
      this.customer = res;
      // this.contactPersons = this.orderCustomer.customer_person;
      // console.log('pulled Customer', this.orderCustomer);

      this.orderService.loadOrderData('', e.data.order_id).subscribe(res2 => {
        this.selectedOrder = res2;
        console.log('Selected Order', this.selectedOrder);
        this.popupVisible = true;
      });
    });
    // this.selectedOrder = e.data.order;
    // alert('Editing!');
  }

  ngOnInit() {
    this.lookupService.loadLookupData('').subscribe(res => {
      this.lookupDataSource = res.value;
      this.vendorTypes = this.createLookupTypeSource('vend');
    });

    this.priceListService.loadPricelistData('').subscribe(res => {
      this.priceListDataSource = res.value;
      this.itemTypes = this.createItemTypeSource('orddi');
    });

    this.userService.getUsers('').subscribe(res => {
      this.userDataSource = res.value;
      // console.log(this.userDataSource);
    });
  }

}
