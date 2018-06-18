import { Component, OnInit, ViewChild, OnChanges, Input } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Http, HttpModule, Headers, Response } from '@angular/http';
import { DxDataGridComponent, DxTemplateModule } from 'devextreme-angular';
import { LookupService } from '../../_services/lookups.service';
import { UserService } from '../../_services/user.service';
import { AuthenticationService } from '../../_services/authentication.service';
import { Order, OrderService, OrderDetail, OrderArtFile, OrderArtPlacement, OrderFee } from '../../_services/order.service';
import { CorrespondenceService } from '../../_services/correspondence.service';
import { OrderInfoComponent } from '../order-info/order-info.component';
import { OrderDetailComponent } from '../order-detail/order-detail.component';
import { OrderArtComponent } from '../order-art/order-art.component';
import { OrderTaskListComponent } from '../order-task-list/order-task-list.component';
import { OrderSummaryComponent } from '../order-summary/order-summary.component';
import { OrderNotesHistoryComponent } from '../order-notes-history/order-notes-history.component';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA,
  MatSnackBar } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { forkJoin } from 'rxjs/observable/forkJoin';

@Component({
  selector: 'app-customer-order-list',
  templateUrl: './customer-order-list.component.html',
  styleUrls: ['./customer-order-list.component.scss'],
  providers: [OrderService, CorrespondenceService]
})
export class CustomerOrderListComponent implements OnInit {
  @Input() customer;
  @ViewChild(DxDataGridComponent) gridOrders: DxDataGridComponent;
  @ViewChild(OrderInfoComponent) orderInfo: OrderInfoComponent;
  @ViewChild(OrderDetailComponent) orderDetail: OrderDetailComponent;
  @ViewChild(OrderArtComponent) orderArt: OrderArtComponent;
  @ViewChild(OrderTaskListComponent) orderTaskList: OrderTaskListComponent;
  @ViewChild(OrderSummaryComponent) orderSummary: OrderSummaryComponent;
  @ViewChild(OrderNotesHistoryComponent) orderNotesHistory: OrderNotesHistoryComponent;

  /* Data Strutures for Orders */
  selectedOrder: any;
  selectedTasks: any;
  selectedOrderLines: any;
  selectedArtPlacements: any;
  selectedFees: any;
  selectedPayments: any;
  selectedCorrespondence: any;
  selectedOrderFees: any;
  selectedArtFiles: any;
  selectedNotes: any;
  selectedStatusHistory: any;

  baseUrl = environment.odataEndpoint;
  defaultArtFolder = environment.defaultArtFolder;
  dataSource: any;
  popupVisible = false;
  summaryVisible = false;
  order_statusSource: any;
  order_typeSource: any;
  user_Source: any;

  lookupDataSource: any;
  customerId: number;
  enableSave = false;
  userProfile;
  leaveWindowOpen: true;
  loading: false;

  constructor(private http: Http, public orderService: OrderService, lookupService: LookupService,
    userService: UserService, public snackBar: MatSnackBar, public correspondenceService: CorrespondenceService,
    authService: AuthenticationService) {
    // Pull User Role to set activities
    this.userProfile = JSON.parse(authService.getUserToken());
    this.enableSave = this.userProfile.profile.role !== 'Readonly';
    lookupService.loadLookupData('').subscribe(res => {
      this.lookupDataSource = res.value;
      // console.log('lookupDataSource', this.lookupDataSource);
      this.createStatusDataSource();
      this.createOrderTypeDataSource();
    });

    userService.getUsers('').subscribe(res => {
      this.user_Source = res.value;
      // console.log('userDataSource', this.user_Source);
    });

  }

  createOrderDataSource() {
    // console.log('Current Customer for Order pull', this.customer);
    this.dataSource = {
      store: {
        type: 'odata',
        url: this.baseUrl + 'orders',
        beforeSend:  function (url, async, method, timeout, params, payload, headers) {
          // console.log('customer-order-list:beforeSend', url, async, method, timeout, params, payload, headers);
          // this.loading = true;
        },
        onLoaded: function() {
          // console.log('customer-order-list:onLoaded', this);
          // this.loading = false;
        }
      },
      expand: ['order_art_file', 'customer', 'order_detail'],
      select: [
        'order_id',
        'customer_id',
        'reorder_ind',
        'order_number',
        'order_status',
        'ship_attn',
        'order_date',
        'order_type',
        'purchase_order',
        'order_due_date',
        'assigned_user_id',
        'taken_user_id',
        'est_begin_date',
        'act_begin_date',
        'est_complete_date',
        'act_complete_date',
        'shipped_date',
        'subtotal',
        'tax_rate',
        'tax_amount',
        'shipping',
        'total',
        'payments',
        'balance_due',
        'IMAGE_FILE',
        'BILL_ADDRESS_1',
        'BILL_ADDRESS_2',
        'BILL_CITY',
        'BILL_STATE',
        'BILL_ZIP',
        'SHIP_ADDRESS_1',
        'SHIP_ADDRESS_2',
        'SHIP_CITY',
        'SHIP_STATE',
        'SHIP_ZIP',
        'PRIORITY',
        'PERCENT_COMPLETE',
        'ship_carrier',
        'ship_tracking',
        'previous_order',
        'contact',
        'contact_email',
        'contact_phone1',
        'contact_phone1_ext',
        'contact_phone1_type',
        'contact_phone2',
        'contact_phone2_ext',
        'contact_phone2_type',
        'customer/customer_name',
        'order_art_file/order_art_id',
        'order_art_file/art_folder',
        'order_art_file/image_file',
        'order_detail/order_detail_id',
        'order_detail/item_line_number'
      ],
      filter: ['customer_id', '=', this.customer.customer_id]
    };
    // console.log('Return from Order List', this.dataSource);
  }
  createStatusDataSource() {
    this.order_statusSource = this.lookupDataSource.filter(item => item.class === 'ord');
  }
  createOrderTypeDataSource() {
    this.order_typeSource = this.lookupDataSource.filter(item => item.class === 'otyps');
  }
  createNewOrder(customer_id) {
    // console.log('Creating Order!!!', customer_id);
    this.selectedOrder = new Order();
    this.selectedOrder.order_id = 0;
    this.selectedOrder.tax_rate = '7.0';
    this.selectedOrder.customer_id = customer_id;
    this.selectedOrder.customer_name = this.customer.customer_name;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    this.selectedOrder.order_number = this.formatOrderNumber(today);
    this.selectedOrder.order_date = today;
    this.selectedOrder.taken_user_id = this.userProfile.profile.user_id;
    this.setOrderContact();
    this.setOrderBillAndShipAddresses();
    if (this.orderDetail) {
      this.orderDetail.order.order_detail = [];
    }
    // this.selectedOrder.ship_attn = this.customer
    this.popupVisible = true;
  }

  reOrder(customer_id) {
    console.log('Reorder Function', this.selectedOrder);
    const reOrderObj = this.cloneOrder(this.selectedOrder);

    reOrderObj.taken_user_id = this.userProfile.profile.user_id;
    reOrderObj.assigned_user_id = this.userProfile.profile.user_id;


    this.orderService.addOrderInfo(this.userProfile.profile.login_id, reOrderObj).subscribe(res => {
      console.log('Order ID Return', res);
      reOrderObj.order_id = res.order_id;
      reOrderObj.order_number = res.order_number;
      const reOrderDetails = this.cloneOrderDetails(this.orderDetail.order.order_detail, res.order_id);
      reOrderDetails.forEach((item) => {
        // console.log('Cloning OrderLine', item);
        this.orderService.addOrderLineItem(this.userProfile.profile.login_id, item).subscribe();
      });

      const reOrderArtFiles = this.cloneOrderArtFiles(this.orderArt.orderArtFiles, res.order_id);
      reOrderArtFiles.forEach((item) => {
        // console.log('Cloning Art File', item);
        this.orderService.addOrderArtFile(this.userProfile.profile.login_id, item).subscribe();
      });

      const reOrderFees = this.cloneOrderFees(this.orderDetail.orderFees, res.order_id);
      reOrderFees.forEach((item) => {
        // console.log('Cloning Order Fees', item);
        this.orderService.addOrderFee(this.userProfile.profile.login_id, item).subscribe();
      });

      const reOrderArtPlacement = this.cloneOrderArtPlacement(this.orderDetail.orderArtPlacement, res.order_id);
      reOrderArtPlacement.forEach((item) => {
        // console.log('Cloning Art Placements', item);
        this.orderService.addOrderArtPlacement(this.userProfile.profile.login_id, item).subscribe();
      });

      const reOrderTaskList = this.orderTaskList.createOrderTaskList(res.order_id, reOrderObj.order_type);
      reOrderTaskList.forEach((item) => {
        // console.log('Cloning Order Task', item);
        this.orderService.addOrderTask(this.userProfile.profile.login_id, item).subscribe();
      });

      this.gridOrders.instance.refresh();
      this.snackBar.open('Re-Order Created.', '', {
        duration: 4000,
        verticalPosition: 'top'
      });
      this.selectedOrder = reOrderObj;
      // this.popupVisible = false;
    });

  }

  setOrderContact() {
    // Add logic to pull primary contact???
    this.selectedOrder.contact = this.customer.customer_person[0].first_name + ' ' + this.customer.customer_person[0].last_name;
    this.selectedOrder.contact_email = this.customer.customer_person[0].email_address;
    this.selectedOrder.contact_phone1 = this.customer.customer_person[0].phone_1;
    this.selectedOrder.contact_phone1_ext = this.customer.customer_person[0].phone_1_ext;
    this.selectedOrder.contact_phone1_type = this.customer.customer_person[0].phone_1_type;
    this.selectedOrder.contact_phone2 = this.customer.customer_person[0].phone_2;
    this.selectedOrder.contact_phone2_ext = this.customer.customer_person[0].phone_2_ext;
    this.selectedOrder.contact_phone2_type = this.customer.customer_person[0].phone_2_type;
  }

  setOrderBillAndShipAddresses() {
    // Get the Billing Address if available
    // console.log('setBillingAndShipmentAddress', this.customer);
    const billingAddress = this.customer.customer_address.filter(item => item.type_code === 'bill');
    this.selectedOrder.ship_attn = this.customer.customer_name;
    if (billingAddress && billingAddress.length > 0) {
      // console.log('Billing Adr', billingAddress[0]);
      this.selectedOrder.BILL_ADDRESS_1 = billingAddress[0].address_1;
      this.selectedOrder.BILL_ADDRESS_2 = billingAddress[0].address_2;
      this.selectedOrder.BILL_CITY = billingAddress[0].city;
      this.selectedOrder.BILL_STATE = billingAddress[0].state;
      this.selectedOrder.BILL_ZIP = billingAddress[0].zip;
      if (this.customer.ship_to_bill_ind === 'Y') {
        this.selectedOrder.SHIP_ADDRESS_1 = billingAddress[0].address_1;
        this.selectedOrder.SHIP_ADDRESS_2 = billingAddress[0].address_2;
        this.selectedOrder.SHIP_CITY = billingAddress[0].city;
        this.selectedOrder.SHIP_STATE = billingAddress[0].state;
        this.selectedOrder.SHIP_ZIP = billingAddress[0].zip;
      } else {
        const shippingAddress = this.customer.customer_address.filter(item => item.type_code === 'ship');
        if (shippingAddress && shippingAddress.length > 0) {
          this.selectedOrder.SHIP_ADDRESS_1 = shippingAddress[0].address_1;
          this.selectedOrder.SHIP_ADDRESS_2 = shippingAddress[0].address_2;
          this.selectedOrder.SHIP_CITY = shippingAddress[0].city;
          this.selectedOrder.SHIP_STATE = shippingAddress[0].state;
          this.selectedOrder.SHIP_ZIP = shippingAddress[0].zip;
        }
      }
    }
  }

  formatOrderNumber(today): string {
    let dd = today.getDate();
    let mm = (today.getMonth() + 1); // January is 0!
    const yyyy = today.getFullYear().toString();
    if (dd < 10) {
      dd = '0' + dd;
    }
    if (mm < 10) {
      mm = '0' + mm;
    }
    return mm + dd + yyyy;
  }

  refreshGrid() {
    this.gridOrders.instance.refresh();
  }

  cloneOrder(origOrder: Order): Order {
    const newOrder = new Order();
    newOrder.previous_order = origOrder.order_number;
    newOrder.reorder_ind = 'Y';
    newOrder.order_id = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    newOrder.order_date = today.toISOString();
    newOrder.order_number = this.formatOrderNumber(today);
    newOrder.order_status = 'inq';
    newOrder.customer_id = origOrder.customer_id;
    newOrder.contact = origOrder.contact;
    newOrder.contact_email = origOrder.contact_email;
    newOrder.contact_phone1 = origOrder.contact_phone1;
    newOrder.contact_phone1_ext = origOrder.contact_phone1_ext;
    newOrder.contact_phone1_type = origOrder.contact_phone1_type;
    newOrder.contact_phone2 = origOrder.contact_phone2;
    newOrder.contact_phone2_ext = origOrder.contact_phone2_ext;
    newOrder.contact_phone2_type = origOrder.contact_phone2_type;
    newOrder.balance_due = origOrder.balance_due;
    newOrder.BILL_ADDRESS_1 = origOrder.BILL_ADDRESS_1;
    newOrder.BILL_ADDRESS_2 = origOrder.BILL_ADDRESS_2;
    newOrder.BILL_CITY = origOrder.BILL_CITY;
    newOrder.BILL_STATE = origOrder.BILL_STATE;
    newOrder.BILL_ZIP = origOrder.BILL_ZIP;
    newOrder.IMAGE_FILE = origOrder.IMAGE_FILE;
    newOrder.ship_attn = origOrder.ship_attn;
    newOrder.SHIP_ADDRESS_1 = origOrder.SHIP_ADDRESS_1;
    newOrder.SHIP_ADDRESS_2 = origOrder.SHIP_ADDRESS_2;
    newOrder.SHIP_CITY = origOrder.SHIP_CITY;
    newOrder.SHIP_STATE = origOrder.SHIP_STATE;
    newOrder.SHIP_ZIP = origOrder.SHIP_ZIP;
    newOrder.order_type = this.setReOrderType(origOrder.order_type);
    newOrder.order_number = this.formatOrderNumber(today);
    newOrder.subtotal = origOrder.subtotal;
    newOrder.tax_amount = origOrder.tax_amount;
    newOrder.tax_rate = origOrder.tax_rate;
    newOrder.shipping = origOrder.shipping;
    newOrder.total = origOrder.total;
    newOrder.balance_due = origOrder.total;

    return newOrder;
  }

  cloneOrderDetails(origDetails: Array<OrderDetail>, order_id: number): Array<OrderDetail> {
    const newDetails = new Array<OrderDetail>();

    origDetails.forEach((item) => { // foreach statement
      const newDetail = new OrderDetail();
      newDetail.order_detail_id = 0;
      newDetail.order_id = order_id;
      newDetail.C2xl_qty = item.C2xl_qty;
      newDetail.C3xl_qty = item.C3xl_qty;
      newDetail.C4xl_qty = item.C4xl_qty;
      newDetail.C5xl_qty = item.C5xl_qty;
      newDetail.checked_in_ind = 'N';
      newDetail.checked_out_ind = 'N';
      newDetail.color_code = item.color_code;
      newDetail.customer_name = item.customer_name;
      newDetail.garment_order_date = null;
      newDetail.garment_recvd_date = null;
      newDetail.item_line_number = newDetails.length + 1;
      newDetail.item_price_each = item.item_price_each;
      newDetail.item_price_ext = item.item_price_ext;
      newDetail.item_quantity = item.item_quantity;
      newDetail.item_type = item.item_type;
      newDetail.large_qty = item.large_qty;
      newDetail.manufacturer = item.manufacturer;
      newDetail.med_qty = item.med_qty;
      newDetail.notes = item.notes;
      newDetail.order_number = item.order_number;
      newDetail.other1_qty = item.other1_qty;
      newDetail.other1_type = item.other1_type;
      newDetail.pricelist_id = item.pricelist_id;
      newDetail.product_code = item.product_code;
      newDetail.shipping_po = '';
      newDetail.size_code = item.size_code;
      newDetail.small_qty = item.small_qty;
      newDetail.style_code = item.style_code;
      newDetail.taxable_ind = item.taxable_ind;
      newDetail.vendor = item.vendor;
      newDetail.xl_qty = item.xl_qty;
      newDetail.xsmall_qty = item.xsmall_qty;

      newDetails.push(newDetail);
    });


    return newDetails;
  }

  cloneOrderArtFiles(origArtFiles: Array<OrderArtFile>, order_id: number): Array<OrderArtFile> {
    const newArtFiles = new Array<OrderArtFile>();

    origArtFiles.forEach((item) => { // foreach statement
      const newArtFile = new OrderArtFile();

      newArtFile.order_id = order_id;
      newArtFile.order_by = newArtFiles.length + 1;
      newArtFile.order_art_id = 0;
      newArtFile.note = item.note;
      newArtFile.image_file = item.image_file;
      newArtFile.art_folder = item.art_folder;

      newArtFiles.push(newArtFile);
    });
    return newArtFiles;
  }

  cloneOrderFees(origOrderFees: Array<OrderFee>, order_id: number): Array<OrderFee> {
    const newOrderFees = new Array<OrderFee>();

    origOrderFees.forEach((item) => { // foreach statement
      const newOrderFee = new OrderFee();

      newOrderFee.order_id = order_id;
      newOrderFee.fee_line_number = newOrderFees.length + 1;
      newOrderFee.order_fee_id = 0;
      newOrderFee.fee_price_each = item.fee_price_each;
      newOrderFee.fee_price_ext = item.fee_price_ext;
      newOrderFee.fee_quantity = item.fee_quantity;
      newOrderFee.notes = item.notes;
      newOrderFee.pricelist_id = item.pricelist_id;
      newOrderFee.taxable_ind = item.taxable_ind;

      newOrderFees.push(newOrderFee);
    });
    return newOrderFees;
  }

  cloneOrderArtPlacement(origArtPlacement: Array<OrderArtPlacement>, order_id: number): Array<OrderArtPlacement> {
    const newArtPlacements = new Array<OrderArtPlacement>();

    origArtPlacement.forEach((item) => { // foreach statement
      const newArtPlacement = new OrderArtPlacement();

      newArtPlacement.order_id = order_id;
      newArtPlacement.order_art_placement_id = 0;
      newArtPlacement.added_by = this.userProfile.profile.login_id;
      newArtPlacement.added_date = new Date().toISOString();
      newArtPlacement.art_placement_code = item.art_placement_code;
      newArtPlacement.color_codes = item.color_codes;
      newArtPlacement.colors = item.colors;
      newArtPlacement.notes = item.notes;

      newArtPlacements.push(newArtPlacement);
    });
    return newArtPlacements;
  }

  setReOrderType(orderType: string): string {
    let ordType = '';
    switch (orderType) {
      case 'scrn': {
        ordType = 'rescr';
        break;
      }
      case 'emb': {
        ordType = 'reemb';
        break;
      }
      case 'dprn': {
        ordType = 'redgp';
        break;
      }
      case 'scrdg': {
        ordType = 'rescd';
        break;
      }
      case 'screm': {
        ordType = 'resce';
        break;
      }
      default: {
        ordType = 'rescr';
        break;
      }
    }
    return ordType;
  }

  applyChanges() {
    this.orderInfo.batchSave().subscribe(res => {
      this.orderDetail.batchSave(res);
      // Still need art tab batch save.
      this.orderArt.batchSave(res);
      // this.selectedOrder = null;
      console.log('orderTaskList on ApplyChanges', this.orderTaskList.orderTask);
      console.log('order balance_due', this.selectedOrder.balance_due);
      console.log('order', this.selectedOrder);
      if (+this.selectedOrder.balance_due === 0.00 && this.orderDetail.orderPayments.length > 0) {
        console.log('balance is paid!');
        const fpmtTask = this.orderTaskList.orderTask.filter(p => p.task_code === 'fnpmt');
        if (fpmtTask) {
          fpmtTask[0].is_complete = 'Y';
          fpmtTask[0].completed_by = this.userProfile.profile.login_id;
          fpmtTask[0].completed_date = new Date().toISOString();
        }
      }
      if (this.orderDetail.orderPayments.length >= 1) {
        const depTask = this.orderTaskList.orderTask.filter(p => p.task_code === 'deprc');
        if (depTask) {
          depTask[0].is_complete = 'Y';
          depTask[0].completed_by = this.userProfile.profile.login_id;
          depTask[0].completed_date = new Date().toISOString();
        }
        console.log('depost is paid!', this.orderDetail.orderPayments);
      }

      this.orderTaskList.batchSave(res);
      this.orderNotesHistory.batchSave(res);
      setTimeout(() => {
        this.gridOrders.instance.refresh();
      }, 1000);
      this.popupVisible = this.leaveWindowOpen;
    });
  }
  showValues() {
    console.log('Showing Order Values', this.selectedOrder);
  }

  selectionChanged(e) {
    // this.selectedOrder = e.selectedRowsData[0];
    // console.log('In selectionChanged', this.selectedOrder);
  }
  setReorderInd(data) {
    if (data === undefined) { return false; }
    return data.reorder_ind === 'Y';
  }
  showEditPopup(e) {
    // e.cancel = true;
    // console.log('E', e);
    this.selectedOrder = e.data;
    forkJoin(
      this.orderService.loadOrderData('', this.selectedOrder.order_id), // 0
      this.orderService.loadArtPlacementData('', this.selectedOrder.order_id), // 1
      this.orderService.loadOrderFeeData('', this.selectedOrder.order_id), // 2
      this.orderService.loadOrderPaymentData('', this.selectedOrder.order_id), // 3
      this.orderService.loadOrderArtFileData('', this.selectedOrder.order_id), // 4
      this.orderService.loadOrderNotesData('', this.selectedOrder.order_id), // 5
      this.orderService.loadOrderStatusHistoryData('', this.selectedOrder.order_id), // 6
      this.orderService.loadOrderTaskData('', this.selectedOrder.order_id), // 7
      this.correspondenceService.getCorrespondenceData('', this.selectedOrder.order_id), // 8
    ).subscribe(results => {
      console.log('selectedOrder', this.selectedOrder);
      console.log('forkJoin Return', results);
      this.selectedOrderLines = results[0].order_detail;
      this.selectedArtPlacements = results[1].order_art_placement;
      this.selectedOrderFees = results[2].order_fees;
      this.selectedPayments = results[3].order_payments;
      this.selectedArtFiles = results[4].order_art_file;
      this.selectedNotes = results[5].order_notes;
      this.selectedStatusHistory = results[6].order_status_history;
      this.selectedTasks = results[7].order_task;
      this.selectedCorrespondence = results[8].correspondences;
      this.popupVisible = true;
    });
    // console.log('Selected Order', this.selectedOrder);
    // alert('Editing!');
  }

  closeEditor() {
    // Need to reset the selected order so the child components to scream
    //  about not having a reference value (undefined)
    this.selectedOrder = new Order();
    this.selectedOrder.order_id = 0;
    this.selectedOrder.tax_rate = '7.0';
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    this.selectedOrder.customer_id = this.customer.customer_id;
    this.selectedOrder.order_number = this.formatOrderNumber(today);
    this.selectedOrder.order_date = today;
    this.selectedOrder.taken_user_id = this.userProfile.profile.user_id;
    this.popupVisible = false;
  }

  showOrderSummary(e) {
    console.log('showOrderSummary', e);

    this.selectedOrder = e;
    this.summaryVisible = true;
  }
  ngOnInit() {
    // console.log('ngInit on customer-order-list', this.customer);
    if (this.customer) {
      this.customerId = this.customer.customer_id;
    }
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnChanges() {
    // console.log('ngChanges on customer-order-list', this.customer);
    if (this.customer) {
      this.customerId = this.customer.customer_id;
    }
    this.createOrderDataSource();
  }

}
