import { Component, Injectable, OnInit, Output, ViewChild } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Http, HttpModule, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { NgModel } from '@angular/forms';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { LookupService } from '../../_services/lookups.service';
import { UserService } from '../../_services/user.service';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import { Order } from '../../_services/order.service';

/* export interface ILookup {
  id: number;
  class: string;
  description: string;
  char_mod: string;
  is_active: string;
  order_by: number;
  filter_function: string;
  created_by: string;
  created_date: string;
  updated_by: string;
  updated_date: string;
} */

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  providers: [LookupService, UserService],
  styleUrls: ['./order-list.component.scss']
})

export class OrderListComponent implements OnInit {
  // @ViewChild('orderTab') listTab: NgbTabset;
  // baseUrl = 'http://localhost:56543/odata/';
  baseUrl = environment.odataEndpoint;
  odataLookup;
  dataSource: any;
  order_statusSource: any;
  order_typeSource: any;
  user_Source: any;
  selectedOrder: any;
  lookupDataSource: any;
  customerId: number;

  filterDate = new Date(2008, 1, 1);

  popupVisible = false;

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

      this.createOrderDataSource();
    }

  checkValues() {
    console.log('order_statusSource', this.order_statusSource );
    console.log('order_typeSource', this.order_typeSource );
  }

  createOrderDataSource() {
    this.dataSource = {
      store: {
          type: 'odata',
          url: this.baseUrl + 'orders'
      },
      expand: ['customer', 'order_art_file'],
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
        'customer/customer_name',
        'order_art_file/image_file'
      ],
       // filter: ['order_date', '>', this.filterDate]
   };
  }

  showValues() {
    console.log('Showing Order Values', this.selectedOrder);
  }
  createStatusDataSource() {

    this.order_statusSource = this.lookupDataSource.filter(item => item.class === 'ord');
  }

  createOrderTypeDataSource() {
    this.order_typeSource = this.lookupDataSource.filter(item => item.class === 'otyps');
  }

  private getHeaders(userId) {
    const headers = new Headers({ 'Accept': 'application/json' });
    headers.append('Content-Type', 'application/json; charset=UTF-8');
    headers.append('userid', userId);
    return headers;
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
    // console.log('Tab', this.listTab);
    /* if (this.listTab) {
      this.listTab.select('Info');
    } */
    this.popupVisible = true;
  }

  closeEditor() {
    // this.selectedOrder = undefined;
    this.popupVisible = false;
  }
  ngOnInit() {
  }

}
