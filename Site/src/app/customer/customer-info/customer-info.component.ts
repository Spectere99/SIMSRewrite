import { Component, OnInit, Input } from '@angular/core';
import { CustomerInfo, Service } from './customer-info.service';
import { StateService, StateInfo } from '../../_shared/states.service';
import { LookupService } from '../../_services/lookups.service';
import { CustomerService, Customer, CustomerAddress } from '../../_services/customer.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA,
  MatSnackBar } from '@angular/material';
import { ConfirmDialogComponent } from '../../_shared/confirm/confirm.component';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-customer-info',
  templateUrl: './customer-info.component.html',
  styleUrls: ['./customer-info.component.css'],
  providers: [ CustomerService, StateService ]
})
export class CustomerInfoComponent implements OnInit {
@Input() customer: any;
@Input() userList: Array<any>;
lookupDataSource: any;
addressTypes: any;
stateList: any;

ctrlHasFocus: string;
  constructor(public dialog: MatDialog, public snackBar: MatSnackBar, private customerService: CustomerService,
            private lookupService: LookupService, private usStateService: StateService, public datePipe: DatePipe) {
    console.log(this.customer);
    console.log('userList', this.userList);
    this.stateList = this.usStateService.getStateList();
    console.log('States', this.stateList);
    lookupService.loadLookupData('').subscribe(res => {
      this.lookupDataSource = res.value;
      this.createAddressTypeDataSource();
    });
  }

  createAddressTypeDataSource() {
    this.addressTypes = this.lookupDataSource.filter(item => item.class === 'addr');
    console.log('addr Types', this.addressTypes);
  }

  removeAddress(customerAddressId: number) {
    console.log('Removing Address', customerAddressId);
    console.log('Customer List', this.customer);
    // Remove contact from list based on customerId
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log('The Result', result);
      if (result) {
        this.customer = this.customer.customer_address.filter(p => p.customer_address_id !== customerAddressId);

        // Remove contact from the database using Web service call.
        this.customerService.deleteCustomerAddress('rwflowers', customerAddressId)
          .subscribe(res => {
            this.snackBar.open('Customer Address Deleted!', '', {
              duration: 4000,
              verticalPosition: 'top'
            });
          });
      }
    });
  }

  addAddress(customerId: number) {
    const newAddress: CustomerAddress = {
      customer_address_id: 0,
      customer_id: customerId,
      type_code: null,
      address_1: null,
      address_2: null,
      city: null,
      state: null,
      zip: null,
  };
    this.customer.customer_address.unshift(newAddress);
  }

  saveAddress(customerAddress: CustomerAddress) {
    console.log('Customer Address on Save', customerAddress);
      if (customerAddress.customer_address_id === 0) {
        this.customerService.addCustomerAddress('rwflowers', customerAddress)
        .subscribe(res => {
          console.log('Save address Return', res);
          this.snackBar.open('Customer Address Added!', '', {
            duration: 4000,
            verticalPosition: 'top'
          });
        });
      } else {
        this.customerService.updateCustomerAddress('rwflowers', customerAddress)
        .subscribe(res => {
          console.log('Update address Return', res);
          this.snackBar.open('Customer Address Updated!', '', {
            duration: 4000,
            verticalPosition: 'top'
          });
        });
      }
  }

  saveCustomer(customer: Customer) {
    console.log('Customer on Save', customer);
    if (customer.customer_id === undefined) {
      const currentDate = new Date();
      const formattedDate = this.datePipe.transform(currentDate, 'yyyy-MM-dd');
      const saveCustomer: Customer = {
        customer_id: 0,
        customer_name: customer.customer_name === undefined ? null : customer.customer_name,
        setup_date: formattedDate,
        setup_by: customer.setup_by === undefined ? null : customer.setup_by,
        status_code: customer.status_code === undefined ? 'act' : customer.status_code,
        ship_to_bill_ind: customer.ship_to_bill_ind === undefined ? 'N' : customer.ship_to_bill_ind,
        website_url: customer.website_url === undefined ? null : customer.website_url,
        account_number: customer.account_number === undefined ? null : customer.account_number,
        override_validation_ind: customer.override_validation_ind === undefined ? 'N' : customer.override_validation_ind,
        parent_id: customer.parent_id === undefined ? null : customer.parent_id,
        parent_ind: customer.parent_ind === undefined ? 'N' : customer.parent_ind
      };
      console.log('SaveCustomer', saveCustomer);
      this.customerService.addCustomer('rwflowers', saveCustomer)
      .subscribe(res => {
        console.log('Save customer Return', res);
        this.snackBar.open('Customer Added!', '', {
          duration: 4000,
          verticalPosition: 'top'
        });
      });
    } else {
      const updCustomer: Customer = {
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
      this.customerService.updateCustomer('rwflowers', updCustomer)
      .subscribe(res => {
        console.log('Update customer Return', res);
        this.snackBar.open('Customer Updated!', '', {
          duration: 4000,
          verticalPosition: 'top'
        });
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
