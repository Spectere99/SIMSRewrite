import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { OrderService, Order, OrderDetail, OrderArtPlacement, OrderFee, OrderPayment } from '../../_services/order.service';
import { LookupService, LookupItem } from '../../_services/lookups.service';
import { PriceListService, PriceListItem } from '../../_services/pricelist.service';

declare let jsPDF;

@Component({
  selector: 'app-order-invoice',
  templateUrl: './order-invoice.component.html',
 /*  template:
    `<h1>JSON to PDF app</h1>
    <div class="container" id="div1">
        <button id="create" (click)="convert()">Create file</button>
    </div>
    `, */
  styleUrls: ['./order-invoice.component.scss'],
  providers: [OrderService, LookupService, PriceListService]
})
export class OrderInvoiceComponent implements OnInit {
@Input() currentOrder: any;
lookupDataSource: Array<LookupItem>;
priceListDataSource: Array<PriceListItem>;
itemTypes: Array<PriceListItem>;
setupItems: Array<PriceListItem>;
styleTypes: Array<LookupItem>;
sizeTypes: Array<LookupItem>;
vendorTypes: Array<LookupItem>;
artLocations: Array<LookupItem>;
paymentSourceItems: Array<LookupItem>;

orderArtPlacement: Array<OrderArtPlacement>;
orderFees: Array<OrderFee>;
orderPayments: Array<OrderPayment>;
order: any;

  constructor(public orderService: OrderService, private lookupService: LookupService, private priceListService: PriceListService) {
    this.order = new Order();
    this.order.order_detail = [];
    this.orderArtPlacement = [];
    this.orderFees = [];
    this.orderPayments = [];
    lookupService.loadLookupData('').subscribe(res => {
      this.lookupDataSource = res.value;
      this.sizeTypes = this.createLookupTypeSource('ssiz');
      this.styleTypes = this.createLookupTypeSource('sclas');
      this.vendorTypes = this.createLookupTypeSource('vend');
      this.artLocations = this.createLookupTypeSource('aloc');
      this.paymentSourceItems = this.createLookupTypeSource('pms');
    });
    priceListService.loadPricelistData('').subscribe(res => {
      this.priceListDataSource = res.value;
      this.itemTypes = this.createItemTypeSource('orddi');
      this.setupItems = this.createItemTypeSource('setup');
    });
  }

  createLookupTypeSource(className: string): any {
    return this.lookupDataSource.filter(item => item.class === className);
  }

  createItemTypeSource(type: string): any {
    return this.priceListDataSource.filter(item => item.pricelist_type === type);
  }

  getItemDescription(priceList_id: number): string {
    let val = '';
    if (this.itemTypes) {
      const foundVal = this.itemTypes.find(p => p.pricelist_id === priceList_id);
      if (foundVal) {
        val = foundVal.pricelist_description;
      }
    }
    return val;
  }

  getStyleDescription(style_code: string): string {
    let val = '';
    if (this.styleTypes) {
      const foundVal = this.styleTypes.find(p => p.chr_mod === style_code);
      if (foundVal) {
        val = foundVal.description;
      }
    }
    return val;
  }

  getSizeTypeDescription(size_type: string): string {
    let val = '';
    if (this.styleTypes) {
      const foundVal = this.sizeTypes.find(p => p.chr_mod === size_type);
      if (foundVal) {
        val = foundVal.description;
      }
    }
    return val;
  }
  convert() {
    const doc = new jsPDF('p', 'pt', 'a4');

    const options = {
      pagesplit: true,
      background: '#fff',
      top: 35,
      bottom: 35,
      left: 40,
      right: 40
    };

    const elementToPrint = document.getElementById('invoiceContent');
    console.log('Generating PDF', elementToPrint);
    // doc.autoTable(col, rows);
    doc.addHTML(elementToPrint, 10, 1, options, () => {
      doc.save('Test.pdf');
    });

  }

  ngOnInit() {

  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnChanges() {
    console.log('Current Order', this.currentOrder);
    if (this.currentOrder.order_id !== 0) {
      this.orderService.loadOrderData('', this.currentOrder.order_id).subscribe(res => {
        this.order = res;
        console.log('pulled order', this.order);
      });
      this.orderService.loadArtPlacementData('', this.currentOrder.order_id).subscribe(res => {
        this.orderArtPlacement = res.order_art_placement;
        // console.log('pulled Art Placement', this.orderArtPlacement);
      });
      this.orderService.loadOrderFeeData('', this.currentOrder.order_id).subscribe(res => {
        this.orderFees = res.order_fees;
        // console.log('pulled Order Fees', this.orderFees);
      });
      this.orderService.loadOrderPaymentData('', this.currentOrder.order_id).subscribe(res => {
        this.orderPayments = res.order_payments;
        // console.log('pulled Payment Data', this.orderPayments);
      });
    } else {
      /// this.currentOrder = new Order();
      this.order.order_detail = new Array<OrderDetail>();
      this.orderArtPlacement = new Array<OrderArtPlacement>();
      this.orderFees = new Array<OrderFee>();
      this.orderPayments = new Array<OrderPayment>();
    }
  }
}
