import { Component, OnInit, ViewChild, Output } from '@angular/core';
import { DxDataGridComponent, DxTemplateModule } from 'devextreme-angular';
import { CustomerInfoComponent } from '../customer-info/customer-info.component';
import { LookupService } from '../../_services/lookups.service';
import { UserService } from '../../_services/user.service';
import { Customer, CustomerService } from '../../_services/customer.service';
import { CustomerContactsComponent } from '../customer-contacts/customer-contacts.component';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  providers: [LookupService, UserService, CustomerService],
  styleUrls: ['./customer-list.component.css']
})
export class CustomerListComponent implements OnInit {
  selectedCustomer: any;
  @ViewChild(DxDataGridComponent) gridCustomers: DxDataGridComponent;
  dataSource: any;
  customerList: any;
  lookupDataSource: any;
  userDataSource: any;
  defaultPageSize: number;
  currentPageSize: number;
  defaultAllowedPageSizes = [10, 20, 50];
  allowedPageSizes;
  scrollMode: string;
  pagingEnabled: boolean;
  gridHeight;
  disableExpand: boolean;
  expandedResults: boolean;
  popupVisible = false;
  personTypes: any;
  phoneTypes: any;
  customerSearchValue: any;
  buttonClass = 'btn-blue-grey';
  filterDate = new Date(2008, 1, 1);

  constructor(lookupService: LookupService, userService: UserService, customerService: CustomerService) {
      this.pagingEnabled = true;
      this.disableExpand = true;
      this.expandedResults = false;
      this.gridHeight = 525;
      this.allowedPageSizes = this.defaultAllowedPageSizes;
      this.defaultPageSize = 10;
      this.currentPageSize = this.defaultPageSize;
      this.CreateCustomerDataSource();
      console.log('customerDataSource', this.dataSource);
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

    filterByContactName(e) {
      const searchCriteria = e.component.option('text');
      const grid = this.gridCustomers.instance;
      console.log('valueChanged', grid);

    }
    getPersonTypes() {
      console.log('In Get Person Types', this.personTypes);
      return this.personTypes;
    }
    selectCustomer(e) {
      // console.log(e);
      this.selectedCustomer = e.selectedRowsData[0];
    }
    createPersonTypeDataSource() {
      this.personTypes = this.lookupDataSource.filter(item => item.class === 'CONT');
    }
    createPhoneTypeDataSource() {
      this.phoneTypes = this.lookupDataSource.filter(item => item.class === 'PHON');
    }

    LoadCustomerListData() {

    }

    CreateCustomerDataSource() {
      this.dataSource = {
        store: {
            type: 'odata',
            url: 'http://localhost:56543/odata/customers'
        },
        expand: ['customer_person', 'customer_address', 'orders'],
        select: [
          'customer_id',
          'customer_name',
          'setup_date',
          'setup_by',
          'status_code',
          'ship_to_bill_ind',
          'website_url',
          'account_number',
          'override_validation_ind',
          'parent_id',
          'parent_ind',
          'customer_person/customer_person_id',
          'customer_person/person_type',
          'customer_person/first_name',
          'customer_person/last_name',
          'customer_person/email_address',
          'customer_person/phone_1_type',
          'customer_person/phone_1',
          'customer_person/phone_1_ext',
          'customer_person/phone_2_type',
          'customer_person/phone_2',
          'customer_person/phone_2_ext',
          'customer_address/type_code',
          'customer_address/address_1',
          'customer_address/address_2',
          'customer_address/city',
          'customer_address/state',
          'customer_address/zip',
          'orders/order_number'
        ],
        filter: ['customer_name', '<>', null]
        //  filter: ['customer_address/type_code', '=', 'bill']
        // filter: ['order_date', '>', this.filterDate]
     };
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
    contentReady(e) {
      const filter = this.gridCustomers.instance.getCombinedFilter();
      // console.log('filter', filter);
      if (filter[2] !== null) {
        console.log('Filter', filter[2]);
        this.disableExpand = filter[2].length < 3;
        // this.disableExpand = (filter === undefined);
        if (this.disableExpand) {
          this.buttonClass = 'btn-blue-grey';
        } else {
          this.buttonClass = 'btn-primary';
        }
      }else {
        this.buttonClass = 'btn-blue-grey';
        this.disableExpand = true;
      }

      // console.log('disableExpand', this.disableExpand);
    }

    showAddPopup(e) {
      console.log('Adding', e);
      this.selectedCustomer = new Customer;

      // console.log('SelectedCustomer', this.selectedCustomer);
      // alert('Editing!');
      this.popupVisible = true;
    }
    showEditPopup(e) {
      // e.cancel = true;
      console.log('E', e);
      this.selectedCustomer = e;
      console.log('SelectedCustomer', this.selectedCustomer);
      // alert('Editing!');
      this.popupVisible = true;
    }

    buildCustomerFirstName(data) {
      if (data.customer_person !== undefined) {
        return [data.customer_person.first_name, data.customer_person.last_name].join(' ');
      }
      return '';
    }

    getContactCount(data) {
      // console.log('ContactData', data);
      if (data.customer_person !== undefined) {
        return data.customer_person.length;
      }
      return 0;

    }
    setContactNames(data) {
      let outputNames = '';
      if (data.customer_person !== undefined) {
        for (let x = 0; x < data.customer_person.length; x++) {
          console.log('Customer', data.customer_person[x]);
          outputNames = outputNames.concat(data.customer_person[x].first_name);
          outputNames = outputNames.concat(' ');
          outputNames = outputNames.concat(data.customer_person[x].last_name);
          outputNames = outputNames.concat(' ');
        }
      }
      console.log('OutputNames', outputNames);
      return outputNames;
    }

    getOrderCount(data) {
      if (data.orders !== undefined) {
        return data.orders.length;
      }
      return 0;
    }

    buildPhoneNumber1(data) {
          // console.log('columnValue:', data.phone_1);
          if (data === undefined) { return ''; }
          let rawNumber = (data.phone_1 === undefined) ||
                            (data.phone_1 === null) ? '' : data.phone_1.toString();
          // console.log('rawNumber:', rawNumber);
          rawNumber = String(rawNumber);
          rawNumber = rawNumber.replace(/[^0-9]*/g, '');
          let formattedNumber = rawNumber;
          const c = (rawNumber[0] === '1') ? '1' : '';
          rawNumber = rawNumber[0] === '1' ? rawNumber.slice(1) : rawNumber;
          const area = rawNumber.substring(0, 3);
          const front = rawNumber.substring(3, 6);
          const end = rawNumber.substring(6, 10);
          if (front) {
            formattedNumber = (c + '(' + area + ') ' + front);
          }
          if (end) {
            formattedNumber += ('-' + end);
          }
          return formattedNumber;
    }

    buildPhoneNumber2(data) {
      // console.log('columnValue:', data.phone_2);
        if (data === undefined) { return ''; }
        let rawNumber = (data.phone_2 === undefined) ||
                        (data.phone_2 === null) ? '' : data.phone_2.toString();
        // console.log('rawNumber:', rawNumber);
        rawNumber = String(rawNumber);
        rawNumber = rawNumber.replace(/[^0-9]*/g, '');
        let formattedNumber = rawNumber;
        const c = (rawNumber[0] === '1') ? '1' : '';
        rawNumber = rawNumber[0] === '1' ? rawNumber.slice(1) : rawNumber;
        const area = rawNumber.substring(0, 3);
        const front = rawNumber.substring(3, 6);
        const end = rawNumber.substring(6, 10);
        if (front) {
          formattedNumber = (c + '(' + area + ') ' + front);
        }
        if (end) {
          formattedNumber += ('-' + end);
        }
      return formattedNumber;
    }

  ngOnInit() {
  }

}
