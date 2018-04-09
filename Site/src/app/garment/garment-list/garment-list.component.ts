import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Http, HttpModule, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { LookupService, LookupItem } from '../../_services/lookups.service';
import { OrderService, Order, OrderDetail } from '../../_services/order.service';
import { PriceListService, PriceListItem } from '../../_services/pricelist.service';
import { AuthenticationService } from '../../_services/authentication.service';
import { UserService, User } from '../../_services/user.service';
import { DxDataGridComponent, DxRadioGroupModule, DxTooltipModule, DxRadioGroupComponent } from 'devextreme-angular';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-garment-list',
  templateUrl: './garment-list.component.html',
  providers: [OrderService, LookupService, UserService,
              PriceListService, AuthenticationService],
  styleUrls: ['./garment-list.component.scss']
})
export class GarmentListComponent implements OnInit {
  @ViewChild(DxDataGridComponent) gridOrders: DxDataGridComponent;
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

  filterNames = [
    'Default',
    'Today',
    // 'Custom'
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

  customOrderFilter = [
                ['order/order_status', '=', 'ord'],
                'and',
                ['garment_order_date', '=', this.customGarmentOrderDate]
                    ];

  constructor(public lookupService: LookupService, public userService: UserService, public priceListService: PriceListService,
              public orderService: OrderService, public authService: AuthenticationService) {
    this.userProfile = JSON.parse(authService.getUserToken());
    this.customGarmentOrderDate = this.getToday();
    this.currentFilter = this.defaultLoadFilter;
    this.createOrderDataSource();
  }

  getToday(): Date {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  }

  customDateChange(event) {
    console.log('customDateChage', event);
    this.customGarmentOrderDate = new Date(event).setHours(0, 0, 0, 0);
/*     this.customOrderFilter = [
      ['order/order_status', '=', 'ord'],
      'and',
      ['garment_order_date', '=', this.customGarmentOrderDate]
    ];
    this.currentFilter = this.customOrderFilter; */
    console.log('Custom Garment Order Date', this.customGarmentOrderDate);
    console.log('Current Filter', this.currentFilter);
    this.gridOrders.instance.clearFilter();
    this.gridOrders.instance.filter(this.currentFilter);
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
      case 'Custom': {
        this.currentFilter = this.customOrderFilter;
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
        'order_number',
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
        'order/order_date',
        'order/order_status'
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
    // console.log('E', e);
    this.selectedOrder = e.data;
    // console.log('Selected Order', this.selectedOrder);
    // alert('Editing!');

    this.popupVisible = true;
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
