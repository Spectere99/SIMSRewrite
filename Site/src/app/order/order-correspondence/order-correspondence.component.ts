import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Globals } from '../../globals';
import { GlobalDataProvider } from '../../_providers/global-data.provider';
import { OrderService, Order, OrderDetail, OrderArtPlacement, OrderFee,
        OrderPayment, OrderArtFile, OrderMaster } from '../../_services/order.service';
import { AuthenticationService } from '../../_services/authentication.service';
import { CorrespondenceService, Correspondence } from '../../_services/correspondence.service';
import { UserService } from '../../_services/user.service';
import { LookupService, LookupItem } from '../../_services/lookups.service';
import { PriceListService, PriceListItem } from '../../_services/pricelist.service';
import { DxLoadPanelModule } from 'devextreme-angular';

declare let jsPDF;

@Component({
  selector: 'app-order-correspondence',
  templateUrl: './order-correspondence.component.html',
  styleUrls: ['./order-correspondence.component.scss'],
  providers: [OrderService, LookupService, PriceListService, CorrespondenceService]
})
export class OrderCorrespondenceComponent implements OnInit {
@Input() masterOrder: OrderMaster;
selectedOrder;
private loading = false;
popupVisible = false;
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

enableSave = false;

  constructor(public orderService: OrderService, private lookupService: LookupService, private priceListService: PriceListService,
    public correspondenceService: CorrespondenceService, private userService: UserService,
    public authService: AuthenticationService, private globals: Globals, globalDataProvider: GlobalDataProvider) {

    this.userProfile = JSON.parse(authService.getUserToken());
    this.enableSave = this.userProfile.profile.role !== 'Readonly';
    this.defaultDocFolder = environment.defaultDocFolder;
    this.order = new Order();
    this.order.order_detail = [];
    this.orderArtPlacement = [];
    this.orderFees = [];
    this.orderPayments = [];
    this.lookupDataSource = globalDataProvider.getLookups();
    this.userDataSource = globalDataProvider.getUsers();
    this.priceListDataSource = globalDataProvider.getPriceList();
    this.sizeTypes = this.createLookupTypeSource('ssiz');
    this.styleTypes = this.createLookupTypeSource('sclas');
    this.vendorTypes = this.createLookupTypeSource('vend');
    this.artLocations = this.createLookupTypeSource('aloc');
    this.paymentSourceItems = this.createLookupTypeSource('pms');
    this.correspondenceTypes = this.createLookupTypeSource('cort');
    this.correspondenceDisp = this.createLookupTypeSource('crdis');
    this.itemTypes = this.createItemTypeSource('orddi');
    this.setupItems = this.createItemTypeSource('setup');
    /* lookupService.loadLookupData('').subscribe(res => {
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
    }); */
  }
  /* showInvoice() {
    this.selectedOrder = this.currentOrder;
    this.popupVisible = true;
    // this.saveInvoice();
  } */

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

 /*  saveInvoice() {
    this.loading = true;
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

    const specialElementHandlers = {
      '#editor': function (element, renderer) {
        return true;
      }
    };

    const elementToPrint = document.getElementById('invoiceContent');
    // console.log('Generating PDF', elementToPrint);
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
        const newWindow = window.open(this.defaultDocFolder + res);
        this.correspondenceService.getCorrespondenceData('', this.currentOrder.order_id).subscribe(res2 => {
          this.orderCorrespondence = res2.correspondences;
        });
      });
    });
    this.loading = false;

  } */

  refreshCorrespondenceList() {
    this.correspondenceService.getCorrespondenceData('', this.masterOrder.order_id).subscribe(res => {
      this.orderCorrespondence = res.correspondences;
      this.popupVisible = false;
    });
  }
  ngOnInit() {

  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnChanges() {
    this.loading = true;
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
      this.selectedOrder = this.masterOrder;
    }
    /* if (this.currentOrder) {
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
        console.log('getting Correspondence Data');
        this.correspondenceService.getCorrespondenceData('', this.currentOrder.order_id).subscribe(res => {
          console.log('correspondenceData return', res);
          this.orderCorrespondence = res.correspondences;
          this.loading = false;
          // console.log('pulled Correspondence Data', this.orderCorrespondence);
        });
      } else {
        /// this.currentOrder = new Order();
        this.order.order_detail = new Array<OrderDetail>();
        this.orderArtPlacement = new Array<OrderArtPlacement>();
        this.orderFees = new Array<OrderFee>();
        this.orderPayments = new Array<OrderPayment>();
        this.loading = false;
      }
      this.selectedOrder = this.currentOrder;
    } */
  }
}
