import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { LookupService, LookupItem } from '../../_services/lookups.service';
import { OrderService, OrderTask, OrderStatusHistory } from '../../_services/order.service';
import { UserService } from '../../_services/user.service';
import { AuthenticationService } from '../../_services/authentication.service';
import { ArraySortPipe } from '../../_shared/pipes/orderBy.pipe';

@Component({
  selector: 'app-order-notes-history',
  templateUrl: './order-notes-history.component.html',
  styleUrls: ['./order-notes-history.component.scss'],
  providers: [OrderService, LookupService, UserService, AuthenticationService]
})
export class OrderNotesHistoryComponent implements OnInit {
  @Input() currentOrder: any;
  lookupDataSource: Array<LookupItem>;
  statusTypes: Array<LookupItem>;
  orderStatusHistory: Array<OrderStatusHistory>;
  userDataSource: any;

  userProfile;

  constructor(private lookupService: LookupService, public orderService: OrderService,
              private userService: UserService, public authService: AuthenticationService) {
    this.userProfile = JSON.parse(authService.getUserToken());
    // console.log('order Task List Constructor');
    lookupService.loadLookupData('').subscribe(res => {
      this.lookupDataSource = res.value;
      this.statusTypes = this.createLookupTypeSource('ord');
      // console.log('StatusTypes', this.statusTypes);
    });
    userService.getUsers('').subscribe(res => {
      this.userDataSource = res.value;
      // console.log(this.userDataSource);
    });
  }

  createLookupTypeSource(className: string): any {
    return this.lookupDataSource.filter(item => item.class === className);
  }


  ngOnInit() {
    // console.log('Order Status History List onInit', this.currentOrder);
    if (this.currentOrder) {
      if (this.currentOrder.order_id > 0) {  // Existing Order.  Grab its status history for display
        this.orderService.loadOrderStatusHistoryData('rflowers', this.currentOrder.order_id)
          .subscribe(res => {
            this.orderStatusHistory = res.order_status_history;
            // console.log('Order Status History Pulled', res);
          });
      }
    }
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnChanges() {
    // console.log('Order Status History List onChange', this.currentOrder);
    if (this.currentOrder) {
      if (this.currentOrder.order_id > 0) {  // Existing Order.  Grab its status history
        this.orderService.loadOrderStatusHistoryData('rflowers', this.currentOrder.order_id)
          .subscribe(res => {
            this.orderStatusHistory = res.order_status_history;
            // console.log('Order Status History Pulled', res.order_status_history);
          });
      } else {
        this.orderStatusHistory = new Array<OrderStatusHistory>();
      }
    }
  }

}
