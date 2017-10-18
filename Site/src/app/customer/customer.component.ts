import { NgModule, Component, OnInit, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import 'devextreme/data/odata/store';
import { DxDataGridModule } from 'devextreme-angular';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  dataSource: any;

  constructor() {
    this.dataSource = {
      store: {
          type: 'odata',
          url: 'http://localhost:56543/odata/orders'
      },
      select: [
          'order_id',
          'customer_id',
          'order_number',
          'order_type'
      ],
      //filter: ['status_code', '=', 'act']
   };
  }

  ngOnInit() {
  }

}
