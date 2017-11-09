import { Component, OnInit, ViewChild } from '@angular/core';
import { DxDataGridComponent, DxTemplateModule } from 'devextreme-angular';
import { CustomerInfoComponent } from './customer-info/customer-info.component';
import { LookupService } from '../_services/lookups.service';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  providers: [LookupService, UserService],
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
@ViewChild(DxDataGridComponent) gridCustomers: DxDataGridComponent;
dataSource: any;
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

  constructor(lookupService: LookupService, userService: UserService) {
    this.pagingEnabled = true;
    this.disableExpand = true;
    this.expandedResults = false;
    this.gridHeight = 525;
    this.allowedPageSizes = this.defaultAllowedPageSizes;
    this.defaultPageSize = 10;
    this.currentPageSize = this.defaultPageSize;
    this.CreateCustomerDataSource();
    // lookupService.loadLookupData('').subscribe(res => this.lookupDataSource = res.value);
    userService.getUsers('').subscribe(res => {
      this.userDataSource = res.value;
      console.log(this.userDataSource);
    });

   }

  ExpandGrid() {
    console.log('expanding Grid');
    console.log(this.gridCustomers.instance.pageCount());
    this.expandedResults = !this.expandedResults;

    const currentPageCount = this.gridCustomers.instance.pageCount();

    if (!this.expandedResults) {
      this.currentPageSize = this.defaultPageSize;
      this.allowedPageSizes = this.defaultAllowedPageSizes;
      this.gridHeight = 525;
    } else {
      this.currentPageSize = currentPageCount * this.defaultPageSize;
      this.defaultAllowedPageSizes = [this.currentPageSize];
      this.gridHeight = 5 * this.currentPageSize;
    }
    this.scrollMode = 'virtual';
    console.log('gridHeight', this.gridHeight);
    
    // this.pagingEnabled = !this.pagingEnabled;
    // console.log('pagingEnabled', this.pagingEnabled);
  }
  LoadLookupData() {
    
  }
  CreateCustomerDataSource() {
    this.dataSource = {
      store: {
          type: 'odata',
          url: 'http://localhost:56543/odata/customers'
      },
      expand: ['customer_person', 'customer_address'],
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
        'customer_person/first_name',
        'customer_person/last_name',
        'customer_person/phone_1',
        'customer_person/phone_2',
        'customer_address/address_1',
        'customer_address/city',
        'customer_address/state',
        'customer_address/zip',
      ],
      //  filter: ['customer_address/type_code', '=', 'bill']
       // filter: ['order_date', '>', this.filterDate]
   };
  }
  contentReady(e) {
    const filter = this.gridCustomers.instance.getCombinedFilter();
    console.log('filter', filter);
    this.disableExpand = (filter === undefined);
    console.log('disableExpand', this.disableExpand);
  }

  showEditPopup(e) {
    e.cancel = true;
    console.log('e:', e);
    alert('Editing!');
  }

  buildCustomerFirstName(data) {
    if (data.customer_person !== undefined) {
      return [data.customer_person.first_name, data.customer_person.last_name].join(' ');
    }
    return '';
  }


  buildPhoneNumber1(data) {
        // console.log('columnValue:', data.customer_person.phone_1);
        if (data.customer_person === undefined) { return ''; }
        let rawNumber = (data.customer_person.phone_1 === undefined) ||
                          (data.customer_person.phone_1 === null) ? '' : data.customer_person.phone_1.toString();
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
      if (data.customer_person === undefined) { return ''; }
      let rawNumber = (data.customer_person.phone_2 === undefined) ||
                      (data.customer_person.phone_2 === null) ? '' : data.customer_person.phone_2.toString();
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
