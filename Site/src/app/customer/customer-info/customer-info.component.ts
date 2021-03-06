import { Component, OnInit, Input } from '@angular/core';
import { GlobalDataProvider } from '../../_providers/global-data.provider';
import { StateService, StateInfo } from '../../_shared/states.service';
import { User } from '../../_services/user.service';
import { LookupService } from '../../_services/lookups.service';
import { CustomerService, Customer, CustomerDTO, CustomerAddress } from '../../_services/customer.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA,
  MatSnackBar } from '@angular/material';
import { ConfirmDialogComponent } from '../../_shared/confirm/confirm.component';
import { DatePipe } from '@angular/common';
import { ArraySortPipe } from '../../_shared/pipes/orderBy.pipe';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-customer-info',
  templateUrl: './customer-info.component.html',
  styleUrls: ['./customer-info.component.css'],
  providers: [ CustomerService, StateService ]
})
export class CustomerInfoComponent implements OnInit {
@Input() customer: any;
userList: Array<User>;
customerList: Array<any>;
lookupDataSource: any;
addressTypes: any;
stateList: any;
statusTypes: any;
panelExpanded: boolean;

ctrlHasFocus: string;
  constructor(public dialog: MatDialog, public snackBar: MatSnackBar, private customerService: CustomerService,
            globalDataProvider: GlobalDataProvider, private usStateService: StateService, public datePipe: DatePipe) {
    // console.log('Customer in customer-info:', this.customer);
    // console.log('userList', this.userList);
    this.stateList = this.usStateService.getStateList();
    // console.log('States', this.stateList);
    // console.log('customerList', this.customerList);
    this.userList = globalDataProvider.getUsers();
    this.lookupDataSource = globalDataProvider.getLookups();
    this.createAddressTypeDataSource();
    this.createStatusTypeDataSource();
/*     lookupService.loadLookupData('').subscribe(res => {
      this.lookupDataSource = res.value;
      this.createAddressTypeDataSource();
      this.createStatusTypeDataSource();
    }); */
    customerService.getActiveParentCustomers('rwflowers').subscribe(res => {
      this.customerList = res.value;
      // console.log('customerList', this.customerList);
    });
    this.panelExpanded = true;
  }

  refreshValue(value: any): void {
    // console.log('refreshValue', value);
    this.customer.parent_id = value;
  }

  createAddressTypeDataSource() {
    this.addressTypes = this.lookupDataSource.filter(item => item.class === 'addr');
    // console.log('addr Types', this.addressTypes);
  }

  createStatusTypeDataSource() {
    this.statusTypes = this.lookupDataSource.filter(item => item.class === 'comps');
    // console.log('status Types', this.statusTypes);
  }

  setParentInd(event) {
    // console.log('setParentInd', event.checked);
    this.customer.parent_ind = event.checked ? 'Y' : 'N';
    // console.log('Customer ParentInd', this.customer.ship_to_bill_ind);
  }

  setShipToBillInd(event) {
    this.customer.ship_to_bill_ind = event.checked ? 'Y' : 'N';
  }

  batchSave(customer_id: number) {
    // Save General Customer Information from the model.
    this.customer.customer_id = customer_id;
    return this.saveCustomer(this.customer).map(res => {
      this.customerService.getActiveParentCustomers('rwflowers').subscribe(res => {
        this.customerList = res.value;
        // console.log('customerList', this.customerList);
      });
      return res;
    });

    // Call saveAddress for each address in array.
  }

  saveCustomer(customer: Customer) {
    // console.log('Customer on Save', customer);
    if (customer.customer_id === 0) {
      const currentDate = new Date();
      const formattedDate = this.datePipe.transform(currentDate, 'yyyy-MM-dd');
      const saveCustomer: CustomerDTO = {
        customer_id: 0,
        customer_name: customer.customer_name === undefined ? null : customer.customer_name,
        setup_date: formattedDate,
        setup_by: customer.setup_by === undefined ? null : customer.setup_by,
        status_code: customer.status_code === undefined ? 'act' : customer.status_code,
        ship_to_bill_ind: customer.ship_to_bill_ind === undefined ? 'N' : customer.ship_to_bill_ind, // ? 'Y' : 'N',
        website_url: customer.website_url === undefined ? null : customer.website_url,
        account_number: customer.account_number === undefined ? null : customer.account_number,
        override_validation_ind: customer.override_validation_ind === undefined ? 'N' : customer.override_validation_ind,
        parent_id: customer.parent_id === undefined ? null : customer.parent_id,
        parent_ind: customer.parent_ind === undefined ? 'N' : customer.parent_ind
      };
      // console.log('SaveCustomer', saveCustomer);
      return this.customerService.addCustomer('rwflowers', saveCustomer)
      .map(res => {
        // console.log('Save customer Return', res);
        customer = res;
        // customer.customer_address = [];
        customer.customer_person = [];
        customer.orders = [];
        this.snackBar.open('Customer Saved!', '', {
          duration: 4000,
          verticalPosition: 'top'
        });
        return customer.customer_id;
      });
    } else {
      const updCustomer: CustomerDTO = {
        customer_id: customer.customer_id,
        customer_name: customer.customer_name,
        setup_date: customer.setup_date,
        setup_by: customer.setup_by,
        status_code: customer.status_code,
        ship_to_bill_ind: customer.ship_to_bill_ind,
        website_url: customer.website_url,
        account_number: customer.account_number,
        override_validation_ind: customer.override_validation_ind,
        parent_id: customer.parent_id,
        parent_ind: customer.parent_ind
      };
      // console.log('Update Customer', updCustomer);
      return this.customerService.updateCustomer('rwflowers', updCustomer)
      .map(res => {
        // console.log('Update customer Return', res);
        this.snackBar.open('Customer Updated!', '', {
          duration: 4000,
          verticalPosition: 'top'
        });
        return customer.customer_id;
      });
    }
  }

  onFocus() {
    this.ctrlHasFocus = 'active';
  }
  showValues() {
    alert(this.customer.customer_name);
  }
  ngOnInit() {
  }

}
