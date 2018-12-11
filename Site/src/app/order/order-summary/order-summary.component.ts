import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { environment } from '../../../environments/environment';
import { GlobalDataProvider } from '../../_providers/global-data.provider';
import { OrderService, Order, OrderMaster, OrderDetail, OrderArtPlacement, OrderFee,
          OrderPayment, OrderArtFile, OrderNote } from '../../_services/order.service';
// import { AuthenticationService } from '../../_services/authentication.service';
// import { CorrespondenceService, Correspondence } from '../../_services/correspondence.service';
import { UserService } from '../../_services/user.service';
import { LookupService, LookupItem } from '../../_services/lookups.service';
import { PriceListService, PriceListItem } from '../../_services/pricelist.service';
@Component({
  selector: 'app-order-summary',
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.scss'],
  providers: [OrderService, LookupService, PriceListService]
})
export class OrderSummaryComponent implements OnInit {
  @Input() currentOrder: OrderMaster;
  @Input() orderDetail: any;
  lookupDataSource: Array<LookupItem>;
  priceListDataSource: Array<PriceListItem>;
  itemTypes: Array<PriceListItem>;
  setupItems: Array<PriceListItem>;
  styleTypes: Array<LookupItem>;
  sizeTypes: Array<LookupItem>;
  vendorTypes: Array<LookupItem>;
  artLocations: Array<LookupItem>;
  userDataSource: any;

  orderArtPlacement: Array<OrderArtPlacement>;
  orderFees: Array<OrderFee>;
  orderPayments: Array<OrderPayment>;
  orderArtFile: Array<OrderArtFile>;
  orderSum: any;
  order_detail: Array<OrderDetail>;
  orderNotes: Array<OrderNote>;

  allDataFetched = false;

  constructor(globalDataProvider: GlobalDataProvider, public orderService: OrderService, private priceListService: PriceListService) {
    /* this.order = new Order();
    this.order.order_detail = []; */
    this.orderArtPlacement = [];
    this.orderFees = [];
    this.orderPayments = [];
    this.lookupDataSource = globalDataProvider.getLookups();
    this.userDataSource = globalDataProvider.getUsers();
    this.sizeTypes = this.createLookupTypeSource('ssiz');
    this.styleTypes = this.createLookupTypeSource('sclas');
    this.vendorTypes = this.createLookupTypeSource('vend');
    this.artLocations = this.createLookupTypeSource('aloc');
    this.priceListDataSource = globalDataProvider.getPriceList();
    this.sizeTypes = this.createLookupTypeSource('ssiz');
    this.styleTypes = this.createLookupTypeSource('sclas');
    this.vendorTypes = this.createLookupTypeSource('vend');
    this.artLocations = this.createLookupTypeSource('aloc');

    priceListService.loadPricelistData('').subscribe(res => {
      this.priceListDataSource = res.value;
      this.itemTypes = this.createItemTypeSource('orddi');
      this.setupItems = this.createItemTypeSource('setup');
    });
    /* lookupService.loadLookupData('').subscribe(res => {
      this.lookupDataSource = res.value;
      console.log('Lookup Data Source', this.lookupDataSource);
      this.sizeTypes = this.createLookupTypeSource('ssiz');
      this.styleTypes = this.createLookupTypeSource('sclas');
      this.vendorTypes = this.createLookupTypeSource('vend');
      this.artLocations = this.createLookupTypeSource('aloc');

    });
     */
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
      // console.log('itemTypes', this.itemTypes);
      const foundVal = this.itemTypes.find(p => p.pricelist_id === priceList_id);
      if (foundVal) {
        // console.log('itemType', foundVal.pricelist_description);
        val = foundVal.pricelist_description;
      }
    }
    return val;
  }

  getUserName(userId: number): string {
    let val = '';
    console.log('getUserName', userId);
    if (this.userDataSource) {
      // console.log('userDataSource', this.userDataSource);
      const foundVal = this.userDataSource.find(p => p.user_id === +userId);

      if (foundVal) {
        val = foundVal.first_name + ' ' + foundVal.last_name;
      }
    }
    return val;
  }
  getLookupDescription(lookup_code: string): string {
    // console.log('Lookup Description', lookup_code);
    // console.log('LookupDataSource', this.lookupDataSource);
    let val = '';
    if (this.lookupDataSource) {
      const foundVal = this.lookupDataSource.find(p => p.char_mod === lookup_code);
      // console.log('foundVal', foundVal);
      if (foundVal) {
        val = foundVal.description;
      }
    }
    // console.log(val);
    return val;
  }

  getFeeDescription(priceList_id: number): string {
    let val = '';
    if (this.itemTypes) {
      const foundVal = this.priceListDataSource.find(p => p.pricelist_id === priceList_id);
      if (foundVal) {
        val = foundVal.pricelist_description;
      }
    }
    return val;
  }

  getStyleDescription(style_code: string): string {
    let val = '';
    if (this.styleTypes) {
      const foundVal = this.styleTypes.find(p => p.char_mod === style_code);
      if (foundVal) {
        val = foundVal.description;
      }
    }
    return val;
  }

  getSizeTypeDescription(size_type: string): string {
    let val = '';
    if (this.styleTypes) {
      const foundVal = this.sizeTypes.find(p => p.char_mod === size_type);
      if (foundVal) {
        val = foundVal.description;
      }
    }
    return val;
  }

  print() {
    let printContents, popupWin;
    printContents = document.getElementById('print-section').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Orders Summary</title>
          <style>
          .SmallBodyText
          {
              font-size: 68%;
              line-height: 16px
          }
          .SmallerBodyText
          {
              font-size: 60%;
              line-height: 16px
          }
          </style>
        </head>
    <body onload="window.print();window.close()">${printContents}</body>
      </html>`
    );
    popupWin.document.close();
  }

  ngOnInit() {
  }
  // tslint:disable-next-line:use-life-cycle-interface
  ngOnChanges() {
    this.allDataFetched = false;
    // console.log('Chg-Current Order', this.currentOrder);
    // console.log('Chg-The Order', this.orderSum);
    if (this.currentOrder.order_id !== 0) {
      this.orderService.loadOrderData('', this.currentOrder.order_id).subscribe(res => {
        // this.orderSum = res;
        this.order_detail = res.order_detail;
        // console.log('pulled order', this.orderSum);
        // console.log('order_detail', this.orderSum.order_detail);
        this.allDataFetched = true;
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
      this.orderService.loadOrderArtFileData('', this.currentOrder.order_id).subscribe(res => {
        this.orderArtFile = res.order_art_file;
      });
      this.orderService.loadOrderNotesData('', this.currentOrder.order_id).subscribe(res => {
        // console.log('Retreiving Order Notes', this.orderNotes);
        this.orderNotes = res.order_notes;
      });
    } else {
      /// this.currentOrder = new Order();
      // this.orderSum.order_detail = new Array<OrderDetail>();
      this.orderDetail = new Array<OrderDetail>();
      this.orderArtPlacement = new Array<OrderArtPlacement>();
      this.orderFees = new Array<OrderFee>();
      this.orderPayments = new Array<OrderPayment>();
      this.orderNotes = new Array<OrderNote>();
      this.allDataFetched = true;
    }
  }
}
