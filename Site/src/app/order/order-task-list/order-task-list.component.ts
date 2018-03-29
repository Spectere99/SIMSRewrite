import { Component, OnInit, OnChanges, Input} from '@angular/core';
import { LookupService, LookupItem } from '../../_services/lookups.service';
import { OrderService, OrderTask } from '../../_services/order.service';
import { TaskService, Task } from '../../_services/task.service';
import { AuthenticationService } from '../../_services/authentication.service';
import { ArraySortPipe } from '../../_shared/pipes/orderBy.pipe';


@Component({
  selector: 'app-order-task-list',
  templateUrl: './order-task-list.component.html',
  styleUrls: ['./order-task-list.component.scss'],
  providers: [OrderService, TaskService, ArraySortPipe]
})
export class OrderTaskListComponent implements OnInit {
@Input() currentOrder: any;
lookupDataSource: Array<LookupItem>;
taskList: Array<Task>;
orderTask: Array<OrderTask>;
taskLookup: Array<LookupItem>;

userProfile;

  constructor(private lookupService: LookupService, public orderService: OrderService,
              public taskService: TaskService, public authService: AuthenticationService) {
    this.userProfile = JSON.parse(authService.getUserToken());
    // console.log('order Task List Constructor');
    lookupService.loadLookupData('').subscribe(res => {
      this.lookupDataSource = res.value;
      this.taskLookup = this.createLookupTypeSource('otask');
      // console.log('task list', this.taskLookup);
    });
    taskService.loadTaskData('').subscribe(res => {
      this.taskList = res.value;
    });
  }

  createLookupTypeSource(className: string): any {
    return this.lookupDataSource.filter(item => item.class === className);
  }

  createOrderTaskList(orderId: number, taskType: string): Array<OrderTask> {
    const returnList = new Array<OrderTask>();
    const filteredList = this.taskList.filter(item => item.task_type === taskType);
    for (let x = 0; x < filteredList.length; x++) {
      const newOrderTask = new OrderTask();
      newOrderTask.order_id = orderId;
      newOrderTask.task_code = filteredList[x].task_code;
      newOrderTask.order_by = filteredList[x].order_by;
      newOrderTask.is_complete = 'N';
      newOrderTask.completed_by = undefined;
      newOrderTask.completed_date = undefined;
      returnList.push(newOrderTask);
    }

    return returnList;
  }

  setTaskComplete(isChecked, task, idx) {
    // console.log('setTaskComplete: isChecked', isChecked);
    // console.log('setTaskComplete: userProfile', this.userProfile);
    const foundTask = this.orderTask.filter(item => item.task_code === task.task_code);
    if (foundTask.length > 0) {
      if (isChecked) {
        foundTask[0].completed_by = this.userProfile.profile.login_id.toUpperCase();
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        foundTask[0].completed_date =  today.toISOString();
      }
      // foundTask[0].completed_by = isChecked ? this.userProfile.profile.login_id.toUpperCase() : '';
      // const today = new Date();
      // today.setHours(0, 0, 0, 0);
      // foundTask[0].completed_date =  isChecked ? today.toLocaleDateString() : undefined;
      // console.log('setTaskComplete: after set completed_by', foundTask[0]);
    }
  }

  buildDefaultTaskList(orderId: number, taskTypeCode: string) {
    // Need to lookup task list based on the order type and create new records for them
    // in the orderTask Array.
    this.orderTask = this.createOrderTaskList(orderId, taskTypeCode);
  }

  batchSave(orderId: number) {
    // console.log('Saving Order Tasks', this.orderTask);
    // console.log('Saving Order Task - OrderId:', orderId);
    // Need to pull the existing tasks and loop through to delete them
    // before adding the new task list updates.
    this.orderService.loadOrderTaskData(this.userProfile.profile.login_id, orderId)
      .subscribe(res => {
        const toDelete = res;
        this.orderService.deleteOrderTask(this.userProfile.profile.login_id, orderId)
        .subscribe(delRes => {
          // console.log('Delete Response', delRes);
          for (let x = 0; x < this.orderTask.length; x++) {
            this.saveOrderTasks(orderId, this.orderTask[x]);
          }
        });
      });
  }

  saveOrderTasks(orderId: number, orderTask: OrderTask) {
    // Need to loop through the order tasks and save their values.
    orderTask.order_id = orderId;
    this.orderService.addOrderTask(this.userProfile.profile.log_id, orderTask)
      .subscribe(res => {
        // console.log(res);
      });
  }

  ngOnInit() {
    // console.log('Order Task List onInit', this.currentOrder);
    if (this.currentOrder) {
      if (this.currentOrder.order_id > 0) {  // Existing Order.  Grab its tasks for display
        this.orderService.loadOrderTaskData('rflowers', this.currentOrder.order_id)
        .subscribe(res => {
          this.orderTask = res.order_task;
          // console.log('Order Tasks Pulled', res);
        });
      }
    }
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnChanges() {
    // console.log('Order Task List onChange', this.currentOrder);
    if (this.currentOrder) {
      if (this.currentOrder.order_id > 0) {  // Existing Order.  Grab its tasks for display
        this.orderService.loadOrderTaskData('rflowers', this.currentOrder.order_id)
        .subscribe(res => {
          this.orderTask = res.order_task;
          // console.log('Order Tasks Pulled', res.order_task);
        });
      } else {
        this.orderTask = new Array<OrderTask>();
      }
    }
  }
}
