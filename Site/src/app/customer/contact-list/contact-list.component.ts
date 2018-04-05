import { Component, OnInit, ViewChild, Output, Input, EventEmitter } from '@angular/core';
import { environment } from '../../../environments/environment';
import { DxDataGridComponent, DxTemplateModule } from 'devextreme-angular';
import { LookupService } from '../../_services/lookups.service';
import { CustomerService, Customer } from '../../_services/customer.service';
import { UserService } from '../../_services/user.service';
import { CustomerContactsComponent } from '../customer-contacts/customer-contacts.component';
import { CustomerInfoComponent } from '../customer-info/customer-info.component';
import { CustomerInfo } from '../customer-info/customer-info.service';
import { AuthenticationService } from '../../_services/authentication.service';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  providers: [LookupService, CustomerService, UserService],
  styleUrls: ['./contact-list.component.css']
})
export class ContactListComponent implements OnInit {
// baseURL = 'http://localhost:56543/odata/';
baseURL = environment.odataEndpoint;
@Input() customer: any;
@Output() onContactCustomerSelect = new EventEmitter<any>();
@ViewChild(CustomerInfoComponent) customerInfo: CustomerInfoComponent;
@ViewChild(CustomerContactsComponent) customerContacts: CustomerContactsComponent;
@ViewChild(DxDataGridComponent) gridCustomers: DxDataGridComponent;
allowedPageSizes = [15, 25, 50];
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
currentPageSize = 10;
buttonClass = 'btn-blue-grey';
disableExpand: boolean;
gridHeight;
popupVisible = false;
orderTabDisabled = true;

  constructor(lookupService: LookupService, customerSvc: CustomerService, userService: UserService,
              public authService: AuthenticationService) {
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
      // console.log(this.userDataSource);
    });
  }
  contentReady(e) {
    this.allowedPageSizes = [15, 25, 50];
    this.currentPageSize = 15;
    // console.log(this.gridCustomers.instance.getCombinedFilter());
    if (Array.isArray(this.gridCustomers.instance.getCombinedFilter()[0])) {
      if (this.gridCustomers.instance.totalCount() < 1000) {
        this.allowedPageSizes = [15, 25, this.gridCustomers.instance.totalCount()];
      } else {
         this.currentPageSize = 15;
         this.gridCustomers.instance.pageSize(this.currentPageSize);
      }
    }
  }

  ExpandGrid() {
    // console.log('expanding Grid');
    // console.log(this.gridCustomers.instance.pageCount());
    this.expandedResults = !this.expandedResults;

    const currentPageCount = this.gridCustomers.instance.pageCount();

    if (!this.expandedResults) {
      this.gridHeight = 525;
      // console.log('Page size-Collapse', this.currentPageSize);
      // console.log('gridHeight-Collapse', this.gridHeight);
    } else {
      this.gridHeight = this.gridHeight * currentPageCount;
      // console.log('Page size-Expand', this.currentPageSize);
      // console.log('gridHeight-Expand', this.gridHeight);
    }
    this.pagingEnabled = !this.pagingEnabled;
    this.scrollMode = 'virtual';

  }

  CreateContactDataSource() {
    this.dataSource = {
      store: {
          type: 'odata',
          url: this.baseURL + 'CustomerPerson'
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
    // console.log('rowClickEvent Param', e.data.items[0].customers);
    if (e.rowType === 'group') {
      this.showEditPopup(e.data.items[0].customers);
    }
  }

  onToolbarPreparing(e) {
    const userRole = JSON.parse(this.authService.getUserToken());
    // console.log('Toolbar Preparing', userRole.profile.role);
    if (userRole.profile.role !== 'Readonly') {
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
  }
  onCellPrepared(e) {
   // console.log('cell data', e);
  }

  showAddPopup(e) {
    // console.log('Adding', e);
    this.selectedCustomer = new Customer;
    // console.log('SelectedCustomer', this.selectedCustomer);
    // alert('Editing!');
    const userProfile = JSON.parse(localStorage.getItem('userProfile'));
    // console.log('currentProfile', userProfile);
    if (this.selectedCustomer.customer_id < 0) {
      this.orderTabDisabled = true; } else {this.orderTabDisabled = false;
    }
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
    // console.log('ShowPopup', e.data);
    this.customerService.getCustomerData('', e.data.customers.customer_id).subscribe(res => {
      this.selectedCustomer = res;
      // console.log('Returned Customer', res);
      this.popupVisible = true;
      // console.log('selectedCustomer for Tab Disble', this.selectedCustomer);
      if (this.selectedCustomer.customer_id < 0) {
        this.orderTabDisabled = true; } else {this.orderTabDisabled = false;
      }
      // console.log('orderTabDisabled', this.orderTabDisabled);
    });
  }

  applyChanges() {
    // alert('Applying Customer-Info Changes');
    // console.log('CustomerInfo Child',  this.customerInfo);
    this.customerInfo.batchSave(this.selectedCustomer.customer_id).subscribe(res => {
      // Call customer_info component's batchSave method.
      // alert('Applying Customer Contacts Changes');
      this.customerContacts.batchSave(res);
      this.customerService.getCustomerData('', res).subscribe(cust => {
        this.selectedCustomer = cust;
      });
    });
    // console.log('Selected Customer After Apply Changes', this.selectedCustomer);
    // Call customer_contacts component's batchSave method.
    setTimeout( () => {
      this.gridCustomers.instance.refresh();
    },
    1000);
    this.popupVisible = false;
  }
  cancelChanges() {
    this.popupVisible = false;
  }
/*   loadCustomerEdit(customer: any) {
    console.log('Customer', customer);
    this.onContactCustomerSelect.emit(customer);

    // alert(customerId);
  } */
  ngOnInit() {
  }

}
