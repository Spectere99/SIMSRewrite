import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { OrderService, OrderDetail } from '../../_services/order.service';
import { UserService } from '../../_services/user.service';
import { LookupService, LookupItem } from '../../_services/lookups.service';


@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss'],
  providers: [OrderService]
})

export class OrderDetailComponent implements OnInit {
  @Input() currentOrder: any;
  lookupDataSource: Array<LookupItem>;
  // TODO:  Add service and call to pull values from price_list odata service and populate list.
  itemTypes = [{ char_mod: 'polo', description: 'Wicking Compression Shirt Short Sleeve' }];
  styleTypes: Array<LookupItem>;
  sizeTypes: Array<LookupItem>;
  vendorTypes: Array<LookupItem>;
  artLocations: Array<LookupItem>;
  userDataSource: any;

  editMode: boolean;

  orderArtPlacement: any;
  order: any;
  orderTasks: any;

  constructor(private lookupService: LookupService, userService: UserService, public orderService: OrderService) {
    this.order = {};
    this.order.order_detail = [];
    lookupService.loadLookupData('').subscribe(res => {
      this.lookupDataSource = res.value;
      this.sizeTypes = this.createLookupTypeSource('ssiz');
      this.styleTypes = this.createLookupTypeSource('sclas');
      this.vendorTypes = this.createLookupTypeSource('vend');
      this.artLocations = this.createLookupTypeSource('aloc');
    });
    userService.getUsers('').subscribe(res => {
      this.userDataSource = res.value;
      console.log(this.userDataSource);
    });
  }

  createLookupTypeSource(className: string): any {
    return this.lookupDataSource.filter(item => item.class === className);
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
  ngOnInit() {
    console.log('order-detail OnInit', this.currentOrder);
    this.editMode = this.currentOrder !== undefined;
    this.orderService.loadOrderData('', this.currentOrder.order_id).subscribe(res => {
      this.order = res;
      console.log('pulled order', this.order);
    });
    this.orderService.loadArtPlacementData('', this.currentOrder.order_id).subscribe(res => {
      this.orderArtPlacement = res.order_art_placement;
      console.log('pulled Art Placement', this.orderArtPlacement);
    });
  }

  ngOnChanges() {
    console.log('order-detail OnChanges', this.currentOrder);
    this.editMode = this.currentOrder !== undefined;
    this.orderService.loadOrderData('', this.currentOrder.order_id).subscribe(res => {
      this.order = res;
      console.log('pulled order', this.order);
    });
    this.orderService.loadArtPlacementData('', this.currentOrder.order_id).subscribe(res => {
      this.orderArtPlacement = res.order_art_placement;
      console.log('pulled Art Placement', this.orderArtPlacement);
    });
  }
}
