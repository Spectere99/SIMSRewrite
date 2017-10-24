import { NgModule, Component, OnInit, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import 'devextreme/data/odata/store';
import { DxDataGridModule } from 'devextreme-angular';

@Component({
  selector: 'app-orderdetails',
  templateUrl: './orderDetails.component.html',
  styleUrls: ['./orderDetails.component.css']
})
export class OrderDetailsComponent implements OnInit {
  dataSource: any;

  constructor() {
    this.dataSource = {
      store: {
          type: 'odata',
          url: 'http://localhost:56543/odata/orderdetails'
      },
      select: [
          'order_detail_id',
          'order_id',
          'item_type',
          'item_line_number'
      ],
      // filter: ['status_code', '=', 'act']
   };
  }

  ngOnInit() {
  }

}
