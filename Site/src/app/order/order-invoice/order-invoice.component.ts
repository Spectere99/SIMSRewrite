import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { environment } from '../../../environments/environment';
import { OrderService, Order, OrderDetail, OrderArtPlacement, OrderFee, OrderPayment, OrderArtFile } from '../../_services/order.service';
import { AuthenticationService } from '../../_services/authentication.service';
import { CorrespondenceService, Correspondence } from '../../_services/correspondence.service';
import { UserService } from '../../_services/user.service';
import { LookupService, LookupItem } from '../../_services/lookups.service';
import { PriceListService, PriceListItem } from '../../_services/pricelist.service';
import { DxLoadPanelModule } from 'devextreme-angular';

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
@Output() onSave = new EventEmitter<any>();
private loading = false;
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
correspondenceTypes: Array<LookupItem>;
correspondenceDisp: Array<LookupItem>;
userDataSource: any;


orderArtPlacement: Array<OrderArtPlacement>;
orderFees: Array<OrderFee>;
orderPayments: Array<OrderPayment>;
orderArtFile: Array<OrderArtFile>;
order: any;
defaultDocFolder: string;
userProfile;


  constructor(public orderService: OrderService, private lookupService: LookupService, private priceListService: PriceListService,
              public correspondenceService: CorrespondenceService, private userService: UserService,
              public authService: AuthenticationService) {
    this.userProfile = JSON.parse(authService.getUserToken());
    this.defaultDocFolder = environment.defaultDocFolder;
    this.order = new Order();
    this.order.order_detail = [];
    this.orderArtPlacement = [];
    this.orderFees = [];
    this.orderPayments = [];
    lookupService.loadLookupData('').subscribe(res => {
      this.lookupDataSource = res.value;
      // console.log('Lookup Data Source', this.lookupDataSource);
      this.sizeTypes = this.createLookupTypeSource('ssiz');
      this.styleTypes = this.createLookupTypeSource('sclas');
      this.vendorTypes = this.createLookupTypeSource('vend');
      this.artLocations = this.createLookupTypeSource('aloc');
      this.paymentSourceItems = this.createLookupTypeSource('pms');
      this.correspondenceTypes = this.createLookupTypeSource('cort');
      this.correspondenceDisp = this.createLookupTypeSource('crdis');
      // console.log('correspendecne Types', this.correspondenceTypes);
      // console.log('correspendecne Disp', this.correspondenceDisp);
    });
    priceListService.loadPricelistData('').subscribe(res => {
      this.priceListDataSource = res.value;
      this.itemTypes = this.createItemTypeSource('orddi');
      this.setupItems = this.createItemTypeSource('setup');
    });
    userService.getUsers('').subscribe(res => {
      this.userDataSource = res.value;
      // console.log(this.userDataSource);
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
    if (this.lookupDataSource) {
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
    this.loading = true;
    const doc = new jsPDF('p', 'pt', 'letter');

/*     const margins = {
      top: 15,
      bottom: 10,
      left: 20,
    }; */

    const options = {
      pagesplit: true,
      background: '#fff',
      dim: {
        h: 775,
        w: 575
      }
    };

    const elementToPrint = document.getElementById('invoiceContent');
    // elementToPrint.parentElement.style.height = '10000px';
    // elementToPrint.style.display = 'inline-block';
    elementToPrint.style.width = 'auto';
    elementToPrint.style.height = 'auto';
    console.log('Generating PDF', elementToPrint);
    // doc.autoTable(col, rows);
    // elementToPrint.style.height = '2000px';
    doc.addHTML(elementToPrint, 15, 15, options, () => {
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
        const newWindow = window.open(this.defaultDocFolder + res);
        this.correspondenceService.getCorrespondenceData('', this.currentOrder.order_id).subscribe(res2 => {
          // this.orderCorrespondence = res2.correspondences;
          this.onSave.emit({
            correspondence: newCorr
          });
          this.loading = false;
        });
      });
    });
  }

  print() {
    let printContents, popupWin;
    printContents = document.getElementById('invoiceContent').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Orders Summary</title>
          <style>
          th {
            background-color:#eee;
            font:  11px "Trebuchet MS", Verdana, Arial, Helvetica,sans-serif;
          }
          td {
            font:  10px "Trebuchet MS", Verdana, Arial, Helvetica,sans-serif;
          }
          h5 {
            font:  9px "Trebuchet MS", Verdana, Arial, Helvetica,sans-serif;
          }
          h6 {
            font:  6px "Trebuchet MS", Verdana, Arial, Helvetica,sans-serif;
          }
          .box1 {
            background: url("/assets/boxtl.gif") no-repeat top left;
            padding: 20px 0px 0px;
            margin: 0;
            height: 25px;
          }
          .box2 {
            background: url("/assets/boxtm.gif") repeat top left;
            padding: 20px 0px 5px;
            margin: 0;
            color: white;
            width: 100%;
          }
          .box3 {
            background: url("/assets/boxtr.gif") no-repeat top left;
            margin: 0;
          }
          .box4 {
            background: url("/assets/boxl.gif") repeat top left;
            margin: 0;
          }
          .box5 {
            background: url("/assets/boxr.gif") repeat top right;
            background-color: white;
            margin: 0;
          }
          .box6 {
            background: url("/assets/boxbl.gif") no-repeat top left;
            background-color: white;
            margin: 0;
            padding: 5px 15px 25px;
            height: 30px;
          }
          .box7 {
            background: url("/assets/boxbm.gif") repeat top left;
            background-color: white;
            margin: 0;
            padding: 5px 15px 25px;
          }
          .box8 {
            background: url("/assets/boxbr.gif") no-repeat top left;
            background-color: white;
            padding: 5px 15px 25px;
          }
          .boxcontent {
            background-color: #E6E6E6;
            padding: 5px 0px 0px;
          }
          </style>
        </head>
      <body>${printContents}</body>
      </html>`
    );
   // <body onload="window.print();window.close()">${printContents}</body>
   // </html>`
    popupWin.document.close();
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
        // console.log('pulled ArtFile Data', this.orderArtFile);
      });
      this.correspondenceService.getCorrespondenceData('', this.currentOrder.order_id).subscribe(res => {
        // console.log('correspondenceData return', res);
        this.orderCorrespondence = res.correspondences;
        // console.log('pulled Correspondence Data', this.orderCorrespondence);
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
