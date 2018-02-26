import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { OrderService, Order, OrderDetail, OrderArtPlacement, OrderFee, OrderPayment } from '../../_services/order.service';
import { UserService } from '../../_services/user.service';
import { LookupService, LookupItem } from '../../_services/lookups.service';
import { PriceListService, PriceListItem } from '../../_services/pricelist.service';


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

  constructor(private lookupService: LookupService, private priceListService: PriceListService, userService: UserService,
    public orderService: OrderService) {
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
      let totalShipping = 0;
      const shippingFees = this.orderFees.filter(fee => fee.pricelist_id === 10737);
      for (let x = 0; x < shippingFees.length; x++) {
        totalShipping = +(totalShipping + shippingFees[x].fee_price_ext);
      }
      this.currentOrder.shipping = totalShipping.toFixed(2);
    }
  }

  addLineItem(e) {
    const lineItem = new OrderDetail();
    lineItem.order_detail_id = (this.order.order_detail.length + 1) * -1;
    this.order.order_detail.unshift(lineItem);
  }
  deleteLineItem(e) {
    console.log('deletingLineItem', e);
    // See if the item has been saved to the database. (non-negative id)
    // if it has not, then just remove it, otherwise, we need to call the web service
    // to delete the item from the database first.
    const index = this.order.order_detail.findIndex(x => x.order_detail_id === e.order_detail_id);
    console.log('Del Line Item', index);
    if (index > 0) {
      if (e.order_detail_id > 0) {
        // Call web service to delete here - passing in the order_detail_id.
      }
    }
    this.order.order_detail.splice(index, 1);
  }

  addArtPlacement(e) {
    const artPlacement = new OrderArtPlacement();
    artPlacement.order_art_placement_id = (this.orderArtPlacement.length + 1) * -1;
    this.orderArtPlacement.unshift(artPlacement);
  }
  deleteArtPlacement(e) {
    console.log('deletingArtPlacement', e);
    // See if the item has been saved to the database. (non-negative id)
    // if it has not, then just remove it, otherwise, we need to call the web service
    // to delete the item from the database first.
    const index = this.orderArtPlacement.findIndex(x => x.order_art_placement_id === e.order_art_placement_id);
    console.log('Del Art Plcmt', index);
    if (index > 0) {
      if (e.order_art_placement_id > 0) {
        // Call web service to delete here.
      }
    }
    this.orderArtPlacement.splice(index, 1);
  }

  addFee(e) {
    const orderFee = new OrderFee();
    orderFee.order_fee_id = (this.orderFees.length + 1) * -1;
    this.orderFees.unshift(orderFee);
  }
  deleteFee(e) {
    console.log('deletingFee', e);
    // See if the item has been saved to the database. (non-negative id)
    // if it has not, then just remove it, otherwise, we need to call the web service
    // to delete the item from the database first.
    const index = this.orderFees.findIndex(x => x.order_fee_id === e.order_fee_id);
    console.log('Del Fee', index);
    if (index > 0) {
      if (e.order_fee_id > 0) {
        // Call web service to delete here.
      }
    }
    this.orderFees.splice(index, 1);
  }

  addPayment(e) {
    const payment = new OrderPayment();
    payment.order_payment_id = (this.orderPayments.length + 1) * -1;
    this.orderPayments.push(payment);
  }
  deletePayment(e) {
    console.log('deletingPayment', e);
    // See if the item has been saved to the database. (non-negative id)
    // if it has not, then just remove it, otherwise, we need to call the web service
    // to delete the item from the database first.
    const index = this.orderPayments.findIndex(x => x.order_payment_id === e.order_payment_id);
    console.log('Del Payment', index);
    if (index > 0) {
      if (e.order_payment_id > 0) {
        // Call web service to delete here.
      }
    }
    this.orderPayments.splice(index, 1);
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
}
