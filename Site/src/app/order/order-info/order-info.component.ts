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
      // console.log(this.userDataSource);
    });
   }

  createLookupTypeSource(className: string): any {
    return this.lookupDataSource.filter(item => item.class === className);
  }

  getCustomerFullName(customer: any): string {
    return customer.first_name + ' ' + customer.last_name;
  }

  onChange(e) {
    console.log('order Contact before: ', this.currentOrder.contact);
    console.log('contact selection changed:', e);
    console.log('contactPersons', this.contactPersons);
    const selectedContact = this.contactPersons.filter(item => (item.first_name + ' ' + item.last_name) === e);
    console.log('selectedContact', selectedContact);
    this.currentOrder.contact = selectedContact[0].first_name + ' ' + selectedContact[0].last_name;
    console.log('new Order contact', this.currentOrder.contact);
    this.currentOrder.contact_email = selectedContact[0].email_address;
    console.log('order Contact after: ', this.currentOrder.contact);
  }
  ngOnInit() {
    /* // console.log('OnInit currentOrder', this.currentOrder);
    this.editMode = this.currentOrder !== undefined;
    if (this.currentOrder) {
      this.customerService.getCustomerData('', this.currentOrder.customer_id).subscribe(res => {
        this.orderCustomer = res;
        this.contactPersons = this.orderCustomer.customer_person;
        // console.log('pulled Customer', this.orderCustomer);
      });
    } else {
      this.currentOrder = new Order();
    } */
  }

  ngOnChanges() {
    // console.log('order-info-component currentOrder', this.currentOrder);
    this.editMode = this.currentOrder.order_id !== 0;
    if (this.currentOrder.customer_id !== 0) {
      this.customerService.getCustomerData('', this.currentOrder.customer_id).subscribe(res => {
        this.orderCustomer = res;
        this.contactPersons = this.orderCustomer.customer_person;
        console.log('pulled Customer', this.orderCustomer);
      });
    } else {
      // this.currentOrder = new Order();
    }
  }

}
