import { Component, OnInit, OnChanges, Input, ViewChild, HostListener } from '@angular/core';
import { Globals } from '../../globals';
import { GlobalDataProvider } from '../../_providers/global-data.provider';
import { OrderService, Order, OrderDetail, OrderArtPlacement, OrderFee, OrderPayment, OrderMaster } from '../../_services/order.service';
import { CustomerService, Customer } from '../../_services/customer.service';
import { UserService } from '../../_services/user.service';
import { LookupService, LookupItem } from '../../_services/lookups.service';
import { PriceListService, PriceListItem } from '../../_services/pricelist.service';
import { AuthenticationService } from '../../_services/authentication.service';
import { WindowRef } from '../../_services/window-ref.service';
import { isNumeric } from 'rxjs/util/isNumeric';
import { ArraySortPipe } from '../../_shared/pipes/orderBy.pipe';
import { OrderTaskListComponent } from '../order-task-list/order-task-list.component';


import {
  MatDialog, MatDialogRef, MAT_DIALOG_DATA,
  MatSnackBar
} from '@angular/material';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss'],
  providers: [OrderService, CustomerService, PriceListService]
})

export class OrderDetailComponent implements OnInit {
  @Input() customer: Customer;
  @Input() masterOrder: OrderMaster;
  // @Input() currentOrder: any;
  @Input() orderArtPlacement: Array<OrderArtPlacement>;
  @Input() orderFees: Array<OrderFee>;
  @Input() orderPayments: Array<OrderPayment>;
  @Input() orderTasks: any;
  @Input() orderLineItems: any;

  loading = false;

  lookupDataSource: Array<LookupItem>;
  priceListDataSource: Array<PriceListItem>;

  order: any;
  itemTypes: Array<PriceListItem>;
  setupItems: Array<PriceListItem>;
  styleTypes: Array<LookupItem>;
  sizeTypes: Array<LookupItem>;
  vendorTypes: Array<LookupItem>;
  artLocations: Array<LookupItem>;
  paymentSourceItems: Array<LookupItem>;
  userDataSource: any;

  editMode: boolean;
  nonTaxableSubTotal: string;
  userProfile;

  window;

  @HostListener('mousewheel', ['$event']) onMousewheel(event) {
    // console.log('mouseWheelEvent: ', event);
    // console.log('sourceElement', event.sourceElement);
  }
  constructor(globalDataProvider: GlobalDataProvider, public userService: UserService,
    public orderService: OrderService, public customerService: CustomerService, public authService: AuthenticationService,
    public snackBar: MatSnackBar, private globals: Globals, public windowRef: WindowRef) {
    this.window = windowRef.nativeWindow;
    this.userProfile = JSON.parse(authService.getUserToken());
    this.order = new Order();
    this.order.order_detail = [];
    this.orderArtPlacement = [];
    this.orderFees = [];
    this.orderPayments = [];

    this.loading = true;
    this.lookupDataSource = globalDataProvider.getLookups();
    this.priceListDataSource = globalDataProvider.getPriceList();
    this.userDataSource = globalDataProvider.getUsers();
    // console.log('userDataSource', this.userDataSource);
    this.sizeTypes = this.createLookupTypeSource('ssiz');
    this.styleTypes = this.createLookupTypeSource('sclas');
    this.vendorTypes = this.createSortedLookupTypeSource('vend');
    this.artLocations = this.createLookupTypeSource('aloc');
    this.paymentSourceItems = this.createLookupTypeSource('pms');
    this.itemTypes = this.createItemTypeSource('orddi');
    this.setupItems = this.createItemTypeSource('setup');

  }

  showValues() {
    // console.log('Showing Order Values', this.order);
  }
  orderTaxableChange(val: boolean): string {
    this.updateTotals();
    return val ? 'Y' : 'N';
  }
  createLookupTypeSource(className: string): any {
    return this.lookupDataSource.filter(item => item.class === className);
  }

  createSortedLookupTypeSource(className: string): any {
    const sortedArray = this.lookupDataSource.filter(item => item.class === className).sort(this.compareValues('description'));
    // console.log('sortedLookupType Array', sortedArray);
    return sortedArray;
  }

  compareValues(key, order = 'asc') {
    return function(a, b) {
      if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
        // property doesn't exist on either object
        return 0;
      }

      const varA = (typeof a[key] === 'string') ?
        a[key].toUpperCase() : a[key];
      const varB = (typeof b[key] === 'string') ?
        b[key].toUpperCase() : b[key];

      let comparison = 0;
      if (varA > varB) {
        comparison = 1;
      } else if (varA < varB) {
        comparison = -1;
      }
      return (
        (order === 'desc') ? (comparison * -1) : comparison
      );
    };
  }

  createItemTypeSource(type: string): any {
    return this.priceListDataSource.filter(item => item.pricelist_type === type).sort(this.compareValues('pricelist_description'));
  }

  noOrderItems() {
    // console.log('In orderHasItems', this.order);
    if (this.masterOrder) {
      if (this.masterOrder.order_detail) {
        return this.masterOrder.order_detail.length === 0;
      }
    }
    return true;
  }

  noArtPlacementItems() {
    if (this.masterOrder) {
      if (this.masterOrder.order_art_placements) {
        return this.masterOrder.order_art_placements.length === 0;
      }
    }
    return true;
  }

  noOrderFees() {
    if (this.masterOrder) {
      if (this.masterOrder.order_fees) {
        return this.masterOrder.order_fees.length === 0;
      }
    }
    return true;
  }

  getShipping() {
    // console.log('getShipping');
    if (!this.noOrderFees()) {
      // Get the order fee for Shipping
      if (this.setupItems) {
        const shippingLookup = this.setupItems.filter(item => item.pricelist_description === 'Shipping');
        if (shippingLookup.length > 0) {
          let totalShipping = 0;
          const shippingFees = this.orderFees.filter(fee => fee.pricelist_id === shippingLookup[0].pricelist_id);
          for (let x = 0; x < shippingFees.length; x++) {
            totalShipping = +(totalShipping + shippingFees[x].fee_price_ext);
          }
          this.masterOrder.shipping = +totalShipping.toFixed(2);
        } // Need to set an error?
      }
    }
  }

  onOrderItemClick(e, orderDetail, idx) {
    orderDetail.item_price_each = '0.00';
    orderDetail.pricelist_id = e;
    this.onPriceChange(e, idx);
  }

  onVendorSelect(e, orderDetail, idx) {
    // console.log('onVendorSelect', e);
    orderDetail.vendor = e;
    if (e === 'gmtpr') {
      orderDetail.taxable_ind = 'N';
      this.onTaxRateChange('N');
      this.onPriceChange(e, idx);
    }

  }

  onOther1TypeSelect(e, orderDetail, idx) {
    // console.log('onOther1TypeSelect', e);
    if (e === '') {
      orderDetail.other1_type = null;
    } else {
      orderDetail.other1_type = e;
    }
  }
  addLineItem(e) {
    const lineItem = new OrderDetail();

    // console.log('add Line Item - line_item_number', lineItem.item_line_number);
    lineItem.order_detail_id = (this.masterOrder.order_detail.length + 1) * -1;
    lineItem.order_id = this.masterOrder.order_id;
    lineItem.item_type = null;
    lineItem.item_line_number = (this.masterOrder.order_detail.length + 1);
    lineItem.item_quantity = null;
    lineItem.pricelist_id = null;
    lineItem.style_code = null;
    lineItem.color_code = null;
    lineItem.size_code = null;
    lineItem.vendor = 'TBDV';
    lineItem.manufacturer = null;
    lineItem.product_code = null;
    lineItem.item_price_each = null;
    lineItem.item_price_ext = null;
    lineItem.taxable_ind = 'Y';
    lineItem.shipping_po = null;
    lineItem.notes = null;
    lineItem.checked_in_ind = null;
    lineItem.checked_out_ind = null;
    lineItem.xsmall_qty = null;
    lineItem.small_qty = null;
    lineItem.med_qty = null;
    lineItem.large_qty = null;
    lineItem.xl_qty = null;
    lineItem.C2xl_qty = null;
    lineItem.C3xl_qty = null;
    lineItem.C4xl_qty = null;
    lineItem.C5xl_qty = null;
    lineItem.other1_type = null;
    lineItem.other1_qty = null;
    lineItem.other2_type = null;
    lineItem.other2_qty = null;
    lineItem.other3_type = null;
    lineItem.other3_qty = null;
    lineItem.garment_order_date = null;
    lineItem.garment_recvd_date = null;
    lineItem.order_number = this.order.order_number;
    if (this.customer) {
      lineItem.customer_name = this.customer.customer_name;
    }
    this.order.order_detail.unshift(lineItem);
    this.masterOrder.order_detail.unshift(lineItem);
    // console.log('addItem - order_detail', this.masterOrder.order_detail);
    // console.log('addItem - order_detail', this.order.order_detail);
  }

  copyOrderLine(e, idx) {
    const orderLine = new OrderDetail();
    Object.assign(orderLine, this.masterOrder.order_detail[idx]);  // TODO:  Change to use orderLineItems
    // orderLine = this.order.order_detail[idx];
    orderLine.order_detail_id = (this.masterOrder.order_detail.length + 1) * -1;
    orderLine.item_line_number = (this.masterOrder.order_detail.length + 1);
    orderLine.garment_order_date = undefined;
    orderLine.garment_recvd_date = undefined;
    orderLine.shipping_po = undefined;
    orderLine.size_code = null;
    orderLine.taxable_ind = this.masterOrder.order_detail[idx].taxable_ind;
    orderLine.shipping_po = null;
    orderLine.notes = null;
    orderLine.checked_in_ind = null;
    orderLine.checked_out_ind = null;
    orderLine.xsmall_qty = null;
    orderLine.small_qty = null;
    orderLine.med_qty = null;
    orderLine.large_qty = null;
    orderLine.xl_qty = null;
    orderLine.C2xl_qty = null;
    orderLine.C3xl_qty = null;
    orderLine.C4xl_qty = null;
    orderLine.C5xl_qty = null;
    orderLine.other1_type = null;
    orderLine.other1_qty = null;
    orderLine.other2_type = null;
    orderLine.other2_qty = null;
    orderLine.other3_type = null;
    orderLine.other3_qty = null;
    orderLine.item_quantity = null;
    orderLine.item_price_ext = null;
    orderLine.item_type = this.masterOrder.order_detail[idx].item_type;
    orderLine.manufacturer = this.masterOrder.order_detail[idx].manufacturer;
    orderLine.color_code = this.masterOrder.order_detail[idx].color_code;
    orderLine.vendor = this.masterOrder.order_detail[idx].vendor;
    orderLine.style_code = this.masterOrder.order_detail[idx].style_code;
    orderLine.item_price_each = this.masterOrder.order_detail[idx].item_price_each;
    orderLine.order_number = this.masterOrder.order_number;
    orderLine.customer_name = this.customer.customer_name;
    this.order.order_detail.unshift(orderLine);
    this.masterOrder.order_detail.unshift(orderLine);
    // console.log('Original Order Line', this.masterOrder.order_detail[idx]);
    // console.log('Copied Order Line', orderLine);
  }

  deleteLineItem(e) {
    // console.log('deletingLineItem', e);
    // See if the item has been saved to the database. (non-negative id)
    // if it has not, then just remove it, otherwise, we need to call the web service
    // to delete the item from the database first.
    // const index = this.order.order_detail.findIndex(x => x.order_detail_id === e.order_detail_id); // TODO:  Change to use orderLineItems
    const index = this.masterOrder.order_detail.findIndex(x => x.order_detail_id === e.order_detail_id);

    // console.log('Del Line Item', index);
    if (index >= 0) {
      if (e.order_detail_id > 0) {
        // Call web service to delete here - passing in the order_detail_id.
        // console.log('OrderDetail on Delete', e.order_detail_id);
        this.orderService.deleteOrderLineItem(this.userProfile.login_id, e.order_detail_id)
          .subscribe(res => {
            this.snackBar.open('Order Line Deleted!', '', {
              duration: 4000,
              verticalPosition: 'top'
            });
          });
      }
    }
    this.order.order_detail.splice(index, 1);
    this.masterOrder.order_detail.splice(index, 1);
  }

  addArtPlacement(e) {
    const artPlacement = new OrderArtPlacement();
    artPlacement.order_art_placement_id = (this.masterOrder.order_art_placements.length + 1) * -1;
    artPlacement.art_placement_code = null;
    artPlacement.added_by = this.userProfile.profile.login_id.toUpperCase();
    artPlacement.notes = null;
    artPlacement.order = null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    artPlacement.added_date = today.toISOString(); // this.formatOrderNumber(today);
    // console.log('ArtPlacement Added By', artPlacement.added_by);
    // console.log('UserList', this.userDataSource);
    this.masterOrder.order_art_placements.push(artPlacement);
  }
  deleteArtPlacement(e) {
    // console.log('deletingArtPlacement', e);
    // See if the item has been saved to the database. (non-negative id)
    // if it has not, then just remove it, otherwise, we need to call the web service
    // to delete the item from the database first.
    const index = this.masterOrder.order_art_placements.findIndex(x => x.order_art_placement_id === e.order_art_placement_id);
    // console.log('Del Art Plcmt', index);
    if (index >= 0) {
      if (e.order_art_placement_id > 0) {
        // Call web service to delete here.
        this.orderService.deleteOrderArtPlacement(this.userProfile.login_id, e.order_art_placement_id)
          .subscribe(res => {
            this.snackBar.open('Art Placement Line Deleted!', '', {
              duration: 4000,
              verticalPosition: 'top'
            });
          });
      }
    }
    // this.orderArtPlacement.splice(index, 1);
    this.masterOrder.order_art_placements.splice(index, 1);
  }

  addFee(e) {
    const orderFee = new OrderFee();
    orderFee.order_fee_id = (this.masterOrder.order_fees.length + 1) * -1;
    orderFee.fee_line_number = this.masterOrder.order_fees.length + 1;
    orderFee.fee_price_each = 0.0.toFixed(2);
    orderFee.taxable_ind = 'N';
    orderFee.pricelist_id = null;
    orderFee.fee_price_ext = 0.0.toFixed(2);
    orderFee.order_id = this.masterOrder.order_id;
    orderFee.fee_quantity = 0;

    // this.orderFees.unshift(orderFee);
    this.masterOrder.order_fees.unshift(orderFee);
  }
  deleteFee(e) {
    // console.log('deletingFee', e);
    // See if the item has been saved to the database. (non-negative id)
    // if it has not, then just remove it, otherwise, we need to call the web service
    // to delete the item from the database first.
    // const index = this.orderFees.findIndex(x => x.order_fee_id === e.order_fee_id);
    const index = this.masterOrder.order_fees.findIndex(x => x.order_fee_id === e.order_fee_id);
    // console.log('Del Fee', index);
    if (index >= 0) {
      if (e.order_fee_id > 0) {
        // Call web service to delete here.
        this.orderService.deleteOrderFee(this.userProfile.login_id, e.order_fee_id)
          .subscribe(res => {
            this.snackBar.open('Order Charge Line Deleted!', '', {
              duration: 4000,
              verticalPosition: 'top'
            });
          });
      }
    }
    // this.orderFees.splice(index, 1);
    this.masterOrder.order_fees.splice(index, 1);
  }

  addPayment(e) {
    const payment = new OrderPayment();
    payment.order_payment_id = (this.masterOrder.order_payments.length + 1) * -1;
    payment.entered_user_id = this.userProfile.profile.user_id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    payment.payment_date = today.toISOString(); // this.formatOrderNumber(today);
    // console.log('Added Payment', payment);
    // this.orderPayments.push(payment);
    this.masterOrder.order_payments.push(payment);
  }
  deletePayment(e) {
    // console.log('deletingPayment', e);
    // See if the item has been saved to the database. (non-negative id)
    // if it has not, then just remove it, otherwise, we need to call the web service
    // to delete the item from the database first.
    // const index = this.orderPayments.findIndex(x => x.order_payment_id === e.order_payment_id);
    const index = this.masterOrder.order_payments.findIndex(x => x.order_payment_id === e.order_payment_id);
    // console.log('Del Payment', index);
    if (index >= 0) {
      if (e.order_payment_id > 0) {
        // Call web service to delete here.
        this.orderService.deleteOrderPayment(this.userProfile.login_id, e.order_payment_id)
          .subscribe(res => {
            this.snackBar.open('Order Payment Deleted!', '', {
              duration: 4000,
              verticalPosition: 'top'
            });
          });
      }
    }
    // this.orderPayments.splice(index, 1);
    this.masterOrder.order_payments.splice(index, 1);
  }

  onPriceChange(e, idx) {
    if (e.target) {
      // console.log('onQtyPriceChange', e.target.value.length);
      if (e.target.value.length === 0) {
        e.target.value = null;
        // console.log('onQtyPriceChange', e.target);
      }

      // console.log('onQtyPriceChange:orderDetail', this.masterOrder.order_detail[idx]);
      let priceValue = e.target.value;
      if (e.target.value.indexOf(',') > -1) {
        priceValue = parseFloat(e.target.value.replace(/,/g, ''));
      }
      if (isNumeric(priceValue)) {
        let totalItemQty = 0;
        // const orderLine = this.order.order_detail[idx];
        const orderLine = this.masterOrder.order_detail[idx];
        orderLine.item_price_each = e.target.value;
        // console.log('orderLine', orderLine);
        totalItemQty = totalItemQty + ((orderLine.xsmall_qty === undefined) ? 0 : +orderLine.xsmall_qty);
        totalItemQty = totalItemQty + ((orderLine.small_qty === undefined) ? 0 : +orderLine.small_qty);
        totalItemQty = totalItemQty + ((orderLine.med_qty === undefined) ? 0 : +orderLine.med_qty);
        totalItemQty = totalItemQty + ((orderLine.large_qty === undefined) ? 0 : +orderLine.large_qty);
        totalItemQty = totalItemQty + ((orderLine.xl_qty === undefined) ? 0 : +orderLine.xl_qty);
        totalItemQty = totalItemQty + ((orderLine.C2xl_qty === undefined) ? 0 : +orderLine.C2xl_qty);
        totalItemQty = totalItemQty + ((orderLine.C3xl_qty === undefined) ? 0 : +orderLine.C3xl_qty);
        totalItemQty = totalItemQty + ((orderLine.C4xl_qty === undefined) ? 0 : +orderLine.C4xl_qty);
        totalItemQty = totalItemQty + ((orderLine.C5xl_qty === undefined) ? 0 : +orderLine.C5xl_qty);
        totalItemQty = totalItemQty + ((orderLine.other1_qty === undefined) ? 0 : +orderLine.other1_qty);
        /* this.order.order_detail[idx].item_quantity = totalItemQty;
        this.order.order_detail[idx].item_price_ext = (totalItemQty * ((orderLine.item_price_each === undefined) ? 0
          : +orderLine.item_price_each)).toFixed(2); */
        this.masterOrder.order_detail[idx].item_quantity = totalItemQty;
        this.masterOrder.order_detail[idx].item_price_ext = (totalItemQty * ((priceValue === undefined) ? 0
            : +priceValue)).toFixed(2);
        this.updateTotals();
    } else {
      this.masterOrder.order_detail[idx].item_price_ext = '0';
    }
  }
  }
  onQtyChange(e, idx) {
    if (e.target) {
        if (e.target.value.length === 0) {
          e.target.value = null;
          // console.log('onQtyPriceChange', e.target);
        }

        // console.log('onQtyPriceChange:orderDetail', this.masterOrder.order_detail[idx]);
        /* let priceValue = e.target.value;
        if (e.target.value.indexOf(',') > -1) {
          priceValue = parseFloat(e.target.value.replace(/,/g, ''));
        } */
        // console.log('priceValue is numeric', isNumeric(priceValue), priceValue);
        // if (isNumeric(priceValue)) {
          let totalItemQty = 0;
          // const orderLine = this.order.order_detail[idx];
          const orderLine = this.masterOrder.order_detail[idx];
          // orderLine.item_price_each = e.target.value;
          // console.log('orderLine', orderLine);
          totalItemQty = totalItemQty + ((orderLine.xsmall_qty === undefined) ? 0 : +orderLine.xsmall_qty);
          totalItemQty = totalItemQty + ((orderLine.small_qty === undefined) ? 0 : +orderLine.small_qty);
          totalItemQty = totalItemQty + ((orderLine.med_qty === undefined) ? 0 : +orderLine.med_qty);
          totalItemQty = totalItemQty + ((orderLine.large_qty === undefined) ? 0 : +orderLine.large_qty);
          totalItemQty = totalItemQty + ((orderLine.xl_qty === undefined) ? 0 : +orderLine.xl_qty);
          totalItemQty = totalItemQty + ((orderLine.C2xl_qty === undefined) ? 0 : +orderLine.C2xl_qty);
          totalItemQty = totalItemQty + ((orderLine.C3xl_qty === undefined) ? 0 : +orderLine.C3xl_qty);
          totalItemQty = totalItemQty + ((orderLine.C4xl_qty === undefined) ? 0 : +orderLine.C4xl_qty);
          totalItemQty = totalItemQty + ((orderLine.C5xl_qty === undefined) ? 0 : +orderLine.C5xl_qty);
          totalItemQty = totalItemQty + ((orderLine.other1_qty === undefined) ? 0 : +orderLine.other1_qty);
          /* this.order.order_detail[idx].item_quantity = totalItemQty;
          this.order.order_detail[idx].item_price_ext = (totalItemQty * ((orderLine.item_price_each === undefined) ? 0
            : +orderLine.item_price_each)).toFixed(2); */

          const priceValue = parseFloat(orderLine.item_price_each.replace(/,/g, ''));
          this.masterOrder.order_detail[idx].item_quantity = totalItemQty;
          /* this.masterOrder.order_detail[idx].item_price_ext = (totalItemQty * ((orderLine.item_price_each === undefined) ? 0
              : +orderLine.item_price_each)).toFixed(2); */
          this.masterOrder.order_detail[idx].item_price_ext = (totalItemQty * priceValue).toFixed(2);
          this.updateTotals();
     // }
    }
  }

  onFeeQtyChange(e, idx) {
    const feeLine = this.masterOrder.order_fees[idx];
    let feeQty = parseFloat(e.target.value.replace(/,/g, ''));
    if (e.target.value.indexOf(',') > -1) {
      feeQty = parseFloat(e.target.value.replace(/,/g, ''));
    }
    if (isNumeric(feeQty)) {
      feeLine.fee_price_ext = '';
      feeLine.fee_quantity = e.target.value;
      feeLine.fee_price_ext = (+feeQty * +feeLine.fee_price_each).toFixed(2);

      this.updateTotals();
    }
  }
  onFeeChange(e, idx) {
    // const feeLine = this.orderFees[idx];
    const feeLine = this.masterOrder.order_fees[idx];
    let feeValue = e.target.value;
    if (e.target.value.indexOf(',') > -1 ) {
      feeValue = parseFloat(e.target.value.replace(/,/g, ''));
    }
    if (isNumeric(feeValue)) {
      feeLine.fee_price_ext = '';
      feeLine.fee_price_each = e.target.value;
      feeLine.fee_price_ext = (+feeLine.fee_quantity * +feeValue).toFixed(2);

      this.updateTotals();
    }
  }
  onTaxRateChange(e) {
    /* for (let x = 0; x < this.order.order_detail.length; x++) {
      this.onQtyPriceChange(e, x);
    } */
    for (let x = 0; x < this.masterOrder.order_detail.length; x++) {
      this.onPriceChange(e, x);
    }
    this.updateTotals();
  }

  updateTotals() {
    // this.order.subtotal = 0;
    this.nonTaxableSubTotal = 0.0.toFixed(2);
    let subTotal = 0;
    let nonTaxSubTotal = 0;
    let shippingTotal = 0;
    let taxAmount = 0;
    let orderTotal = 0;

    // Calculate Taxable and Non Taxable Sub Totals
    for (let x = 0; x < this.masterOrder.order_detail.length; x++) {
      if (this.masterOrder.order_detail[x].taxable_ind === 'Y') {
        subTotal = subTotal + +this.masterOrder.order_detail[x].item_price_ext;
      } else {
        nonTaxSubTotal = nonTaxSubTotal + +this.masterOrder.order_detail[x].item_price_ext;
      }
    }
    // console.log('subTotal', subTotal);
    // console.log('nonTaxSubTotal', nonTaxSubTotal);
    this.masterOrder.subtotal = subTotal;

    // Add Shipping Fees to SubTotal.
    const shippingLookup = this.setupItems.filter(item => item.pricelist_description === 'Shipping');

    // Add Non Shipping Fees to SubTotal and NonTaxable Sub Totals
    const nonShippingFees = this.masterOrder.order_fees.filter(item => item.pricelist_id !== +shippingLookup[0].pricelist_id);
    for (let y = 0; y < nonShippingFees.length; y++) {
      if (nonShippingFees[y].taxable_ind === 'Y') {
        subTotal = subTotal + +nonShippingFees[y].fee_price_ext;
      } else {
        nonTaxSubTotal = nonTaxSubTotal + +nonShippingFees[y].fee_price_ext;
      }
    }
    // this.nonTaxableSubTotal = nonTaxSubTotal.toFixed(2);
    // this.order.subtotal = subTotal.toFixed(2);

    taxAmount  = (subTotal * (+this.masterOrder.tax_rate / 100));

    // Total Shipping Items (Non Taxable)
    const shippingFees = this.masterOrder.order_fees.filter(item => +item.pricelist_id === 10737); // +shippingLookup[0].pricelist_id);

    for (let z = 0; z < shippingFees.length; z++) {
      shippingTotal = shippingTotal + +shippingFees[z].fee_price_ext;
    }

    // Get Payments that were made
    let paymentTotal = 0;

    for (let x = 0; x < this.masterOrder.order_payments.length; x++) {
      paymentTotal = paymentTotal + +this.masterOrder.order_payments[x].payment_amount;
    }

    // Total it all up.
    orderTotal = (+subTotal + +this.masterOrder.tax_amount + nonTaxSubTotal + shippingTotal);

    this.masterOrder.subtotal = +subTotal.toFixed(2);
    this.masterOrder.tax_amount = +taxAmount.toFixed(2);
    this.masterOrder.shipping = +shippingTotal.toFixed(2);
    this.masterOrder.total = +orderTotal.toFixed(2);
    this.masterOrder.payments = +paymentTotal.toFixed(2);
    this.masterOrder.balance_due = +(+orderTotal.toFixed(2) - +paymentTotal.toFixed(2)).toFixed(2);
    this.nonTaxableSubTotal = nonTaxSubTotal.toFixed(2);
  }

  onOtherTypeChange(e, idx) {
    // console.log('onOtherTypeChange', e);
    // console.log('onOtherTypeChange : idx', idx);
    if (e.length === 0) {
      this.masterOrder.order_detail[idx].other1_type = null;
      this.masterOrder.order_detail[idx].other1_qty = null;
      // console.log('onOtherTypeChange: order_detail[idx]', this.masterOrder.order_detail[idx]);
    }
  }

  batchSave(order_id: number) {

    for (let x = 0; x < this.masterOrder.order_detail.length; x++) {
      // console.log('Saving Order- Order ID= ', order_id);
      this.masterOrder.order_detail[x].order_id = order_id;
      this.saveOrderLines(this.masterOrder.order_detail[x]);
    }

    for (let x = 0; x < this.masterOrder.order_art_placements.length; x++) {
      this.masterOrder.order_art_placements[x].order_id = order_id;
      this.saveArtPlacement(this.masterOrder.order_art_placements[x]);
    }

    for (let x = 0; x < this.masterOrder.order_fees.length; x++) {
      this.masterOrder.order_fees[x].order_id = order_id;
      this.saveFees(this.masterOrder.order_fees[x]);
    }

    for (let x = 0; x < this.masterOrder.order_payments.length; x++) {
      this.masterOrder.order_payments[x].order_id = order_id;
      this.savePayments(this.masterOrder.order_payments[x]);
    }
  }

  saveOrderLines(orderDetail: OrderDetail) {
    // console.log('OrderDetail on Save', orderDetail);
    orderDetail = this.fixOrderDetailFields(orderDetail);
    if (orderDetail.order_detail_id <= 0) {
      orderDetail.order_detail_id = 0;
      orderDetail.order_id = this.masterOrder.order_id;
      orderDetail.customer_name = this.customer.customer_name;
      orderDetail.order_number = this.masterOrder.order_number;
      // console.log('OrderDetail on Save', orderDetail);
      this.orderService.addOrderLineItem(this.userProfile.login_id, orderDetail)
        .subscribe(res => {
          // console.log('Save orderInfo Return', res);
          orderDetail.order_detail_id = res.order_detail_id;
          this.snackBar.open('Order Line Added!', '', {
            duration: 4000,
            verticalPosition: 'top'
          });
        });
    } else {
      orderDetail.customer_name = this.customer.customer_name;
      orderDetail.order_number = this.masterOrder.order_number;
      // console.log('OrderDetail on Save', orderDetail);
      this.orderService.updateOrderLineItem(this.userProfile.login_id, orderDetail)
        .subscribe(res => {
          // console.log('Update orderLineItem Return', res);
          this.snackBar.open('Order Line Updated!', '', {
            duration: 4000,
            verticalPosition: 'top'
          });
        });
    }
  }
  onOtherQtyChange(e, idx) {
    // console.log('onOtherQtyChange', e);
    if (e === null) {
      this.masterOrder.order_detail[idx].other1_type = null;
      this.masterOrder.order_detail[idx].other1_qty = null;
    }
  }
  fixOrderDetailFields(orderDetail: OrderDetail): OrderDetail {
    /* console.log('fixOrderDetailFields:med_qty is undefined?', orderDetail.med_qty === undefined);
    console.log('fixOrderDetailFields:med_qty is null?', orderDetail.med_qty === null);
    console.log('fixOrderDetailFields:med_qty is 0', +orderDetail.med_qty === 0); */
    orderDetail.small_qty = +orderDetail.small_qty === 0 ? null : +orderDetail.small_qty;
    orderDetail.med_qty = +orderDetail.med_qty === 0 ? null : +orderDetail.med_qty;
    orderDetail.large_qty = +orderDetail.large_qty === 0 ? null : +orderDetail.large_qty;
    orderDetail.xl_qty = +orderDetail.xl_qty === 0 ? null : +orderDetail.xl_qty;
    orderDetail.C2xl_qty = +orderDetail.C2xl_qty === 0 ? null : +orderDetail.C2xl_qty;
    orderDetail.C3xl_qty = +orderDetail.C3xl_qty === 0 ? null : +orderDetail.C3xl_qty;
    orderDetail.C4xl_qty = +orderDetail.C4xl_qty === 0 ? null : +orderDetail.C4xl_qty;
    orderDetail.C5xl_qty = +orderDetail.C5xl_qty === 0 ? null : +orderDetail.C5xl_qty;
    orderDetail.other1_qty = +orderDetail.other1_qty === 0 ? null : +orderDetail.other1_qty;
    return orderDetail;
  }
  saveArtPlacement(artPlacement: OrderArtPlacement) {
    // console.log('Art Placement on Save', artPlacement);
    if (artPlacement.order_art_placement_id <= 0) {
      artPlacement.order_art_placement_id = 0;
      this.orderService.addOrderArtPlacement(this.userProfile.login_id, artPlacement)
        .subscribe(res => {
          // console.log('Save artPlacement Return', res);
          artPlacement.order_art_placement_id = res.order_art_placement_id;
          this.snackBar.open('Art Placement Line Added!', '', {
            duration: 4000,
            verticalPosition: 'top'
          });
        });
    } else {
      this.orderService.updateOrderArtPlacement(this.userProfile.login_id, artPlacement)
        .subscribe(res => {
          // console.log('Update artPlacement Return', res);
          this.snackBar.open('Art Placement Line Updated!', '', {
            duration: 4000,
            verticalPosition: 'top'
          });
        });
    }
  }

  saveFees(orderFee: OrderFee) {
    // console.log('Order Fee on Save', orderFee);
    if (orderFee.order_fee_id <= 0) {
      orderFee.order_fee_id = 0;
      this.orderService.addOrderFee(this.userProfile.login_id, orderFee)
        .subscribe(res => {
          // console.log('Save orderFee Return', res);
          orderFee.order_fee_id = res.order_fee_id;
          this.snackBar.open('Order Fee Line Added!', '', {
            duration: 4000,
            verticalPosition: 'top'
          });
        });
    } else {
      this.orderService.updateOrderFee(this.userProfile.login_id, orderFee)
        .subscribe(res => {
          // console.log('Update orderFee Return', res);
          this.snackBar.open('Order Fee Line Updated!', '', {
            duration: 4000,
            verticalPosition: 'top'
          });
        });
    }
  }

  savePayments(orderPayment: OrderPayment) {
    // console.log('Order Payment on Save', orderPayment);
    if (orderPayment.order_payment_id <= 0) {
      orderPayment.order_payment_id = 0;
      this.orderService.addOrderPayment(this.userProfile.login_id, orderPayment)
        .subscribe(res => {
          // console.log('Save orderFee Return', res);
          orderPayment.order_payment_id = res.order_payment_id;
          this.snackBar.open('Order Payment Line Added!', '', {
            duration: 4000,
            verticalPosition: 'top'
          });
        });
    } else {
      this.orderService.updateOrderPayment(this.userProfile.login_id, orderPayment)
        .subscribe(res => {
          // console.log('Update orderPayment Return', res);
          this.snackBar.open('Order Payment Line Updated!', '', {
            duration: 4000,
            verticalPosition: 'top'
          });
        });
    }
  }

  ngOnInit() {
    this.editMode = this.masterOrder.order_id !== 0;
    this.updateTotals();
    // console.log('Current Order', this.currentOrder);
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnChanges() {
    // console.log('order-detail-component currentOrder', this.currentOrder);
    // console.log('order-detail-component:ngOnChanges()', this.masterOrder);
    this.loading = true;
    this.updateTotals();
    this.editMode = this.masterOrder.order_id !== 0;
    // console.log('Current Order', this.currentOrder);
  }

  formatOrderNumber(today): string {
    // console.log('formatOrderNumber - today', today);
    let dd = today.getDate();
    let mm = (today.getMonth() + 1); // January is 0!
    const yyyy = today.getFullYear().toString();
    if (dd < 10) {
      dd = '0' + dd;
    }
    if (mm < 10) {
      mm = '0' + mm;
    }
    // console.log('formattedDate', mm + dd + yyyy);
    return mm.toString() + dd.toString() + yyyy.toString();
  }
}
