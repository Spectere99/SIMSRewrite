import { Component, Injectable, OnInit } from '@angular/core';
import { Http, HttpModule, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { NgModel } from '@angular/forms';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

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
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})

export class OrderComponent implements OnInit {
  config;
  baseUrl: string;
  odataLookup;
  dataSource: any;
  order_statusSource: any;
  order_typeSource: any;
  user_Source: any;
  selectedOrder = {};

  filterDate = new Date(2008, 1, 1);

    constructor(private http: Http) {
      this.baseUrl = 'http://localhost:56543/odata/';
      this.createOrderDataSource();
      this.createStatusDataSource();
      this.createOrderTypeDataSource();
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
       // filter: ['order_date', '>', this.filterDate]
   };
  }

  createStatusDataSource() {

    this.order_statusSource = [
      {char_mod: 'inq', description: 'Quote'},
      {char_mod: 'inst', description: 'Invoiced'},
      {char_mod: 'qtat', description: 'Quote/Artwork'},
      {char_mod: 'ord', description: 'Order'},
      {char_mod: 'com', description: 'Completed'},
      {char_mod: 'clos', description: 'Closed'},
      {char_mod: 'can', description: 'Cancelled'} ];

  }

  createOrderTypeDataSource() {
    this.http.get(this.baseUrl + 'LookupItems', {headers: this.getHeaders('rwflowers')})
            .map(data => this.order_typeSource = data);
    console.log('order_typeSource', this.order_typeSource);
  }

  private getHeaders(userId) {
    const headers = new Headers({ 'Accept': 'application/json' });
    headers.append('Content-Type', 'application/json; charset=UTF-8');
    headers.append('userid', userId);
    return headers;
  }

  selectionChanged(e) {
    this.selectedOrder = e.selectedRowsData[0];
  }
  setReorderInd(data) {
    if (data === undefined) { return false; }
    return data.reorder_ind === 'Y';
  }
  ngOnInit() {
  }

}
