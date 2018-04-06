import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Http, HttpModule, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { LookupService, LookupItem } from '../../_services/lookups.service';
import { OrderService, Order, OrderDetail } from '../../_services/order.service';
import { PriceListService, PriceListItem } from '../../_services/pricelist.service';
import { AuthenticationService } from '../../_services/authentication.service';
import { UserService, User } from '../../_services/user.service';
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

  constructor(public lookupService: LookupService, public userService: UserService, public priceListService: PriceListService,
              public orderService: OrderService, public authService: AuthenticationService) {
    this.userProfile = JSON.parse(authService.getUserToken());
    this.createOrderDataSource();
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
          url: this.baseUrl + 'OrderDetails'
      },
      expand: ['order'],
      select: [
        'order_id',
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
       filter: [['garment_order_date', '=', null],
                  'and',
                ['order/order_status', '=', 'ord'],
                  'and',
                ['vendor', '<>', 'gmtpr']]
   };
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
