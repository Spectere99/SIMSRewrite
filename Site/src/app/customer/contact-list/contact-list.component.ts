import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { LookupService } from '../../_services/lookups.service';
import { CustomerService, Customer } from '../../_services/customer.service';
import { UserService } from '../../_services/user.service';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  providers: [LookupService, CustomerService, UserService],
  styleUrls: ['./contact-list.component.css']
})
export class ContactListComponent implements OnInit {
@Input() customer: any;
@Output() onContactCustomerSelect = new EventEmitter<any>();
customerService: CustomerService;
userDataSource: any;
selectedCustomer: Customer;
dataSource: any;
lookupDataSource: any;
personTypes: any;
gridHeight;
popupVisible = false;

  constructor(lookupService: LookupService, customerSvc: CustomerService, userService: UserService) {
    this.customerService = customerSvc;
    this.CreateContactDataSource();
    this.gridHeight = 525;
    lookupService.loadLookupData('').subscribe(res => {
      this.lookupDataSource = res.value;
      this.createPersonTypeDataSource();
    });
    userService.getUsers('').subscribe(res => {
      this.userDataSource = res.value;
      console.log(this.userDataSource);
    });
  }


  CreateContactDataSource() {
    this.dataSource = {
      store: {
          type: 'odata',
          url: 'http://localhost:56543/odata/CustomerPerson'
      },
      expand: ['customers'],
      select: [
        'customer_person_id',
        'person_type',
        'first_name',
        'last_name',
        'email_address',
        'phone_1_type',
        'phone_1',
        'phone_1_ext',
        'phone_2_type',
        'phone_2',
        'phone_2_ext',
        'customers/customer_id',
        'customers/customer_name',
        'customers/setup_date',
        'customers/setup_by',
        'customers/status_code',
        'customers/ship_to_bill_ind',
        'customers/website_url',
        'customers/account_number',
        'customers/override_validation_ind',
        'customers/parent_id',
        'customers/parent_ind'
      ],
      //  filter: ['customer_address/type_code', '=', 'bill']
      // filter: ['order_date', '>', this.filterDate]
   };
  }

  onCellPrepared(e) {
   // console.log('cell data', e);
  }
  createPersonTypeDataSource() {
    this.personTypes = this.lookupDataSource.filter(item => item.class === 'CONT');
  }

  showEditPopup(e) {
    // e.cancel = true;
    console.log('ShowPopup', e);

    this.customerService.loadCustomerData('', e.customer_id).subscribe(res => {
      this.selectedCustomer = res;
      console.log('Returned Customer', res);
      this.popupVisible = true;
    });
  }

/*   loadCustomerEdit(customer: any) {
    console.log('Customer', customer);
    this.onContactCustomerSelect.emit(customer);

    // alert(customerId);
  } */
  ngOnInit() {
  }

}
