import { Component, OnInit, OnChanges, Input, ViewChild } from '@angular/core';
import { OrderService, Order, OrderDetail, OrderArtPlacement, OrderFee, OrderPayment } from '../../_services/order.service';
import { UserService } from '../../_services/user.service';
import { LookupService, LookupItem } from '../../_services/lookups.service';
import { PriceListService, PriceListItem } from '../../_services/pricelist.service';
import { AuthenticationService } from '../../_services/authentication.service';
import { OrderTaskListComponent } from '../order-task-list/order-task-list.component';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA,
  MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss'],
  providers: [OrderService, PriceListService]
})

export class OrderDetailComponent implements OnInit {
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
  userDataSource: any;

  editMode: boolean;

  orderArtPlacement: Array<OrderArtPlacement>;
  orderFees: Array<OrderFee>;
  orderPayments: Array<OrderPayment>;
  order: any;
  orderTasks: any;
  nonTaxableSubTotal: string;
  userProfile;

  constructor(private lookupService: LookupService, private priceListService: PriceListService, userService: UserService,
    public orderService: OrderService, public authService: AuthenticationService, public snackBar: MatSnackBar) {
    this.userProfile = JSON.parse(authService.getUserToken());
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
      // console.log('Pricelist Items', this.itemTypes);
      // console.log('Setup Items', this.setupItems);
    });

    userService.getUsers('').subscribe(res => {
      this.userDataSource = res.value;
      // console.log(this.userDataSource);
    });
  }

  showValues() {
    console.log('Showing Order Values', this.order);
  }
  orderTaxableChange(val: boolean): string {
    this.updateTotals();
    return val ? 'Y' : 'N';
  }
  createLookupTypeSource(className: string): any {
    return this.lookupDataSource.filter(item => item.class === className);
  }

  createItemTypeSource(type: string): any {
    return this.priceListDataSource.filter(item => item.pricelist_type === type);
  }

  noOrderItems() {
    // console.log('In orderHasItems', this.order);
    if (this.order) {
      if (this.order.order_detail) {
        return this.order.order_detail.length === 0;
      }
    }
    return true;
  }

  noArtPlacementItems() {
    if (this.order) {
      if (this.orderArtPlacement) {
        return this.orderArtPlacement.length === 0;
      }
    }
    return true;
  }

  noOrderFees() {
    if (this.order) {
      if (this.orderFees) {
        return this.orderFees.length === 0;
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
          this.currentOrder.shipping = totalShipping.toFixed(2);
        } // Need to set an error?
      }
    }
  }

  addLineItem(e) {
    const lineItem = new OrderDetail();
    lineItem.order_detail_id = (this.order.order_detail.length + 1) * -1;
    lineItem.order_id = this.order.order_id;
    lineItem.item_type = null;
    lineItem.item_line_number = null;
    lineItem.item_quantity = null;
    lineItem.pricelist_id = null;
    lineItem.style_code = null;
    lineItem.color_code = null;
    lineItem.size_code = null;
    lineItem.vendor = null;
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
    lineItem.order_number = null;
    lineItem.customer_name = null;
    lineItem.garment_order_date = null;
    lineItem.garment_recvd_date = null;

    this.order.order_detail.unshift(lineItem);
  }

  copyOrderLine(e, idx) {
    const orderLine = this.order.order_detail[idx];
    orderLine.order_detail_id = (this.order.order_detail.length + 1) * -1;
    this.order.order_detail.unshift(orderLine);
  }

  deleteLineItem(e) {
    console.log('deletingLineItem', e);
    // See if the item has been saved to the database. (non-negative id)
    // if it has not, then just remove it, otherwise, we need to call the web service
    // to delete the item from the database first.
    const index = this.order.order_detail.findIndex(x => x.order_detail_id === e.order_detail_id);
    console.log('Del Line Item', index);
    if (index >= 0) {
      if (e.order_detail_id > 0) {
        // Call web service to delete here - passing in the order_detail_id.
        console.log('OrderDetail on Delete', e.order_detail_id);
        this.orderService.deleteOrderLineItem('rwflowers', e.order_detail_id)
        .subscribe(res => {
          this.snackBar.open('Order Line Deleted!', '', {
            duration: 4000,
            verticalPosition: 'top'
          });
        });
      }
    }
    this.order.order_detail.splice(index, 1);
  }

  addArtPlacement(e) {
    const artPlacement = new OrderArtPlacement();
    artPlacement.order_art_placement_id = (this.orderArtPlacement.length + 1) * -1;
    artPlacement.added_by = this.userProfile.profile.login_id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    artPlacement.added_date = today.toLocaleDateString(); // this.formatOrderNumber(today);
    console.log('ArtPlacement Added By', artPlacement.added_by);
    console.log('UserList', this.userDataSource);
    this.orderArtPlacement.unshift(artPlacement);
  }
  deleteArtPlacement(e) {
    console.log('deletingArtPlacement', e);
    // See if the item has been saved to the database. (non-negative id)
    // if it has not, then just remove it, otherwise, we need to call the web service
    // to delete the item from the database first.
    const index = this.orderArtPlacement.findIndex(x => x.order_art_placement_id === e.order_art_placement_id);
    console.log('Del Art Plcmt', index);
    if (index >= 0) {
      if (e.order_art_placement_id > 0) {
        // Call web service to delete here.
        this.orderService.deleteOrderArtPlacement('rwflowers', e.order_art_placement_id)
        .subscribe(res => {
          this.snackBar.open('Art Placement Line Deleted!', '', {
            duration: 4000,
            verticalPosition: 'top'
          });
        });
      }
    }
    this.orderArtPlacement.splice(index, 1);
  }

  addFee(e) {
    const orderFee = new OrderFee();
    orderFee.order_fee_id = (this.orderFees.length + 1) * -1;
    orderFee.fee_line_number = this.orderFees.length + 1;
    orderFee.fee_price_each = 0.0.toFixed(2);
    orderFee.taxable_ind = 'N';
    orderFee.pricelist_id = null;
    orderFee.fee_price_ext = 0.0.toFixed(2);
    orderFee.order_id = this.currentOrder.order_id;
    orderFee.fee_quantity = 0;

    this.orderFees.unshift(orderFee);
  }
  deleteFee(e) {
    console.log('deletingFee', e);
    // See if the item has been saved to the database. (non-negative id)
    // if it has not, then just remove it, otherwise, we need to call the web service
    // to delete the item from the database first.
    const index = this.orderFees.findIndex(x => x.order_fee_id === e.order_fee_id);
    console.log('Del Fee', index);
    if (index >= 0) {
      if (e.order_fee_id > 0) {
        // Call web service to delete here.
        this.orderService.deleteOrderFee('rwflowers', e.order_fee_id)
        .subscribe(res => {
          this.snackBar.open('Order Charge Line Deleted!', '', {
            duration: 4000,
            verticalPosition: 'top'
          });
        });
      }
    }
    this.orderFees.splice(index, 1);
  }

  addPayment(e) {
    const payment = new OrderPayment();
    payment.order_payment_id = (this.orderPayments.length + 1) * -1;
    payment.entered_user_id = this.userProfile.profile.user_id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    payment.payment_date = today.toLocaleDateString(); // this.formatOrderNumber(today);
    this.orderPayments.push(payment);
  }
  deletePayment(e) {
    console.log('deletingPayment', e);
    // See if the item has been saved to the database. (non-negative id)
    // if it has not, then just remove it, otherwise, we need to call the web service
    // to delete the item from the database first.
    const index = this.orderPayments.findIndex(x => x.order_payment_id === e.order_payment_id);
    console.log('Del Payment', index);
    if (index >= 0) {
      if (e.order_payment_id > 0) {
        // Call web service to delete here.
        this.orderService.deleteOrderPayment('rwflowers', e.order_payment_id)
        .subscribe(res => {
          this.snackBar.open('Order Payment Deleted!', '', {
            duration: 4000,
            verticalPosition: 'top'
          });
        });
      }
    }
    this.orderPayments.splice(index, 1);
  }

  onQtyPriceChange(e, idx) {
    console.log('Order Detail onChange Event', e.target.value);
    console.log('Order Index item', idx);
    let totalItemQty = 0;
    const orderLine = this.order.order_detail[idx];
    console.log('orderLine', orderLine);
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
    this.order.order_detail[idx].item_quantity = totalItemQty;
    this.order.order_detail[idx].item_price_ext = (totalItemQty * ((orderLine.item_price_each === undefined) ? 0
                                                                    : +orderLine.item_price_each)).toFixed(2);
    this.updateTotals();
  }

  onFeeChange(e, idx) {
    const feeLine = this.orderFees[idx];

    feeLine.fee_price_ext = (+feeLine.fee_quantity * +feeLine.fee_price_each).toFixed(2);

    this.updateTotals();
  }
  onTaxRateChange(e) {
    for (let x = 0; x < this.order.order_detail.length; x++) {
      this.onQtyPriceChange(e, x);
    }
    this.updateTotals();
  }

  updateTotals() {
    this.order.subtotal = 0;
    this.nonTaxableSubTotal = 0.0.toFixed(2);
    let subTotal = 0;
    let nonTaxSubTotal = 0;
    console.log('order Details', this.order.order_detail);
    // Total order Line Items
    for ( let x = 0; x < this.order.order_detail.length; x++) {
      if (this.order.order_detail[x].taxable_ind === 'Y') {
        subTotal = subTotal + +this.order.order_detail[x].item_price_ext;
      } else {
        nonTaxSubTotal = nonTaxSubTotal + +this.order.order_detail[x].item_price_ext;
      }
    }
    console.log('subTotal', subTotal);
    console.log('nonTaxSubTotal', nonTaxSubTotal);
    this.order.subtotal = subTotal.toFixed(2);
    this.currentOrder.subtotal = subTotal.toFixed(2);
    // Add Non Shipping Fees to SubTotal.
    const shippingLookup = this.setupItems.filter(item => item.pricelist_description === 'Shipping');
    const nonShippingFees = this.orderFees.filter(item => item.pricelist_id !== +shippingLookup[0].pricelist_id);
    for ( let y = 0; y < nonShippingFees.length; y++) {
      if (nonShippingFees[y].taxable_ind === 'Y') {
        subTotal = subTotal + +nonShippingFees[y].fee_price_ext;
      } else {
        nonTaxSubTotal = nonTaxSubTotal + +nonShippingFees[y].fee_price_ext;
      }
    }
    this.nonTaxableSubTotal = nonTaxSubTotal.toFixed(2);
    this.order.subtotal = subTotal.toFixed(2);
    this.currentOrder.subtotal = this.order.subtotal;
    this.order.tax_amount = (subTotal * (this.currentOrder.tax_rate / 100)).toFixed(2);
    this.currentOrder.tax_amount = this.order.tax_amount;

    // Total Shipping Items (Non Taxable)
    let shippingTotal = 0;
    const shippingFees = this.orderFees.filter(item => +item.pricelist_id === 10737); // +shippingLookup[0].pricelist_id);

    for ( let z = 0; z < shippingFees.length; z++) {
      shippingTotal = shippingTotal + +shippingFees[z].fee_price_ext;
    }
    this.order.shipping = shippingTotal.toFixed(2);
    this.currentOrder.shipping = this.order.shipping;


    // Get Payments that were made
    let paymentTotal = 0;
    for (let x = 0; x < this.orderPayments.length; x++) {
      paymentTotal = paymentTotal + +this.orderPayments[x].payment_amount;
    }

    // Total it all up.
    this.order.total = (+subTotal + +this.order.tax_amount + nonTaxSubTotal + shippingTotal).toFixed(2);
    this.currentOrder.total = this.order.total;

    this.order.payments = paymentTotal.toFixed(2);
    this.currentOrder.payments = paymentTotal.toFixed(2);

    this.order.balance_due = (+subTotal + +this.order.tax_amount + nonTaxSubTotal + shippingTotal - paymentTotal).toFixed(2);
    this.currentOrder.balance_due = this.order.balance_due;
  }

  batchSave(order_id: number) {
    for (let x = 0; x < this.order.order_detail.length; x++) {
      console.log('Saving Order- Order ID= ', order_id);
      this.order.order_detail[x].order_id = order_id;
      this.saveOrderLines(this.order.order_detail[x]);
    }

    for (let x = 0; x < this.orderArtPlacement.length; x++) {
      this.orderArtPlacement[x].order_id = order_id;
      this.saveArtPlacement(this.orderArtPlacement[x]);
    }

    for (let x = 0; x < this.orderFees.length; x++) {
      this.orderFees[x].order_id = order_id;
      this.saveFees(this.orderFees[x]);
    }

    for (let x = 0; x < this.orderPayments.length; x++) {
      this.orderPayments[x].order_id = order_id;
      this.savePayments(this.orderPayments[x]);
    }
  }

  saveOrderLines(orderDetail: OrderDetail) {
    console.log('OrderDetail on Save', orderDetail);
    if (orderDetail.order_detail_id <= 0) {
      orderDetail.order_detail_id = 0;
      orderDetail.order_id = this.order.order_id;
      this.orderService.addOrderLineItem('rwflowers', orderDetail)
      .subscribe(res => {
        console.log('Save orderInfo Return', res);
        orderDetail.order_detail_id = res.order_detail_id;
        this.snackBar.open('Order Line Added!', '', {
          duration: 4000,
          verticalPosition: 'top'
        });
      });
    } else {
      this.orderService.updateOrderLineItem('rwflowers', orderDetail)
      .subscribe(res => {
        console.log('Update orderLineItem Return', res);
        this.snackBar.open('Order Line Updated!', '', {
          duration: 4000,
          verticalPosition: 'top'
        });
      });
    }
  }

  saveArtPlacement(artPlacement: OrderArtPlacement) {
    console.log('Art Placement on Save', artPlacement);
    if (artPlacement.order_art_placement_id <= 0) {
      artPlacement.order_art_placement_id = 0;
      this.orderService.addOrderArtPlacement('rwflowers', artPlacement)
      .subscribe(res => {
        console.log('Save artPlacement Return', res);
        artPlacement.order_art_placement_id = res.order_art_placement_id;
        this.snackBar.open('Art Placement Line Added!', '', {
          duration: 4000,
          verticalPosition: 'top'
        });
      });
    } else {
      this.orderService.updateOrderArtPlacement('rwflowers', artPlacement)
      .subscribe(res => {
        console.log('Update artPlacement Return', res);
        this.snackBar.open('Art Placement Line Updated!', '', {
          duration: 4000,
          verticalPosition: 'top'
        });
      });
    }
  }

  saveFees(orderFee: OrderFee) {
    console.log('Order Fee on Save', orderFee);
    if (orderFee.order_fee_id <= 0) {
      orderFee.order_fee_id = 0;
      this.orderService.addOrderFee('rwflowers', orderFee)
      .subscribe(res => {
        console.log('Save orderFee Return', res);
        orderFee.order_fee_id = res.order_fee_id;
        this.snackBar.open('Order Fee Line Added!', '', {
          duration: 4000,
          verticalPosition: 'top'
        });
      });
    } else {
      this.orderService.updateOrderFee('rwflowers', orderFee)
      .subscribe(res => {
        console.log('Update orderFee Return', res);
        this.snackBar.open('Order Fee Line Updated!', '', {
          duration: 4000,
          verticalPosition: 'top'
        });
      });
    }
  }

  savePayments(orderPayment: OrderPayment) {
    console.log('Order Payment on Save', orderPayment);
    if (orderPayment.order_payment_id <= 0) {
      orderPayment.order_payment_id = 0;
      this.orderService.addOrderPayment('rwflowers', orderPayment)
      .subscribe(res => {
        console.log('Save orderFee Return', res);
        orderPayment.order_payment_id = res.order_payment_id;
        this.snackBar.open('Order Payment Line Added!', '', {
          duration: 4000,
          verticalPosition: 'top'
        });
      });
    } else {
      this.orderService.updateOrderPayment('rwflowers', orderPayment)
      .subscribe(res => {
        console.log('Update orderPayment Return', res);
        this.snackBar.open('Order Payment Line Updated!', '', {
          duration: 4000,
          verticalPosition: 'top'
        });
      });
    }
  }

  ngOnInit() {
    /* console.log('order-detail OnInit', this.currentOrder);
    this.editMode = this.currentOrder !== undefined;
    this.orderService.loadOrderData('', this.currentOrder.order_id).subscribe(res => {
      this.order = res;
      console.log('pulled order', this.order);
    });
    this.orderService.loadArtPlacementData('', this.currentOrder.order_id).subscribe(res => {
      this.orderArtPlacement = res.order_art_placement;
      console.log('pulled Art Placement', this.orderArtPlacement);
    }); */
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnChanges() {
    // console.log('order-detail-component currentOrder', this.currentOrder);
    this.editMode = this.currentOrder.order_id !== 0;
    console.log('Current Order', this.currentOrder);
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
        this.getShipping();
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
  formatOrderNumber(today): string {
    console.log('formatOrderNumber - today', today);
    let dd = today.getDate();
    let mm = (today.getMonth() + 1); // January is 0!
    const yyyy = today.getFullYear().toString();
    if (dd < 10) {
      dd = '0' + dd;
    }
    if (mm < 10) {
      mm = '0' + mm;
    }
    console.log('formattedDate', mm + dd + yyyy);
    return mm + dd + yyyy;
  }
}
