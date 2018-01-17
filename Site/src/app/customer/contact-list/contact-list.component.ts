import { Component, OnInit, ViewChild, Output, Input, EventEmitter } from '@angular/core';
import { DxDataGridComponent, DxTemplateModule } from 'devextreme-angular';
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
@ViewChild(DxDataGridComponent) gridCustomers: DxDataGridComponent;
customerService: CustomerService;
userDataSource: any;
selectedCustomer: Customer;
dataSource: any;
lookupDataSource: any;
personTypes: any;
phoneTypes: any;
scrollMode: string;
pagingEnabled: boolean;
expandedResults: boolean;
currentPageSize: number;
buttonClass = 'btn-blue-grey';
disableExpand: boolean;
gridHeight;
popupVisible = false;

  constructor(lookupService: LookupService, customerSvc: CustomerService, userService: UserService) {
    this.customerService = customerSvc;
    this.CreateContactDataSource();
    this.gridHeight = 525;
    lookupService.loadLookupData('').subscribe(res => {
      this.lookupDataSource = res.value;
      this.createPersonTypeDataSource();
      this.createPhoneTypeDataSource();
    });
    userService.getUsers('').subscribe(res => {
      this.userDataSource = res.value;
      console.log(this.userDataSource);
    });
  }

  ExpandGrid() {
    // console.log('expanding Grid');
    // console.log(this.gridCustomers.instance.pageCount());
    this.expandedResults = !this.expandedResults;

    const currentPageCount = this.gridCustomers.instance.pageCount();

    if (!this.expandedResults) {
      this.gridHeight = 525;
      console.log('Page size-Collapse', this.currentPageSize);
      console.log('gridHeight-Collapse', this.gridHeight);
    } else {
      this.gridHeight = this.gridHeight * currentPageCount;
      console.log('Page size-Expand', this.currentPageSize);
      console.log('gridHeight-Expand', this.gridHeight);
    }
    this.pagingEnabled = !this.pagingEnabled;
    this.scrollMode = 'virtual';

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
      filter: ['customers/customer_name', '<>', null]
      //  filter: ['customer_address/type_code', '=', 'bill']
      // filter: ['order_date', '>', this.filterDate]
   };
  }
  onRowClick(e) {
    console.log('rowClickEvent Param', e.data.items[0].customers);
    if (e.rowType === 'group') {
      this.showEditPopup(e.data.items[0].customers);
    }
  }

  onToolbarPreparing(e) {
      e.toolbarOptions.items.unshift({
              location: 'after',
              widget: 'dxButton',
              options: {
                  hint: 'Add New Customer',
                  icon: 'plus',
                  onClick: this.showAddPopup.bind(this)
              }
          });
  }
  onCellPrepared(e) {
   // console.log('cell data', e);
  }

  showAddPopup(e) {
    console.log('Adding', e);
    this.selectedCustomer = new Customer;

    // console.log('SelectedCustomer', this.selectedCustomer);
    // alert('Editing!');
    this.popupVisible = true;
  }

  createPersonTypeDataSource() {
    this.personTypes = this.lookupDataSource.filter(item => item.class === 'CONT');
  }
  createPhoneTypeDataSource() {
    this.phoneTypes = this.lookupDataSource.filter(item => item.class === 'PHON');
  }

  showEditPopup(e) {
    // e.cancel = true;s
    console.log('ShowPopup', e.data);

    this.customerService.getCustomerData('', e.data.customers.customer_id).subscribe(res => {
      this.selectedCustomer = res;
      console.log('Returned Customer', res);
      this.popupVisible = true;
    });
  }

  applyChanges() {
    alert('Applying Customer-Info Changes');
    // Call customer_info component's batchSave method.
    alert('Applying Customer Contacts Changes');
    // Call customer_contacts component's batchSave method.
}
/*   loadCustomerEdit(customer: any) {
    console.log('Customer', customer);
    this.onContactCustomerSelect.emit(customer);

    // alert(customerId);
  } */
  ngOnInit() {
  }

}
