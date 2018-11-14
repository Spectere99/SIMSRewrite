import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Http, HttpModule, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { GlobalDataProvider } from '../../_providers/global-data.provider';
import { LookupService, LookupItem } from '../../_services/lookups.service';
import { OrderMaster, OrderService, Order, OrderDetail } from '../../_services/order.service';
import { PriceListService, PriceListItem } from '../../_services/pricelist.service';
import { CustomerService, Customer } from '../../_services/customer.service';
import { AuthenticationService } from '../../_services/authentication.service';
import { UserService, User } from '../../_services/user.service';
import { CorrespondenceService } from '../../_services/correspondence.service';
import { OrderInfoComponent } from '../../order/order-info/order-info.component';
import { OrderDetailComponent } from '../../order/order-detail/order-detail.component';
import { OrderArtComponent } from '../../order/order-art/order-art.component';
import { OrderTaskListComponent } from '../../order/order-task-list/order-task-list.component';
import { OrderSummaryComponent } from '../../order/order-summary/order-summary.component';
import { OrderNotesHistoryComponent } from '../../order/order-notes-history/order-notes-history.component';
import { DxDataGridComponent, DxRadioGroupModule, DxTooltipModule, DxRadioGroupComponent } from 'devextreme-angular';
import { WindowRef } from '../../_services/window-ref.service';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import { forkJoin } from 'rxjs/observable/forkJoin';

@Component({
  selector: 'app-garment-list',
  templateUrl: './garment-list.component.html',
  providers: [OrderService, LookupService, UserService, CorrespondenceService,
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

  customer: Customer;
  baseUrl = environment.odataEndpoint;
  popupVisible = false;
  dataSource: any;
  userDataSource: any;
  priceListDataSource: Array<PriceListItem>;
  lookupDataSource: Array<LookupItem>;
  vendorTypes: Array<LookupItem>;
  itemTypes: Array<PriceListItem>;
  userProfile;
  todayDate;
  currentFilterName: string;
  customGarmentOrderDate;

  loading: boolean;
  loadingOrder: boolean;
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

  window;
  constructor(globalDataProvider: GlobalDataProvider, public lookupService: LookupService, public userService: UserService,
              public priceListService: PriceListService,  public correspondenceService: CorrespondenceService,
              public orderService: OrderService, public customerService: CustomerService, public authService: AuthenticationService,
              public windowRef: WindowRef) {
    this.window = windowRef.nativeWindow;
    // console.log('garment-list.component:constructor');
    this.userProfile = JSON.parse(authService.getUserToken());
    this.lookupDataSource = globalDataProvider.getLookups();
    this.priceListDataSource = globalDataProvider.getPriceList();
    // console.log('garment-list.component:constructor - lookupDataSource', this.lookupDataSource);
    this.vendorTypes = this.createLookupTypeSource('vend');
    this.itemTypes = this.createItemTypeSource('orddi');
    this.userDataSource = globalDataProvider.getUsers();
    // console.log('User Profile', this.userProfile);
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
    // console.log(event);
    // console.log('Custom Hour value', this.customGarmentOrderDate);
    this.currentFilterName = event.value;
    switch (event.value) {
      case 'Default': {
        this.currentFilter = this.defaultLoadFilter;
        // console.log('Default Filter', this.currentFilter);
        // this.gridOrders.instance.refresh();
        break;
      }
      case 'Today': {
        this.currentFilter = this.todayOrderFilter;
        // console.log('Todays Filter', this.currentFilter);
        // this.gridOrders.instance.refresh();
        break;
      }
      case 'All': {
        this.currentFilter = this.allOrderFilter;
        // console.log('Custom Filter', this.currentFilter);
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
            // console.log('beforeSend', url, async, method, timeout, params, payload, headers);
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
      ],
      beforeSend: function(request) {
        request.timeout = environment.connectionTimeout;
      },
      filter: this.currentFilter
   };
  }

  updatingGarmentOrderData(key, values) {
    // console.log('updating', key, values);
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
    // console.log('E', e);
    // console.log('*** garment-list-comopnent:showEditPopup - START');
    this.loadingOrder = true;
    this.loading = true;
    this.selectedOrder = e.data;
    this.selectedOrderMaster = e.data;
    forkJoin(
      this.orderService.loadOrderData('', this.selectedOrder.order_id), // 0
      this.orderService.loadArtPlacementData('', this.selectedOrder.order_id), // 1
      this.orderService.loadOrderFeeData('', this.selectedOrder.order_id), // 2
      this.orderService.loadOrderPaymentData('', this.selectedOrder.order_id), // 3
      this.orderService.loadOrderArtFileData('', this.selectedOrder.order_id), // 4
      this.orderService.loadOrderNotesData('', this.selectedOrder.order_id), // 5
      this.orderService.loadOrderStatusHistoryData('', this.selectedOrder.order_id), // 6
      this.orderService.loadOrderTaskData('', this.selectedOrder.order_id), // 7
      this.correspondenceService.getCorrespondenceData('', this.selectedOrder.order_id), // 8
      this.customerService.getCustomerData('', e.data.order.customer_id) // 9
    ).subscribe(results => {
      // console.log('selectedOrder', this.selectedOrder);
      // console.log('forkJoin Return', results);
      this.selectedOrderLines = results[0].order_detail;
      this.selectedOrderMaster = results[0];
      this.selectedOrderMaster.order_detail = results[0].order_detail;
      this.selectedArtPlacements = results[1].order_art_placement;
      this.selectedOrderMaster.order_art_placements = results[1].order_art_placement;
      this.selectedOrderFees = results[2].order_fees;
      this.selectedOrderMaster.order_fees = results[2].order_fees;
      this.selectedPayments = results[3].order_payments;
      this.selectedOrderMaster.order_payments = results[3].order_payments;
      this.selectedArtFiles = results[4].order_art_file;
      this.selectedOrderMaster.order_art_file = results[4].order_art_file;
      this.selectedNotes = results[5].order_notes;
      this.selectedOrderMaster.order_notes = results[5].order_notes;
      this.selectedStatusHistory = results[6].order_status_history;
      this.selectedOrderMaster.order_status_histories = results[6].order_status_history;
      this.selectedTasks = results[7].order_task;
      this.selectedOrderMaster.order_tasks = results[7].order_task;
      this.selectedCorrespondence = results[8].correspondences;
      this.customer = results[9];
      this.selectedOrderMaster.order_correspondence = results[8].correspondences;
      this.selectedOrderMaster.customer = this.customer;
      // console.log('Order Master Return', this.selectedOrderMaster);
      this.loadingOrder = false;
      this.loading = false;
      this.popupVisible = true;
    });
    // console.log('*** garment-list-comopnent:showEditPopup - LEAVING');
  }

  ngOnInit() {
    // console.log('garment-list.component:ngOnInit');
  }

}
