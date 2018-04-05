import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { LookupService, LookupItem } from '../../_services/lookups.service';
import { OrderService, OrderTask, OrderStatusHistory, OrderNote } from '../../_services/order.service';
import { UserService } from '../../_services/user.service';
import { AuthenticationService } from '../../_services/authentication.service';
import { ArraySortPipe } from '../../_shared/pipes/orderBy.pipe';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA,
  MatSnackBar } from '@angular/material';

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
  orderNotes: Array<OrderNote>;
  userDataSource: any;

  userProfile;

  constructor(private lookupService: LookupService, public orderService: OrderService,
              private userService: UserService, public authService: AuthenticationService, public snackBar: MatSnackBar) {
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

  addNote(e) {
    const newNote = new OrderNote();
    newNote.order_id = this.currentOrder.order_id;
    newNote.entered_date = new Date().toISOString();
    newNote.order_notes_id = (this.orderNotes.length + 1) * -1;
    newNote.private_ind = 'N';
    newNote.user_id = this.userProfile.profile.user_id;

    this.orderNotes.push(newNote);
  }

  deleteNote(e) {
    const index = this.orderNotes.findIndex(x => x.order_notes_id === e.order_notes_id);
    // console.log('Del Line Item', index);
    if (index >= 0) {
      if (e.order_notes_id > 0) {
        this.orderService.deleteOrderNote('rwflowers', e.order_notes_id)
        .subscribe(res => {
          this.snackBar.open('Note Deleted!', '', {
            duration: 4000,
            verticalPosition: 'top'
          });
        });
      }
    }
    this.orderNotes.splice(index, 1);
  }

  batchSave(order_id: number) {
    for (let x = 0; x < this.orderNotes.length; x++) {
      // console.log('Saving Order- Order ID= ', order_id);
      this.orderNotes[x].order_id = order_id;
      this.saveOrderNote(this.orderNotes[x]);
    }
  }

  saveOrderNote(orderNote: OrderNote) {
    // console.log('OrderDetail on Save', orderDetail);
    if (orderNote.order_notes_id <= 0) {
      orderNote.order_notes_id = 0;
      orderNote.order_id = this.currentOrder.order_id;
      this.orderService.addOrderNote('rwflowers', orderNote)
      .subscribe(res => {
        // console.log('Save orderInfo Return', res);
        orderNote.order_notes_id = res.order_detail_id;
        this.snackBar.open('Order Note Added!', '', {
          duration: 4000,
          verticalPosition: 'top'
        });
      });
    } else {
      this.orderService.updateOrderNote('rwflowers', orderNote)
      .subscribe(res => {
        // console.log('Update orderLineItem Return', res);
        this.snackBar.open('Order Note Updated!', '', {
          duration: 4000,
          verticalPosition: 'top'
        });
      });
    }
  }
  ngOnInit() {
    // console.log('Order Status History List onInit', this.currentOrder);
    if (this.currentOrder) {
      if (this.currentOrder.order_id > 0) {  // Existing Order.  Grab its status history for display
        this.orderService.loadOrderNotesData('rflowers', this.currentOrder.order_id)
          .subscribe(res => {
            console.log('loading Order Notes Data', this.currentOrder.order_id);
            this.orderNotes = res.order_notes;
            console.log('notes returned', this.orderNotes);
            // console.log('Order Status History Pulled', res);
          });
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
        this.orderService.loadOrderNotesData('rflowers', this.currentOrder.order_id)
          .subscribe(res => {
            console.log('loading Order Notes Data', this.currentOrder.order_id);
            this.orderNotes = res.order_notes;
            console.log('notes returned', this.orderNotes);
            // console.log('Order Status History Pulled', res);
          });
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
