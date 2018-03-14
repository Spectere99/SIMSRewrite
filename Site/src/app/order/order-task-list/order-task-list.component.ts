import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { LookupService, LookupItem } from '../../_services/lookups.service';
import { OrderService, OrderTask } from '../../_services/order.service';

@Component({
  selector: 'app-order-task-list',
  templateUrl: './order-task-list.component.html',
  styleUrls: ['./order-task-list.component.scss'],
  providers: [OrderService],
})
export class OrderTaskListComponent implements OnInit {
@Input() currentOrder: any;
lookupDataSource: Array<LookupItem>;
orderTask: Array<OrderTask>;
taskLookup: Array<LookupItem>;

  constructor(private lookupService: LookupService, public orderService: OrderService) {
    console.log('order Task List Constructor');
    lookupService.loadLookupData('').subscribe(res => {
      this.lookupDataSource = res.value;
      this.taskLookup = this.createLookupTypeSource('otask');
    });
  }

  createLookupTypeSource(className: string): any {
    return this.lookupDataSource.filter(item => item.class === className);
  }

  ngOnInit() {
    console.log('Order Task List onInit', this.currentOrder);
    if (this.currentOrder) {
      if (this.currentOrder.order_id > 0) {  // Existing Order.  Grab its tasks for display
        this.orderService.loadOrderTaskData('rflowers', this.currentOrder.order_id)
        .subscribe(res => {
          this.orderTask = res.order_task;
          console.log('Order Tasks Pulled', res);
        });
      }
    }
  }

  ngOnChange() {
    console.log('Order Task List onChange', this.currentOrder);
    if (this.currentOrder) {
      if (this.currentOrder.order_id > 0) {  // Existing Order.  Grab its tasks for display
        this.orderService.loadOrderTaskData('rflowers', this.currentOrder.order_id)
        .subscribe(res => {
          this.orderTask = res.order_task;
          console.log('Order Tasks Pulled', res.order_task);
        });
      }
    }
  }
}
