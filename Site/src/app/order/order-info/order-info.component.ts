import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { LookupService } from '../../_services/lookups.service';
import { UserService } from '../../_services/user.service';
import { CustomerService } from '../../_services/customer.service';
import { OrderService, Order, OrderDetail } from '../../_services/order.service';
import { StateService, StateInfo } from '../../_shared/states.service';

@Component({
  selector: 'app-order-info',
  templateUrl: './order-info.component.html',
  styleUrls: ['./order-info.component.scss'],
  providers: [CustomerService, OrderService, StateService]
})
export class OrderInfoComponent implements OnInit, OnChanges {
  @Input() currentOrder: Order;
  orderCustomer: any;
  lookupDataSource: any;
  contactPersons: any;
  stateList: any;
  phoneTypes: any;
  orderTypes: any;
  statusTypes: any;
  userDataSource: any;

  editMode: boolean;
 // customerService: CustomerService;

  constructor(lookupService: LookupService, userService: UserService, public customerService: CustomerService,
              private usStateService: StateService) {

    this.stateList = this.usStateService.getStateList();
      lookupService.loadLookupData('').subscribe(res => {
      this.lookupDataSource = res.value;
      this.phoneTypes = this.createLookupTypeSource('PHON');
      this.orderTypes = this.createLookupTypeSource('otyps');
      this.statusTypes = this.createLookupTypeSource('ord');
    });
    userService.getUsers('').subscribe(res => {
      this.userDataSource = res.value;
      console.log(this.userDataSource);
    });
   }

  createLookupTypeSource(className: string): any {
    return this.lookupDataSource.filter(item => item.class === className);
  }

  getCustomerFullName(customer: any): string {
    return customer.first_name + ' ' + customer.last_name;
  }

  ngOnInit() {
    console.log('OnInit currentOrder', this.currentOrder);
    this.editMode = this.currentOrder !== undefined;
    if (this.currentOrder) {
      this.customerService.getCustomerData('', this.currentOrder.customer_id).subscribe(res => {
        this.orderCustomer = res;
        this.contactPersons = this.orderCustomer.customer_person;
        console.log('pulled Customer', this.orderCustomer);
      });
    }
  }

  ngOnChanges() {
    console.log('OnChanges currentOrder', this.currentOrder);
    this.editMode = this.currentOrder !== undefined;
    if (this.currentOrder) {
      this.customerService.getCustomerData('', this.currentOrder.customer_id).subscribe(res => {
        this.orderCustomer = res;
        this.contactPersons = this.orderCustomer.customer_person;
        console.log('pulled Customer', this.orderCustomer);
      });
    }
  }

}
