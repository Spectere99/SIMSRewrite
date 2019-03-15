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
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      // console.log('blob', blob);
      reader.readAsText(blob);
    }));
    // tslint:disable-next-line:max-line-length
    // const logoData = '';
    // let logoData = '';
    toDataURL('assets/InvoiceLogo.txt')
      .then(dataURL => {
      const logoData2 = dataURL;
      const doc = new jsPDF();
      const lineLocation = 15;
      const lineOffset = 5;
      // console.log('Master Order', this.masterOrder);
      doc.addImage(logoData2, 'JPEG', 15, 25, 70, 50);

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
      this.buildTotalSummaryHeader(doc, 245);
      this.buildTotalSummary(doc, 245);

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

      this.correspondenceService.addCorrespondence(this.userProfile.profile.login_id.toUpperCase(), newCorr).subscribe(res => {
        const newWindow = window.open(this.defaultDocFolder + res);
        this.correspondenceService.getCorrespondenceData('', this.masterOrder.order_id).subscribe(res2 => {
          // this.orderCorrespondence = res2.correspondences;
          this.onSave.emit({
            correspondence: newCorr
          });
          this.loading = false;
        });
      });
    });
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
    // console.log('Order Date - lineLocation', lineLocation);
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
    doc.text(150, lineLocation + 5, 'Non-taxable:');
    doc.text(150, lineLocation + 10, 'Tax Rate:');
    doc.text(150, lineLocation + 15, 'Tax:');
    doc.text(150, lineLocation + 20, 'Shipping:');
    doc.text(150, lineLocation + 25, 'Total:');
    doc.text(150, lineLocation + 30, 'Payments:');

    doc.setFontType('bolditalic');
    doc.text(150, lineLocation + 35, 'Balance Due:');

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
      doc.text(143, lineLocation, this.getSizeTypeDescription(lineItem.other1_type) + '(' + (lineItem.other1_qty === null ? ''
      : lineItem.other1_qty.toString()) + ')');
    }
    // doc.text(152, lineLocation, );
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
    doc.text(46, lineLocation, (artInfo.colors === null || artInfo.colors === undefined) ? '' : artInfo.colors.toString());
    doc.rect(5, lineLocation - 4, 98, 5);
    doc.text(105, lineLocation, (artInfo.notes === null || artInfo.colors === undefined) ? '' : artInfo.notes.toString());
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
    const non_tax = ((this.masterOrder.total === null) ? 0 : +this.masterOrder.total) -
                    ((this.masterOrder.subtotal === null) ? 0 : +this.masterOrder.subtotal) -
                    ((this.masterOrder.tax_amount === null) ? 0 : +this.masterOrder.tax_amount);
    doc.text(195, lineLocation + 5, (non_tax === null ? '-' :
      this.cp.transform(non_tax, 'USD', 'symbol')), 'right');
    doc.text(195, lineLocation + 10, (this.masterOrder.tax_rate === null ? '-' :
      this.masterOrder.tax_rate.toString() + '%'), 'right');
    doc.text(195, lineLocation + 15, (this.masterOrder.tax_amount === null ? '-' :
      this.cp.transform(this.masterOrder.tax_amount.toString(), 'USD', 'symbol')), 'right');
    doc.text(195, lineLocation + 20, (this.masterOrder.shipping === null ? '-' :
      this.cp.transform(this.masterOrder.shipping.toString(), 'USD', 'symbol')), 'right');
    doc.text(195, lineLocation + 25, (this.masterOrder.total === null ? '-' :
      this.cp.transform(this.masterOrder.total.toString(), 'USD', 'symbol')), 'right');
    doc.text(195, lineLocation + 30, (this.masterOrder.payments === null ? '-' :
      this.cp.transform(this.masterOrder.payments.toString(), 'USD', 'symbol')), 'right');

    doc.setFontType('bold');
    doc.text(195, lineLocation + 35, '$' + this.masterOrder.balance_due === null ? '' :
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
