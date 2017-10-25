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
          url: 'http://localhost:56543/odata/OrderDetails'
      },
      select: [
          'order_detail_id',
          'order_id',
          'item_type',
          'item_line_number',
          'item_quantity',
          'pricelist_id',
          'style_code',
          'color_code',
          'size_code',
          'vendor',
          'manufacturer',
          'product_code',
          'item_price_each',
          'item_price_ext',
          'taxable_ind',
          'shipping_po',
          'notes',
          'checked_in_ind',
          'checked_out_ind',
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
          'other2_type',
          'other2_qty',
          'other3_type',
          'other3_qty',
          'order_number',
          'customer_name',
          'garment_order_date',
          'garment_recvd_date'
      ],
       filter: ['garment_order_date', '<>', null]
   };
  }

  ngOnInit() {
  }

}
