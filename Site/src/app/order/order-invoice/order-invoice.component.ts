import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { environment } from '../../../environments/environment';
import { GlobalDataProvider } from '../../_providers/global-data.provider';
import { OrderService, Order, OrderDetail, OrderArtPlacement,
        OrderFee, OrderPayment, OrderArtFile, OrderMaster } from '../../_services/order.service';
import { AuthenticationService } from '../../_services/authentication.service';
import { CorrespondenceService, Correspondence } from '../../_services/correspondence.service';
import { UserService } from '../../_services/user.service';
import { LookupService, LookupItem } from '../../_services/lookups.service';
import { PriceListService, PriceListItem } from '../../_services/pricelist.service';
import { DxLoadPanelModule } from 'devextreme-angular';
import { WindowRef } from '../../_services/window-ref.service';

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
  providers: [OrderService, LookupService, PriceListService, CorrespondenceService, CurrencyPipe]
})
export class OrderInvoiceComponent implements OnInit {
 // @Input() currentOrder: any;
  @Input() masterOrder: OrderMaster;
  @Output() onSave = new EventEmitter<any>();
  loading = false;
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

  window;

  constructor(globalDataProvider: GlobalDataProvider, public orderService: OrderService, private priceListService: PriceListService,
    public correspondenceService: CorrespondenceService, public windowRef: WindowRef,
    public authService: AuthenticationService, public cp: CurrencyPipe) {
    this.window = windowRef.nativeWindow;
    this.userProfile = JSON.parse(authService.getUserToken());
    this.defaultDocFolder = environment.defaultDocFolder;
    this.order = new Order();
    this.order.order_detail = [];
    this.orderArtPlacement = [];
    this.orderFees = [];
    this.orderPayments = [];
    this.lookupDataSource = globalDataProvider.getLookups();
    this.sizeTypes = this.createLookupTypeSource('ssiz');
    this.styleTypes = this.createLookupTypeSource('sclas');
    this.vendorTypes = this.createLookupTypeSource('vend');
    this.artLocations = this.createLookupTypeSource('aloc');
    this.paymentSourceItems = this.createLookupTypeSource('pms');
    this.correspondenceTypes = this.createLookupTypeSource('cort');
    this.correspondenceDisp = this.createLookupTypeSource('crdis');
/*     lookupService.loadLookupData('').subscribe(res => {
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
    }); */
    this.priceListDataSource = globalDataProvider.getPriceList();
    this.itemTypes = this.createItemTypeSource('orddi');
    this.setupItems = this.createItemTypeSource('setup');
    /* priceListService.loadPricelistData('').subscribe(res => {
      this.priceListDataSource = res.value;
      this.itemTypes = this.createItemTypeSource('orddi');
      this.setupItems = this.createItemTypeSource('setup');
    }); */
    this.userDataSource = globalDataProvider.getUsers();
    /* userService.getUsers('').subscribe(res => {
      this.userDataSource = res.value;
      // console.log(this.userDataSource);
    }); */
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
  
  generateInvoice() {

    const toDataURL = url => fetch(url)
    .then(response => response.blob())
    .then(blob => new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    }))
    // tslint:disable-next-line:max-line-length
    // const logoData = 'data:image/jpeg;base64,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';
    // const logoData = '';
    // let logoData = '';
    toDataURL('assets/splogo.jpg')
      .then(dataURL => {
       let logoData = dataURL;
      
      console.log('logoData', logoData);
      const doc = new jsPDF();
      const lineLocation = 15;
      const lineOffset = 5;
      // console.log('Master Order', this.masterOrder);
      doc.addImage(logoData, 'JPEG', 15, 15, 60, 50);

      this.buildInvoiceBoxes(doc);
      this.buildHeader(doc, lineLocation, lineOffset);
      this.buildLineItemHeader(doc, 95, 5);

      // console.log('Line Items', this.order.order_detail);
      let detailLineLocation = 105;
      if (this.order.order_detail) {
        this.order.order_detail.forEach(lineItem => {
          this.buildLineItem(doc, detailLineLocation, lineItem);
          detailLineLocation = detailLineLocation + 5;
        });
      }

      this.buildFeeItemHeader(doc, detailLineLocation, 8);
      // console.log('Fee Item', this.orderFees);
      let feeLineLocation = detailLineLocation + 14;
      if (this.orderFees) {
        this.orderFees.forEach(feeItem => {
          this.buildFeeItem(doc, feeLineLocation, feeItem);
          feeLineLocation = feeLineLocation + 5;
        });
      }

      this.buildArtInfoHeader(doc, feeLineLocation, 8);
      let artInfoLineLocation = feeLineLocation + 14;
      if (this.orderArtPlacement) {
        this.orderArtPlacement.forEach(artPlcItem => {
          this.buildArtInfoItem(doc, artInfoLineLocation, artPlcItem);
          artInfoLineLocation = artInfoLineLocation + 5;
        });
      }

      this.buildArtFileHeader(doc, artInfoLineLocation, 8);
      let artFileLineLocation = artInfoLineLocation + 14;
      if (this.orderArtFile) {
        this.orderArtFile.forEach(artFile => {
          this.buildArtFileItem(doc, artFileLineLocation, artFile);
          artFileLineLocation = artFileLineLocation + 5;
        });
      }

      this.buildPaymentsHeader(doc, 240, 8);
      let paymentLineLocation = 254;
      if (this.orderPayments) {
        this.orderPayments.forEach(payment => {
          this.buildPaymentItem(doc, paymentLineLocation, payment);
          paymentLineLocation = paymentLineLocation + 5;
        });
      }
      // console.log('PaymentLineLocation', paymentLineLocation);
      this.buildTotalSummaryHeader(doc, 250);
      this.buildTotalSummary(doc, 250);

      this.buildInvoiceMessage(doc);

      // doc.addImage(logoData, 'JPEG', 10, 10, 241, 171, 200, 100);
      // doc.save('invoice.pdf');
      const pdfString = doc.output('datauristring');
      const newCorr = new Correspondence();
      newCorr.corr_filename = '';
      newCorr.order_id = this.masterOrder.order_id;
      newCorr.customer_id = this.masterOrder.customer_id;
      newCorr.file_stream = pdfString;
      newCorr.corr_type = 'invoi';
      newCorr.corr_disp = 'local';
      newCorr.user_id = this.userProfile.profile.user_id;
      newCorr.corr_date = new Date().toISOString();

      this.correspondenceService.addCorrespondence(this.userProfile.profile.login_id, newCorr).subscribe(res => {
        const newWindow = window.open(this.defaultDocFolder + res);
        this.correspondenceService.getCorrespondenceData('', this.masterOrder.order_id).subscribe(res2 => {
          // this.orderCorrespondence = res2.correspondences;
          this.onSave.emit({
            correspondence: newCorr
          });
          this.loading = false;
        });
      });
    })
  }

  private buildInvoiceMessage(doc) {
    doc.setFontSize(8);
    doc.setFontType('bold');
    doc.text(105, 285, 'Thank you for your order! We appreciate your business.', 'center');
    doc.setFontSize(8);
    doc.setFontType('bolditalic');
    doc.text(105, 288, 'A 50% deposit is required to initiate all orders. Balance is due upon shipment of order.', 'center');
    doc.setFontSize(6);
    doc.setFontType('normal');
    let disclaimer = 'All artwork and custom designs are for the use only of the individual or organization paying for the designs.';
    disclaimer = disclaimer.concat(' The "screens" remain the property of Southpaw Screen Printing.');
    doc.text(105, 291, disclaimer, 'center');

  }
  private buildInvoiceBoxes(doc) {
    // Setting up top header information
    doc.rect(105, 21, 100, 65);
    doc.rect(105, 21, 29, 65);
    doc.rect(105, 21, 100, 5); // OrderNumber
    doc.rect(105, 26, 100, 20); // BillTo
    doc.rect(105, 46, 100, 25); // ShipTo
    doc.rect(105, 71, 100, 5); // OrderDate
    doc.rect(105, 76, 100, 5); // DueDate
    doc.rect(105, 86, 100, 5); // Sales Rep

    doc.rect(5, 91, 200, 192); // Invoice details

    doc.setFillColor(185, 215, 255);
    doc.rect(5, 96, 200, 5, 'FD'); // Invoice Line Header
  }

  private buildHeader(doc, lineLocation: number, lineOffset: number) {
    doc.setFontSize(18);
    doc.setFontType('bold');
    doc.text(80, lineLocation, 'Work Order / Receipt');

    doc.setFontSize(10);
    doc.setFontType('bold');
    lineLocation = 25;
    doc.text(106, lineLocation, 'Order Number');
    lineLocation = lineLocation + lineOffset; // 30
    doc.text(106, lineLocation, 'Bill To');
    lineLocation = lineLocation + (lineOffset * 4); // 50
    doc.text(106, lineLocation, 'Ship To');
    lineLocation = lineLocation + (lineOffset * 5); // 75
    doc.text(106, lineLocation, 'Order Date');
    lineLocation = lineLocation + lineOffset; // 80
    doc.text(106, lineLocation, 'Due Date');
    lineLocation = lineLocation + lineOffset; // 85
    doc.text(106, lineLocation, 'PO #');
    lineLocation = lineLocation + lineOffset; // 90
    doc.text(106, lineLocation, 'Sales Rep');
    lineLocation = lineLocation + lineOffset; // 95

    // Header Data information
    doc.setFontSize(8);
    doc.setFontType('normal');
    lineLocation = 25;
    doc.text(136, lineLocation, this.masterOrder.order_number);
    lineLocation = lineLocation + lineOffset; // 30
    // Bill To information
    doc.text(136, lineLocation, this.masterOrder.customer == null ? '' : this.masterOrder.customer.customer_name);
    lineLocation = lineLocation + lineOffset; // 35
    if (this.masterOrder.BILL_ADDRESS_1 !== null && this.masterOrder.BILL_ADDRESS_1.length > 0) {
      doc.text(136, lineLocation, this.masterOrder.BILL_ADDRESS_1 == null ? '' : this.masterOrder.BILL_ADDRESS_1);
    }
    lineLocation = lineLocation + lineOffset; // 40
    if (this.masterOrder.BILL_ADDRESS_2 !== null && this.masterOrder.BILL_ADDRESS_2.length > 0) {
      doc.text(136, lineLocation, this.masterOrder.BILL_ADDRESS_2 == null ? '' : this.masterOrder.BILL_ADDRESS_2);
    }
    lineLocation = lineLocation + lineOffset; // 45
    let cityLine = this.masterOrder.BILL_CITY == null ? '' : this.masterOrder.BILL_CITY;
    cityLine = cityLine.concat(' ', this.masterOrder.BILL_STATE == null ? '' : this.masterOrder.BILL_STATE);
    cityLine = cityLine.concat(' ', this.masterOrder.BILL_ZIP == null ? '' : this.masterOrder.BILL_ZIP);
    // console.log('cityLine', cityLine);
    doc.text(136, lineLocation, cityLine);
    lineLocation = lineLocation + (lineOffset); // 50
    // Ship to information
    doc.text(136, lineLocation, this.masterOrder.customer == null ? '' : this.masterOrder.customer.customer_name);
    lineLocation = lineLocation + lineOffset; // 55
    const attnLine = 'Attn: ';
    doc.text(136, lineLocation, attnLine.concat(this.masterOrder.ship_attn == null ? '' : this.masterOrder.ship_attn));
    lineLocation = lineLocation + lineOffset; // 60
    if (this.masterOrder.SHIP_ADDRESS_1 !== null && this.masterOrder.SHIP_ADDRESS_1.length > 0) {
      doc.text(136, lineLocation, this.masterOrder.SHIP_ADDRESS_1 == null ? '' : this.masterOrder.SHIP_ADDRESS_1);
    }
    lineLocation = lineLocation + lineOffset; // 65
    if (this.masterOrder.SHIP_ADDRESS_2 !== null) {
      doc.text(136, lineLocation, this.masterOrder.SHIP_ADDRESS_2 == null ? '' : this.masterOrder.SHIP_ADDRESS_2);
    }
    lineLocation = lineLocation + lineOffset; // 70
    let cityLine2 = this.masterOrder.SHIP_CITY == null ? '' : this.masterOrder.SHIP_CITY;
    cityLine2 = cityLine2.concat(' ', this.masterOrder.SHIP_STATE == null ? '' : this.masterOrder.SHIP_STATE);
    cityLine2 = cityLine2.concat(' ', this.masterOrder.SHIP_ZIP == null ? '' : this.masterOrder.SHIP_ZIP);
    doc.text(136, lineLocation, cityLine2);

    lineLocation = lineLocation + lineOffset; // 80
    console.log('Order Date - lineLocation', lineLocation);
    doc.text(136, lineLocation, this.masterOrder.order_date == null ? ''
                              : new Date(this.masterOrder.order_date).toLocaleDateString());
    lineLocation = lineLocation + lineOffset; // 85
    doc.text(136, lineLocation, this.masterOrder.order_due_date == null ? ''
                              : new Date(this.masterOrder.order_due_date).toLocaleDateString());
    lineLocation = lineLocation + lineOffset; // 90
    doc.text(136, lineLocation, this.masterOrder.purchase_order == null ? '' : this.masterOrder.purchase_order);
    lineLocation = lineLocation + lineOffset; // 95
    doc.text(136, lineLocation, this.masterOrder.taken_user_id == null ? '' : this.getUserName(this.masterOrder.taken_user_id));
    lineLocation = lineLocation + lineOffset; // 100

  }

  private buildLineItemHeader(doc, lineLocation: number, lineOffset: number) {
    doc.setFontSize(10);
    doc.setFontType('bold');
    doc.text(6, lineLocation, 'Order Items');
    lineLocation = lineLocation + lineOffset;

    doc.setFontSize(8);
    doc.setFontType('bold');
    doc.text(8, lineLocation, 'Item');
    doc.text(45, lineLocation, 'Style');
    doc.text(60, lineLocation, 'Y / A');
    doc.text(70, lineLocation, 'Color');
    doc.text(86, lineLocation, 'XS');
    doc.text(92, lineLocation, 'S');
    doc.text(97, lineLocation, 'M');
    doc.text(102, lineLocation, 'L');
    doc.text(107, lineLocation, 'XL');
    doc.text(113, lineLocation, '2XL');
    doc.text(120, lineLocation, '3XL');
    doc.text(127, lineLocation, '4XL');
    doc.text(134, lineLocation, '5XL');
    doc.text(145, lineLocation, 'Other');
    doc.text(160, lineLocation, 'Qty');
    doc.text(172, lineLocation, 'Price');
    doc.text(185, lineLocation, 'Sub');
    doc.text(199, lineLocation, 'Tax');
  }

  private buildFeeItemHeader(doc, lineLocation: number, lineOffset: number) {
    doc.setFontSize(10);
    doc.setFontType('bold');
    doc.text(6, lineLocation + 3, 'Fees');

    doc.setFillColor(185, 215, 255);
    doc.rect(5, lineLocation + 4, 200, 6, 'FD'); // Fee Line Header

    lineLocation = lineLocation + lineOffset;
    doc.setFontSize(8);
    doc.setFontType('bold');
    doc.text(8, lineLocation, 'Fee Description');
    doc.text(160, lineLocation, 'Qty');
    doc.text(172, lineLocation, 'Price');
    doc.text(185, lineLocation, 'Sub');
    doc.text(199, lineLocation, 'Tax');
  }

  private buildArtInfoHeader(doc, lineLocation: number, lineOffset: number) {
    doc.setFontSize(10);
    doc.setFontType('bold');
    doc.text(6, lineLocation + 3, 'Art Info');

    doc.setFillColor(185, 215, 255);
    doc.rect(5, lineLocation + 4, 200, 6, 'FD'); // Fee Line Header

    lineLocation = lineLocation + lineOffset;
    doc.setFontSize(8);
    doc.setFontType('bold');
    doc.text(8, lineLocation, 'Placement');
    doc.text(46, lineLocation, 'Colors');
    doc.text(105, lineLocation, 'Note');
  }

  private buildArtFileHeader(doc, lineLocation: number, lineOffset: number) {
    doc.setFontSize(10);
    doc.setFontType('bold');
    doc.text(6, lineLocation + 3, 'Art File');

    doc.setFillColor(185, 215, 255);
    doc.rect(5, lineLocation + 4, 160, 6, 'FD'); // Fee Line Header

    lineLocation = lineLocation + lineOffset;
    doc.setFontSize(8);
    doc.setFontType('bold');
    doc.text(8, lineLocation, 'Image File');
    doc.text(75, lineLocation, 'Art Folder');
    doc.text(105, lineLocation, 'Note');
  }

  private buildTotalSummaryHeader(doc, lineLocation: number) {

    doc.setFontSize(10);
    doc.setFontType('normal');

    doc.text(150, lineLocation, 'Subtotal:');
    doc.text(150, lineLocation + 5, 'Tax Rate:');
    doc.text(150, lineLocation + 10, 'Tax:');
    doc.text(150, lineLocation + 15, 'Shipping:');
    doc.text(150, lineLocation + 20, 'Total:');
    doc.text(150, lineLocation + 25, 'Payments:');

    doc.setFontType('bolditalic');
    doc.text(150, lineLocation + 30, 'Balance Due:');

  }

  private buildPaymentsHeader(doc, lineLocation: number, lineOffset: number) {
    doc.setFontSize(10);
    doc.setFontType('bold');
    doc.text(6, lineLocation + 3, 'Payments');

    doc.setFillColor(185, 215, 255);
    doc.rect(5, lineLocation + 4, 120, 6, 'FD'); // Fee Line Header

    lineLocation = lineLocation + lineOffset;
    doc.setFontSize(8);
    doc.setFontType('bold');
    doc.text(8, lineLocation, 'Amount');
    doc.text(45, lineLocation, 'Type');
    doc.text(70, lineLocation, 'Date');
  }

  private buildFeeItem(doc, lineLocation: number, feeItem) {
    doc.setFontSize(8);
    doc.setFontType('normal');

    doc.text(8, lineLocation, this.getFeeDescription(feeItem.pricelist_id));

    doc.text(160, lineLocation, feeItem.fee_quantity === null ? '' : feeItem.fee_quantity.toString());
    doc.rect(5, lineLocation - 4, 160, 5);
    doc.text(172, lineLocation, feeItem.fee_price_each === null ? '' : feeItem.fee_price_each.toString());
    doc.rect(5, lineLocation - 4, 175, 5);
    doc.text(185, lineLocation, feeItem.fee_price_ext === null ? '' : feeItem.fee_price_ext.toString());
    doc.rect(5, lineLocation - 4, 195, 5);
    doc.text(201, lineLocation, feeItem.taxable_ind === null ? 'N' : feeItem.taxable_ind.toString());

    doc.rect(5, lineLocation - 4, 200, 5);
    // doc.rect(5, lineLocation + 1, 200, 5);
  }

  private buildLineItem(doc, lineLocation: number, lineItem) {
    doc.setFontSize(8);
    doc.setFontType('normal');

    doc.text(8, lineLocation, this.getItemDescription(lineItem.pricelist_id));
    doc.rect(5, lineLocation - 4, 39, 5);
    doc.text(45, lineLocation, lineItem.product_code === null ? '' : lineItem.product_code);
    doc.rect(5, lineLocation - 4, 54, 5);
    doc.text(60, lineLocation, this.getStyleDescription(lineItem.style_code));
    doc.rect(5, lineLocation - 4, 64, 5);
    doc.text(70, lineLocation, lineItem.color_code === null ? '' : lineItem.color_code.toString());
    doc.rect(5, lineLocation - 4, 81, 5);
    doc.text(87, lineLocation, lineItem.xsmall_qty === null ? '' : lineItem.xsmall_qty.toString());
    doc.rect(5, lineLocation - 4, 86, 5);
    doc.text(92, lineLocation, lineItem.small_qty === null ? '' : lineItem.small_qty.toString());
    doc.rect(5, lineLocation - 4, 91, 5);
    doc.text(97, lineLocation, lineItem.med_qty === null ? '' : lineItem.med_qty.toString());
    doc.rect(5, lineLocation - 4, 96, 5);
    doc.text(102, lineLocation, lineItem.large_qty === null ? '' : lineItem.large_qty.toString());
    doc.rect(5, lineLocation - 4, 101, 5);
    doc.text(108, lineLocation, lineItem.xl_qty === null ? '' : lineItem.xl_qty.toString());
    doc.rect(5, lineLocation - 4, 107, 5);
    doc.text(114, lineLocation, lineItem.C2xl_qty === null ? '' : lineItem.C2xl_qty.toString());
    doc.rect(5, lineLocation - 4, 113, 5);
    doc.text(121, lineLocation, lineItem.C3xl_qty === null ? '' : lineItem.C3xl_qty.toString());
    doc.rect(5, lineLocation - 4, 121, 5);
    doc.text(128, lineLocation, lineItem.C4xl_qty === null ? '' : lineItem.C4xl_qty.toString());
    doc.rect(5, lineLocation - 4, 128, 5);
    doc.text(135, lineLocation, lineItem.C5xl_qty === null ? '' : lineItem.C5xl_qty.toString());
    doc.rect(5, lineLocation - 4, 135, 5);
    // console.log('other1_type', lineItem);
    if (lineItem.other1_qty !== null) {
      doc.text(143, lineLocation, this.getSizeTypeDescription(lineItem.other1_type) + '(' + (lineItem.other1_qty === null ? '' : lineItem.other1_qty.toString()) + ')');
    }
    //doc.text(152, lineLocation, );
    doc.rect(5, lineLocation - 4, 152, 5);
    doc.text(160, lineLocation, lineItem.item_quantity === null ? '' : lineItem.item_quantity.toString());
    doc.rect(5, lineLocation - 4, 160, 5);
    doc.text(172, lineLocation, lineItem.item_price_each === null ? '' : lineItem.item_price_each.toString());
    doc.rect(5, lineLocation - 4, 175, 5);
    doc.text(185, lineLocation, lineItem.item_price_ext === null ? '' : lineItem.item_price_ext.toString());
    doc.rect(5, lineLocation - 4, 195, 5);
    doc.text(201, lineLocation, lineItem.taxable_ind);

    doc.rect(5, lineLocation - 4, 200, 5);
  }

  private buildArtInfoItem(doc, lineLocation: number, artInfo: OrderArtPlacement) {
    doc.setFontSize(8);
    doc.setFontType('normal');

    doc.text(8, lineLocation, this.getLookupDescription(artInfo.art_placement_code));
    doc.rect(5, lineLocation - 4, 39, 5);
    doc.text(46, lineLocation, artInfo.colors === null ? '' : artInfo.colors.toString());
    doc.rect(5, lineLocation - 4, 98, 5);
    doc.text(105, lineLocation, artInfo.notes === null ? '' : artInfo.notes.toString());
    // doc.rect(5, lineLocation - 4, 64, 5);

    doc.rect(5, lineLocation - 4, 200, 5);
  }

  private buildArtFileItem(doc, lineLocation: number, artFileInfo: OrderArtFile) {
    doc.setFontSize(8);
    doc.setFontType('normal');

    doc.text(8, lineLocation, artFileInfo.image_file);
    doc.rect(5, lineLocation - 4, 69, 5);
    doc.text(75, lineLocation, artFileInfo.art_folder === null ? '' : artFileInfo.art_folder.toString());
    doc.rect(5, lineLocation - 4, 98, 5);
    doc.text(105, lineLocation, artFileInfo.note === null ? '' : artFileInfo.note.toString());
    doc.rect(5, lineLocation - 4, 160, 5);

    // doc.rect(5, lineLocation + 1, 120, 5);
  }

  private buildPaymentItem(doc, lineLocation: number, payment: OrderPayment) {
    doc.setFontSize(8);
    doc.setFontType('normal');

    doc.text(20, lineLocation, this.cp.transform(payment.payment_amount, 'USD', 'symbol'), 'right');
    doc.rect(5, lineLocation - 4, 39, 5);
    doc.text(45, lineLocation, payment.payment_type_code === null ? '' : this.getLookupDescription(payment.payment_type_code));
    doc.rect(5, lineLocation - 4, 64, 5);
    doc.text(70, lineLocation, payment.payment_date === null ? '' : new Date(payment.payment_date).toLocaleDateString());

    doc.rect(5, lineLocation - 4, 120, 5);

    // doc.rect(5, lineLocation + 1, 120, 5);
  }

  private buildTotalSummary(doc, lineLocation: number) {
    doc.setFontSize(10);
    doc.setFontType('normal');
    // console.log('buildTotalSummary', this.masterOrder);
    doc.text(195, lineLocation, (this.masterOrder.subtotal === null ? '-' :
      this.cp.transform(this.masterOrder.subtotal.toString(), 'USD', 'symbol')), 'right');
    doc.text(195, lineLocation + 5, (this.masterOrder.tax_rate === null ? '-' :
      this.masterOrder.tax_rate.toString() + '%'), 'right');
    doc.text(195, lineLocation + 10, (this.masterOrder.tax_amount === null ? '-' :
      this.cp.transform(this.masterOrder.tax_amount.toString(), 'USD', 'symbol')), 'right');
    doc.text(195, lineLocation + 15, (this.masterOrder.shipping === null ? '-' :
      this.cp.transform(this.masterOrder.shipping.toString(), 'USD', 'symbol')), 'right');
    doc.text(195, lineLocation + 20, (this.masterOrder.total === null ? '-' :
      this.cp.transform(this.masterOrder.total.toString(), 'USD', 'symbol')), 'right');
    doc.text(195, lineLocation + 25, (this.masterOrder.payments === null ? '-' :
      this.cp.transform(this.masterOrder.payments.toString(), 'USD', 'symbol')), 'right');

    doc.setFontType('bold');
    doc.text(195, lineLocation + 30, '$' + this.masterOrder.balance_due === null ? '' :
      this.cp.transform(this.masterOrder.balance_due.toString(), 'USD', 'symbol'), 'right');
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

  getUserName(userId: number): string {
    let val = '';
    // console.log('getUserName', userId);
    if (this.userDataSource) {
      // console.log('userDataSource', this.userDataSource);
      const foundVal = this.userDataSource.find(p => p.user_id === +userId);

      if (foundVal) {
        val = foundVal.first_name + ' ' + foundVal.last_name;
      }
    }
    return val;
  }

  /* getFileContentAsBase64(path, callback) {
    
    let xhr = new XMLHttpRequest();
    xhr.onloadend = function() {
      let reader = new FileReader();
      reader.onloadend = () => {
          console.log('getFilecontentAsBase64', reader.result);
          callback(reader.result);
      }
      reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', path);
    xhr.responseType = 'blob';
    xhr.send();
    
  } */
  ngOnInit() {
    // console.log('order-invoice:ngOnInit: Master Order', this.masterOrder);
    if (this.masterOrder) {
      this.order = this.masterOrder;
      this.orderArtPlacement = this.masterOrder.order_art_placements;
      this.orderArtFile = this.masterOrder.order_art_file;
      this.orderFees = this.masterOrder.order_fees;
      this.orderPayments = this.masterOrder.order_payments;
      this.orderCorrespondence = this.masterOrder.order_correspondence;
      /* this.correspondenceService.getCorrespondenceData('', this.masterOrder.order_id).subscribe(res => {
        console.log('correspondenceData return', res);
        this.orderCorrespondence = res.correspondences;
        this.loading = false;
        // console.log('pulled Correspondence Data', this.orderCorrespondence);
      }); */
      // this.selectedOrder = this.masterOrder;
    }
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnChanges() {
    // console.log('order-invoice:ngOnChanges: Master Order', this.masterOrder);
    if (this.masterOrder) {
      this.order = this.masterOrder;
      this.orderArtPlacement = this.masterOrder.order_art_placements;
      this.orderArtFile = this.masterOrder.order_art_file;
      this.orderFees = this.masterOrder.order_fees;
      this.orderPayments = this.masterOrder.order_payments;
      this.orderCorrespondence = this.masterOrder.order_correspondence;
    }
    /* if (this.currentOrder.order_id !== 0) {
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
    } */
  }
}
