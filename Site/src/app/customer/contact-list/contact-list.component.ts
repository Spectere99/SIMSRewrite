import { Component, OnInit, ViewChild, Output, Input, EventEmitter } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Globals } from '../../globals';
import { GlobalDataProvider } from '../../_providers/global-data.provider';
import { DxDataGridComponent, DxTemplateModule } from 'devextreme-angular';
import { LookupService } from '../../_services/lookups.service';
import { CustomerService, Customer } from '../../_services/customer.service';
import { UserService } from '../../_services/user.service';
// import { CustomerContactsComponent } from '../customer-contacts/customer-contacts.component';
import { ContactInfoComponent } from '../contact-info/contact-info.component';
import { ContactAddressComponent } from '../contact-address/contact-address.component';
import { CustomerInfoComponent } from '../customer-info/customer-info.component';

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
  @ViewChild(CustomerInfoComponent) customerInfoCmpt: CustomerInfoComponent;
  @ViewChild(ContactInfoComponent) contactInfoCmpt: ContactInfoComponent;
  @ViewChild(ContactAddressComponent) contactAddressCmpt: ContactAddressComponent;
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
  userProfile;
  leaveWindowOpen = true;

  constructor(globalDataProvider: GlobalDataProvider, customerSvc: CustomerService,
    public authService: AuthenticationService, private globals: Globals) {
    this.userProfile = JSON.parse(authService.getUserToken());
    this.customerService = customerSvc;
    this.userDataSource = globalDataProvider.getUsers();
    this.lookupDataSource = globalDataProvider.getLookups();
    // this.userDataSource = globals.userData;
    // this.lookupDataSource = globals.lookupData;
    this.createPersonTypeDataSource();
    this.createPhoneTypeDataSource();
    this.CreateContactDataSource();
    this.gridHeight = 525;
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
    this.expandedResults = !this.expandedResults;
    const currentPageCount = this.gridCustomers.instance.pageCount();

    if (!this.expandedResults) {
      this.gridHeight = 525;
    } else {
      this.gridHeight = this.gridHeight * currentPageCount;
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
      filter: [['customers/customer_name', '<>', null]]
    };
  }

  onRowClick(e) {
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

  showAddPopup(e) {
    // initialize a new Customer object
    this.selectedCustomer = new Customer;
    const today = new Date();
    this.selectedCustomer.customer_id = 0;
    this.selectedCustomer.customer_name = '';
    this.selectedCustomer.ship_to_bill_ind = 'N';
    this.selectedCustomer.customer_address = [];
    this.selectedCustomer.customer_person = [];
    this.selectedCustomer.orders = [];
    this.selectedCustomer.status_code = 'act';
    this.selectedCustomer.setup_date = today.toISOString();
    this.selectedCustomer.setup_by = this.userProfile.profile.user_id;

    this.orderTabDisabled = true;
    this.popupVisible = true;

  }

  createPersonTypeDataSource() {
    this.personTypes = this.lookupDataSource.filter(item => item.class === 'CONT');
  }
  createPhoneTypeDataSource() {
    this.phoneTypes = this.lookupDataSource.filter(item => item.class === 'PHON');
  }

  showEditPopup(e) {
    // console.log('contact-list:showEditPopup Calling getCustomerData');
    this.customerService.getCustomerData('', e.data.customers.customer_id).subscribe(res => {
      this.selectedCustomer = res;
      // console.log('contact-list:showEditPopup', this.selectedCustomer);
      this.selectedCustomer.customer_person = this.selectedCustomer.customer_person.filter(f => f.status_code === 'act');
      this.popupVisible = true;
      if (this.selectedCustomer.customer_id < 0) {
        this.orderTabDisabled = true;
      } else {
      this.orderTabDisabled = false;
      }
    });
  }

  customerSaved(closeWindow) {
    this.gridCustomers.instance.refresh();
    this.popupVisible = closeWindow;
  }

  closePopup() {
    this.popupVisible = false;
  }

  applyChanges() {

    this.customerInfoCmpt.batchSave(this.selectedCustomer.customer_id).subscribe(res => {
      // console.log('contact-list calling contactsComponent batchSave', res);
      const cnt = this.contactInfoCmpt.batchSave(res);
      const adr = this.contactAddressCmpt.batchSave(res);
        console.log('contactInfo batch Saved Result', cnt);
        // console.log('contactAddress batch Saved Result', adr);
          setTimeout(() => {
            this.gridCustomers.instance.refresh();
            this.customerService.getCustomerData('', res).subscribe(cust => {
              // console.log('contact-list applyChanges - selectedCustomer', this.selectedCustomer);
            console.log('contact-list applyChanges - Customer', cust);
            this.selectedCustomer = cust;
            this.selectedCustomer.customer_person = this.selectedCustomer.customer_person.filter(f => f.status_code === 'act');
            });
          }, 1000);
          this.orderTabDisabled = false;
          this.popupVisible = this.leaveWindowOpen;
        });
  }
  cancelChanges() {
    this.popupVisible = false;
  }

  ngOnInit() {
  }

  popupHiding(e) {
    // e.cancel = true;  // This will stop the popup from hiding.
                         //  Use to check for changes
    this.gridCustomers.instance.refresh();
  }
}
