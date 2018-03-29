import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { environment } from '../../../environments/environment';
import { OrderService, Order, OrderDetail, OrderArtPlacement, OrderFee, OrderPayment, OrderArtFile } from '../../_services/order.service';
import { AuthenticationService } from '../../_services/authentication.service';
import { CorrespondenceService, Correspondence } from '../../_services/correspondence.service';
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
  providers: [OrderService, LookupService, PriceListService, CorrespondenceService]
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
orderCorrespondence: Array<Correspondence>;

orderArtPlacement: Array<OrderArtPlacement>;
orderFees: Array<OrderFee>;
orderPayments: Array<OrderPayment>;
orderArtFile: Array<OrderArtFile>;
order: any;
defaultDocFolder: string;
userProfile;


  constructor(public orderService: OrderService, private lookupService: LookupService, private priceListService: PriceListService,
              public correspondenceService: CorrespondenceService, public authService: AuthenticationService) {
    this.userProfile = JSON.parse(authService.getUserToken());
    this.defaultDocFolder = environment.defaultDocFolder;
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

  getLookupDescription(lookup_code: string): string {
    // console.log('Lookup Description', lookup_code);
    // console.log('LookupDataSource', this.lookupDataSource);
    let val = '';
    if (this.itemTypes) {
      const foundVal = this.lookupDataSource.find(p => p.char_mod === lookup_code);
      if (foundVal) {
        val = foundVal.description;
      }
    }
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

  convert() {
    const doc = new jsPDF('p', 'pt', 'a4');

    const margins = {
      top: 25,
      bottom: 60,
      left: 20,
      width: 522
    };

    const options = {
      pagesplit: true,
      background: '#fff',
    };

    const elementToPrint = document.getElementById('invoiceContent');
    console.log('Generating PDF', elementToPrint);
    // doc.autoTable(col, rows);
    doc.addHTML(elementToPrint, 25, 25, options, () => {
      const pdfString = doc.output('datauristring');
      const newCorr = new Correspondence();
      newCorr.corr_filename = '';
      newCorr.order_id = this.currentOrder.order_id;
      newCorr.customer_id = this.currentOrder.customer_id;
      newCorr.file_stream = pdfString;
      newCorr.corr_type = 'invoi';
      newCorr.corr_disp = 'local';
      newCorr.user_id = this.userProfile.profile.user_id;
      newCorr.corr_date = new Date().toISOString();

      this.correspondenceService.addCorrespondence(this.userProfile.profile.login_id, newCorr).subscribe(res => {
        // console.log('pdfString', pdfString);
        // const iframe = '<iframe width="100%" height="100%" src="' + pdfString + '"></iframe>';
        const newWindow = window.open(this.defaultDocFolder + res);
        // newWindow.document.write(iframe);
        // newWindow.document.close();
        // console.log('New Window', newWindow);
      });
    });

  }

  ngOnInit() {

  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnChanges() {
    // console.log('Current Order', this.currentOrder);
    if (this.currentOrder.order_id !== 0) {
      this.orderService.loadOrderData('', this.currentOrder.order_id).subscribe(res => {
        this.order = res;
        // console.log('pulled order', this.order);
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
        console.log('pulled ArtFile Data', this.orderArtFile);
      });
      this.correspondenceService.getCorrespondenceData('', this.currentOrder.order_id).subscribe(res => {
        this.orderArtFile = res.order_art_file;
        console.log('pulled ArtFile Data', this.orderArtFile);
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
